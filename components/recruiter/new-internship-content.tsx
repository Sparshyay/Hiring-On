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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Plus, X, CheckCircle2, Loader2 } from "lucide-react";
import { SmartAutocomplete } from "@/components/shared/smart-autocomplete";
import { toast } from "sonner";

// Steps Enum
enum PostInternshipStep {
    BASICS = 1,
    DETAILS = 2,
    ELIGIBILITY = 3,
    CUSTOM_FORM = 4,
    REVIEW = 5
}

export function PostInternshipContent() {
    const router = useRouter();
    const createInternship = useMutation(api.internships.create);
    const companies = useQuery(api.companies.search, { query: "" }) || [];

    const [currentStep, setCurrentStep] = useState<PostInternshipStep>(PostInternshipStep.BASICS);
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
        stipend: "",
        duration: "3 Months",
        workDays: "5 Days",
        workHours: "Flexible",
        applicationDeadline: "", // YYYY-MM-DD
        tags: [] as string[],

        // Details
        description: "",
        requirements: "", // Line separated

        // Eligibility
        minEducation: "",
        requiredSkills: [] as string[],

        // Custom Form
        customQuestions: [] as Array<{
            id: string;
            question: string;
            type: "text" | "file" | "boolean" | "mcq";
            isRequired: boolean;
            options?: string[];
        }>
    });

    const validateStep = (step: PostInternshipStep): boolean => {
        switch (step) {
            case PostInternshipStep.BASICS:
                if (!formData.title.trim()) { toast.error("Job Title is required"); return false; }
                if (!formData.location.trim()) { toast.error("Location is required"); return false; }
                if (!formData.stipend.trim()) { toast.error("Stipend is required"); return false; }
                if (!formData.applicationDeadline) { toast.error("Application Deadline is required"); return false; }
                return true;
            case PostInternshipStep.DETAILS:
                if (!formData.description.trim() || formData.description.length < 50) {
                    toast.error("Please provide a detailed description (min 50 chars)");
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) return;
        if (currentStep < PostInternshipStep.REVIEW) {
            setCurrentStep(current => current + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > PostInternshipStep.BASICS) {
            setCurrentStep(current => current - 1);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const companyIdToUse = formData.companyId || (companies.length > 0 ? companies[0]._id : "");

            if (!companyIdToUse) {
                toast.error("Please select a company (or ensure one exists)");
                setIsLoading(false);
                return;
            }

            // Upload Logo
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

            const requirementsList = formData.requirements
                .split("\n")
                .map(line => line.trim())
                .filter(line => line.length > 0);

            await createInternship({
                title: formData.title,
                location: formData.location,
                type: formData.type,
                workMode: formData.workMode,
                stipend: formData.stipend,
                duration: formData.duration,

                applicationDeadline: new Date(formData.applicationDeadline).getTime(),
                workDays: formData.workDays,
                workHours: formData.workHours,

                description: formData.description,
                requirements: requirementsList,
                tags: formData.tags,

                minEducation: formData.minEducation,
                requiredSkills: formData.requiredSkills,

                customApplyForm: formData.customQuestions,
                companyLogo: logoStorageId,
            });

            toast.success("Internship posted successfully!");
            router.push("/recruiter/internships");
        } catch (error) {
            console.error("Failed to post internship:", error);
            toast.error("Failed to post internship. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper functions
    const addCustomQuestion = () => {
        setFormData(prev => ({
            ...prev,
            customQuestions: [
                ...prev.customQuestions,
                { id: crypto.randomUUID(), question: "", type: "text", isRequired: false }
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
                        <h1 className="text-2xl font-bold text-slate-900">Post a New Internship</h1>
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
                    {/* Sidebar Navigation */}
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
                        </CardHeader>

                        <CardContent className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
                            <AnimatePresence mode="wait">
                                {/* STEP 1: BASICS */}
                                {currentStep === 1 && (
                                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>Internship Title <span className="text-red-500">*</span></Label>
                                            <Input
                                                placeholder="e.g. React Native Intern"
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
                                                <Label>Type</Label>
                                                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Duration</Label>
                                                <Input
                                                    placeholder="e.g. 3 Months"
                                                    value={formData.duration}
                                                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Stipend</Label>
                                                <Input
                                                    placeholder="e.g. ₹15,000 / month"
                                                    value={formData.stipend}
                                                    onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input
                                                placeholder="e.g. Bangalore, India"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
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
                                            <Label>Role Description <span className="text-red-500">*</span></Label>
                                            <Textarea
                                                className="min-h-[200px]"
                                                placeholder="Describe the role and responsibilities..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Key Requirements (One per line)</Label>
                                            <Textarea
                                                className="min-h-[150px]"
                                                placeholder="- React.js knowledge&#10;- Git proficiency"
                                                value={formData.requirements}
                                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tags</Label>
                                            <SmartAutocomplete
                                                type="skills"
                                                placeholder="Add tags..."
                                                onSelect={(val) => {
                                                    if (!formData.tags.includes(val)) setFormData({ ...formData, tags: [...formData.tags, val] })
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
                                        <div className="space-y-2">
                                            <Label>Minimum Education</Label>
                                            <Select value={formData.minEducation} onValueChange={(v) => setFormData({ ...formData, minEducation: v })}>
                                                <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Any">Any</SelectItem>
                                                    <SelectItem value="High School">High School</SelectItem>
                                                    <SelectItem value="Undergraduate">Undergraduate (Pursuing)</SelectItem>
                                                    <SelectItem value="Graduate">Graduate</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Mandatory Skills</Label>
                                            <SmartAutocomplete
                                                type="skills"
                                                placeholder="Add required skills..."
                                                onSelect={(val) => {
                                                    if (!formData.requiredSkills.includes(val)) setFormData({ ...formData, requiredSkills: [...formData.requiredSkills, val] })
                                                }}
                                            />
                                            <div className="flex flex-wrap gap-2 mt-2">
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
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold text-slate-800">Additional Questions</h3>
                                            <Button size="sm" variant="outline" onClick={addCustomQuestion}>
                                                <Plus className="w-4 h-4 mr-2" /> Add Question
                                            </Button>
                                        </div>
                                        <div className="space-y-4">
                                            {formData.customQuestions.map((q) => (
                                                <div key={q.id} className="border border-slate-200 rounded-lg p-4 bg-white relative group">
                                                    <button onClick={() => removeCustomQuestion(q.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <div className="grid gap-4">
                                                        <Input
                                                            value={q.question}
                                                            onChange={(e) => updateCustomQuestion(q.id, "question", e.target.value)}
                                                            placeholder="Question text..."
                                                        />
                                                        <div className="flex items-center gap-4">
                                                            <Select value={q.type} onValueChange={(v) => updateCustomQuestion(q.id, "type", v)}>
                                                                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="text">Text</SelectItem>
                                                                    <SelectItem value="file">File</SelectItem>
                                                                    <SelectItem value="boolean">Yes/No</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <div className="flex items-center gap-2">
                                                                <Switch checked={q.isRequired} onCheckedChange={(checked) => updateCustomQuestion(q.id, "isRequired", checked)} />
                                                                <span className="text-sm">Required</span>
                                                            </div>
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
                                                <span>{formData.location}</span> • <span>{formData.stipend}</span> • <span>{formData.duration}</span>
                                            </div>
                                            <div className="space-y-6">
                                                <div><h3 className="font-semibold mb-2">Description</h3><p className="text-slate-700 whitespace-pre-wrap">{formData.description}</p></div>
                                                <div><h3 className="font-semibold mb-2">Requirements</h3><ul className="list-disc list-inside text-slate-700">{formData.requirements.split("\n").map(((req, i) => <li key={i}>{req}</li>))}</ul></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>

                        <CardFooter className="border-t border-slate-100 p-6 bg-slate-50/50 flex justify-between">
                            <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1}><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
                            <Button onClick={handleNext} disabled={isLoading} className={currentStep === 5 ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"}>
                                {currentStep === 5 ? (isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</> : "Publish Internship") : <>Next Step <ChevronRight className="w-4 h-4 ml-2" /></>}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
