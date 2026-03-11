"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, User, Phone, Mail, Building } from "lucide-react";

export default function SchoolDetailsModal({ school }: { school: any }) {
    if (!school) {
        return <span className="text-slate-500">Unknown</span>;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left outline-none">
                    {school.name}
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-blue-900 border-b pb-4">
                        <Building className="w-5 h-5 text-blue-600" />
                        {school.name}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Address</p>
                            <p className="font-medium text-slate-800">{school.address || "N/A"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <User className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Contact Person</p>
                            <p className="font-medium text-slate-800">{school.contactPerson || "N/A"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Phone className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Phone</p>
                            <p className="font-medium text-slate-800">{school.phone || "N/A"}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Mail className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-slate-500">Email</p>
                            <p className="font-medium text-slate-800">{school.email || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
