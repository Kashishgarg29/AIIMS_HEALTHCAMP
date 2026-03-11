import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: { eventId: string } }) {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
        return new Response("Unauthorized", { status: 401 });
    }

    const event = await prisma.event.findUnique({
        where: { id: params.eventId },
        include: {
            school: true,
            students: {
                include: {
                    record: {
                        include: { responses: { include: { field: true } } }
                    }
                }
            }
        }
    });

    if (!event) return new Response("Not Found", { status: 404 });

    // Compute Headers
    // We extract all unique field labels across all responses to form CSV columns
    const headerSet = new Set<string>(['Student_Name', 'Class', 'Age', 'Gender', 'Student_ID', 'Status']);

    event.students.forEach((student: any) => {
        student.record?.responses.forEach((r: any) => {
            headerSet.add(`"${r.field.label}"`);
        });
    });

    const headers = Array.from(headerSet);

    // Compute Rows
    const rows = event.students.map((student: any) => {
        const rowData: Record<string, string> = {
            'Student_Name': `"${student.name}"`,
            'Class': student.class,
            'Age': student.age.toString(),
            'Gender': student.gender,
            'Student_ID': student.optionalId || "",
            'Status': student.record?.status || "PENDING"
        };

        // Map dynamic responses
        student.record?.responses.forEach((r: any) => {
            let val = Array.isArray(r.value) ? r.value.join(';') : r.value;
            rowData[`"${r.field.label}"`] = `"${val}"`;
        });

        return headers.map(h => rowData[h] || "").join(',');
    });

    const csvContent = [
        headers.join(','),
        ...rows
    ].join('\n');

    return new Response(csvContent, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="event_${event.uniqueId}_data.csv"`
        }
    });
}
