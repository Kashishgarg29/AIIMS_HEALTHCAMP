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
import { updateEventDate } from "@/services/admin.action";

export default function ManageDateModal({
    eventId,
    schoolName,
    currentDate
}: {
    eventId: string,
    schoolName: string,
    currentDate: string | Date
}) {
    const [open, setOpen] = useState(false);
    // Format date string to YYYY-MM-DD for input type="date"
    const formattedDate = new Date(currentDate).toISOString().split('T')[0];
    const [dateField, setDateField] = useState(formattedDate);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        const res = await updateEventDate(eventId, dateField);
        setLoading(false);
        if (res?.error) {
            alert(res.error);
        } else {
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (val) setDateField(formattedDate);
            setOpen(val);
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Manage Date</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Event Date</DialogTitle>
                    <DialogDescription>
                        Specify the scheduled date for the <b>{schoolName}</b> event.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-2">
                    <Label htmlFor="eventDate" className="text-xs">Scheduled Date</Label>
                    <Input
                        id="eventDate"
                        type="date"
                        value={dateField}
                        onChange={(e) => setDateField(e.target.value)}
                        className="h-10 text-sm"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                        {loading ? "Saving..." : "Save Date"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
