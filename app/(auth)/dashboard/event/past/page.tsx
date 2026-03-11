import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PastEventIndexPage() {
    const session = await getSession();

    let events: any[] = [];

    if (session?.user.role === "HOSPITAL_ADMIN") {
        events = await prisma.event.findMany({
            where: { status: 'COMPLETED' },
            include: { school: true, visitRequest: true, _count: { select: { students: true } } },
            orderBy: { date: 'desc' }
        });
    } else if (session?.user.role === "EVENT_USER") {
        const mappings = await prisma.eventUser.findMany({
            where: { userId: session.user.id },
            include: {
                event: {
                    include: { school: true, visitRequest: true, _count: { select: { students: true } } }
                }
            }
        });
        events = mappings.map((m: any) => m.event).filter((e: any) => e.status === 'COMPLETED');
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-blue-900 tracking-tight">Past Events</h1>
                    <p className="text-muted-foreground">Historical records of health camps you participated in.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/event">&larr; Back to Active Events</Link>
                </Button>
            </div>

            <Card className="shadow-sm border-none bg-white dark:bg-slate-950 overflow-hidden opacity-90">
                <CardContent className="p-0">
                    {events.length === 0 ? (
                        <div className="text-center p-12 border-2 border-dashed rounded-2xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500">
                            No completed events found in your history.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                <TableRow>
                                    <TableHead className="w-[180px] font-bold uppercase text-[10px] tracking-widest text-slate-400">Date</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">School / Location</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Status</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400 text-center">Students Checked</TableHead>
                                    <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((event: any) => (
                                    <TableRow key={event.id} className="group hover:bg-slate-50/30 transition-colors">
                                        <TableCell className="font-bold text-slate-700 dark:text-slate-300">
                                            {format(new Date(event.date), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-slate-100 capitalize">{event.school.name}</span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter italic truncate max-w-[200px]">
                                                    {event.visitRequest?.remarks ? `"${event.visitRequest.remarks}"` : "Completed health camp"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold text-[10px] uppercase px-2.5">
                                                Completed
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                                                <span className="font-bold text-slate-900 dark:text-slate-100">{event._count.students}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/dashboard/event/${event.id}`}>
                                                <Button size="sm" className="h-8 shadow-sm bg-slate-200 hover:bg-slate-300 text-slate-800 border-none font-bold text-[10px] uppercase tracking-widest px-4">
                                                    View Archives
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
