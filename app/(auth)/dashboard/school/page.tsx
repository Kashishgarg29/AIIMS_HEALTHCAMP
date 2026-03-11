import { getSession } from "@/lib/auth";
import { getSchoolEvents } from "@/services/school.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import AddStudentModal from "./AddStudentModal";
import CSVUploadModal from "../event/[eventId]/CSVUploadModal";
import { Activity, Calendar, CheckCircle2, FileText, Hash, Lock, Users, Target } from "lucide-react";

export default async function SchoolDashboard() {
    const session = await getSession();
    if (!session || session.user.role !== "SCHOOL_REP") {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="p-8 text-center text-red-600 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-100 dark:border-red-900/30 font-bold max-w-sm">
                    Unauthorized Access. Please login as a School Representative.
                </div>
            </div>
        );
    }

    const events = await getSchoolEvents();

    return (
        <div className="space-y-8 max-w-5xl animate-in fade-in duration-500 pb-12">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-blue-900 dark:text-slate-50">School Portal</h1>
                <p className="text-slate-500 dark:text-slate-400">Manage your upcoming health camps and pre-register students.</p>
            </div>

            <Card className="shadow-sm border-none bg-white dark:bg-slate-950 overflow-hidden">
                <CardContent className="p-0">
                    {events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-16 text-center text-blue-900 dark:text-slate-50dark:text-slate-400">
                            <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2 ">No Active Events</h3>
                            <p className="max-w-md">You do not have any upcoming health camps officially scheduled right now. When a Hospital Admin approves your Visit Request, it will appear here.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                <TableRow>
                                    <TableHead className="w-[180px] font-bold uppercase text-[10px] tracking-widest text-slate-400">Date</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Status</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Students</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Template</TableHead>
                                    {/* <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Event ID</TableHead> */}
                                    <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((evt: any) => (
                                    <TableRow key={evt.id} className="group hover:bg-slate-50/30 transition-colors">
                                        <TableCell className="font-bold text-slate-700 dark:text-slate-300">
                                            {format(new Date(evt.date), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            {evt.isLocked ? (
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 gap-1 rounded-md px-2 border-0 font-bold text-[10px] uppercase">
                                                    <Lock className="w-3 h-3" /> Locked
                                                </Badge>
                                            ) : (
                                                <Badge variant="success" className="bg-emerald-100 text-emerald-800 gap-1 rounded-md px-2 border-0 shadow-none font-bold text-[10px] uppercase">
                                                    <CheckCircle2 className="w-3 h-3" /> Active
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-900 dark:text-slate-100">{evt._count?.students || 0}</span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Registered</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[120px] block">
                                                {evt.formTemplate?.name || 'Standard Checks'}
                                            </span>
                                        </TableCell>
                                        {/* <TableCell className="font-mono text-[10px] text-slate-500">
                                            {evt.uniqueId.split('-')[0]}...
                                        </TableCell> */}
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {!evt.isLocked && (
                                                    <>
                                                        <AddStudentModal eventId={evt.id} eventDate={format(new Date(evt.date), 'MMM d, yyyy')} />
                                                        <CSVUploadModal eventId={evt.id} />
                                                    </>
                                                )}
                                                <Link href={`/dashboard/event/${evt.id}`}>
                                                    <Button size="sm" className="h-8 shadow-sm bg-blue-600 hover:bg-blue-700 text-white border-none font-bold text-[10px] uppercase tracking-widest px-4">
                                                        {evt.isLocked ? "View Records" : "Enter Portal"}
                                                    </Button>
                                                </Link>
                                            </div>
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
