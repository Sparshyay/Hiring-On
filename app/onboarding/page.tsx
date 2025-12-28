"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle2, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const convexUser = useQuery(api.auth.getUser);
    const profileCompletion = useQuery(api.users.checkProfileCompletion);
    const createUser = useMutation(api.users.createUser);
    const updateResume = useMutation(api.users.updateResume);

    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [hasRedirected, setHasRedirected] = useState(false);

    // Check if user is authenticated (using Clerk)
    const isAuthenticated = isLoaded && !!user;

    useEffect(() => {
        if (isAuthenticated && convexUser === null) {
            // Create user in Convex if not exists
            console.log("Creating user in Convex from onboarding...");
            createUser({
                name: user.fullName || user.username || "User",
                email: user.primaryEmailAddress?.emailAddress || "",
            });
        }
    }, [isAuthenticated, user, convexUser, createUser]);

    useEffect(() => {
        // Only redirect if profile is complete AND we haven't redirected yet
        if (profileCompletion?.isComplete && !hasRedirected && !isSubmitting) {
            console.log("Profile complete, redirecting to practice...");
            setHasRedirected(true);
            router.push("/practice");
        }
    }, [profileCompletion, router, hasRedirected, isSubmitting]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            validateAndSetFile(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        if (file.type !== "application/pdf") {
            alert("Only PDF files are allowed.");
            return;
        }
        setResumeFile(file);
    };

    const handleSubmit = async () => {
        if (!resumeFile) {
            alert("Please upload a resume first");
            return;
        }

        if (!isAuthenticated) {
            alert("Please wait while authentication completes...");
            return;
        }

        if (!convexUser) {
            alert("Please wait while we set up your account...");
            return;
        }

        setIsSubmitting(true);
        try {
            // In a production app, you would upload the file to storage (S3, Convex storage, etc.)
            // For now, we'll just store the filename as a placeholder
            const resumeUrl = `resumes/${user?.id}/${resumeFile.name}`;

            console.log("Uploading resume:", resumeFile.name);
            await updateResume({ resume: resumeUrl });

            console.log("Resume uploaded successfully, redirecting to profile edit...");

            // Small delay to ensure state updates
            setTimeout(() => {
                router.push("/profile/edit");
            }, 500);
        } catch (error) {
            console.error("Error uploading resume:", error);
            alert("Failed to upload resume. Please try again.\n\nError: " + (error as Error).message);
            setIsSubmitting(false);
        }
    };

    if (!isLoaded || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-none shadow-xl">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
                    <CardDescription>Upload your resume (PDF only) to start applying.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[200px] ${isDragging ? "border-primary bg-primary/5" : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById("resume-upload")?.click()}
                    >
                        <input
                            id="resume-upload"
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={handleFileSelect}
                        />

                        {resumeFile ? (
                            <div className="flex flex-col items-center text-green-600">
                                <CheckCircle2 className="w-10 h-10 mb-2" />
                                <p className="font-medium text-slate-900 break-all">{resumeFile.name}</p>
                                <p className="text-xs text-slate-500 mt-1">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                <Button variant="ghost" size="sm" className="mt-2 h-auto py-1 text-xs text-red-500 hover:text-red-600" onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}>
                                    Remove
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Upload className={`w-10 h-10 mb-4 ${isDragging ? "text-primary" : "text-slate-300"}`} />
                                <p className="text-sm font-medium text-slate-900">
                                    {isDragging ? "Drop PDF here" : "Click to upload or drag and drop"}
                                </p>
                                <p className="text-xs text-slate-400 mt-2">PDF only (max 5MB)</p>
                            </>
                        )}
                    </div>

                    <Button
                        className="w-full bg-primary hover:bg-orange-600 text-white"
                        onClick={handleSubmit}
                        disabled={!resumeFile || isSubmitting || !isAuthenticated || !convexUser}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-pulse">Uploading Resume...</span>
                            </>
                        ) : !isAuthenticated ? (
                            "Authenticating..."
                        ) : !convexUser ? (
                            "Setting up account..."
                        ) : (
                            <>
                                Continue <ArrowRight className="ml-2 w-4 h-4" />
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
