"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { preRegisterStudent } from "@/services/school.action";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Info, HeartPulse, Activity, Syringe, ClipboardList, Phone, ShieldCheck } from "lucide-react";

export default function AddStudentModal({ eventId, eventDate }: { eventId: string, eventDate: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        const res = await preRegisterStudent(eventId, fd);
        setLoading(false);
        if (res.error) {
            alert(res.error);
        } else {
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto h-9 px-4 rounded-md shadow-sm text-white transition-all">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Pre-register Student
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-0 rounded-2xl shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8 text-white sticky top-0 z-10">
                    <DialogTitle className="text-2xl font-bold  flex items-center gap-2 text-white">
                        <UserPlus className="w-6 h-6 opacity-80" />
                        Add Student to Roster
                    </DialogTitle>
                    <DialogDescription className="text-blue-100 mt-2 text-sm leading-relaxed max-w-xl">
                        Pre-register a student for the health camp on <strong className="text-white">{eventDate}</strong>. Filling this comprehensive medical profile ensures better preparation for the checkup.
                    </DialogDescription>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 bg-slate-50 dark:bg-slate-950">
                    {/* Basic Info */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <Info className="w-5 h-5 text-blue-500" />
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 ">Basic Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            <div className="space-y-2.5">
                                <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                                <Input id="name" name="name" required placeholder="John Doe" className="bg-slate-50 focus-visible:ring-blue-500" />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="class" className="text-sm font-medium">Class/Grade *</Label>
                                <Input id="class" name="class" required placeholder="5A" className="bg-slate-50 focus-visible:ring-blue-500" />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="age" className="text-sm font-medium">Age *</Label>
                                <Input id="age" name="age" type="number" required placeholder="10" min="1" max="25" className="bg-slate-50 focus-visible:ring-blue-500" />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="gender" className="text-sm font-medium">Gender *</Label>
                                <select id="gender" name="gender" className="flex h-11 w-full rounded-xl border border-input bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" required>
                                    <option value="">Select...</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</Label>
                                <Input id="dateOfBirth" name="dateOfBirth" type="date" className="bg-slate-50 focus-visible:ring-blue-500" />
                            </div>
                            <div className="space-y-2.5">
                                <Label htmlFor="bloodGroup" className="text-sm font-medium">Blood Group</Label>
                                <select id="bloodGroup" name="bloodGroup" className="flex h-11 w-full rounded-xl border border-input bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
                                    <option value="">Select...</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Family & Contact */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <Phone className="w-5 h-5 text-indigo-500" />
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 ">Family & Contact Details</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2.5"><Label htmlFor="fatherName" className="text-sm font-medium">Father's Name</Label><Input id="fatherName" name="fatherName" className="bg-slate-50" /></div>
                            <div className="space-y-2.5"><Label htmlFor="fatherOccupation" className="text-sm font-medium">Father's Occupation</Label><Input id="fatherOccupation" name="fatherOccupation" className="bg-slate-50" /></div>
                            <div className="space-y-2.5"><Label htmlFor="motherName" className="text-sm font-medium">Mother's Name</Label><Input id="motherName" name="motherName" className="bg-slate-50" /></div>
                            <div className="space-y-2.5"><Label htmlFor="motherOccupation" className="text-sm font-medium">Mother's Occupation</Label><Input id="motherOccupation" name="motherOccupation" className="bg-slate-50" /></div>
                            <div className="space-y-2.5 md:col-span-2"><Label htmlFor="address" className="text-sm font-medium">Address</Label><Input id="address" name="address" className="bg-slate-50" /></div>
                            <div className="space-y-2.5"><Label htmlFor="pincode" className="text-sm font-medium">Pincode</Label><Input id="pincode" name="pincode" className="bg-slate-50" /></div>
                            <div className="space-y-2.5"><Label htmlFor="mobileNumber" className="text-sm font-medium">Mobile Number</Label><Input id="mobileNumber" name="mobileNumber" type="tel" className="bg-slate-50" /></div>
                        </div>
                    </section>

                    {/* Medical & History */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <HeartPulse className="w-5 h-5 text-rose-500" />
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 ">Medical & Past History</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2.5 md:col-span-2"><Label htmlFor="pastHistory" className="text-sm font-medium">Past History (if any)</Label><Input id="pastHistory" name="pastHistory" className="bg-slate-50" /></div>
                            <div className="space-y-2.5"><Label htmlFor="pastHistoryHandler" className="text-sm font-medium">Doctor Handled History</Label><Input id="pastHistoryHandler" name="pastHistoryHandler" className="bg-slate-50" /></div>
                            <div className="space-y-2.5"><Label htmlFor="pastHistoryHandlerContact" className="text-sm font-medium">Doctor's Phone</Label><Input id="pastHistoryHandlerContact" name="pastHistoryHandlerContact" type="tel" className="bg-slate-50" /></div>
                            <div className="space-y-2.5 md:col-span-2"><Label htmlFor="presentComplaints" className="text-sm font-medium">Present Complaints</Label><Input id="presentComplaints" name="presentComplaints" className="bg-slate-50" /></div>
                            <div className="space-y-2.5 md:col-span-2"><Label htmlFor="currentMedication" className="text-sm font-medium">Current Medication</Label><Input id="currentMedication" name="currentMedication" className="bg-slate-50" /></div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Implants & Accessories */}
                        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
                            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 ">Implants / Accessories</h3>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                    <input type="checkbox" name="hasDentalImplant" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                    <span className="text-sm font-medium text-slate-700">Dental Implant</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                    <input type="checkbox" name="hasBraces" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                    <span className="text-sm font-medium text-slate-700">Braces</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                    <input type="checkbox" name="hasRightEyeSpectacle" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                    <span className="text-sm font-medium text-slate-700">Spectacles - Right Eye</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                    <input type="checkbox" name="hasLeftEyeSpectacle" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                    <span className="text-sm font-medium text-slate-700">Spectacles - Left Eye</span>
                                </label>
                            </div>
                        </section>

                        {/* Conditions Overview */}
                        <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
                            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                                <ShieldCheck className="w-5 h-5 text-amber-500" />
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 ">Symptoms Overview</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                {[
                                    { name: "condScratchesHead", label: "Scratches head" },
                                    { name: "condRubsEyes", label: "Rubs eyes" },
                                    { name: "condFrequentHeadache", label: "Frequent headache" },
                                    { name: "condCannotSeeBoard", label: "Cannot see board" },
                                    { name: "condPokesEars", label: "Pulls ear" },
                                    { name: "condTeethBlackOrRotten", label: "Rotten teeth" },
                                    { name: "condBadBreath", label: "Bad breath" },
                                    { name: "condCracksAtMouthCorners", label: "Mouth cracks" },
                                    { name: "condBreathesThroughMouth", label: "Breathes via mouth" },
                                    { name: "condBitesNails", label: "Bites nails" },
                                    { name: "condWhitePatches", label: "White patches" },
                                    { name: "condLimpingGait", label: "Limping gait" },
                                    { name: "condBreathlessness", label: "Breathlessness" },
                                    { name: "condFrequentUrination", label: "Frequent urination" },
                                    { name: "condDiarrhoea", label: "Diarrhoea" },
                                    { name: "condVomiting", label: "Vomiting" },
                                    { name: "condStammers", label: "Stammers" },
                                    { name: "condBloodInStools", label: "Blood in stools" },
                                    { name: "condFaintingEpisodes", label: "Fainting" },
                                ].map((symptom) => (
                                    <label key={symptom.name} className="flex items-start space-x-2 text-sm cursor-pointer hover:bg-slate-50 p-1.5 rounded transition-colors border border-transparent hover:border-slate-100">
                                        <input type="checkbox" name={symptom.name} className="mt-0.5 w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500" />
                                        <span className="text-slate-700 leading-tight">{symptom.label}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="mt-3 space-y-2">
                                <Label htmlFor="condAnyOtherProblem" className="text-sm font-medium">Other Problems</Label>
                                <Input id="condAnyOtherProblem" name="condAnyOtherProblem" placeholder="Specify if any..." className="bg-slate-50" />
                            </div>
                        </section>
                    </div>

                    {/* Vaccination */}
                    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <Syringe className="w-5 h-5 text-purple-500" />
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 ">Vaccination Status</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <Label className="font-semibold text-slate-800 dark:text-slate-200 block border-b pb-2 mb-3">Hepatitis B</Label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="vaccHepatitisB1" className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" /><span className="text-sm font-medium">1st Dose</span></label>
                                    <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="vaccHepatitisB2" className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" /><span className="text-sm font-medium">2nd Dose</span></label>
                                    <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="vaccHepatitisB3" className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" /><span className="text-sm font-medium">3rd Dose</span></label>
                                </div>
                            </div>
                            <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <Label className="font-semibold text-slate-800 dark:text-slate-200 block border-b pb-2 mb-3">Typhoid</Label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="vaccTyphoid1" className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" /><span className="text-sm font-medium">Class 1</span></label>
                                    <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="vaccTyphoid5" className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" /><span className="text-sm font-medium">Class 5</span></label>
                                    <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="vaccTyphoid8" className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" /><span className="text-sm font-medium">Class 8</span></label>
                                    <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="vaccTyphoid11" className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" /><span className="text-sm font-medium">Class 11</span></label>
                                    <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="vaccTyphoid14" className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" /><span className="text-sm font-medium">Class 14</span></label>
                                </div>
                            </div>
                            <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <Label className="font-semibold text-slate-800 dark:text-slate-200 block border-b pb-2 mb-3">Others</Label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="vaccDTPolio" className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" /><span className="text-sm font-medium">D.T. & Polio Booster</span></label>
                                    <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="vaccTetanus6" className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" /><span className="text-sm font-medium">Tetanus Class VI</span></label>
                                    <label className="flex items-center space-x-3 cursor-pointer"><input type="checkbox" name="vaccTetanus11" className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" /><span className="text-sm font-medium">Tetanus Class XI</span></label>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex justify-end gap-3 pt-6">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl px-6">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-md transition-all">
                            {loading ? "Registering Student..." : "Complete Registration"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
