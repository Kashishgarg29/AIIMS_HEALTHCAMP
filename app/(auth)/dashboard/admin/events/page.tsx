import { getActiveEvents, getCompletedEvents, getFormTemplates, getStaffUsers } from "@/services/admin.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Activity, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import CreateEventModal from "../CreateEventModal";
import ManageDateModal from "../ManageDateModal";
import ManageDoctorsModal from "../ManageDoctorsModal";
import DeleteEventButton from "../../components/DeleteEventButton";
import SchoolDetailsModal from "@/components/modules/SchoolDetailsModal";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EventsManagementPage() {
    const session = await getSession();
    if (!session || session.user.role !== "HOSPITAL_ADMIN") {
        redirect("/dashboard");
    }

    const activeEvents = await getActiveEvents();
    const completedEvents = await getCompletedEvents();
    const templates = await getFormTemplates();
    const staff = await getStaffUsers();
    const availableDoctors = staff.filter((s: any) => s.role === 'EVENT_USER');

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight  text-blue-900 dark:text-slate-50">Health Camps</h1>
                    <p className="text-slate-500 dark:text-slate-400">Schedule and manage your ongoing and historical medical camps.</p>
                </div>
                <CreateEventModal templates={templates} availableDoctors={availableDoctors} />
            </div>

            {/* Active Events Overview */}
            <Card className="shadow-sm border-none overflow-hidden bg-white dark:bg-slate-950 ">
                <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-white bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex text-indigo-600 dark:text-indigo-400 items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            <CardTitle>Active Events</CardTitle>
                        </div>
                        <CardDescription>Live health camps currently in progress or scheduled.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {activeEvents.length === 0 ? (
                        <div className="text-center p-12">
                            <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No active events scheduled</h3>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">Create a new health camp to start assigning doctors and tracking student progress.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/30">
                                <TableRow>
                                    <TableHead className="w-[180px] font-bold uppercase text-[10px] tracking-widest text-slate-400">Date</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">School Name</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Status</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Assigned Team</TableHead>
                                    <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeEvents.map((evt: any) => (
                                    <TableRow key={evt.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-bold text-slate-600">
                                            {format(new Date(evt.date), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <SchoolDetailsModal school={evt.school} />
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0 font-bold text-[9px] uppercase tracking-wider">Active</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1.5 min-w-[150px]">
                                                {evt.eventUsers.length === 0 ? (
                                                    <span className="text-[10px] text-slate-400 italic">Unassigned</span>
                                                ) : (
                                                    evt.eventUsers.map((eu: any) => (
                                                        <Badge key={eu.user.id} variant="secondary" className="font-bold text-[9px] px-2 py-0 border-slate-200 capitalize bg-slate-100/50 text-slate-600 border-0">
                                                            {eu.user.name}
                                                        </Badge>
                                                    ))
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <ManageDateModal
                                                    eventId={evt.id}
                                                    schoolName={evt.school?.name || "the school"}
                                                    currentDate={evt.date}
                                                />
                                                <ManageDoctorsModal
                                                    eventId={evt.id}
                                                    schoolName={evt.school?.name || "the school"}
                                                    availableDoctors={availableDoctors}
                                                    assignedDoctorIds={evt.eventUsers.map((eu: any) => eu.userId)}
                                                />
                                                <Link href={`/dashboard/event/${evt.id}`}>
                                                    <Button size="sm" variant="default" className="h-8 shadow-sm bg-blue-600 hover:bg-blue-700 text-white px-3 text-[10px] font-bold uppercase tracking-widest">Enter</Button>
                                                </Link>
                                                <DeleteEventButton eventId={evt.id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Past Events Records */}
            <Card className="shadow-sm border-none overflow-hidden bg-white dark:bg-slate-950">
                <CardHeader className="border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-white dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="flex text-indigo-600 dark:text-indigo-400 items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <CardTitle>Historical Archive</CardTitle>
                    </div>
                    <CardDescription>Completed health camps and their finalized medical records.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {completedEvents.length === 0 ? (
                        <div className="p-8 text-center text-sm font-medium text-slate-500">
                            No completed events found in the archive.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/30">
                                <TableRow>
                                    <TableHead className="w-[180px] font-bold uppercase text-[10px] tracking-widest text-slate-400">Completion Date</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">School Name</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Status</TableHead>
                                    <TableHead className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Medical Team</TableHead>
                                    <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest text-slate-400">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {completedEvents.map((evt: any) => (
                                    <TableRow key={evt.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-bold text-slate-500">
                                            {format(new Date(evt.date), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <SchoolDetailsModal school={evt.school} />
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="success" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0 font-bold text-[9px] uppercase tracking-wider">Completed</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1.5 min-w-[150px]">
                                                {evt.eventUsers.length === 0 ? (
                                                    <span className="text-[10px] text-slate-400 italic">Unassigned</span>
                                                ) : (
                                                    evt.eventUsers.map((eu: any) => (
                                                        <Badge key={eu.user.id} variant="secondary" className="font-bold text-[9px] px-2 py-0 border-slate-200 capitalize bg-slate-100/30 text-slate-500 border-0">
                                                            {eu.user.name}
                                                        </Badge>
                                                    ))
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <Link href={`/dashboard/event/${evt.id}`}>
                                                    <Button size="sm" className="h-8 shadow-sm bg-slate-50 text-slate-600 hover:bg-slate-100 border-none px-3 font-bold text-[10px] uppercase tracking-widest">
                                                        View Records
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
            </Card >
        </div >
    );
}
