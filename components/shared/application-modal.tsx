"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, FileText, CheckCircle2, Upload, Trash2, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ResumeUpload } from "@/components/onboarding/resume-upload"; // We can reuse this logic or part of it? 
// ResumeUpload component is full page style. We might want a smaller inline version or just use it as a modal step.
// For now, I'll implement inline resume logic or improved UI.

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    jobTitle: string;
    companyName: string;
    type?: "Job" | "Internship";
}

export function ApplicationModal({ isOpen, onClose, jobId, jobTitle, companyName, type = "Job" }: ApplicationModalProps) {
    const profile = useQuery(api.users.getProfileForApplication);
    const updateProfile = useMutation(api.users.updateProfileFromApplication);
    const applyToJob = useMutation(api.applications.create); // Assuming create exists and takes jobId

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<"form" | "resume-upload">("form");

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        gender: "",
        location: "",
        instituteName: "",
        differentlyAbled: "No",
        userType: "",
        domain: "",
        course: "",
        courseSpecialization: "",
        graduatingYear: "",
        courseDuration: "", // "4 Years"
        resume: "", // Storage ID
        previewResumeUrl: "", // For display
    });

    const [termsAccepted, setTermsAccepted] = useState(false);

    // Load Profile Data
    useEffect(() => {
        if (profile) {
            setFormData({
                firstName: profile.firstName || profile.name?.split(" ")[0] || "",
                lastName: profile.lastName || profile.name?.split(" ").slice(1).join(" ") || "",
                email: profile.email || "",
                mobile: profile.mobile || "",
                gender: profile.gender || "",
                location: profile.location || "",
                instituteName: profile.instituteName || "",
                differentlyAbled: profile.differentlyAbled || "No",
                userType: profile.userType || "",
                domain: profile.domain || "",
                course: profile.course || "",
                courseSpecialization: profile.specialization || "",
                graduatingYear: profile.graduatingYear || "",
                courseDuration: profile.courseDuration || "",
                resume: profile.resumeStorageId || "",
                previewResumeUrl: profile.resumeUrl || "",
            });
        }
    }, [profile]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleResumeUpload = (data: any, fileId: string) => {
        // Callback from ResumeUpload component if we use it
        setFormData(prev => ({
            ...prev,
            resume: fileId,
            previewResumeUrl: "", // We might not have URL immediately unless component returns it
        }));
        setStep("form");
        toast.success("Resume updated!");
    };

    const validateForm = () => {
        const requiredFields = [
            "firstName", "mobile", "gender", "location",
            "instituteName", "userType", "domain", "course",
            "courseSpecialization", "graduatingYear", "resume"
        ];

        const missing = requiredFields.filter(field => !formData[field as keyof typeof formData]);

        if (missing.length > 0) {
            toast.error(`Please fill all required fields: ${missing.join(", ")}`);
            return false;
        }

        if (!termsAccepted) {
            toast.error("Please accept the terms and conditions");
            return false;
        }

        return true;
    };

    const handleApply = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // 1. Save Profile Changes
            await updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                mobile: formData.mobile,
                gender: formData.gender,
                location: formData.location,
                instituteName: formData.instituteName,
                differentlyAbled: formData.differentlyAbled,
                userType: formData.userType,
                domain: formData.domain,
                course: formData.course,
                courseSpecialization: formData.courseSpecialization,
                graduatingYear: formData.graduatingYear,
                courseDuration: formData.courseDuration,
                resume: formData.resume,
            });

            // 2. Apply to Job
            await applyToJob({
                jobId: jobId as any, // ID string
                resumeUrl: formData.resume, // Sending ID as resumeUrl for now (backend handles it?)
                // API expects resumeUrl: v.optional(v.string()). If we send ID, backend logic in 'create' should handle it?
                // `applications.ts:create`: `resumeUrl: args.resumeUrl || user.resume`.
                // It stores it as string. `getRecruiterApplications` resolves it. So ID is fine.
            });

            toast.success("Applied successfully!");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Failed to apply");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    if (step === "resume-upload") {
        return (
            <Dialog open={true} onOpenChange={() => setStep("form")}>
                <DialogContent className="sm:max-w-md">
                    <ResumeUpload
                        onParsingComplete={handleResumeUpload}
                        onCancel={() => setStep("form")}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    if (!profile) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent>
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Registration Form</DialogTitle>
                    <div className="text-sm text-muted-foreground mt-1">
                        Applying for <span className="font-semibold text-foreground">{jobTitle}</span> at <span className="font-semibold text-foreground">{companyName}</span>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Resume Section */}
                    <div className="space-y-2">
                        <Label className="text-base font-semibold">Upload CV / Resume <span className="text-red-500">*</span></Label>
                        <p className="text-xs text-muted-foreground">Submit your resume in doc, docx, pdf</p>

                        {formData.previewResumeUrl || formData.resume ? (
                            <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                                        {formData.previewResumeUrl ? "Resume Uploaded" : "Existing Resume"}
                                    </span>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Uploaded</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    {formData.previewResumeUrl && (
                                        <Button variant="ghost" size="sm" asChild>
                                            <a href={formData.previewResumeUrl} target="_blank" rel="noopener noreferrer">View File</a>
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" onClick={() => setStep("resume-upload")}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => setStep("resume-upload")}
                                className="border-2 border-dashed rounded-lg p-6 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                            >
                                <div className="text-center">
                                    <Upload className="h-6 w-6 mx-auto text-slate-400 mb-2" />
                                    <span className="text-sm font-medium text-slate-600">Click to upload Resume</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Basic Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Basic Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name <span className="text-red-500">*</span></Label>
                                <Input value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Email <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input value={formData.email} disabled className="bg-slate-50" />
                                    <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Mobile <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-2.5 flex items-center gap-1">
                                        <span className="text-sm font-medium">🇮🇳 +91</span>
                                    </div>
                                    <Input
                                        value={formData.mobile.replace("+91", "").trim()}
                                        onChange={(e) => handleInputChange("mobile", e.target.value)}
                                        className="pl-20"
                                    />
                                    <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label>Gender <span className="text-red-500">*</span></Label>
                                <div className="flex gap-4 flex-wrap">
                                    {["Female", "Male", "Transgender", "Prefer not to say"].map((g) => (
                                        <div
                                            key={g}
                                            onClick={() => handleInputChange("gender", g)}
                                            className={`px-4 py-2 rounded-full border cursor-pointer text-sm font-medium transition-colors ${formData.gender === g
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            {g}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label>Location <span className="text-red-500">*</span></Label>
                                <div className="relative">
                                    <Input value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} />
                                    <MapPin className="absolute right-3 top-3 h-4 w-4 text-slate-400" />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label>Institute Name <span className="text-red-500">*</span></Label>
                                <Input value={formData.instituteName} onChange={(e) => handleInputChange("instituteName", e.target.value)} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label>Differently Abled <span className="text-red-500">*</span></Label>
                                <div className="flex gap-4">
                                    {["No", "Yes"].map((opt) => (
                                        <div
                                            key={opt}
                                            onClick={() => handleInputChange("differentlyAbled", opt)}
                                            className={`px-6 py-2 rounded-full border cursor-pointer text-sm font-medium transition-colors ${formData.differentlyAbled === opt
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">User Details</h3>

                        <div className="space-y-2">
                            <Label>Type <span className="text-red-500">*</span></Label>
                            <div className="flex gap-4 flex-wrap">
                                {["College Students", "Professional", "Fresher"].map((t) => (
                                    <div
                                        key={t}
                                        onClick={() => handleInputChange("userType", t)}
                                        className={`px-4 py-2 rounded-full border cursor-pointer text-sm font-medium transition-colors ${formData.userType === t
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <Label>Domain <span className="text-red-500">*</span></Label>
                                <Select value={formData.domain} onValueChange={(v) => handleInputChange("domain", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Domain" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Engineering">Engineering</SelectItem>
                                        <SelectItem value="Management">Management</SelectItem>
                                        <SelectItem value="Design">Design</SelectItem>
                                        {/* Add more later */}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label>Course <span className="text-red-500">*</span></Label>
                                <Select value={formData.course} onValueChange={(v) => handleInputChange("course", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="B.Tech/BE">B.Tech/BE (Bachelor of Technology)</SelectItem>
                                        <SelectItem value="B.Sc">B.Sc</SelectItem>
                                        <SelectItem value="MBA">MBA</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label>Course Specialization <span className="text-red-500">*</span></Label>
                                <Select value={formData.courseSpecialization} onValueChange={(v) => handleInputChange("courseSpecialization", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Specialization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                                        <SelectItem value="Finance">Finance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Graduating Year <span className="text-red-500">*</span></Label>
                                <div className="flex gap-2 flex-wrap">
                                    {["2024", "2025", "2026", "2027"].map(year => (
                                        <div
                                            key={year}
                                            onClick={() => handleInputChange("graduatingYear", year)}
                                            className={`px-3 py-1.5 rounded-full border cursor-pointer text-xs font-medium transition-colors ${formData.graduatingYear === year
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            {year}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Course Duration <span className="text-red-500">*</span></Label>
                                <div className="flex gap-2">
                                    {["3 Years", "4 Years", "5 Years"].map(d => (
                                        <div
                                            key={d}
                                            onClick={() => handleInputChange("courseDuration", d)}
                                            className={`px-3 py-1.5 rounded-full border cursor-pointer text-xs font-medium transition-colors ${formData.courseDuration === d
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-slate-200 hover:border-slate-300"
                                                }`}
                                        >
                                            {d}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start space-x-2 pt-4 border-t">
                        <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(c) => setTermsAccepted(c as boolean)} />
                        <label
                            htmlFor="terms"
                            className="text-xs text-muted-foreground leading-tight"
                        >
                            By registering for this opportunity, you agree to share the data mentioned in this form or any form henceforth on this opportunity with the recruiter. You also agree to our <span className="text-blue-600">privacy policy</span> and <span className="text-blue-600">terms of use</span>.
                        </label>
                    </div>

                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button
                        onClick={handleApply}
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...
                            </>
                        ) : (
                            "Register"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
