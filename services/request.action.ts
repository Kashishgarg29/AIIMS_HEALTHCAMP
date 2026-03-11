"use server";

import { prisma } from "@/lib/prisma";

export async function createVisitRequest(formData: FormData) {
    const schoolName = formData.get("schoolName") as string;
    const address = formData.get("address") as string;
    const contactPerson = formData.get("contactPerson") as string;
    const email = (formData.get("email") as string || "").trim().toLowerCase();
    const phone = formData.get("phone") as string;
    const preferredDate = formData.get("preferredDate") as string;
    const studentStrength = parseInt(formData.get("studentStrength") as string);
    const remarks = formData.get("remarks") as string;

    if (!schoolName || !address || !contactPerson || !phone || !email || !preferredDate || !studentStrength) {
        return { error: "Missing required fields" };
    }

    try {
        const request = await prisma.visitRequest.create({
            data: {
                schoolName,
                address,
                contactPerson,
                email,
                phone,
                preferredDate: new Date(preferredDate),
                studentStrength,
                remarks,
                status: "PENDING"
            }
        });

        return { success: true, id: request.id };
    } catch (error) {
        console.error("Error creating visit request:", error);
        return { error: "Failed to submit request." };
    }
}
