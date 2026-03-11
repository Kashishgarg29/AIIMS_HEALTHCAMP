"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDirectEvent } from "@/services/admin.action";
import { Plus, School, Settings, Users } from "lucide-react";

export default function CreateEventModal({
    templates,
    availableDoctors
}: {
    templates: any[],
    availableDoctors: any[]
}) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);
            const res = await createDirectEvent(formData);

            if (res.error) {
                alert(res.error);
            } else {
                setOpen(false);
            }
        } catch (error) {
            console.error("Failed to create event:", error);
            alert("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 rounded-xl shadow-sm transition-all text-white">
                    <Plus className="w-4 h-4" />
                    Create Event
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-0 rounded-2xl shadow-2xl bg-white dark:bg-slate-950">
                <div className="bg-blue-600 p-6 md:p-8 text-white shrink-0">
                    <DialogTitle className="text-2xl font-bold  flex items-center gap-2 text-white">
                        <Plus className="w-6 h-6 opacity-80" />
                        Create New Event
                    </DialogTitle>
                    <DialogDescription className="text-blue-100 mt-2 text-sm leading-relaxed">
                        Manually create a newly structured health camp event, define required templates, provide school details, and assign doctors.
                    </DialogDescription>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 bg-slate-50 dark:bg-slate-950">
                    <div className="space-y-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <School className="w-5 h-5 text-blue-500" />
                            <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-100 ">School Details</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2.5">
                                <Label htmlFor="schoolName" className="text-sm font-medium text-slate-700 dark:text-slate-300">School Name *</Label>
                                <Input id="schoolName" name="schoolName" required placeholder="XYZ Academy" className="bg-slate-50 focus-visible:ring-blue-500" />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="contactPerson" className="text-sm font-medium text-slate-700 dark:text-slate-300">Contact Person *</Label>
                                <Input id="contactPerson" name="contactPerson" required placeholder="Principal Name" className="bg-slate-50 focus-visible:ring-blue-500" />
                            </div>
                        </div>
                        <div className="space-y-2.5">
                            <Label htmlFor="address" className="text-sm font-medium text-slate-700 dark:text-slate-300">Address *</Label>
                            <Input id="address" name="address" required placeholder="Full School Address" className="bg-slate-50 focus-visible:ring-blue-500" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2.5">
                                <Label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number *</Label>
                                <Input id="phone" name="phone" placeholder="+1234567890" required className="bg-slate-50 focus-visible:ring-blue-500" />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address *</Label>
                                <Input id="email" name="email" type="email" placeholder="school@example.com" required className="bg-slate-50 focus-visible:ring-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <Settings className="w-5 h-5 text-indigo-500" />
                            <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-100 ">Event Configuration</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2.5">
                                <Label htmlFor="templateId" className="text-sm font-medium text-slate-700 dark:text-slate-300">Form Template *</Label>
                                <select
                                    id="templateId"
                                    name="templateId"
                                    required
                                    className="flex h-11 w-full rounded-xl border border-input bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select a template...</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="scheduledDate" className="text-sm font-medium text-slate-700 dark:text-slate-300">Scheduled Date *</Label>
                                <Input id="scheduledDate" name="scheduledDate" type="date" required className="bg-slate-50 focus-visible:ring-blue-500" />
                            </div>
                        </div>

                        <div className="space-y-3 pt-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-emerald-500" />
                                    Assign Doctors (Optional)
                                </Label>
                                <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{availableDoctors.length} available</span>
                            </div>

                            {availableDoctors.length === 0 ? (
                                <div className="text-sm text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-200">
                                    No doctors are currently available. Ensure doctors are registered in the portal to assign them.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border p-4 rounded-xl max-h-56 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                                    {availableDoctors.map(doctor => (
                                        <label key={doctor.id} className="flex items-start space-x-3 cursor-pointer hover:bg-white dark:hover:bg-slate-800 p-3 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow">
                                            <input type="checkbox" name="doctorIds" value={doctor.id} className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900 dark:text-slate-100 leading-none capitalize">{doctor.name}</span>
                                                <span className="text-xs text-slate-500 mt-1">{doctor.email}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl px-6">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-md">
                            {isSubmitting ? "Creating Event..." : "Create Event"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
