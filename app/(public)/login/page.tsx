"use client";

import { useState } from "react";
import { requestOTP, verifyOTP } from "@/services/user.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [identifier, setIdentifier] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState<"request" | "verify">("request");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        const formData = new FormData();
        formData.append("identifier", identifier);

        const res = await requestOTP(formData);

        setLoading(false);
        if (res.error) {
            setError(res.error);
        } else {
            setStep("verify");
            setMessage(res.message || "Enter the OTP sent to you");
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("identifier", identifier);
        formData.append("code", code);

        const res = await verifyOTP(formData);

        setLoading(false);
        if (res.error) {
            setError(res.error);
        } else {
            // Upon success, explicitly route to their correct dashboard portal
            const roleRoutes: Record<string, string> = {
                HOSPITAL_ADMIN: '/dashboard/admin',
                EVENT_USER: '/dashboard/event',
                SCHOOL_REP: '/dashboard/school',
            };

            window.location.href = roleRoutes[res.role as string] || "/";
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
            <Card className="w-full max-w-md shadow-lg border-blue-100 dark:border-slate-800">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Staff Portal Login</CardTitle>
                    <CardDescription>
                        {step === "request"
                            ? "Enter your email address to receive a secure OTP."
                            : "Enter the 6-digit code sent to your email."}
                    </CardDescription>
                </CardHeader>

                {step === "request" ? (
                    <form onSubmit={handleRequest}>
                        <CardContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="identifier">Email Address</Label>
                                <Input
                                    id="identifier"
                                    type="email"
                                    placeholder="name@hospital.com"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                {loading ? "Sending..." : "Send OTP"}
                            </Button>
                        </CardFooter>
                    </form>
                ) : (
                    <form onSubmit={handleVerify}>
                        <CardContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">One-Time Password</Label>
                                <Input
                                    id="code"
                                    type="text"
                                    placeholder="123456"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    maxLength={6}
                                    required
                                    className="text-center tracking-widest text-lg"
                                />
                            </div>
                            {message && <p className="text-sm font-medium text-green-600 dark:text-green-400">{message}</p>}
                            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-2">
                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                {loading ? "Verifying..." : "Verify & Login"}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full"
                                onClick={() => setStep("request")}
                                disabled={loading}
                            >
                                Back
                            </Button>
                        </CardFooter>
                    </form>
                )}
            </Card>
        </div>
    );
}
