"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { removeStaff } from "@/services/admin.action";

export default function RemoveStaffButton({ userId }: { userId: string }) {
    const [loading, setLoading] = useState(false);

    const handleRemove = async () => {
        if (!confirm("Are you sure you want to remove this staff member? This action cannot be undone.")) return;

        setLoading(true);
        const res = await removeStaff(userId);

        if (res?.error) {
            alert(res.error);
        }
        setLoading(false);
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            disabled={loading}
            className="h-7 px-3 text-xs"
        >
            {loading ? "Removing..." : "Remove"}
        </Button>
    );
}
