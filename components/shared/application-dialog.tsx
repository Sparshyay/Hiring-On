"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, FileText, Upload, X, Loader2, ArrowRight } from "lucide-react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface ApplicationDialogProps {
    job: any;
    user: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ApplicationDialog({ job, user, open, onOpenChange }: ApplicationDialogProps) {
    const applyToJob = useMutation(api.applications.create);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const updateProfile = useMutation(api.users.updateProfile);

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    // Resume File State
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeStorageId, setResumeStorageId] = useState<string>(user?.resume || "");

    const [formData, setFormData] = useState({
        // Basic Details
        firstName: user?.firstName || user?.name?.split(" ")[0] || "",
        lastName: user?.lastName || user?.name?.split(" ").slice(1).join(" ") || "",
        email: user?.email || "",
        mobile: user?.mobile || "",
        gender: user?.gender || "",
        currentLocation: user?.currentLocation || "",

        // Education / Institute
        instituteName: user?.education?.[0]?.institution || "",
        differentlyAbled: "No", // Default

        // User Details
        type: user?.userType || "College Students",
        domain: user?.domain || "",
        course: user?.course || "",
        courseSpecialization: user?.courseSpecialization || "",
        graduatingYear: user?.education?.[0]?.endYear || "",
        courseDuration: "4 Years", // Default

        // Custom Answers
        customAnswers: {} as Record<string, any>,
        coverLetter: "",
    });

    const [acceptedTerms, setAcceptedTerms] = useState(false);

    useEffect(() => {
        if (open && user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || user.name?.split(" ")[0] || prev.firstName,
                lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || prev.lastName,
                email: user.email || prev.email,
                mobile: user.mobile || prev.mobile,
                currentLocation: user.currentLocation || prev.currentLocation,
            }));
            setResumeStorageId(user.resume || "");
        }
    }, [open, user]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setResumeFile(file);
    };

    const handleSubmit = async () => {
        if (!acceptedTerms) {
            toast.error("Please accept the terms and conditions");
            return;
        }
        setLoading(true);
        try {
            // 1. Upload Resume if changed
            let finalResumeId = resumeStorageId;
            if (resumeFile) {
                const postUrl = await generateUploadUrl();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": resumeFile.type },
                    body: resumeFile,
                });
                if (!result.ok) throw new Error("Upload failed");
                const { storageId } = await result.json();
                finalResumeId = storageId;
            }

            if (!finalResumeId) {
                throw new Error("Resume is required");
            }

            // 2. Update Profile with new info
            // We optimize this to only send specific fields if needed, 
            // but for now generally updating is safe to keep profile fresh
            await updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                mobile: formData.mobile,
                currentLocation: formData.currentLocation,
                gender: formData.gender,
                userType: formData.type,
                // Update education if institute changed? Leaving complex update for now
                resume: finalResumeId
            });

            // 3. Format Custom Answers
            const formattedAnswers = Object.entries(formData.customAnswers).map(([qId, answer]) => ({
                questionId: qId,
                answer: answer
            }));

            // 4. Create Application
            await applyToJob({
                jobId: job._id,
                resumeUrl: finalResumeId,
                coverLetter: formData.coverLetter,
                customAnswers: formattedAnswers
            });

            toast.success("Application Submitted Successfully!");
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto z-[200]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Registration Form</DialogTitle>
                </DialogHeader>

                <div className="space-y-8 py-4">
                    {/* Resume Section */}
                    <div className="space-y-4">
                        <Label className="text-base font-semibold">Upload CV / Resume <span className="text-red-500">*</span></Label>
                        <p className="text-xs text-slate-500">Submit your resume in doc, docx, pdf</p>

                        {(resumeStorageId || resumeFile) ? (
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-8 h-8 text-blue-600" />
                                    <div>
                                        <p className="font-semibold text-sm">{resumeFile ? resumeFile.name : "Current Resume"}</p>
                                        <p className="text-xs text-slate-500">Ready to submit</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => { setResumeFile(null); setResumeStorageId(""); }}>
                                    <X className="w-4 h-4 text-slate-400" />
                                </Button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-slate-50 transition cursor-pointer relative">
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleFileUpload}
                                />
                                <div className="flex flex-col items-center gap-2 text-slate-500">
                                    <Upload className="w-8 h-8 text-slate-400" />
                                    <p className="font-medium">Click to upload or drag and drop</p>
                                    <p className="text-xs">PDF, DOC, DOCX (Max 5MB)</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Basic Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Basic Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First Name <span className="text-red-500">*</span></Label>
                                <Input
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Last Name</Label>
                                <Input
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email <span className="text-red-500">*</span></Label>
                                <Input
                                    value={formData.email}
                                    readOnly
                                    className="bg-slate-50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Mobile <span className="text-red-500">*</span></Label>
                                <div className="flex gap-2">
                                    <div className="flex items-center px-3 border rounded-md bg-slate-50 text-slate-500 text-sm">
                                        🇮🇳 +91
                                    </div>
                                    <Input
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Location <span className="text-red-500">*</span></Label>
                                <Input
                                    value={formData.currentLocation}
                                    onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Select Gender <span className="text-red-500">*</span></Label>
                                <div className="flex gap-3 flex-wrap">
                                    {["Female", "Male", "Transgender", "Non-binary", "Prefer not to say"].map((g) => (
                                        <button
                                            key={g}
                                            onClick={() => setFormData({ ...formData, gender: g })}
                                            className={`px-4 py-2 rounded-full border text-sm font-medium transition ${formData.gender === g ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Education / User Type */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">User Details</h3>
                        <div className="space-y-2">
                            <Label>Type <span className="text-red-500">*</span></Label>
                            <div className="flex gap-3">
                                {["College Students", "Professional", "Fresher"].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => setFormData({ ...formData, type: val })}
                                        className={`px-4 py-2 rounded-full border text-sm font-medium transition ${formData.type === val ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-slate-300'}`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label>Institute Name <span className="text-red-500">*</span></Label>
                                <Input
                                    value={formData.instituteName}
                                    onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
                                    placeholder="Enter college or university name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Domain</Label>
                                <Select value={formData.domain} onValueChange={(v) => setFormData({ ...formData, domain: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Domain" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Engineering">Engineering</SelectItem>
                                        <SelectItem value="Arts">Arts</SelectItem>
                                        <SelectItem value="Management">Management</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Course</Label>
                                <Select value={formData.course} onValueChange={(v) => setFormData({ ...formData, course: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="B.Tech">B.Tech</SelectItem>
                                        <SelectItem value="MBA">MBA</SelectItem>
                                        <SelectItem value="BBA">BBA</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Course Duration</Label>
                                <Select value={formData.courseDuration} onValueChange={(v) => setFormData({ ...formData, courseDuration: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="3 Years">3 Years</SelectItem>
                                        <SelectItem value="4 Years">4 Years</SelectItem>
                                        <SelectItem value="5 Years">5 Years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Graduating Year</Label>
                                <Select value={formData.graduatingYear} onValueChange={(v) => setFormData({ ...formData, graduatingYear: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(y => (
                                            <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Custom Questions */}
                    {job?.customApplyForm && job.customApplyForm.length > 0 && (
                        <div className="space-y-4">
                            <div className="h-px bg-slate-100" />
                            <h3 className="text-lg font-semibold">Additional Questions</h3>
                            <div className="space-y-4">
                                {job.customApplyForm.map((q: any) => (
                                    <div key={q.id} className="space-y-2">
                                        <Label>{q.question} {q.isRequired && <span className="text-red-500">*</span>}</Label>
                                        {q.type === 'text' && (
                                            <Input
                                                value={formData.customAnswers[q.id] || ""}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    customAnswers: { ...formData.customAnswers, [q.id]: e.target.value }
                                                })}
                                            />
                                        )}
                                        {q.type === 'boolean' && (
                                            <Select
                                                value={formData.customAnswers[q.id]}
                                                onValueChange={(v) => setFormData({
                                                    ...formData,
                                                    customAnswers: { ...formData.customAnswers, [q.id]: v }
                                                })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Yes">Yes</SelectItem>
                                                    <SelectItem value="No">No</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Terms */}
                    <div className="flex items-start gap-2 pt-4 border-t">
                        <Checkbox
                            id="terms"
                            checked={acceptedTerms}
                            onCheckedChange={(c) => setAcceptedTerms(c as boolean)}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Accept Terms & Conditions
                            </label>
                            <p className="text-sm text-muted-foreground">
                                By registering, you agree to share your data with the recruiter for this opportunity.
                            </p>
                        </div>
                    </div>

                </div>

                <DialogFooter className="py-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Submit Application
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
