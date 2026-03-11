"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateFieldResponse(formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };
    if (session.user.role !== 'EVENT_USER') return { error: "Only Event Doctors can fill out student records." };

    const recordId = formData.get("recordId") as string;
    const fieldId = formData.get("fieldId") as string;
    const value = formData.get("value") as string; // JSON Stringified
    const studentId = formData.get("studentId") as string;
    const eventId = formData.get("eventId") as string; // For revalidation

    // Extra security: Do not allow edits if event is completed
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (event?.status === 'COMPLETED') {
        return { error: "Event is completed and locked. Data cannot be modified." };
    }

    try {
        // 1. Transaction to safely update Response + History + Lock
        await prisma.$transaction(async (tx: any) => {

            let targetResponse = await tx.fieldResponse.findUnique({
                where: { recordId_fieldId: { recordId, fieldId } }
            });

            const parsedValue = JSON.parse(value);
            let oldValue = targetResponse ? targetResponse.value : undefined;

            if (targetResponse) {
                targetResponse = await tx.fieldResponse.update({
                    where: { id: targetResponse.id },
                    data: {
                        value: parsedValue,
                        updatedById: session.user.id
                    }
                });
            } else {
                targetResponse = await tx.fieldResponse.create({
                    data: {
                        recordId,
                        fieldId,
                        value: parsedValue,
                        updatedById: session.user.id
                    }
                });
            }

            // Create immutable audit history
            await tx.fieldHistory.create({
                data: {
                    responseId: targetResponse.id,
                    oldValue: oldValue ?? undefined,
                    newValue: parsedValue,
                    updatedById: session.user.id
                }
            });

            // Soft-lock tracking
            await tx.studentRecord.update({
                where: { id: recordId },
                data: {
                    lastUpdatedById: session.user.id,
                    lockedById: session.user.id,
                    lockedAt: new Date()
                }
            });
        });

        // 2. Compute New Progress Status Asynchronously (Out of bound transaction) 
        // This allows the main response to return faster.

        const record = await prisma.studentRecord.findUnique({
            where: { id: recordId },
            include: {
                responses: true,
                student: {
                    include: {
                        event: {
                            include: {
                                formTemplate: { include: { sections: { include: { fields: true } } } }
                            }
                        }
                    }
                }
            }
        });

        if (record && record.student.event.formTemplate) {
            // Flatten all required fields from schema
            const requiredFieldIds = record.student.event.formTemplate.sections
                .flatMap((s: any) => s.fields)
                .filter((f: any) => f.isRequired)
                .map((f: any) => f.id);

            const currentResponses = record.responses;

            const isCompleted = requiredFieldIds.every((id: any) =>
                currentResponses.some((res: any) => res.fieldId === id && res.value && res.value !== "")
            );

            const newStatus = isCompleted ? 'COMPLETED' :
                (currentResponses.length > 0 ? 'IN_PROGRESS' : 'PENDING');

            if (record.status !== newStatus) {
                await prisma.studentRecord.update({
                    where: { id: recordId },
                    data: { status: newStatus }
                });
            }
        }

        revalidatePath(`/dashboard/event/${eventId}/record/${studentId}`);
        return { success: true };

    } catch (error) {
        console.error("Failed to update field response:", error);
        return { error: "Intermittent save failure" };
    }
}

export async function releaseRecordLock(recordId: string) {
    await prisma.studentRecord.update({
        where: { id: recordId },
        data: { lockedById: null, lockedAt: null }
    });
}
