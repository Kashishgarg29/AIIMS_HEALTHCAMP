"use client";

import { useState } from "react";
import { createVisitRequest } from "@/services/request.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function VisitRequestPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const result = await createVisitRequest(formData);

        setLoading(false);
        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(true);
            (e.target as HTMLFormElement).reset();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl mb-6">
                <Link href="/" className="text-blue-600 hover:underline text-sm font-medium">
                    &larr; Back to Home
                </Link>
            </div>

            <Card className="w-full max-w-2xl shadow-md border-slate-200">
                <CardHeader className="bg-white rounded-t-lg border-b border-slate-100">
                    <CardTitle className="text-2xl text-blue-900">Health Camp Request</CardTitle>
                    <CardDescription>
                        Schools can request a health camp visit by filling out this form. Our team will review and contact you.
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6 bg-white rounded-b-lg text-slate-700">
                    {success ? (
                        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-6 text-center space-y-4">
                            <h3 className="text-lg font-bold">Request Submitted Successfully!</h3>
                            <p className="text-sm">Thank you for your interest. Our team will review your request and get back to you shortly.</p>
                            <Button onClick={() => setSuccess(false)} variant="outline" className="mt-4">
                                Submit Another Request
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="schoolName">School Name *</Label>
                                    <Input id="schoolName" name="schoolName" required placeholder="e.g. Springfield High" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contactPerson">Contact Person *</Label>
                                    <Input id="contactPerson" name="contactPerson" required placeholder="e.g. Jane Doe" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input id="email" name="email" type="email" required placeholder="school@example.com" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input id="phone" name="phone" type="tel" required placeholder="10-digit mobile number" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="preferredDate">Preferred Date *</Label>
                                    <Input id="preferredDate" name="preferredDate" type="date" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="studentStrength">Approx. Student Strength *</Label>
                                    <Input id="studentStrength" name="studentStrength" type="number" min="1" required placeholder="e.g. 500" />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address">Full Address *</Label>
                                    <Input id="address" name="address" required placeholder="Street address, City, State, Zip" />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="remarks">Additional Remarks</Label>
                                    <Input id="remarks" name="remarks" placeholder="Any specific requirements or notes?" />
                                </div>
                            </div>

                            {error && <div className="text-destructive text-sm font-medium">{error}</div>}

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <Button type="submit" disabled={loading} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
                                    {loading ? "Submitting..." : "Submit Request"}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
