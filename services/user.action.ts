"use server";

import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { sendEmail } from "@/lib/mail";
import { cookies } from "next/headers";

function generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function requestOTP(formData: FormData) {
    let identifier = (formData.get("identifier") as string || "").trim();
    if (!identifier) {
        return { error: "Email is required" };
    }

    // Basic check for email
    const isEmail = identifier.includes("@");
    if (!isEmail) {
        return { error: "Please enter a valid email address" };
    }
    identifier = identifier.toLowerCase();

    try {
        // Upsert user based on identifier
        const users = await prisma.user.findMany({
            where: { email: { equals: identifier, mode: 'insensitive' } }
        });

        // Priority resolution: Grab the real authenticated account over any older PUBLIC ghost accounts
        let user = users.find((u: any) => u.role !== "PUBLIC") || users[0];

        if (!user) {
            return { error: "User not registered" };
        }

        const code = generateRandomCode();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await prisma.oTP.create({
            data: {
                userId: user.id,
                code,
                expiresAt,
            }
        });

        const emailResult = await sendEmail({
            to: identifier,
            subject: "Your AIMS Login OTP",
            text: `Your One-Time Password (OTP) for the AIMS Portal is: ${code}. It will expire in 5 minutes.`
        });

        if (!emailResult.success) {
            console.error(`Failed to send email to ${identifier}`, emailResult.error);
            // Even if email fails, log the OTP in dev so testing isn't fully blocked
            console.log(`[DEVELOPMENT RESCUE] OTP generated for ${identifier}: ${code}`);
        } else {
            console.log(`[DEVELOPMENT LOG] Successfully dispatched OTP to ${identifier}`);
            console.log(`[DEVELOPMENT RESCUE] OTP generated for ${identifier}: ${code}`);
        }

        return { success: true, message: "OTP sent successfully" };

    } catch (err: any) {
        console.error(err);
        return { error: "Failed to generate OTP. Please try again." };
    }
}

export async function verifyOTP(formData: FormData) {
    let identifier = (formData.get("identifier") as string || "").trim();
    const code = formData.get("code") as string;

    if (!identifier || !code) return { error: "Missing required fields" };

    const isEmail = identifier.includes("@");
    if (!isEmail) return { error: "Invalid email" };

    identifier = identifier.toLowerCase();

    try {
        const users = await prisma.user.findMany({
            where: { email: { equals: identifier, mode: 'insensitive' } }
        });

        // Priority resolution: Grab the real authenticated account over any older PUBLIC ghost accounts
        let user = users.find((u: any) => u.role !== "PUBLIC") || users[0];

        if (!user) return { error: "User not found" };



        const otpRecord = await prisma.oTP.findFirst({
            where: {
                userId: user.id,
                code,
                isUsed: false,
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: "desc" }
        });

        if (!otpRecord) {
            return { error: "Invalid or expired OTP" };
        }

        // Mark used
        await prisma.oTP.update({
            where: { id: otpRecord.id },
            data: { isUsed: true }
        });

        // Create secure HTTP Cookie via helper
        await createSession({ id: user.id, role: user.role });

        return { success: true, role: user.role };

    } catch (err) {
        console.error(err);
        return { error: "Verification failed" };
    }
}
