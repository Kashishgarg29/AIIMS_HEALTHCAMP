"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { completeEvent } from "@/services/event.action";
import { CheckCircle } from "lucide-react";

export default function CompleteEventButton({ eventId }: { eventId: string }) {
    const [isCompleting, setIsCompleting] = useState(false);

    const handleComplete = async () => {
        if (!confirm("Are you sure you want to mark this event as COMPLETED? No further changes will be allowed.")) {
            return;
        }

        setIsCompleting(true);
        try {
            const res = await completeEvent(eventId);
            if (res?.error) {
                alert(res.error);
            }
        } catch (error) {
            console.error("Failed to complete event", error);
            alert("An error occurred while completing the event.");
        } finally {
            setIsCompleting(false);
        }
    };

    return (
        <Button
            size="sm"
            className="flex gap-2 whitespace-nowrap bg-green-600 hover:bg-green-700 text-white"
            onClick={handleComplete}
            disabled={isCompleting}
        >
            <CheckCircle className="w-4 h-4" />
            {isCompleting ? "Completing..." : "Complete Event"}
        </Button>
    );
}
