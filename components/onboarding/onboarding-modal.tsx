"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Sparkles, Clock, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ResumeUpload } from "./resume-upload";
import { AIResumeBuilder } from "./ai-resume-builder";

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Removed specific click handlers as they are internal now
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
    const updateProfile = useMutation(api.users.updateProfile);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Steps: 'select' | 'upload' | 'ai-build' 
    const [step, setStep] = useState<"select" | "upload" | "ai-build">("select");
    const [parsedData, setParsedData] = useState<any>(null);
    const [resumeFileId, setResumeFileId] = useState<string | undefined>(undefined);
    const [resumeSource, setResumeSource] = useState<"pdf" | "ai-generated">("pdf");

    // Reset when closed/opened
    useEffect(() => {
        if (isOpen) {
            setStep("select");
            setParsedData(null);
        }
    }, [isOpen]);

    const handleSkip = async () => {
        setIsLoading(true);
        try {
            await updateProfile({ onboardingStatus: "skipped" });
            toast.info("You can complete your profile later before applying to jobs.");
            onClose();
        } catch (error) {
            console.error("Failed to skip onboarding", error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleParsingComplete = async (parsedData: any, fileId: string) => {
        setIsLoading(true);
        try {
            // Save draft profile data and resume info
            const draftData = parsedData?.draftProfile || parsedData;

            // Map parsed data to profile schema format
            const profileUpdate = {
                firstName: draftData.basicDetails?.firstName?.value || "",
                lastName: draftData.basicDetails?.lastName?.value || "",
                // Don't overwrite email/mobile if they exist, but maybe fine for first time
                mobile: draftData.basicDetails?.mobile?.value || "",
                about: draftData.aboutMe?.value || "",
                currentLocation: draftData.basicDetails?.currentLocation?.value || "",
                gender: draftData.basicDetails?.gender?.value || "",
                skills: draftData.skills || [],

                // Save Resume Metadata
                resume: fileId,
                resumeMetadata: {
                    uploaded: true,
                    source: "pdf",
                    parsed: true,
                    fileId: fileId
                },
                // Set status to pending so they MUST confirm on profile page
                onboardingStatus: "pending",
                profileStatus: {
                    autoFilled: true,
                    confirmed: false,
                    completionLevel: 1
                }
            };

            await updateProfile(profileUpdate);
            toast.success("Resume processed! Please review your profile.");
            // Redirect to profile edit page for final review
            router.push("/profile/edit?from_onboarding=true");
            onClose();

        } catch (error) {
            console.error("Failed to save draft:", error);
            toast.error("Failed to process resume data.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAIComplete = async (parsedData: any) => {
        setIsLoading(true);
        try {
            const draftData = parsedData?.draftProfile || parsedData;
            const profileUpdate = {
                firstName: draftData.basicDetails?.firstName?.value || "",
                lastName: draftData.basicDetails?.lastName?.value || "",
                about: draftData.aboutMe?.value || "",
                skills: draftData.skills || [],

                resumeMetadata: {
                    uploaded: false,
                    source: "ai-generated",
                    parsed: true,
                },
                onboardingStatus: "pending",
                profileStatus: {
                    autoFilled: true,
                    confirmed: false,
                    completionLevel: 1
                }
            };

            await updateProfile(profileUpdate);
            toast.success("Profile generated! Please review details.");
            router.push("/profile/edit?from_onboarding=true");
            onClose();
        } catch (error) {
            console.error("Failed to save AI profile:", error);
            toast.error("Failed to generate profile.");
        } finally {
            setIsLoading(false);
        }
    };


    if (step === 'select') {
        return (
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-xl" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">Complete Your Profile</DialogTitle>
                        <DialogDescription className="text-center text-base mt-2">
                            To apply for jobs, you need a verified resume and profile. Choose how you want to start.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {/* Upload Resume Option */}
                        <div
                            className="border-2 border-dashed border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 rounded-xl p-6 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 text-center group"
                            onClick={() => setStep('upload')}
                        >
                            <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-primary">Upload Resume</h3>
                                <p className="text-sm text-muted-foreground mt-1">Auto-fill details from your PDF</p>
                            </div>
                            <span className="text-xs font-medium bg-primary text-white px-2 py-1 rounded-full mt-2">Recommended</span>
                        </div>

                        {/* AI Resume Builder Option */}
                        <div
                            className="border-2 border-dashed border-purple-500/20 hover:border-purple-500/50 bg-purple-50 hover:bg-purple-100 rounded-xl p-6 cursor-pointer transition-all flex flex-col items-center justify-center gap-3 text-center group"
                            onClick={() => setStep('ai-build')}
                        >
                            <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Sparkles className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-purple-700">Create with AI</h3>
                                <p className="text-sm text-muted-foreground mt-1">Build a professional resume instantly</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <Button
                            variant="ghost"
                            onClick={handleSkip}
                            disabled={isLoading}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                        >
                            <Clock className="w-4 h-4" />
                            Do it later
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
                {/* Back button logic could go here in Header */}
                <DialogHeader>
                    <DialogTitle>
                        {step === 'upload' && "Upload Resume"}
                        {step === 'ai-build' && "AI Resume Builder"}
                    </DialogTitle>
                </DialogHeader>

                <div className="mt-4">
                    {step === 'upload' && (
                        <ResumeUpload
                            onParsingComplete={handleParsingComplete}
                            onCancel={() => setStep('select')}
                        />
                    )}
                    {step === 'ai-build' && (
                        <AIResumeBuilder
                            onComplete={handleAIComplete}
                            onCancel={() => setStep('select')}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
