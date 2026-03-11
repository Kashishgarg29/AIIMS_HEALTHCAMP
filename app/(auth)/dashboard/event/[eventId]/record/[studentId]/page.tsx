import { getEventDetails } from "@/services/event.action";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { getSession } from "@/lib/auth";
import DynamicFieldInput from "./DynamicFieldInput";
import {
    ChevronLeft,
    User,
    Calendar,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    Hash,
    ShieldCheck,
    ListTree
} from "lucide-react";

export default async function StudentRecordPage({ params }: { params: { eventId: string, studentId: string } }) {
    const session = await getSession();
    const event = await getEventDetails(params.eventId);

    if (!event || !event.formTemplate) {
        return <div className="p-8 text-center bg-yellow-50 dark:bg-amber-900/10 text-yellow-800 dark:text-amber-400 m-8 rounded-2xl border border-yellow-200 dark:border-amber-950/50 font-bold">
            <AlertCircle className="w-10 h-10 mx-auto mb-4 opacity-50" />
            This event does not have a valid health camp template attached!
        </div>;
    }

    const student = event.students.find(s => s.id === params.studentId);
    if (!student) return <div className="p-8 text-center text-slate-500 font-bold">Student not found.</div>;

    const record = student.record;
    const isLockedByOther = record?.lockedById && record.lockedById !== session?.user.id;

    const responseMap = (record?.responses || []).reduce((acc: any, curr) => {
        acc[curr.fieldId] = curr.value;
        return acc;
    }, {});

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-24">
            {/* Premium Header Section */}
            <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-950 shadow-sm border border-slate-100 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-transparent dark:border-slate-800">
                <div className="absolute top-0 left-0 w-full h-32  dark:from-blue-500/10 dark:via-transparent" />

                <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4 flex-1">
                        <Link
                            href={session?.user.role === 'SCHOOL_REP' ? '/dashboard/school' : `/dashboard/event/${params.eventId}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Return to Directory
                        </Link>

                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 capitalize">
                                    {student.name}
                                </h1>
                                {record?.status === 'COMPLETED' ? (
                                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 font-bold px-3 py-1 uppercase text-[10px] tracking-widest">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Completed
                                    </Badge>
                                ) : record?.status === 'IN_PROGRESS' ? (
                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50 font-bold px-3 py-1 uppercase text-[10px] tracking-widest">
                                        <Clock className="w-3 h-3 mr-1 animate-pulse" />
                                        In Progress
                                    </Badge>
                                ) : (
                                    <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/50 font-bold px-3 py-1 uppercase text-[10px] tracking-widest">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Pending
                                    </Badge>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-400 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-blue-500/70" />
                                    Grade {student.class}
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-indigo-500/70" />
                                    {student.age} • {student.gender}
                                </div>
                                {student.optionalId && (
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-rose-500/70" />
                                        UID: {student.optionalId}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-right">Assessment Form</p>
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{event.formTemplate.name}</p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-12 items-start">
                {/* Main Record Area */}
                <div className="md:col-span-8 lg:col-span-9 space-y-8">
                    {event.formTemplate.sections.map((section) => (
                        <Card key={section.id} id={`section-${section.id}`} className="scroll-mt-24 shadow-sm border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 p-5 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/5 to-transparent dark:from-blue-500/10" />
                                <CardTitle className="relative text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    {section.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 sm:p-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                {section.fields.map((field) => (
                                    <div key={field.id} className={field.type === 'TEXT' || field.type === 'SIGNATURE' ? 'sm:col-span-2' : ''}>
                                        <Label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-400">
                                            {field.label} {field.isRequired && <span className="text-rose-500">*</span>}
                                        </Label>

                                        <DynamicFieldInput
                                            field={field}
                                            eventId={params.eventId}
                                            studentId={params.studentId}
                                            recordId={record?.id || ""}
                                            initialValue={responseMap[field.id] || ""}
                                            disabled={field.isDisabled || session?.user?.role !== 'EVENT_USER' || event.status === 'COMPLETED'}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sticky Navigation Sidebar */}
                <div className="md:col-span-4 lg:col-span-3 hidden md:block sticky top-24 space-y-6">
                    <Card className="shadow-sm border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <CardHeader className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                <ListTree className="w-3.5 h-3.5" />
                                Form Sections
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ul className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                {event.formTemplate.sections.map((section) => (
                                    <li key={section.id} className="border-b last:border-0 border-slate-50 dark:border-slate-900 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                                        <Link href={`#section-${section.id}`} className="flex items-center gap-3 p-3.5 px-4 w-full h-full hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                            <div className="w-1 h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                                            {section.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <div className="p-5 bg-blue-50/30 dark:bg-blue-900/5 rounded-2xl border border-blue-100/50 dark:border-blue-900/20">
                        <p className="text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 text-center leading-relaxed italic uppercase tracking-widest">
                            ⚡ Continuous Cloud Saving Active • PeerSync Enabled
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
