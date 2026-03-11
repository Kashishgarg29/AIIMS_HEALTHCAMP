import { prisma } from "@/lib/prisma";
import { format, addDays, startOfDay, endOfDay } from "date-fns";

export async function GET(request: Request) {
    // Basic security header validation to ensure it's called securely (pseudo-auth)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'dev-cron-secret'}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        // Find events happening exactly tomorrow
        const tomorrow = addDays(new Date(), 1);
        const start = startOfDay(tomorrow);
        const end = endOfDay(tomorrow);

        const upcomingEvents = await prisma.event.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end
                }
            },
            include: {
                school: true
            }
        });

        const emailsSent: string[] = [];

        for (const event of upcomingEvents) {
            const schoolEmail = event.school.email;
            if (schoolEmail) {
                // In a production environment, this would call Resend/Nodemailer/SendGrid
                // e.g. await resend.emails.send({ to: schoolEmail, ... });

                console.log(`[CRON] Sudo-Emitting automated 1-day reminder email to ${schoolEmail} for event ${event.uniqueId} at ${event.school.name}`);
                emailsSent.push(schoolEmail);
            } else {
                console.log(`[CRON] Event ${event.id} skipped - No email listed for school ${event.school.name}.`);
            }
        }

        return new Response(JSON.stringify({
            success: true,
            message: `Processed ${upcomingEvents.length} events. Sent ${emailsSent.length} reminders.`,
            dispatchedTo: emailsSent
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Cron failed:", error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
