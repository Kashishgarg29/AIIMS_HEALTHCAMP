import { getEventDetails, addStudentToEvent, completeEvent } from "@/services/event.action";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import CompleteEventButton from "./CompleteEventButton";
import AddStudentDoctorModal from "./AddStudentDoctorModal";
import CSVUploadModal from "./CSVUploadModal";
import { getSession } from "@/lib/auth";
import StudentDirectory from "./StudentDirectory";
import {
    ChevronLeft,
    Calendar,
    Users,
    CheckCircle2,
    Clock,
    AlertCircle,
    GraduationCap,
    MapPin,
    FileText,
    Activity
} from "lucide-react";

export default async function EventDashboard({ params }: { params: { eventId: string } }) {
    const session = await getSession();
    const event = await getEventDetails(params.eventId);

    if (!event) return <div className="p-8 text-center text-slate-500">Event not found.</div>;

    const role = session?.user?.role;
    let backUrl = "/dashboard/event";
    if (role === "HOSPITAL_ADMIN") backUrl = "/dashboard/admin";
    if (role === "SCHOOL_REP") backUrl = "/dashboard/school";

    const completed = event.students.filter(s => s.record?.status === 'COMPLETED').length;
    const inProgress = event.students.filter(s => s.record?.status === 'IN_PROGRESS').length;
    const pending = event.students.filter(s => s.record?.status === 'PENDING').length;

    const isEventCompleted = event.status === 'COMPLETED';

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-8">
            {/* Header Section with Gradient Background */}
            <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-950 shadow-sm border bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-transparent border-slate-100 dark:border-slate-800">
                <div className="absolute top-0 left-0 w-full h-24  dark:from-blue-500/10 dark:via-transparent" />

                <div className="relative p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-3 flex-1">
                        <Link
                            href={backUrl}
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            Back
                        </Link>

                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 capitalize">
                                    {event.school.name}
                                </h1>
                                {isEventCompleted ? (
                                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 font-bold px-2 py-0.5 uppercase text-[9px] tracking-widest">
                                        Completed
                                    </Badge>
                                ) : (
                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50 font-bold px-2 py-0.5 uppercase text-[9px] tracking-widest">
                                        Active
                                    </Badge>
                                )}
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-mono font-bold border border-slate-200 dark:border-slate-800">
                                    {event.uniqueId}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-blue-500/70" />
                                    {format(new Date(event.date), 'MMM d, yyyy')}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-indigo-500/70" />
                                    {event.formTemplate?.name || "No Template"}
                                </div>
                                {event.school.address && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5 text-rose-500/70" />
                                        <span className="truncate max-w-[200px]">{event.school.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {event.eventUsers.length > 0 && (
                            <div className="pt-1 flex items-center gap-2">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Team:</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {event.eventUsers.map(eu => (
                                        <Badge key={eu.user.id} variant="secondary" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 px-1.5 py-0 font-bold text-[9px] shadow-sm capitalize">
                                            {eu.user.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {!isEventCompleted && (
                        <div className="shrink-0">
                            <CompleteEventButton eventId={event.id} />
                        </div>
                    )}
                </div>

                {event.visitRequest?.remarks && (
                    <div className="mx-5 mb-5 p-3 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-0.5">Remarks</p>
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">{event.visitRequest.remarks}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Stat Cards - Premium Gradients */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card className="border-none shadow-sm bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 border-blue-100 dark:border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Students</p>
                            <Users className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">{event.students.length}</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50 to-white dark:from-slate-900 border-emerald-100 dark:border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Finished</p>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">{completed}</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50 to-white dark:from-slate-900 border-amber-100 dark:border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Ongoing</p>
                            <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">{inProgress}</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-gradient-to-br from-rose-50 to-white dark:from-slate-900 border-rose-100 dark:border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between pb-1">
                            <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">Remaining</p>
                            <AlertCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">{pending}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-4">
                {/* Quick Add Sidebar */}
                {!isEventCompleted && role !== 'HOSPITAL_ADMIN' && role !== 'SCHOOL_REP' && (
                    <div className="md:col-span-1 space-y-6">
                        <Card className="shadow-sm border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden h-fit sticky top-24">
                            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/5 to-transparent dark:from-blue-500/10" />
                                <CardTitle className="relative text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 flex items-center gap-2">
                                    <div className="p-1 bg-white dark:bg-slate-950 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                                        <Users className="w-3.5 h-3.5 text-blue-500" />
                                    </div>
                                    Quick Addition
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5">
                                <AddStudentDoctorModal eventId={event.id} />

                                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <div className="text-center">
                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Bulk Operations</p>
                                        <CSVUploadModal eventId={event.id} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Student List View */}
                <div className={isEventCompleted || role === 'HOSPITAL_ADMIN' || role === 'SCHOOL_REP' ? "md:col-span-3 lg:col-span-4" : "md:col-span-2 lg:col-span-3"}>
                    <StudentDirectory
                        students={event.students}
                        eventId={event.id}
                        role={role}
                    />
                </div>
            </div>
        </div>
    );
}
