import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Stethoscope, Building, AlertCircle } from "lucide-react";

export default async function EventIndexPage() {
    const session = await getSession();

    // If Hospital Admin, they see all events
    let events: any[] = [];

    if (session?.user.role === "HOSPITAL_ADMIN") {
        events = await prisma.event.findMany({
            where: { status: 'ACTIVE' },
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
        events = mappings.map((m: any) => m.event).filter((e: any) => e.status === 'ACTIVE');
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight  text-blue-900 dark:text-slate-50">Active Health Camps</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage and access workspaces you're assigned to.</p>
                </div>
                <Button variant="outline" className="shrink-0 rounded-full shadow-sm hover:bg-slate-50 hover:text-blue-600 border-slate-200 transition-all font-medium" asChild>
                    <Link href="/dashboard/event/past">View Past Events &rarr;</Link>
                </Button>
            </div>

            {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                        <Stethoscope className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No Active Assignments</h3>
                    <p className="max-w-md text-slate-500 dark:text-slate-400">You have no upcoming health camp events. You will see them here once an admin assigns you.</p>
                </div>
            ) : (
                <Card className="shadow-sm border-none bg-white dark:bg-slate-950 overflow-hidden">
                    <CardContent className="p-0">
                        {events.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center">
                                <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                                    <Stethoscope className="h-8 w-8 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No Active Assignments</h3>
                                <p className="max-w-md text-slate-500 dark:text-slate-400">You have no upcoming health camp events. You will see them here once an admin assigns you.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                    <TableRow>
                                        <TableHead className="w-[180px] font-bold uppercase text-[10px] tracking-widest text-slate-400">Date</TableHead>
                                        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">School / Location</TableHead>
                                        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Status</TableHead>
                                        <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400 text-center">Enrolled</TableHead>
                                        <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-slate-400">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {events.map((event: any) => (
                                        <TableRow key={event.id} className="group hover:bg-slate-50/30 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                                                    <CalendarDays className="w-4 h-4 text-blue-500" />
                                                    {format(new Date(event.date), 'MMM d, yyyy')}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100 capitalize">{event.school.name}</span>
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Health Camp</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0 shadow-none font-bold text-[10px] uppercase px-2.5">
                                                    Active
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                                                    <Users className="w-3.5 h-3.5 text-blue-600" />
                                                    <span className="font-bold text-slate-900 dark:text-slate-100">{event._count.students}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/dashboard/event/${event.id}`}>
                                                    <Button size="sm" className="h-8 shadow-sm bg-blue-600 hover:bg-blue-700 text-white border-none font-bold text-[10px] uppercase tracking-widest px-4">
                                                        Open Dashboard &rarr;
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
            )}
        </div>
    );
}

// Ensure FileText icon is imported if I used it inline
import { FileText } from "lucide-react";
