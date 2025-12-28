"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";
import { useEffect } from "react";

export default function RecruitersLandingPage() {
    const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
    const { isRecruiter, isCandidate, isLoading: roleLoading } = useUserRole();
    const becomeRecruiter = useMutation(api.users.becomeRecruiter);
    const router = useRouter();

    const isLoading = authLoading || roleLoading;

    // Redirect if already recruiter
    useEffect(() => {
        if (!isLoading && isRecruiter) {
            router.push("/recruiter");
        }
    }, [isLoading, isRecruiter, router]);

    const handleJoin = async () => {
        try {
            await becomeRecruiter();
            toast.success("Welcome! You are now a Recruiter.");
            router.push("/recruiter");
        } catch (error) {
            toast.error("Failed to update role. Please try again.");
            console.error(error);
        }
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero */}
            <section className="bg-slate-900 text-white py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold">Find Your Next Great Hire</h1>
                    <p className="text-xl text-slate-300">
                        Connect with top talent, manage applications, and streamline your hiring process.
                    </p>
                    <div className="pt-4">
                        {!isAuthenticated ? (
                            <SignInButton mode="modal">
                                <Button size="lg" className="bg-primary hover:bg-orange-600 text-lg px-8">
                                    Start Hiring Now
                                </Button>
                            </SignInButton>
                        ) : isRecruiter ? (
                            <Button size="lg" onClick={() => router.push("/recruiter")}>
                                Go to Dashboard
                            </Button>
                        ) : (
                            <Button size="lg" className="bg-primary hover:bg-orange-600 text-lg px-8" onClick={handleJoin}>
                                Create Recruiter Account
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6 bg-slate-50">
                <div className="container mx-auto max-w-5xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            title="Post Unlimited Jobs"
                            desc="Reach thousands of qualified candidates with detailed job listings."
                        />
                        <FeatureCard
                            title="Smart Candidate Matching"
                            desc="Our AI helps you find the perfect fit based on skills and experience."
                        />
                        <FeatureCard
                            title="Application Tracking"
                            desc="Manage your entire hiring pipeline in one easy-to-use dashboard."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
    return (
        <Card>
            <CardHeader>
                <CheckCircle className="w-8 h-8 text-primary mb-2" />
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-base">{desc}</CardDescription>
            </CardContent>
        </Card>
    );
}
