"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addStudentToEvent } from "@/services/event.action";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function AddStudentDoctorModal({ eventId }: { eventId: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData(e.currentTarget);
        // ensure eventId is in formData
        fd.append("eventId", eventId);
        const res = await addStudentToEvent(fd);
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
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-9" size="sm">Open Add Student Form</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Quick Add Student</DialogTitle>
                    <DialogDescription>
                        Register a new student directly into this health camp event.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-8 pt-4">
                    {/* Basic Info */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input id="name" name="name" required placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="class">Class/Grade *</Label>
                                <Input id="class" name="class" required placeholder="5A" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">Age *</Label>
                                <Input id="age" name="age" type="number" required placeholder="10" min="1" max="25" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender *</Label>
                                <select id="gender" name="gender" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                                    <option value="">Select...</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="optionalId">School ID (Optional)</Label>
                                <Input id="optionalId" name="optionalId" placeholder="Roll No / ID" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <Input id="dateOfBirth" name="dateOfBirth" type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bloodGroup">Blood Group</Label>
                                <select id="bloodGroup" name="bloodGroup" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
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
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Family & Contact Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="fatherName">Father's Name</Label><Input id="fatherName" name="fatherName" /></div>
                            <div className="space-y-2"><Label htmlFor="fatherOccupation">Father's Occupation</Label><Input id="fatherOccupation" name="fatherOccupation" /></div>
                            <div className="space-y-2"><Label htmlFor="motherName">Mother's Name</Label><Input id="motherName" name="motherName" /></div>
                            <div className="space-y-2"><Label htmlFor="motherOccupation">Mother's Occupation</Label><Input id="motherOccupation" name="motherOccupation" /></div>
                            <div className="space-y-2 md:col-span-2"><Label htmlFor="address">Address</Label><Input id="address" name="address" /></div>
                            <div className="space-y-2"><Label htmlFor="pincode">Pincode</Label><Input id="pincode" name="pincode" /></div>
                            <div className="space-y-2"><Label htmlFor="mobileNumber">Mobile Number</Label><Input id="mobileNumber" name="mobileNumber" type="tel" /></div>
                        </div>
                    </section>

                    {/* Medical & History */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Medical & Past History</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2"><Label htmlFor="pastHistory">Past History (if any)</Label><Input id="pastHistory" name="pastHistory" /></div>
                            <div className="space-y-2"><Label htmlFor="pastHistoryHandler">Doctor Handled History</Label><Input id="pastHistoryHandler" name="pastHistoryHandler" /></div>
                            <div className="space-y-2"><Label htmlFor="pastHistoryHandlerContact">Doctor's Phone</Label><Input id="pastHistoryHandlerContact" name="pastHistoryHandlerContact" type="tel" /></div>
                            <div className="space-y-2 md:col-span-2"><Label htmlFor="presentComplaints">Present Complaints</Label><Input id="presentComplaints" name="presentComplaints" /></div>
                            <div className="space-y-2 md:col-span-2"><Label htmlFor="currentMedication">Current Medication</Label><Input id="currentMedication" name="currentMedication" /></div>
                        </div>
                    </section>

                    {/* Implants & Accessories */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Implants / Accessories</h3>
                        <div className="flex flex-wrap gap-6">
                            <label className="flex items-center space-x-2"><input type="checkbox" name="hasDentalImplant" className="w-4 h-4 text-blue-600 rounded" /><span>Dental Implant</span></label>
                            <label className="flex items-center space-x-2"><input type="checkbox" name="hasBraces" className="w-4 h-4 text-blue-600 rounded" /><span>Braces</span></label>
                            <label className="flex items-center space-x-2"><input type="checkbox" name="hasRightEyeSpectacle" className="w-4 h-4 text-blue-600 rounded" /><span>Spectacles - Right Eye</span></label>
                            <label className="flex items-center space-x-2"><input type="checkbox" name="hasLeftEyeSpectacle" className="w-4 h-4 text-blue-600 rounded" /><span>Spectacles - Left Eye</span></label>
                        </div>
                    </section>

                    {/* Vaccination */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Vaccination Status</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="font-semibold text-slate-700">Hepatitis B</Label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center space-x-2"><input type="checkbox" name="vaccHepatitisB1" className="w-4 h-4 text-blue-600 rounded" /><span>1st Dose</span></label>
                                    <label className="flex items-center space-x-2"><input type="checkbox" name="vaccHepatitisB2" className="w-4 h-4 text-blue-600 rounded" /><span>2nd Dose</span></label>
                                    <label className="flex items-center space-x-2"><input type="checkbox" name="vaccHepatitisB3" className="w-4 h-4 text-blue-600 rounded" /><span>3rd Dose</span></label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-semibold text-slate-700">Typhoid</Label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center space-x-2"><input type="checkbox" name="vaccTyphoid1" className="w-4 h-4 text-blue-600 rounded" /><span>Class 1</span></label>
                                    <label className="flex items-center space-x-2"><input type="checkbox" name="vaccTyphoid5" className="w-4 h-4 text-blue-600 rounded" /><span>Class 5</span></label>
                                    <label className="flex items-center space-x-2"><input type="checkbox" name="vaccTyphoid8" className="w-4 h-4 text-blue-600 rounded" /><span>Class 8</span></label>
                                    <label className="flex items-center space-x-2"><input type="checkbox" name="vaccTyphoid11" className="w-4 h-4 text-blue-600 rounded" /><span>Class 11</span></label>
                                    <label className="flex items-center space-x-2"><input type="checkbox" name="vaccTyphoid14" className="w-4 h-4 text-blue-600 rounded" /><span>Class 14</span></label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-semibold text-slate-700">Others</Label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center space-x-2"><input type="checkbox" name="vaccDTPolio" className="w-4 h-4 text-blue-600 rounded" /><span>D.T. & Polio Booster</span></label>
                                    <label className="flex items-center space-x-2"><input type="checkbox" name="vaccTetanus6" className="w-4 h-4 text-blue-600 rounded" /><span>Tetanus Class VI</span></label>
                                    <label className="flex items-center space-x-2"><input type="checkbox" name="vaccTetanus11" className="w-4 h-4 text-blue-600 rounded" /><span>Tetanus Class XI</span></label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Conditions */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">Symptoms & Conditions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condScratchesHead" className="w-4 h-4" /><span>Constantly scratches head</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condRubsEyes" className="w-4 h-4" /><span>Rubs eyes</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condFrequentHeadache" className="w-4 h-4" /><span>Frequent headache</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condCannotSeeBoard" className="w-4 h-4" /><span>Cannot see what's on board</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condPokesEars" className="w-4 h-4" /><span>Pokes fingers or pulls ear</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condTeethBlackOrRotten" className="w-4 h-4" /><span>Teeth look black or rotten</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condBadBreath" className="w-4 h-4" /><span>Breath has bad odour</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condCracksAtMouthCorners" className="w-4 h-4" /><span>Cracks at corners of mouth</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condBreathesThroughMouth" className="w-4 h-4" /><span>Breathes through mouth</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condBitesNails" className="w-4 h-4" /><span>Bites nails</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condWhitePatches" className="w-4 h-4" /><span>White patches</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condLimpingGait" className="w-4 h-4" /><span>Limping gait</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condBreathlessness" className="w-4 h-4" /><span>Attacks of breathlessness</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condFrequentUrination" className="w-4 h-4" /><span>Frequent urination</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condDiarrhoea" className="w-4 h-4" /><span>Diarrhoea</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condVomiting" className="w-4 h-4" /><span>Vomiting</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condStammers" className="w-4 h-4" /><span>Stammers or cannot speak properly</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condBloodInStools" className="w-4 h-4" /><span>Blood passed with stools</span></label>
                            <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="condFaintingEpisodes" className="w-4 h-4" /><span>Episodes of fainting (summers)</span></label>
                        </div>
                        <div className="mt-2 space-y-2">
                            <Label htmlFor="condAnyOtherProblem">Any other problem</Label>
                            <Input id="condAnyOtherProblem" name="condAnyOtherProblem" placeholder="Please specify if any..." />
                        </div>
                    </section>

                    <div className="flex justify-end gap-2 pt-6 border-t pb-8">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                            {loading ? "Adding..." : "Add to Event"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
