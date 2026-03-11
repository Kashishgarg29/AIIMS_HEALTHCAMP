"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
    Search,
    UserPlus,
    ArrowRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    User,
    GraduationCap,
    HeartPulse,
    Info,
    Layout
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import StudentProfileView from "./StudentProfileView";

interface Student {
    id: string;
    name: string;
    class: string;
    age: number;
    gender: string;
    precaution: string | null;
    optionalId: string | null;
    record: {
        status: string;
    } | null;
}

interface StudentDirectoryProps {
    students: Student[];
    eventId: string;
    role: string | undefined;
}

export default function StudentDirectory({ students, eventId, role }: StudentDirectoryProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.optionalId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.class.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Premium Header */}
            <div className="relative p-5 border-b border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-900/50" />
                <div className="relative flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                            <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                                Student Directory
                                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[10px] px-2 py-0">
                                    {students.length}
                                </Badge>
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Manage health camp participants</p>
                        </div>
                    </div>
                    <div className="relative w-full sm:max-w-[280px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            placeholder="Find student by name or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grade/Class</th>
                            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Participant Details</th>
                            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personal Info</th>
                            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Outcome</th>
                            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                        {filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-16 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-200">
                                            <Search className="h-10 w-10" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-slate-100">Zero matches found</p>
                                            <p className="text-xs text-slate-400 mt-1">Try a different name or student identifier</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((student) => (
                                <tr key={student.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all duration-200">
                                    <td className="px-5 py-4">
                                        <Badge variant="outline" className="text-[10px] font-bold bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 px-2 py-0.5 shadow-sm text-slate-600 dark:text-slate-300">
                                            {student.class}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex flex-col">
                                            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 capitalize">
                                                {student.name}
                                                {student.precaution && (
                                                    <Badge className="bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50 font-bold text-[9px] px-1.5 py-0">
                                                        {student.precaution}
                                                    </Badge>
                                                )}
                                            </div>
                                            {student.optionalId && <span className="text-[10px] font-bold text-slate-400 mt-0.5 tracking-tight">ID: {student.optionalId}</span>}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            <span className="capitalize">{student.gender}</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                                            <span>Age {student.age}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        {student.record?.status === 'COMPLETED' ? (
                                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 font-bold text-[9px] px-2 py-0.5 uppercase tracking-widest">
                                                <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                                                Finished
                                            </Badge>
                                        ) : student.record?.status === 'IN_PROGRESS' ? (
                                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50 font-bold text-[9px] px-2 py-0.5 uppercase tracking-widest">
                                                <Clock className="w-2.5 h-2.5 mr-1 animate-pulse" />
                                                Ongoing
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/50 font-bold text-[9px] px-2 py-0.5 uppercase tracking-widest">
                                                <AlertCircle className="w-2.5 h-2.5 mr-1" />
                                                Pending
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-9 w-9 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-xl"
                                                        title="View Profile"
                                                    >
                                                        <Info className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0 rounded-3xl shadow-2xl">
                                                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 text-white sticky top-0 z-10">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                                                                <User className="w-6 h-6 text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <DialogTitle className="text-2xl font-bold text-white capitalize">{student.name}</DialogTitle>
                                                                <DialogDescription className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-0.5">
                                                                    Registration Profile • Grade {student.class}
                                                                </DialogDescription>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-6 sm:p-8 bg-white dark:bg-slate-950">
                                                        <StudentProfileView student={student} role={role} />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="group/btn hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-xs rounded-xl"
                                                asChild
                                            >
                                                <Link href={`/dashboard/event/${eventId}/record/${student.id}`} className="flex items-center gap-2">
                                                    {student.record?.status === 'COMPLETED' || role !== 'EVENT_USER' ? 'View Record' : 'Fill Record'}
                                                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Premium Footer */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                    <div className="h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
                    Live Cloud Sync Active
                </div>
                <div className="text-[9px] font-bold text-slate-300 dark:text-slate-600">
                    EVENT NODE: {eventId.slice(-8).toUpperCase()}
                </div>
            </div>
        </div>
    );
}
