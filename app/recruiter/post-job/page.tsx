"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Plus, X, GripVertical, CheckCircle2 } from "lucide-react";
import { SmartAutocomplete } from "@/components/shared/smart-autocomplete";

// Steps Enum
enum PostJobStep {
    BASICS = 1,
    DETAILS = 2,
    ELIGIBILITY = 3,
    CUSTOM_FORM = 4,
    REVIEW = 5
}

export default function PostJobPage() {
    const router = useRouter();
    const createJob = useMutation(api.jobs.create);
    const companies = useQuery(api.companies.search, { query: "" }) || []; // Simplification for MVP

    const [currentStep, setCurrentStep] = useState<PostJobStep>(PostJobStep.BASICS);
    const [isLoading, setIsLoading] = useState(false);

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    // Form State
    const [formData, setFormData] = useState({
        // Basics
        title: "",
        companyId: "",
        location: "",
        type: "Full-time",
        workMode: "On-site",
        salary: "",
        salaryDuration: "year", // "month" | "year"
        workDays: "5 Days",
        workHours: "Flexible",
        applicationDeadline: "", // YYYY-MM-DD string for input
        tags: [] as string[],

        // Details
        description: "",
        requirements: "", // Line separated for now

        // Eligibility
        minExperience: 0,
        minEducation: "",
        requiredSkills: [] as string[],

        // Custom Form
        customQuestions: [] as Array<{
            id: string;
            question: string;
            type: "text" | "file" | "boolean" | "mcq";
            isRequired: boolean;
            options?: string[]; // For MCQ  
        }>
    });

    const validateStep = (step: PostJobStep): boolean => {
        switch (step) {
            case PostJobStep.BASICS:
                if (!formData.title.trim()) {
                    alert("Job Title is required");
                    return false;
                }
                if (!formData.location.trim()) {
                    alert("Location is required");
                    return false;
                }
                if (!formData.salary.trim()) {
                    alert("Salary is required");
                    return false;
                }
                if (!formData.applicationDeadline) {
                    alert("Application Deadline is required");
                    return false;
                }
                return true;
            case PostJobStep.DETAILS:
                if (!formData.description.trim() || formData.description.length < 50) {
                    alert("Please provide a detailed description (min 50 chars)");
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) return;

        if (currentStep < PostJobStep.REVIEW) {
            setCurrentStep(current => current + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > PostJobStep.BASICS) {
            setCurrentStep(current => current - 1);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Fallback for company (MVP)
            const companyIdToUse = formData.companyId || (companies.length > 0 ? companies[0]._id : "");

            if (!companyIdToUse) {
                alert("Please select a company (or ensure one exists)");
                setIsLoading(false);
                return;
            }

            // Upload Logo if exists
            let logoStorageId = undefined;
            if (logoFile) {
                const postUrl = await generateUploadUrl();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": logoFile.type },
                    body: logoFile,
                });
                const { storageId } = await result.json();
                logoStorageId = storageId;
            }

            // Split requirements strictly
            const requirementsList = formData.requirements
                .split("\n")
                .map(line => line.trim())
                .filter(line => line.length > 0);

            await createJob({
                title: formData.title,
                companyId: companyIdToUse as any,
                location: formData.location,
                type: formData.type,
                workMode: formData.workMode,
                salary: formData.salary,
                salaryDuration: formData.salaryDuration,

                applicationDeadline: new Date(formData.applicationDeadline).getTime(),
                workDays: formData.workDays,
                workHours: formData.workHours,

                description: formData.description,
                requirements: requirementsList,
                tags: formData.tags,

                minExperience: Number(formData.minExperience),
                minEducation: formData.minEducation,
                requiredSkills: formData.requiredSkills,

                customApplyForm: formData.customQuestions,
                companyLogo: logoStorageId, // Pass storage ID
            });

            router.push("/recruiter/jobs"); // Explicit redirect to My Jobs
        } catch (error) {
            console.error("Failed to post job:", error);
            alert("Failed to create job. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to add custom question
    const addCustomQuestion = () => {
        setFormData(prev => ({
            ...prev,
            customQuestions: [
                ...prev.customQuestions,
                {
                    id: crypto.randomUUID(),
                    question: "",
                    type: "text",
                    isRequired: false
                }
            ]
        }));
    };

    const removeCustomQuestion = (id: string) => {
        setFormData(prev => ({
            ...prev,
            customQuestions: prev.customQuestions.filter(q => q.id !== id)
        }));
    };

    const updateCustomQuestion = (id: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            customQuestions: prev.customQuestions.map(q =>
                q.id === id ? { ...q, [field]: value } : q
            )
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Progress Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-bold text-slate-900">Post a New Job</h1>
                        <span className="text-sm font-medium text-slate-500">Step {currentStep} of 5</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-indigo-600"
                            initial={{ width: "20%" }}
                            animate={{ width: `${(currentStep / 5) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Sidebar Navigation (Desktop) */}
                    <div className="hidden lg:block w-64 space-y-2">
                        {[
                            { step: 1, label: "Basics" },
                            { step: 2, label: "Details" },
                            { step: 3, label: "Eligibility" },
                            { step: 4, label: "Application Form" },
                            { step: 5, label: "Review" }
                        ].map((item) => (
                            <div
                                key={item.step}
                                className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${currentStep === item.step
                                    ? "bg-white text-indigo-600 shadow-sm"
                                    : currentStep > item.step ? "text-green-600" : "text-slate-500"
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${currentStep === item.step ? "border-indigo-600 bg-indigo-50" :
                                    currentStep > item.step ? "border-green-600 bg-green-50" : "border-slate-200"
                                    }`}>
                                    {currentStep > item.step ? <Check className="w-4 h-4" /> : item.step}
                                </div>
                                {item.label}
                            </div>
                        ))}
                    </div>

                    {/* Main Content */}
                    <Card className="flex-1 min-h-[500px] flex flex-col border-none shadow-lg">
                        <CardHeader className="border-b border-slate-100 bg-white sticky top-0 z-10">
                            <CardTitle>
                                {currentStep === 1 && "Start with the basics"}
                                {currentStep === 2 && "Tell us about the role"}
                                {currentStep === 3 && "Who is eligible?"}
                                {currentStep === 4 && "Customize Application"}
                                {currentStep === 5 && "Review & Publish"}
                            </CardTitle>
                            <CardDescription>
                                {currentStep === 1 && "Title, location, and salary information."}
                                {currentStep === 2 && "Detailed description and extensive requirements."}
                                {currentStep === 3 && "Set strict filters to get the best candidates."}
                                {currentStep === 4 && "Add custom questions to your application form."}
                                {currentStep === 5 && "Double check everything before going live."}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
                            <AnimatePresence mode="wait">
                                {/* STEP 1: BASICS */}
                                {currentStep === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>Job Title <span className="text-red-500">*</span></Label>
                                            <Input
                                                placeholder="e.g. Senior Product Designer"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Work Mode</Label>
                                                <Select value={formData.workMode} onValueChange={(v) => setFormData({ ...formData, workMode: v })}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="On-site">On-site</SelectItem>
                                                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                                                        <SelectItem value="Remote">Remote</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Employment Type</Label>
                                                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                                        <SelectItem value="Contract">Contract</SelectItem>
                                                        <SelectItem value="Internship">Internship</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input
                                                placeholder="e.g. New York, NY"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Salary Range</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="e.g. 5-8 LPA or 20k-30k"
                                                        value={formData.salary}
                                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                                    />
                                                    <Select value={formData.salaryDuration} onValueChange={(v) => setFormData({ ...formData, salaryDuration: v })}>
                                                        <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="year">Per Year</SelectItem>
                                                            <SelectItem value="month">Per Month</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Application Deadline <span className="text-red-500">*</span></Label>
                                                <Input
                                                    type="date"
                                                    value={formData.applicationDeadline}
                                                    onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Working Days</Label>
                                                <Input
                                                    placeholder="e.g. 5 Days (Mon-Fri)"
                                                    value={formData.workDays}
                                                    onChange={(e) => setFormData({ ...formData, workDays: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Working Hours</Label>
                                                <Input
                                                    placeholder="e.g. 9:00 AM - 6:00 PM"
                                                    value={formData.workHours}
                                                    onChange={(e) => setFormData({ ...formData, workHours: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Company Logo (Optional)</Label>
                                            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) setLogoFile(file);
                                                    }}
                                                />
                                                {logoFile ? (
                                                    <div className="text-center">
                                                        <p className="text-sm font-medium text-green-600 mb-1">Logo Selected</p>
                                                        <p className="text-xs text-slate-500">{logoFile.name}</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                                                        <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG (max 2MB)</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 2: DETAILS */}
                                {currentStep === 2 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>Job Description <span className="text-red-500">*</span></Label>
                                            <Textarea
                                                className="min-h-[200px]"
                                                placeholder="Describe the role, team, and responsibilities..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Key Requirements (One per line)</Label>
                                            <Textarea
                                                className="min-h-[150px]"
                                                placeholder="• Bachelor's degree in CS&#10;• 5+ years React experience"
                                                value={formData.requirements}
                                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tags</Label>
                                            <SmartAutocomplete
                                                type="skills"
                                                placeholder="Add tags (skills, tools)..."
                                                onSelect={(val) => {
                                                    if (!formData.tags.includes(val)) {
                                                        setFormData({ ...formData, tags: [...formData.tags, val] })
                                                    }
                                                }}
                                            />
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {formData.tags.map(tag => (
                                                    <Badge key={tag} variant="secondary" className="px-3 py-1">
                                                        {tag}
                                                        <button
                                                            onClick={() => setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })}
                                                            className="ml-2 hover:text-red-500"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 3: ELIGIBILITY */}
                                {currentStep === 3 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 mb-4">
                                            Applicants who don't match these strict criteria will be automatically filtered.
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Minimum Experience (Years)</Label>
                                            <div className="flex items-center gap-4">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="20"
                                                    className="w-24"
                                                    value={formData.minExperience}
                                                    onChange={(e) => setFormData({ ...formData, minExperience: Number(e.target.value) })}
                                                />
                                                <span className="text-slate-500">years of relevant experience</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Minimum Education</Label>
                                            <Select value={formData.minEducation} onValueChange={(v) => setFormData({ ...formData, minEducation: v })}>
                                                <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Any">Any</SelectItem>
                                                    <SelectItem value="Bachelors">Bachelor's Degree</SelectItem>
                                                    <SelectItem value="Masters">Master's Degree</SelectItem>
                                                    <SelectItem value="PhD">PhD</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Mandatory Skills</Label>
                                            <SmartAutocomplete
                                                type="skills"
                                                placeholder="Add required skills..."
                                                onSelect={(val) => {
                                                    if (!formData.requiredSkills.includes(val)) {
                                                        setFormData({ ...formData, requiredSkills: [...formData.requiredSkills, val] })
                                                    }
                                                }}
                                            />
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {formData.requiredSkills.length === 0 && <span className="text-sm text-slate-400 italic">No mandatory skills added.</span>}
                                                {formData.requiredSkills.map(skill => (
                                                    <Badge key={skill} className="px-3 py-1 bg-slate-900 text-white">
                                                        {skill}
                                                        <button
                                                            onClick={() => setFormData({ ...formData, requiredSkills: formData.requiredSkills.filter(s => s !== skill) })}
                                                            className="ml-2 hover:text-red-400"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 4: CUSTOM FORM */}
                                {currentStep === 4 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
                                            <h3 className="font-semibold text-slate-900 mb-2">Standard Application Fields</h3>
                                            <p className="text-sm text-slate-500 mb-4">These fields are collected from every candidate automatically.</p>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {["Full Name", "Email Address", "Phone Number", "Resume / CV", "Portfolio Link", "LinkedIn Profile"].map((field) => (
                                                    <div key={field} className="flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-100 shadow-sm">
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                        {field}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-slate-800">Additional Custom Questions</h3>
                                            <Button size="sm" variant="outline" onClick={addCustomQuestion}>
                                                <Plus className="w-4 h-4 mr-2" /> Add Question
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            {formData.customQuestions.length === 0 && (
                                                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                                                    <p className="text-slate-500">No custom questions added.</p>
                                                    <p className="text-xs text-slate-400">Candidates will only submit their resume and contact info.</p>
                                                </div>
                                            )}

                                            {formData.customQuestions.map((q, index) => (
                                                <div key={q.id} className="border border-slate-200 rounded-lg p-4 bg-white relative group">
                                                    <button
                                                        onClick={() => removeCustomQuestion(q.id)}
                                                        className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>

                                                    <div className="grid gap-4">
                                                        <div className="flex gap-4">
                                                            <div className="flex-1">
                                                                <Label className="text-xs text-slate-500">Question Text</Label>
                                                                <Input
                                                                    value={q.question}
                                                                    onChange={(e) => updateCustomQuestion(q.id, "question", e.target.value)}
                                                                    placeholder="e.g. Why do you want to work here?"
                                                                    className="mt-1"
                                                                />
                                                            </div>
                                                            <div className="w-32">
                                                                <Label className="text-xs text-slate-500">Type</Label>
                                                                <Select
                                                                    value={q.type}
                                                                    onValueChange={(v) => updateCustomQuestion(q.id, "type", v)}
                                                                >
                                                                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="text">Text Answer</SelectItem>
                                                                        <SelectItem value="file">File Upload</SelectItem>
                                                                        <SelectItem value="boolean">Yes/No</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                checked={q.isRequired}
                                                                onCheckedChange={(checked) => updateCustomQuestion(q.id, "isRequired", checked)}
                                                            />
                                                            <span className="text-sm text-slate-600">Required</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* STEP 5: REVIEW */}
                                {currentStep === 5 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                            <h2 className="text-2xl font-bold mb-1">{formData.title}</h2>
                                            <div className="flex gap-2 text-sm text-slate-500 mb-6">
                                                <span>{formData.location}</span> • <span>{formData.type}</span> • <span>{formData.workMode}</span>
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="font-semibold mb-2">About the Role</h3>
                                                    <p className="text-slate-700 whitespace-pre-wrap">{formData.description || "No description provided."}</p>
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold mb-2">Requirements</h3>
                                                    <ul className="list-disc list-inside text-slate-700">
                                                        {formData.requirements ? formData.requirements.split("\n").map(((req, i) => (
                                                            <li key={i}>{req}</li>
                                                        ))) : <li>No specific requirements.</li>}
                                                    </ul>
                                                </div>

                                                <div className="border-t pt-4 grid grid-cols-2 gap-8">
                                                    <div>
                                                        <h3 className="font-semibold mb-2 text-sm text-slate-400 uppercase">Eligibility</h3>
                                                        <div className="text-sm space-y-1">
                                                            <div>Experience: <span className="font-medium">{formData.minExperience}+ years</span></div>
                                                            <div>Education: <span className="font-medium">{formData.minEducation || "Any"}</span></div>
                                                            <div>
                                                                Skills: {formData.requiredSkills.length > 0 ? formData.requiredSkills.join(", ") : "None mandatory"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold mb-2 text-sm text-slate-400 uppercase">Application</h3>
                                                        <div className="text-sm">
                                                            {formData.customQuestions.length} custom questions configured.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>

                        <CardFooter className="border-t border-slate-100 p-6 bg-slate-50/50 flex justify-between">
                            <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1}>
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back
                            </Button>

                            <Button
                                onClick={handleNext}
                                disabled={isLoading}
                                className={currentStep === 5 ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"}
                            >
                                {currentStep === 5 ? (
                                    <>{isLoading ? "Publishing..." : "Publish Job Post"}</>
                                ) : (
                                    <>Next Step <ChevronRight className="w-4 h-4 ml-2" /></>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
