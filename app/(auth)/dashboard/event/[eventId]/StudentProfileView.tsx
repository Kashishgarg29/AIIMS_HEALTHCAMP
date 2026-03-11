"use client";

import React, { useState } from "react";
import {
    User,
    Calendar,
    Phone,
    MapPin,
    HeartPulse,
    Activity,
    Syringe,
    ShieldCheck,
    Info,
    Droplet,
    Baby,
    Briefcase,
    Stethoscope,
    Smile,
    AlertTriangle,
    ListTree,
    ChevronLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { updateStudentPreRegistration } from "@/services/event.action";
import { useRouter } from "next/navigation";

interface StudentProfileProps {
    student: any;
    role?: string;
}

export default function StudentProfileView({ student, role }: StudentProfileProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (!student) return null;

    const canEdit = role === "SCHOOL_REP" || role === "EVENT_USER";

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        // Handle checkboxes manually because FormData might miss unchecked ones or get "on"
        const checkboxFields = [
            'hasDentalImplant', 'hasBraces', 'hasRightEyeSpectacle', 'hasLeftEyeSpectacle',
            'vaccHepatitisB1', 'vaccHepatitisB2', 'vaccHepatitisB3', 'vaccTyphoid1', 'vaccTyphoid5', 'vaccTyphoid8', 'vaccTyphoid11', 'vaccTyphoid14', 'vaccDTPolio', 'vaccTetanus6', 'vaccTetanus11',
            'condScratchesHead', 'condRubsEyes', 'condFrequentHeadache', 'condCannotSeeBoard', 'condPokesEars', 'condTeethBlackOrRotten', 'condBadBreath', 'condCracksAtMouthCorners', 'condBreathesThroughMouth', 'condBitesNails', 'condWhitePatches', 'condLimpingGait', 'condBreathlessness', 'condFrequentUrination', 'condDiarrhoea', 'condVomiting', 'condStammers', 'condBloodInStools', 'condFaintingEpisodes'
        ];

        checkboxFields.forEach(field => {
            if (!formData.get(field)) {
                formData.append(field, "off");
            }
        });

        const res = await updateStudentPreRegistration(student.id, formData);
        if (res.success) {
            alert("Profile updated successfully");
            setIsEditing(false);
            router.refresh();
        } else {
            alert(res.error || "Failed to update profile");
        }
        setLoading(false);
    };

    const DetailItem = ({ icon: Icon, label, value, colorClass = "text-blue-500", name, type = "text", required = false }: any) => {
        if (isEditing) {
            return (
                <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                        {label} {required && <span className="text-rose-500">*</span>}
                    </Label>
                    {type === "textarea" ? (
                        <Textarea name={name} defaultValue={value || ""} className="rounded-xl text-xs font-semibold" />
                    ) : type === "select" ? (
                        <Select name={name} defaultValue={value || ""}>
                            <SelectTrigger className="rounded-xl text-xs font-semibold h-9">
                                <SelectValue placeholder={`Select ${label}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {name === "gender" ? (
                                    <>
                                        <SelectItem value="M">Male</SelectItem>
                                        <SelectItem value="F">Female</SelectItem>
                                        <SelectItem value="O">Other</SelectItem>
                                    </>
                                ) : name === "bloodGroup" ? (
                                    ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                    ))
                                ) : null}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            name={name}
                            type={type}
                            defaultValue={type === "date" && value ? format(new Date(value), 'yyyy-MM-dd') : value || ""}
                            required={required}
                            className="h-9 rounded-xl text-xs font-semibold"
                        />
                    )}
                </div>
            );
        }

        const displayValue = value instanceof Date ? format(value, 'PPP') : value;

        return (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/50">
                <div className={`mt-0.5 p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm ${colorClass}`}>
                    <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">
                        {displayValue || <span className="text-slate-300 italic">Not Provided</span>}
                    </p>
                </div>
            </div>
        );
    };

    const StatusItem = ({ label, active, icon: Icon, colorClass = "blue", name }: any) => {
        if (isEditing) {
            return (
                <div className="flex items-center gap-2 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
                    <Checkbox id={name} name={name} defaultChecked={active} className="rounded-md border-slate-300" />
                    <Label htmlFor={name} className="text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer select-none">{label}</Label>
                </div>
            );
        }
        return (
            <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-300 ${active
                    ? `bg-${colorClass}-50/50 dark:bg-${colorClass}-900/10 border-${colorClass}-100 dark:border-${colorClass}-900/30 text-${colorClass}-700 dark:text-${colorClass}-400`
                    : "bg-slate-50/30 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800 text-slate-400"
                    }`}
            >
                <Icon className={`w-3.5 h-3.5 ${active ? "animate-pulse" : "opacity-40"}`} />
                <span className="text-[11px] font-bold tracking-tight">{label}</span>
            </div>
        );
    };

    return (
        <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Actions */}
            <div className="flex justify-between items-center -mt-2">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50/50 text-blue-600 border-blue-100 rounded-lg py-1">
                        {isEditing ? "Editing Student Records" : "Viewing Student Records"}
                    </Badge>
                </div>
                {canEdit && (
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="rounded-xl text-xs font-bold text-slate-500">
                                    Cancel
                                </Button>
                                <Button type="submit" size="sm" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-4 h-9 shadow-md shadow-blue-500/10">
                                    {loading ? "Saving..." : "Save Changes"}
                                </Button>
                            </>
                        ) : (
                            <Button type="button" size="sm" onClick={() => setIsEditing(true)} className="bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl text-xs font-bold px-4 h-9 shadow-sm">
                                Edit Registration Profile
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* 1. Basic Information */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <div className="h-4 w-1 bg-blue-600 rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Identity & Demographic</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DetailItem icon={User} label="Full Name" value={student.name} name="name" required />
                    <DetailItem icon={Calendar} label="Date of Birth" value={student.dateOfBirth} type="date" name="dateOfBirth" />
                    <DetailItem icon={Droplet} label="Blood Group" value={student.bloodGroup} colorClass="text-rose-500" name="bloodGroup" type="select" />
                    <div className="grid grid-cols-2 gap-2">
                        <DetailItem icon={Baby} label="Age" value={student.age} type="number" name="age" required />
                        <DetailItem icon={User} label="Gender" value={student.gender} name="gender" type="select" required />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem icon={Info} label="Class/Grade" value={student.class} name="class" required />
                    <DetailItem icon={ShieldCheck} label="Optional ID/UID" value={student.optionalId} name="optionalId" />
                </div>
            </section>

            {/* 2. Family & Contact */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <div className="h-4 w-1 bg-indigo-600 rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Family & Logistics</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-4 md:col-span-1">
                        <DetailItem icon={Briefcase} label="Father's Name" value={student.fatherName} name="fatherName" />
                        <DetailItem icon={Briefcase} label="Father's Occupation" value={student.fatherOccupation} name="fatherOccupation" />
                    </div>
                    <div className="space-y-4 md:col-span-1">
                        <DetailItem icon={Briefcase} label="Mother's Name" value={student.motherName} name="motherName" colorClass="text-pink-500" />
                        <DetailItem icon={Briefcase} label="Mother's Occupation" value={student.motherOccupation} name="motherOccupation" colorClass="text-pink-500" />
                    </div>
                    <div className="space-y-4 md:col-span-1">
                        <DetailItem icon={Phone} label="Mobile Number" value={student.mobileNumber} colorClass="text-emerald-500" name="mobileNumber" />
                        <DetailItem icon={MapPin} label="Pincode" value={student.pincode} colorClass="text-rose-400" name="pincode" />
                    </div>
                    <div className="md:col-span-3">
                        <DetailItem icon={MapPin} label="Home Address" value={student.address} colorClass="text-rose-400" name="address" type="textarea" />
                    </div>
                </div>
            </section>

            {/* 3. Medical Background */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <div className="h-4 w-1 bg-rose-600 rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Medical History</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <DetailItem icon={Stethoscope} label="Past History" value={student.pastHistory} colorClass="text-rose-500" name="pastHistory" type="textarea" />
                    </div>
                    <DetailItem icon={User} label="Past Care Handled By" value={student.pastHistoryHandler} name="pastHistoryHandler" />
                    <DetailItem icon={Phone} label="Care Giver Contact" value={student.pastHistoryHandlerContact} name="pastHistoryHandlerContact" />

                    <div className="md:col-span-2">
                        <DetailItem icon={AlertTriangle} label="Special Precautions" value={student.precaution} name="precaution" colorClass="text-amber-500" />
                    </div>
                    <div className="md:col-span-2">
                        <DetailItem icon={Activity} label="Present Complaints" value={student.presentComplaints} name="presentComplaints" type="textarea" />
                    </div>
                    <div className="md:col-span-2">
                        <DetailItem icon={HeartPulse} label="Current Medications" value={student.currentMedication} name="currentMedication" type="textarea" />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                        <StatusItem label="Dental Implant" active={student.hasDentalImplant} icon={Smile} name="hasDentalImplant" />
                        <StatusItem label="Braces" active={student.hasBraces} icon={Activity} name="hasBraces" />
                        <StatusItem label="Spectacles (R)" active={student.hasRightEyeSpectacle} icon={ShieldCheck} name="hasRightEyeSpectacle" />
                        <StatusItem label="Spectacles (L)" active={student.hasLeftEyeSpectacle} icon={ShieldCheck} name="hasLeftEyeSpectacle" />
                    </div>
                </div>
            </section>

            {/* 4. Vaccination Status */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <div className="h-4 w-1 bg-emerald-600 rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Vaccination Checklist</h3>
                </div>
                <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100/50 dark:border-slate-800/50">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <StatusItem label="Hep B (1)" active={student.vaccHepatitisB1} icon={Syringe} name="vaccHepatitisB1" colorClass="emerald" />
                        <StatusItem label="Hep B (2)" active={student.vaccHepatitisB2} icon={Syringe} name="vaccHepatitisB2" colorClass="emerald" />
                        <StatusItem label="Hep B (3)" active={student.vaccHepatitisB3} icon={Syringe} name="vaccHepatitisB3" colorClass="emerald" />
                        <StatusItem label="Typhoid (1)" active={student.vaccTyphoid1} icon={Syringe} name="vaccTyphoid1" colorClass="emerald" />
                        <StatusItem label="Typhoid (5)" active={student.vaccTyphoid5} icon={Syringe} name="vaccTyphoid5" colorClass="emerald" />
                        <StatusItem label="Typhoid (8)" active={student.vaccTyphoid8} icon={Syringe} name="vaccTyphoid8" colorClass="emerald" />
                        <StatusItem label="Typhoid (11)" active={student.vaccTyphoid11} icon={Syringe} name="vaccTyphoid11" colorClass="emerald" />
                        <StatusItem label="Typhoid (14)" active={student.vaccTyphoid14} icon={Syringe} name="vaccTyphoid14" colorClass="emerald" />
                        <StatusItem label="DT & Polio" active={student.vaccDTPolio} icon={Syringe} name="vaccDTPolio" colorClass="emerald" />
                        <StatusItem label="Tet (6)" active={student.vaccTetanus6} icon={Syringe} name="vaccTetanus6" colorClass="emerald" />
                        <StatusItem label="Tet (11)" active={student.vaccTetanus11} icon={Syringe} name="vaccTetanus11" colorClass="emerald" />
                    </div>
                </div>
            </section>

            {/* 5. Observed Symptoms */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <div className="h-4 w-1 bg-amber-600 rounded-full" />
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Reported Symptoms</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                        { key: 'condScratchesHead', label: 'Scratches Head' },
                        { key: 'condRubsEyes', label: 'Rubs Eyes' },
                        { key: 'condFrequentHeadache', label: 'Headaches' },
                        { key: 'condCannotSeeBoard', label: 'Vision Blurs' },
                        { key: 'condPokesEars', label: 'Ear Pain' },
                        { key: 'condTeethBlackOrRotten', label: 'Rotten Teeth' },
                        { key: 'condBadBreath', label: 'Bad Breath' },
                        { key: 'condCracksAtMouthCorners', label: 'Mouth Cracks' },
                        { key: 'condBreathesThroughMouth', label: 'Mouth Breathing' },
                        { key: 'condBitesNails', label: 'Bites Nails' },
                        { key: 'condWhitePatches', label: 'White Patches' },
                        { key: 'condLimpingGait', label: 'Limping' },
                        { key: 'condBreathlessness', label: 'Breathlessness' },
                        { key: 'condFrequentUrination', label: 'Freq Urination' },
                        { key: 'condDiarrhoea', label: 'Diarrhoea' },
                        { key: 'condVomiting', label: 'Vomiting' },
                        { key: 'condStammers', label: 'Stammers' },
                        { key: 'condBloodInStools', label: 'Blood in Stools' },
                        { key: 'condFaintingEpisodes', label: 'Fainting' },
                    ].map((item: any) => (
                        <StatusItem
                            key={item.key}
                            label={item.label}
                            active={student[item.key]}
                            icon={student[item.key] ? AlertTriangle : ShieldCheck}
                            colorClass={student[item.key] ? "rose" : "slate"}
                            name={item.key}
                        />
                    ))}
                </div>
                <DetailItem icon={Info} label="Additional Observations" value={student.condAnyOtherProblem} name="condAnyOtherProblem" type="textarea" />
            </section>
        </form>
    );
}
