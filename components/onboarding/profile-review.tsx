"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProfileReviewProps {
    initialData: any;
    resumeFileId?: string;
    resumeSource: "pdf" | "ai-generated";
    onConfirm: () => void;
    onBack: () => void;
}

export function ProfileReview({ initialData, resumeFileId, resumeSource, onConfirm, onBack }: ProfileReviewProps) {
    const updateProfile = useMutation(api.users.updateProfile);
    const [isSaving, setIsSaving] = useState(false);

    // Flatten initialData if needed (draftProfile structure from AI)
    const draft = initialData.draftProfile || initialData;
    const basic = draft.basicDetails || {};

    // Simple state for key fields - in a real app, use React Hook Form + Zod
    const [formData, setFormData] = useState({
        firstName: basic.firstName?.value || "",
        lastName: basic.lastName?.value || "",
        email: basic.email?.value || "",
        mobile: basic.mobile?.value || "",
        currentLocation: basic.currentLocation?.value || "",
        role: "", // Not strictly in parsed data usually
        about: draft.aboutMe?.value || "",
        skills: (draft.skills || []).join(", "), // Comma separated for review
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirm = async () => {
        if (!formData.firstName || !formData.lastName || !formData.mobile) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            setIsSaving(true);

            // Construct payload matching schema
            await updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                mobile: formData.mobile,
                currentLocation: formData.currentLocation,
                about: formData.about,
                role: formData.role, // Added manual role entry if needed
                skills: formData.skills.split(",").map((s: string) => s.trim()).filter(Boolean),
                resumeMetadata: {
                    uploaded: true,
                    source: resumeSource,
                    parsed: true,
                    fileId: resumeFileId
                },
                profileStatus: {
                    autoFilled: true,
                    confirmed: true,
                    completionLevel: 3
                },
                onboardingStatus: "completed"
            });

            toast.success("Profile confirmed!");
            onConfirm();

        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save profile.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h3 className="text-xl font-semibold">Review & Confirm</h3>
                <p className="text-muted-foreground text-sm">
                    Please verify the details extracted from your resume.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={formData.firstName} onChange={e => handleChange("firstName", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={formData.lastName} onChange={e => handleChange("lastName", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={formData.email} onChange={e => handleChange("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mobile">Phone</Label>
                    <Input id="mobile" value={formData.mobile} onChange={e => handleChange("mobile", e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Current Location</Label>
                    <Input id="location" value={formData.currentLocation} onChange={e => handleChange("currentLocation", e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="skills">Skills (Comma separated)</Label>
                    <Textarea id="skills" value={formData.skills} onChange={e => handleChange("skills", e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="about">About / Summary</Label>
                    <Textarea id="about" className="h-24" value={formData.about} onChange={e => handleChange("about", e.target.value)} />
                </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={onBack} disabled={isSaving}>Back</Button>
                <Button onClick={handleConfirm} disabled={isSaving}>
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Confirm & Save Profile
                </Button>
            </div>
        </div>
    );
}
