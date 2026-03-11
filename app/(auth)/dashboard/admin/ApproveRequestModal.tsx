"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Calendar, Users, Settings, Clock, Info } from "lucide-react";
import { approveVisitRequest } from "@/services/admin.action";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface ApproveRequestModalProps {
    request: any;
    templates: any[];
    availableDoctors: any[];
}

export default function ApproveRequestModal({ request, templates, availableDoctors }: ApproveRequestModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const templateId = formData.get("templateId") as string;
        const doctorIds = formData.getAll("doctorIds") as string[];
        const scheduledDate = formData.get("scheduledDate") as string;

        try {
            const result = await approveVisitRequest(request.id, templateId, doctorIds, scheduledDate);
            if (result.success) {
                setOpen(false);
                router.refresh();
            } else {
                alert(result.error || "Failed to approve request");
            }
        } catch (error) {
            alert("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-sm hover:shadow-md transition-all font-bold text-[10px] uppercase tracking-widest rounded-lg">
                    Approve Request
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 rounded-2xl shadow-2xl bg-white dark:bg-slate-950">
                <div className="bg-emerald-600 p-6 md:p-8 text-white sticky top-0 z-10">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-white">
                        <CheckCircle2 className="w-6 h-6 opacity-80" />
                        Approve Camp Request
                    </DialogTitle>
                    <DialogDescription className="text-emerald-100 mt-2">
                        Set the schedule and assign a medical team for {request.schoolName}.
                    </DialogDescription>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                    {/* Request Summary */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">School</Label>
                            <p className="font-bold text-slate-900 dark:text-slate-100">{request.schoolName}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Requested Date</Label>
                            <p className="font-bold text-slate-900 dark:text-slate-100">{format(new Date(request.preferredDate), 'MMM d, yyyy')}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-slate-400 font-bold tracking-widest">Strength</Label>
                            <p className="font-bold text-slate-900 dark:text-slate-100">{request.studentStrength} Students</p>
                        </div>
                    </div>

                    {/* Step 1: Assign Doctors */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            <Users className="w-4 h-4 text-blue-500" />
                            <h4 className="font-bold uppercase text-[10px] tracking-widest">1. Assign Medical Team</h4>
                        </div>
                        {availableDoctors.length === 0 ? (
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-sm flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                No doctors available. Please add them from the Staff Directory.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                                {availableDoctors.map((doctor: any) => (
                                    <label key={doctor.id} className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer transition-all group">
                                        <input
                                            type="checkbox"
                                            name="doctorIds"
                                            value={doctor.id}
                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 accent-blue-600"
                                        />
                                        <span className="text-sm font-semibold capitalize group-hover:text-blue-700">{doctor.name}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Step 2: Configuration */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                            <Settings className="w-4 h-4 text-indigo-500" />
                            <h4 className="font-bold uppercase text-[10px] tracking-widest">2. Event Configuration</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="templateId" className="text-sm font-medium">Form Template</Label>
                                <select
                                    id="templateId"
                                    name="templateId"
                                    required
                                    className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                >
                                    <option value="">Select a template...</option>
                                    {templates.map((t: any) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="scheduledDate" className="text-sm font-medium">Scheduled Date</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="scheduledDate"
                                        name="scheduledDate"
                                        type="date"
                                        required
                                        defaultValue={new Date(request.preferredDate).toISOString().split('T')[0]}
                                        className="pl-10 h-11 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="flex-1 h-11 rounded-xl font-bold">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-md font-bold text-white">
                            {loading ? "Processing..." : "Confirm Approval"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
