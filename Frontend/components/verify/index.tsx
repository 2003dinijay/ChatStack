'use client';
import authApi from "@/api/authApi";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import { Loader2, Mail, MessageSquare, RotateCcw } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function VerifyEmailPageComponent() {
    const [email, setEmail] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isResending, setIsResending] = useState<boolean>(false);
    const [resendTimer, setResendTimer] = useState<number>(0);

    const { verifyEmail, pendingRegistration } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (pendingRegistration) {
            setEmail(pendingRegistration.email);
        } else {
            router.push('/register');
        }
    }, [pendingRegistration, router]);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!otp.trim()) {
            setError('Please enter the OTP.');
            return;
        }

        if (otp.length < 6) {
            setError('OTP must be 6 digits long.');
            return;
        }

        setIsLoading(true);

        try {
            const message = await verifyEmail(email, otp);
            setSuccessMessage(message);
            setOtp('');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err) {
            console.error("Verification error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError(null);
        setSuccessMessage(null);
        setIsResending(true);

        try {
            const response = await authApi.post('/api/auth/resendOtp', {
                email,
            });
            setSuccessMessage(response.data.message);

            setResendTimer(30);

        } catch (err) {
            if (axios.isAxiosError(err)) {
                const errorData = err.response?.data;
                // Backend sends { "Error": "message" } with capital E
                const message = errorData?.Error || errorData?.error || errorData?.message || 'Failed to resend OTP.';
                setError(message);
            } else {
                setError('Failed to resend OTP.');
            }
            console.error("Resend OTP error:", err);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="flex w-full items-center justify-center bg-background min-h-screen">
            <Card className="w-full max-w-md shadow-lg">
                {/* Header */}
                <CardHeader className="space-y-2 pb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <MessageSquare className="h-8 w-8 text-chart-6" />
                        <h1 className="text-3xl font-bold">ChatStack</h1>
                    </div>
                    <CardTitle className="text-2xl font-bold">Verify Email</CardTitle>
                    <CardDescription className="text-base">
                        Enter the OTP sent to <br />
                        <span className="font-semibold text-foreground">
                            {email}
                        </span>
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    {error && (
                        <div className="rounded-md bg-destructive/15 p-3.5 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="rounded-md bg-green-50 p-3.5 text-sm text-green-800">
                            ✓ {successMessage}
                        </div>
                    )}

                    <div className="rounded-md bg-blue-50 p-4 flex gap-3">
                        <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            We sent a one-time password (OTP) to your email.
                            For security, the OTP is not displayed here.
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <Label htmlFor="otp" className="text-sm font-medium">
                            One-Time Password (OTP)
                        </Label>
                        <Input
                            id="otp"
                            type="text"
                            placeholder="Enter OTP from email"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            disabled={isLoading}
                            className="h-11"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Check your email for the OTP code
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pt-6">
                    <Button
                        className="h-11 w-full text-base"
                        type="submit"
                        onClick={handleVerifyOtp}
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </Button>

                    <Button
                        variant="outline"
                        className="h-11 w-full text-base"
                        onClick={handleResendOtp}
                        disabled={isResending || resendTimer > 0}
                    >
                        {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isResending ? 'Sending...' : (
                            <>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
                            </>
                        )}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        Wrong email?{' '}
                        <Link
                            href="/register"
                            className="text-chart-6 hover:underline font-medium"
                        >
                            Create new account
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}