"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/services/admin.action";
import { Trash2 } from "lucide-react";

export default function DeleteEventButton({ eventId }: { eventId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
            return;
        }

        setIsDeleting(true);
        try {
            const res = await deleteEvent(eventId);
            if (res.error) {
                alert(res.error);
            }
        } catch (error) {
            console.error("Failed to delete event", error);
            alert("An error occurred while deleting the event.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            className="flex gap-2 whitespace-nowrap"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting..." : "Delete"}
        </Button>
    );
}
