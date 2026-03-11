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
import { bulkAddStudents } from "@/services/event.action";
import { UploadCloud, AlertCircle } from "lucide-react";

export default function CSVUploadModal({ eventId }: { eventId: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            if (!text) {
                setError("Empty file");
                setLoading(false);
                return;
            }

            try {
                // Determine delimiter
                const firstLine = text.split('\n')[0];
                const delimiter = firstLine.includes('\t') ? '\t' : (firstLine.includes(',') ? ',' : ';');

                const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
                if (lines.length < 2) {
                    setError("The CSV file is empty or missing headers.");
                    setLoading(false);
                    return;
                }

                const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());

                if (!headers.includes('name') || !headers.includes('class') || !headers.includes('age') || !headers.includes('gender')) {
                    setError(`CSV must have columns: name, class, age, gender. Found headers: ${headers.join(', ')}`);
                    setLoading(false);
                    return;
                }

                const data = [];
                for (let i = 1; i < lines.length; i++) {
                    // Quick parse handling quotes
                    let rowStr = lines[i];
                    const values: string[] = [];
                    let inQuotes = false;
                    let currentValue = "";
                    for (let j = 0; j < rowStr.length; j++) {
                        const char = rowStr[j];
                        if (char === '"') {
                            inQuotes = !inQuotes;
                        } else if (char === delimiter && !inQuotes) {
                            values.push(currentValue);
                            currentValue = "";
                        } else {
                            currentValue += char;
                        }
                    }
                    values.push(currentValue);

                    const rowObj: any = {};
                    headers.forEach((h, idx) => {
                        rowObj[h] = values[idx]?.trim().replace(/^"|"$/g, '') || "";
                    });

                    if (rowObj.name && rowObj.class) {
                        data.push(rowObj);
                    }
                }

                if (data.length === 0) {
                    setError("No valid student rows found.");
                    setLoading(false);
                    return;
                }

                const res = await bulkAddStudents(eventId, data);
                if (res.error) {
                    setError(res.error);
                } else {
                    setOpen(false);
                }
            } catch (err: any) {
                setError(err.message || "Failed to upload students");
            } finally {
                setLoading(false);
            }
        };

        reader.onerror = () => {
            setError("Failed to read file.");
            setLoading(false);
        };

        reader.readAsText(file);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4" size="sm">
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Bulk Import
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Bulk Upload Students</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file to add multiple students at once.
                        The file must use exactly these exact headers:
                        <strong> name, class, age, gender</strong>
                        <br />Optional headers: <strong>optionalId</strong>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="csv-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 border-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-900 dark:border-slate-700">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-3 text-slate-500" />
                                <p className="mb-2 text-sm text-slate-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-slate-500">CSV file containing student rows</p>
                            </div>
                            <Input
                                id="csv-upload"
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={loading}
                            />
                        </label>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <div>{error}</div>
                        </div>
                    )}

                    {loading && (
                        <div className="text-center text-sm text-slate-500 flex flex-col items-center gap-2 mt-2">
                            <div className="w-5 h-5 border-2 border-t-blue-600 border-blue-200 rounded-full animate-spin" />
                            Processing CSV...
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
