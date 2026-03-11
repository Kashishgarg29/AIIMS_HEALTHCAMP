import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        let sanitizedUsers = 0;
        for (const user of users) {
            if (user.email && user.email !== user.email.trim()) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { email: user.email.trim().toLowerCase() }
                });
                sanitizedUsers++;
            }
        }

        const schools = await prisma.school.findMany();
        let sanitizedSchools = 0;
        for (const school of schools) {
            if (school.email && school.email !== school.email.trim()) {
                await prisma.school.update({
                    where: { id: school.id },
                    data: { email: school.email.trim().toLowerCase() }
                });
                sanitizedSchools++;
            }
        }

        const requests = await prisma.visitRequest.findMany();
        let sanitizedRequests = 0;
        for (const req of requests) {
            if (req.email && req.email !== req.email.trim()) {
                await prisma.visitRequest.update({
                    where: { id: req.id },
                    data: { email: req.email.trim().toLowerCase() }
                });
                sanitizedRequests++;
            }
        }

        // Migration: Retroactively populate missing emails onto legacy SCHOOL_REPs
        const legacyReps = await prisma.user.findMany({
            where: { role: 'SCHOOL_REP', email: null }
        });

        let backfilledEmails = 0;
        for (const rep of legacyReps) {
            if (rep.phone) {
                const linkedSchool = await prisma.school.findFirst({
                    where: { phone: rep.phone }
                });
                if (linkedSchool && linkedSchool.email) {
                    await prisma.user.update({
                        where: { id: rep.id },
                        data: { email: linkedSchool.email.trim().toLowerCase() }
                    });
                    backfilledEmails++;
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: "Database emails sanitized and backfilled",
            sanitizedUsers,
            sanitizedSchools,
            sanitizedRequests,
            backfilledEmails
        });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message });
    }
}
