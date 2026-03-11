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
import { updateEventStaff } from "@/services/admin.action";

export default function ManageDoctorsModal({
    eventId,
    schoolName,
    availableDoctors,
    assignedDoctorIds
}: {
    eventId: string,
    schoolName: string,
    availableDoctors: any[],
    assignedDoctorIds: string[]
}) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set(assignedDoctorIds));
    const [loading, setLoading] = useState(false);

    const toggleDoctor = (id: string) => {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelected(next);
    };

    const handleSave = async () => {
        setLoading(true);
        const res = await updateEventStaff(eventId, Array.from(selected));
        setLoading(false);
        if (res?.error) {
            alert(res.error);
        } else {
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (val) setSelected(new Set(assignedDoctorIds));
            setOpen(val);
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Manage Doctors</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign Doctors</DialogTitle>
                    <DialogDescription>
                        Select which doctors should have access to the <b>{schoolName}</b> event dashboard.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-2 max-h-[60vh] overflow-y-auto">
                    {availableDoctors.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">No doctors available. Add them in the AIMS Portal.</p>
                    ) : (
                        availableDoctors.map(doctor => (
                            <label key={doctor.id} className="flex items-center space-x-3 border border-slate-200 p-3 rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-blue-600"
                                    checked={selected.has(doctor.id)}
                                    onChange={() => toggleDoctor(doctor.id)}
                                />
                                <div>
                                    <div className="font-medium text-sm text-slate-800 capitalize">{doctor.name}</div>
                                    <div className="text-xs text-slate-500">{doctor.email || doctor.phone || "No contact info"}</div>
                                </div>
                            </label>
                        ))
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                        {loading ? "Saving..." : "Save Assignments"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
