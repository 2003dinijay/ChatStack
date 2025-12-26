"use client";

import { MessagesSquare } from "lucide-react";
import { Button } from "./button";

export default function Nav() {
    const handleSignIn = () => {
        window.location.href = '/login';
    };
    
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 backdrop-blur-sm bg-background/20">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <MessagesSquare className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <a href="" className="text-xl font-bold">ChatStack</a>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Features
                    </a>
                    <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        About
                    </a>
                    <Button variant="outline" size="sm" onClick={handleSignIn}>
                        Sign In
                    </Button>
                </nav>
            </div>
        </header>
    );
}