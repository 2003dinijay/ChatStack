"use client";

import { ArrowRight, MessageSquare, Shield, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DarkVeil from "@/components/ui/DarkVeil";
import Nav from "@/components/ui/nav";

export default function Home() {
  const handleSignIn = () => {
    window.location.href = '/login';
  };

  const handleGetStarted = () => {
    window.location.href = '/register';
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div>
        <Nav />
      </div>
      <div className="absolute inset-0 z-0">
        <DarkVeil />
      </div>
      <div className="relative z-10">
        <section className="container mx-auto px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              Real-time messaging platform
            </div>

            <h1 className="mb-6 text-5xl md:text-6xl font-bold tracking-tight">
              Connect with your team in{" "}
              <span className="text-primary">real-time</span>
            </h1>

            <p className="mb-8 text-lg text-muted-foreground">
              Experience seamless communication with ChatStack. Built for teams who value speed,
              simplicity, and powerful real-time conversations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base" onClick={handleGetStarted}>
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-base" onClick={handleSignIn}>
                Sign In
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="container mx-auto px-6 py-16">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to communicate
            </h2>
            <p className="text-muted-foreground text-lg">
              Powerful features designed for modern teams
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="backdrop-blur-sm bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <MessageSquare className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Real-time Chat</h3>
                <p className="text-muted-foreground">
                  Instant messaging with WebSocket technology. See messages as they happen with zero delay.
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Team Collaboration</h3>
                <p className="text-muted-foreground">
                  Create channels, organize conversations, and keep your team connected in one place.
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-border/50">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Shield className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your conversations are protected with enterprise-grade security and encryption.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16 mb-16">
          <Card className="backdrop-blur-sm bg-primary/10 border-primary/20">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="mx-auto max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to get started?
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Join thousands of teams already using ChatStack to communicate better.
                </p>
                <Button size="lg" className="text-base" onClick={handleGetStarted}>
                  Start Chatting Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="border-t border-border/40 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                  <MessageSquare className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold">ChatStack</span>
              </div>
              <p className="text-sm text-muted-foreground">
                © 2025 ChatStack. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}