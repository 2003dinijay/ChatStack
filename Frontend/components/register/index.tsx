'use client';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Loader2, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Link from "next/link";

export default function RegisterPageComponent() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { register } = useAuth();
    const router = useRouter();

    const validateForm = (): boolean => {
        if (!username || !password || !email || !confirmPassword) {
            setError('All fields are required.');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }
        if (username.length < 3) {
            setError('Username must be at least 3 characters long.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email format.');
            return false;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }
        setIsLoading(true);

        try {
            await register({
                username,
                email,
                password,
                confirmPassword,
            });

            router.push('verify-email');
        } catch (err) {
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex w-full items-center justify-center bg-background min-h-screen">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-2 pb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <MessageSquare className="h-8 w-8 text-chart-6" />
                        <h1 className="text-3xl font-bold">ChatStack</h1>
                    </div>
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription className="text-base">
                        Sign up to start chatting with others.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                    {/* Error Message */}
                    {error && (
                        <div className="rounded-md bg-destructive/15 p-3.5 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2.5">
                        <Label htmlFor="username" className="text-sm font-medium">
                            Username
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isLoading}
                            className="h-11"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            At least 3 characters
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="h-11"
                            required
                        />
                    </div>

                    <div className="space-y-2.5">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="h-11"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            At least 6 characters
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                            className="h-11"
                            required
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pt-6">
                    <Button
                        className="h-11 w-full text-base"
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link
                            href="/login"
                            className="text-chart-6 hover:underline font-medium"
                        >
                            Login here
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}