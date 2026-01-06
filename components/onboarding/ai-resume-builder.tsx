"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AIResumeBuilderProps {
    onComplete: (data: any) => void;
    onCancel: () => void;
}

export function AIResumeBuilder({ onComplete, onCancel }: AIResumeBuilderProps) {
    // Simplified Manual Entry for "AI Builder" flow
    // In a full version, this would use AI to generate content based on role.
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        mobile: "",
        role: "",
        skills: "",
        about: ""
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // Mocking the structure expected by ProfileReview (draftProfile)
        const mockParsedData = {
            draftProfile: {
                basicDetails: {
                    firstName: { value: formData.firstName },
                    lastName: { value: formData.lastName },
                    mobile: { value: formData.mobile },
                },
                aboutMe: { value: formData.about },
                skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
                // Add more fields if needed
            }
        };
        onComplete(mockParsedData);
    };

    return (
        <div className="space-y-6 p-1">
            <div className="space-y-1">
                <h3 className="text-xl font-semibold">Build Your Resume</h3>
                <p className="text-muted-foreground text-sm">
                    Enter your details and we'll format it for you.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="ai-firstName">First Name</Label>
                    <Input id="ai-firstName" value={formData.firstName} onChange={e => handleChange("firstName", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ai-lastName">Last Name</Label>
                    <Input id="ai-lastName" value={formData.lastName} onChange={e => handleChange("lastName", e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="ai-mobile">Mobile Number</Label>
                    <Input id="ai-mobile" value={formData.mobile} onChange={e => handleChange("mobile", e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="ai-role">Target Role (e.g. Software Engineer)</Label>
                    <Input id="ai-role" value={formData.role} onChange={e => handleChange("role", e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="ai-skills">Key Skills</Label>
                    <Textarea id="ai-skills" placeholder="Java, Python, React..." value={formData.skills} onChange={e => handleChange("skills", e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="ai-about">Professional Summary</Label>
                    <Textarea id="ai-about" className="h-24" placeholder="Briefly describe your experience..." value={formData.about} onChange={e => handleChange("about", e.target.value)} />
                </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
                <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700">
                    Generate Profile
                </Button>
            </div>
        </div>
    );
}
