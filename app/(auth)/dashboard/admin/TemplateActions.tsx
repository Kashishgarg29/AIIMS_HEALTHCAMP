"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteFormTemplate } from "@/services/admin.action";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";

export default function TemplateActions({ template }: { template: any }) {
    const [openView, setOpenView] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await deleteFormTemplate(template.id);
        setIsDeleting(false);
        setOpenDelete(false);
        setOpenView(false);
    };

    return (
        <div className="flex gap-2">

            {/* View Dialog Modal */}
            <Dialog open={openView} onOpenChange={setOpenView}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">View</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{template.name}</DialogTitle>
                        <DialogDescription>{template.description || "No description provided."}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 my-4">
                        {template.sections.map((section: any) => (
                            <div key={section.id} className="border rounded-md p-4 bg-slate-50">
                                <h4 className="font-semibold text-md mb-3 border-b pb-2">{section.name}</h4>
                                <ul className="space-y-2">
                                    {section.fields.map((field: any) => (
                                        <li key={field.id} className="text-sm flex justify-between bg-white px-3 py-2 border rounded shadow-sm">
                                            <span>
                                                <span className="font-medium">{field.label}</span>
                                                <span className="text-xs ml-2 text-slate-400">({field.type})</span>
                                            </span>
                                            {field.isRequired && <span className="text-xs text-red-500 font-medium">Required</span>}
                                        </li>
                                    ))}
                                    {section.fields.length === 0 && (
                                        <li className="text-xs text-muted-foreground italic">No fields in this section.</li>
                                    )}
                                </ul>
                            </div>
                        ))}
                        {template.sections.length === 0 && (
                            <div className="text-sm text-center text-muted-foreground py-8">This template has no sections configured.</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog Modal */}
            <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Template?</DialogTitle>
                        <DialogDescription>
                            Are you absolutely sure you want to delete <strong>{template.name}</strong>?
                            This action cannot be undone. Active events using this will lose their template binding.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setOpenDelete(false)} disabled={isDeleting}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Confirm Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
