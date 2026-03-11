"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// --- Form Template Actions ---

export async function createFormTemplate(formData: FormData) {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const sectionsData = formData.get("sections") as string; // JSON parsed representation

    if (!name) return { error: "Template name is required" };

    try {
        let sections = [];
        if (sectionsData) {
            sections = JSON.parse(sectionsData);
        }

        const template = await prisma.formTemplate.create({
            data: {
                name,
                description,
                sections: {
                    create: sections.map((sec: any, i: number) => ({
                        name: sec.name,
                        order: i,
                        fields: {
                            create: sec.fields.map((f: any, j: number) => ({
                                name: f.name,
                                label: f.label,
                                type: f.type,
                                options: f.options || null,
                                isRequired: f.isRequired || false,
                                order: j
                            }))
                        }
                    }))
                }
            }
        });

        revalidatePath("/dashboard/admin/templates");
        return { success: true, id: template.id };
    } catch (error: any) {
        console.error("Error creating template", error);
        if (error.code === 'P2002') {
            return { error: "A form template with this name already exists. Please choose a unique name." };
        }
        return { error: "Failed to create form template" };
    }
}

export async function getFormTemplates() {
    return await prisma.formTemplate.findMany({
        include: {
            sections: {
                include: { fields: true },
                orderBy: { order: 'asc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function deleteFormTemplate(templateId: string) {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        // Prisma cascade deletes will handle sections and fields.
        // If an event is currently using this template, it will set the relation to NULL based on schema.
        await prisma.formTemplate.delete({
            where: { id: templateId }
        });

        revalidatePath("/dashboard/admin");
        revalidatePath("/dashboard/admin/templates");
        return { success: true };
    } catch (error) {
        console.error("Error deleting template:", error);
        return { error: "Failed to delete template." };
    }
}

// --- Visit Request & Event Actions ---

export async function getVisitRequests() {
    return await prisma.visitRequest.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function approveVisitRequest(requestId: string, templateId: string, doctorIds: string[] = [], scheduledDateStr?: string) {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        // 1. Mark request as approved
        const request = await prisma.visitRequest.update({
            where: { id: requestId },
            data: { status: "APPROVED" }
        });

        // 2. Ensure school exists or create one based on the request data
        let school = request.schoolId ?
            await prisma.school.findUnique({ where: { id: request.schoolId } }) : null;

        if (!school) {
            school = await prisma.school.create({
                data: {
                    name: request.schoolName || "Unknown School",
                    address: request.address || "",
                    contactPerson: request.contactPerson || "",
                    phone: request.phone || "",
                    email: request.email || ""
                }
            });

            // Link the request to the new school
            await prisma.visitRequest.update({
                where: { id: requestId },
                data: { schoolId: school.id }
            });
        }

        // 3. Create the Event
        const eventDate = scheduledDateStr ? new Date(scheduledDateStr) : request.preferredDate;

        const event = await prisma.event.create({
            data: {
                date: eventDate,
                visitRequestId: request.id,
                schoolId: school.id,
                formTemplateId: templateId
            }
        });

        // 4. Assign Doctors
        if (doctorIds.length > 0) {
            await prisma.eventUser.createMany({
                data: doctorIds.map(id => ({
                    eventId: event.id,
                    userId: id
                }))
            });
        }

        // 5. Provision User account for the School Representative
        if (request.phone || request.email) {
            const orConditions = [];
            if (request.phone) orConditions.push({ phone: request.phone });
            if (request.email) orConditions.push({ email: request.email });

            let existingUser = await prisma.user.findFirst({
                where: { OR: orConditions }
            });

            if (existingUser) {
                // Safely update the existing user to SCHOOL_REP without overwriting established identifiers if they conflict
                await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        role: 'SCHOOL_REP',
                        name: request.contactPerson || request.schoolName || existingUser.name,
                        // Only set email/phone if the user doesn't already have one, to prevent unique constraint jumps
                        ...(existingUser.email ? {} : { email: request.email }),
                        ...(existingUser.phone ? {} : { phone: request.phone }),
                    }
                });
            } else {
                // Create brand new user securely
                await prisma.user.create({
                    data: {
                        role: 'SCHOOL_REP',
                        name: request.contactPerson || request.schoolName || "School Rep",
                        email: request.email || null,
                        phone: request.phone || null
                    }
                });
            }
        }

        revalidatePath("/dashboard/admin");
        return { success: true, eventId: event.id };

    } catch (error) {
        console.error("Failed to approve request:", error);
        return { error: "Failed to create associated event." };
    }
}

export async function createDirectEvent(formData: FormData) {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
        return { error: "Unauthorized" };
    }

    const schoolName = formData.get("schoolName") as string;
    const address = formData.get("address") as string;
    const contactPerson = formData.get("contactPerson") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const templateId = formData.get("templateId") as string;
    const scheduledDateStr = formData.get("scheduledDate") as string;
    const doctorIds = formData.getAll("doctorIds") as string[];

    if (!schoolName || !address || !contactPerson) {
        return { error: "School Name, Address, and Contact Person are required." };
    }

    if (!phone || !email) {
        return { error: "Phone Number and Email Address are strictly required." };
    }

    if (!templateId || !scheduledDateStr) {
        return { error: "Template and Scheduled Date are required." };
    }

    try {
        // 1. Create or Find School (In this direct mode, let's create a new school entry if it doesn't match perfectly, or just create it)
        // A better approach in a real app would be to search existing schools first or allow selecting from existing.
        // For simplicity here, we'll create a new one based on form data if one with exact name doesn't exist.
        let school = await prisma.school.findFirst({
            where: { name: schoolName }
        });

        if (!school) {
            school = await prisma.school.create({
                data: {
                    name: schoolName,
                    address,
                    contactPerson,
                    phone: phone || "N/A",
                    email: email || null
                }
            });
        }

        // 2. Create the Event directly (No VisitRequest needed or we can create a mock one if logic depends on it, but the DB schema says visitRequestId is optional on Event)
        const eventDate = new Date(scheduledDateStr);

        const event = await prisma.event.create({
            data: {
                date: eventDate,
                schoolId: school.id,
                formTemplateId: templateId
            }
        });

        // 3. Assign Doctors
        if (doctorIds.length > 0) {
            await prisma.eventUser.createMany({
                data: doctorIds.map(id => ({
                    eventId: event.id,
                    userId: id
                }))
            });
        }

        revalidatePath("/dashboard/admin");
        return { success: true, eventId: event.id };
    } catch (error) {
        console.error("Failed to create direct event:", error);
        return { error: "Failed to create event." };
    }
}

// --- Staff Management Actions ---

export async function getStaffUsers(roles?: ("HOSPITAL_ADMIN" | "EVENT_USER")[]) {
    return await prisma.user.findMany({
        where: {
            role: {
                in: roles || ["HOSPITAL_ADMIN", "EVENT_USER"]
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function addStaff(formData: FormData) {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
        return { error: "Unauthorized. Insufficient privileges to add staff." };
    }

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as ("HOSPITAL_ADMIN" | "EVENT_USER");

    if (!name || (!phone && !email) || !role) {
        return { error: "Name, Role, and either Phone or Email are required." };
    }

    if (role !== "EVENT_USER") {
        return { error: "Only Event Doctors can be created." };
    }

    try {
        await prisma.user.create({
            data: {
                name,
                phone: phone || null,
                email: email || null,
                role
            }
        });

        // Revalidate appropriate dashboards
        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error: any) {
        console.error("Error creating staff:", error);
        if (error.code === 'P2002') {
            return { error: "A user with this email or phone already exists." };
        }
        return { error: "Failed to create staff member." };
    }
}

export async function removeStaff(userId: string) {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
        return { error: "Unauthorized. Insufficient privileges to remove staff." };
    }

    try {
        const targetUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!targetUser) return { error: "User not found." };

        if (targetUser.role === 'HOSPITAL_ADMIN') {
            return { error: "Cannot remove a Hospital Admin." };
        }

        await prisma.user.delete({
            where: { id: userId }
        });

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Error removing staff:", error);
        return { error: "Failed to remove staff member. They might be linked to active events." };
    }
}

export async function getActiveEvents() {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") return [];

    return await prisma.event.findMany({
        where: { status: 'ACTIVE' },
        include: {
            school: true,
            eventUsers: {
                include: { user: true }
            }
        },
        orderBy: { date: 'desc' }
    });
}

export async function getCompletedEvents() {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") return [];

    return await prisma.event.findMany({
        where: { status: 'COMPLETED' },
        include: {
            school: true,
            eventUsers: {
                include: { user: true }
            }
        },
        orderBy: { date: 'desc' }
    });
}

export async function updateEventStaff(eventId: string, doctorIds: string[]) {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.$transaction([
            // Clear existing staff bindings for this event
            prisma.eventUser.deleteMany({
                where: { eventId }
            }),
            // Insert new bindings
            prisma.eventUser.createMany({
                data: doctorIds.map(id => ({
                    eventId,
                    userId: id
                }))
            })
        ]);

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Error updating event staff:", error);
        return { error: "Failed to update staff assignments." };
    }
}

export async function updateEventDate(eventId: string, dateString: string) {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.event.update({
            where: { id: eventId },
            data: { date: new Date(dateString) }
        });

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Error updating event date:", error);
        return { error: "Failed to update event scheduled date." };
    }
}

export async function deleteEvent(eventId: string) {
    const session = await getSession();
    // Allow HOSPITAL_ADMIN to delete events
    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        // Find the event to get the visitRequestId before deleting
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return { error: "Event not found" };
        }

        // Delete the event
        await prisma.event.delete({
            where: { id: eventId }
        });

        // Delete the associated visit request if it exists so it doesn't stay stuck as APPROVED
        if (event.visitRequestId) {
            await prisma.visitRequest.delete({
                where: { id: event.visitRequestId }
            });
        }

        revalidatePath("/dashboard/admin");
        return { success: true };
    } catch (error) {
        console.error("Error deleting event:", error);
        return { error: "Failed to delete event." };
    }
}
