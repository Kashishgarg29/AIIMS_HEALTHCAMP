"use client";

import { useState, useCallback, useEffect } from "react";
import { updateFieldResponse } from "@/services/record.action";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

// A simulated debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
}

export default function DynamicFieldInput({
    field,
    eventId,
    studentId,
    recordId,
    initialValue,
    disabled
}: {
    field: any,
    eventId: string,
    studentId: string,
    recordId: string,
    initialValue: any,
    disabled: boolean
}) {

    const [val, setVal] = useState(initialValue);
    const [saving, setSaving] = useState(false);
    const pathname = usePathname();

    const debouncedVal = useDebounce(val, 800); // 800ms debounce

    // Fire actual server action on debounce or explicit blur
    const saveToDB = useCallback(async (valueToSave: any) => {
        // Skip if nothing changed from initial
        if (valueToSave === initialValue) return;

        setSaving(true);
        const formData = new FormData();
        formData.append("recordId", recordId);
        formData.append("fieldId", field.id);
        formData.append("eventId", eventId);
        formData.append("studentId", studentId);
        formData.append("value", JSON.stringify(valueToSave));

        await updateFieldResponse(formData);

        setSaving(false);
    }, [field.id, recordId, eventId, studentId, initialValue]);

    useEffect(() => {
        if (debouncedVal !== initialValue) {
            saveToDB(debouncedVal);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedVal]);


    const baseClasses = `transition-all duration-300 ${saving ? 'ring-2 ring-yellow-400 bg-yellow-50/10' : ''}`;

    if (field.type === 'TEXT') {
        return <textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={() => saveToDB(val)}
            disabled={disabled}
            placeholder="Enter notes..."
            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${baseClasses}`}
        />;
    }

    if (field.type === 'NUMBER') {
        return <Input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={() => saveToDB(val)}
            disabled={disabled}
            className={baseClasses}
        />;
    }

    if (field.type === 'DROPDOWN' && field.options) {
        // Options stored as JSON array in DB
        const opts = (Array.isArray(field.options) ? field.options : JSON.parse(field.options)) || [];

        return (
            <select
                value={val}
                onChange={(e) => setVal(e.target.value)}
                disabled={disabled}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${baseClasses}`}
            >
                <option value="" disabled>Select option...</option>
                {opts.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        );
    }

    if (field.type === 'RADIO' && field.options) {
        const opts = (Array.isArray(field.options) ? field.options : JSON.parse(field.options)) || [];

        return (
            <div className="flex gap-4 items-center h-10">
                {opts.map((opt: string) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm">
                        <input
                            type="radio"
                            name={`radio-${field.id}`}
                            value={opt}
                            checked={val === opt}
                            onChange={(e) => setVal(e.target.value)}
                            disabled={disabled}
                            className="h-4 w-4 text-primary"
                        />
                        {opt}
                    </label>
                ))}
            </div>
        );
    }

    if (field.type === 'DATE') {
        return <Input
            type="date"
            value={val ? String(val).split('T')[0] : ""} // Format HTML5 date
            onChange={(e) => setVal(e.target.value)}
            onBlur={() => saveToDB(val)}
            disabled={disabled}
            className={baseClasses}
        />;
    }

    // Default Fallback
    return <Input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => saveToDB(val)}
        disabled={disabled}
        className={baseClasses}
    />;
}
