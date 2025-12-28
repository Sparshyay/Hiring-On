"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/nextjs";
import { FileText, Download, User, Briefcase, GraduationCap, Mail, Phone, MapPin, Loader2, CheckCircle2, ChevronRight, Settings, Plus, Trash2, GripVertical } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RESUME_ROLES, EXPERIENCE_LEVELS, RESUME_TYPES, getResumeConfig } from "@/lib/resume-config";
import { cn } from "@/lib/utils";

// Mock User Data (Expanded)
// Initial Empty State
const MOCK_PROFILE = {
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    skills: ["Your Skill 1", "Your Skill 2"], // minimal placeholder
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    portfolio: ""
};

export default function ResumeBuilderPage() {
    const { user: clerkUser } = useUser();

    // Configuration State
    const [configStep, setConfigStep] = useState(1); // 1: Config, 2: Editor
    const [selectedRole, setSelectedRole] = useState<string>(RESUME_ROLES[0].id);
    const [selectedLevel, setSelectedLevel] = useState<string>(EXPERIENCE_LEVELS[0].id);
    const [selectedType, setSelectedType] = useState<string>(RESUME_TYPES[0].id);

    // Data State
    const [resumeData, setResumeData] = useState<any>(MOCK_PROFILE);
    const [isGenerating, setIsGenerating] = useState(false);

    // Dynamic Config
    const [activeConfig, setActiveConfig] = useState(getResumeConfig(selectedRole, selectedLevel, selectedType));
    const resumeRef = useRef<HTMLDivElement>(null);

    // Update config when selections change
    useEffect(() => {
        setActiveConfig(getResumeConfig(selectedRole, selectedLevel, selectedType));
    }, [selectedRole, selectedLevel, selectedType]);

    const handleDownload = async () => {
        if (!resumeRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(resumeRef.current, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${resumeData.name.replace(/\s+/g, "_")}_Resume.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Helper to update array items (simple strings)
    const handleArrayChange = (field: string, index: number, value: string) => {
        const newArray = [...resumeData[field]];
        newArray[index] = value;
        setResumeData({ ...resumeData, [field]: newArray });
    };

    const addArrayItem = (field: string) => {
        setResumeData({ ...resumeData, [field]: [...(resumeData[field] || []), "New Item"] });
    };

    const removeArrayItem = (field: string, index: number) => {
        const newArray = [...resumeData[field]];
        newArray.splice(index, 1);
        setResumeData({ ...resumeData, [field]: newArray });
    };

    // Helper to update complex array items (objects)
    const handleComplexArrayChange = (field: string, index: number, key: string, value: string) => {
        const newArray = [...resumeData[field]];
        newArray[index] = { ...newArray[index], [key]: value };
        setResumeData({ ...resumeData, [field]: newArray });
    };

    const addComplexItem = (field: string, template: any) => {
        setResumeData({ ...resumeData, [field]: [...(resumeData[field] || []), template] });
    };

    const removeComplexItem = (field: string, index: number) => {
        const newArray = [...resumeData[field]];
        newArray.splice(index, 1);
        setResumeData({ ...resumeData, [field]: newArray });
    };


    // Render Dynamic Editor Sections
    const renderEditorSection = (sectionId: string) => {
        const label = activeConfig.labels[sectionId] || sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

        switch (sectionId) {
            case "skills":
                return (
                    <div key={sectionId} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">{label}</h3>
                            <Button variant="ghost" size="sm" onClick={() => addArrayItem("skills")} className="h-6 w-6 p-0 rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                                <Plus className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {resumeData.skills?.map((skill: string, i: number) => (
                                <div key={i} className="flex group relative">
                                    <Input
                                        value={skill}
                                        onChange={(e) => handleArrayChange("skills", i, e.target.value)}
                                        className="h-8 text-xs bg-white min-w-[100px]"
                                    />
                                    <button
                                        onClick={() => removeArrayItem("skills", i)}
                                        className="absolute -top-1 -right-1 bg-white text-red-500 rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case "experience":
                return (
                    <div key={sectionId} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">{label}</h3>
                            <Button variant="ghost" size="sm" onClick={() => addComplexItem("experience", { role: "Role", company: "Company", duration: "Duration", description: "Description" })} className="text-primary text-xs hover:bg-primary/5">
                                <Plus className="w-3 h-3 mr-1" /> Add
                            </Button>
                        </div>
                        {resumeData.experience?.map((exp: any, i: number) => (
                            <Card key={i} className="p-3 bg-white space-y-2 relative group">
                                <button
                                    onClick={() => removeComplexItem("experience", i)}
                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input value={exp.role} onChange={(e) => handleComplexArrayChange("experience", i, "role", e.target.value)} placeholder="Role" className="h-8 text-xs" />
                                    <Input value={exp.company} onChange={(e) => handleComplexArrayChange("experience", i, "company", e.target.value)} placeholder="Company" className="h-8 text-xs" />
                                    <Input value={exp.duration} onChange={(e) => handleComplexArrayChange("experience", i, "duration", e.target.value)} placeholder="Duration" className="h-8 text-xs col-span-2" />
                                </div>
                                <Textarea value={exp.description} onChange={(e) => handleComplexArrayChange("experience", i, "description", e.target.value)} placeholder="Description" className="min-h-[60px] text-xs" />
                            </Card>
                        ))}
                    </div>
                );

            case "education":
                return (
                    <div key={sectionId} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">{label}</h3>
                            <Button variant="ghost" size="sm" onClick={() => addComplexItem("education", { degree: "Degree", school: "School / University", year: "Year" })} className="text-primary text-xs hover:bg-primary/5">
                                <Plus className="w-3 h-3 mr-1" /> Add
                            </Button>
                        </div>
                        {resumeData.education?.map((edu: any, i: number) => (
                            <Card key={i} className="p-3 bg-white space-y-2 relative group">
                                <button
                                    onClick={() => removeComplexItem("education", i)}
                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <div className="grid grid-cols-1 gap-2">
                                    <Input value={edu.degree} onChange={(e) => handleComplexArrayChange("education", i, "degree", e.target.value)} placeholder="Degree" className="h-8 text-xs" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input value={edu.school} onChange={(e) => handleComplexArrayChange("education", i, "school", e.target.value)} placeholder="School" className="h-8 text-xs" />
                                        <Input value={edu.year} onChange={(e) => handleComplexArrayChange("education", i, "year", e.target.value)} placeholder="Year" className="h-8 text-xs" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                );

            case "projects":
                return (
                    <div key={sectionId} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">{label}</h3>
                            <Button variant="ghost" size="sm" onClick={() => addComplexItem("projects", { title: "Project Title", description: "Description" })} className="text-primary text-xs hover:bg-primary/5">
                                <Plus className="w-3 h-3 mr-1" /> Add
                            </Button>
                        </div>
                        {resumeData.projects?.map((proj: any, i: number) => (
                            <Card key={i} className="p-3 bg-white space-y-2 relative group">
                                <button
                                    onClick={() => removeComplexItem("projects", i)}
                                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <Input value={proj.title} onChange={(e) => handleComplexArrayChange("projects", i, "title", e.target.value)} placeholder="Project Title" className="h-8 text-xs" />
                                <Textarea value={proj.description} onChange={(e) => handleComplexArrayChange("projects", i, "description", e.target.value)} placeholder="Description" className="min-h-[60px] text-xs" />
                            </Card>
                        ))}
                    </div>
                );

            case "certifications":
                return (
                    <div key={sectionId} className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">{label}</h3>
                            <Button variant="ghost" size="sm" onClick={() => addArrayItem("certifications")} className="h-6 w-6 p-0 rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                                <Plus className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            {resumeData.certifications?.map((cert: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 group">
                                    <Input
                                        value={cert}
                                        onChange={(e) => handleArrayChange("certifications", i, e.target.value)}
                                        className="h-8 text-xs bg-white"
                                    />
                                    <button
                                        onClick={() => removeArrayItem("certifications", i)}
                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "portfolio":
                return (
                    <div key={sectionId} className="space-y-2">
                        <h3 className="text-sm font-bold text-slate-900">{label}</h3>
                        <Input
                            value={resumeData.portfolio}
                            onChange={(e) => setResumeData({ ...resumeData, portfolio: e.target.value })}
                            placeholder="Portfolio URL"
                            className="h-9"
                        />
                    </div>
                )

            default:
                return null;
        }
    };

    // Render Section Content (For Preview)
    const renderSectionContent = (sectionId: string) => {
        const labels = activeConfig.labels;
        switch (sectionId) {
            case "summary":
                return (
                    <section key={sectionId} className="mb-4">
                        <h2 className={cn("text-sm font-bold uppercase tracking-wider mb-2", selectedType === 'modern' ? "text-slate-500" : "text-slate-900 border-b-2 border-slate-900 pb-1")}>
                            {labels.summary || "Summary"}
                        </h2>
                        <p className="text-sm leading-relaxed text-slate-700">{resumeData.summary}</p>
                    </section>
                );
            case "skills":
                return resumeData.skills && resumeData.skills.length > 0 ? (
                    <section key={sectionId} className="mb-4">
                        <h2 className={cn("text-sm font-bold uppercase tracking-wider mb-2", selectedType === 'modern' ? "text-slate-500" : "text-slate-900 border-b-2 border-slate-900 pb-1")}>
                            {labels.skills || "Skills"}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill: string, i: number) => (
                                <span key={i} className={cn("text-xs font-semibold", selectedType === 'modern' ? "bg-slate-100 text-slate-700 px-2 py-1 rounded" : "text-slate-800 border border-slate-300 px-2 py-0.5 rounded-sm")}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                ) : null;
            case "experience":
                return resumeData.experience && resumeData.experience.length > 0 ? (
                    <section key={sectionId} className="mb-4">
                        <h2 className={cn("text-sm font-bold uppercase tracking-wider mb-3", selectedType === 'modern' ? "text-slate-500" : "text-slate-900 border-b-2 border-slate-900 pb-1")}>
                            {labels.experience || "Experience"}
                        </h2>
                        <div className="space-y-4">
                            {resumeData.experience.map((exp: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-slate-900 text-sm">{exp.role}</h3>
                                        <span className="text-xs font-semibold text-slate-500">{exp.duration}</span>
                                    </div>
                                    <p className="text-sm font-medium text-primary mb-1">{exp.company}</p>
                                    <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;
            case "projects":
                return resumeData.projects && resumeData.projects.length > 0 ? (
                    <section key={sectionId} className="mb-4">
                        <h2 className={cn("text-sm font-bold uppercase tracking-wider mb-3", selectedType === 'modern' ? "text-slate-500" : "text-slate-900 border-b-2 border-slate-900 pb-1")}>
                            {labels.projects || "Projects"}
                        </h2>
                        <div className="space-y-3">
                            {resumeData.projects.map((proj: any, i: number) => (
                                <div key={i}>
                                    <h3 className="font-bold text-slate-900 text-sm">{proj.title}</h3>
                                    <p className="text-xs text-slate-600">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;
            case "education":
                return resumeData.education && resumeData.education.length > 0 ? (
                    <section key={sectionId} className="mb-4">
                        <h2 className={cn("text-sm font-bold uppercase tracking-wider mb-3", selectedType === 'modern' ? "text-slate-500" : "text-slate-900 border-b-2 border-slate-900 pb-1")}>
                            Education
                        </h2>
                        {resumeData.education.map((edu: any, i: number) => (
                            <div key={i} className="mb-2">
                                <h3 className="font-bold text-slate-900 text-sm">{edu.degree}</h3>
                                <p className="text-xs text-slate-600">{edu.school} • {edu.year}</p>
                            </div>
                        ))}
                    </section>
                ) : null;
            case "portfolio":
                return resumeData.portfolio ? (
                    <section key={sectionId} className="mb-4">
                        <h2 className={cn("text-sm font-bold uppercase tracking-wider mb-2", selectedType === 'modern' ? "text-slate-500" : "text-slate-900 border-b-2 border-slate-900 pb-1")}>
                            Portfolio
                        </h2>
                        <a href={resumeData.portfolio} target="_blank" className="text-sm text-blue-600 underline">{resumeData.portfolio}</a>
                    </section>
                ) : null;
            case "certifications":
                return resumeData.certifications && resumeData.certifications.length > 0 ? (
                    <section key={sectionId} className="mb-4">
                        <h2 className={cn("text-sm font-bold uppercase tracking-wider mb-2", selectedType === 'modern' ? "text-slate-500" : "text-slate-900 border-b-2 border-slate-900 pb-1")}>
                            Certifications
                        </h2>
                        <ul className="list-disc list-inside text-xs text-slate-600">
                            {resumeData.certifications.map((cert: string, i: number) => <li key={i}>{cert}</li>)}
                        </ul>
                    </section>
                ) : null;
            default:
                return null;
        }
    };

    // 1. Configuration Wizard View
    if (configStep === 1) {
        return (
            <div className="min-h-screen bg-slate-50 py-12 px-4 flex items-center justify-center">
                <Card className="max-w-5xl w-full p-8 md:p-12 shadow-2xl border-0 rounded-3xl bg-white/80 backdrop-blur-xl">
                    <div className="text-center mb-12 max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Build Your Perfect Resume</h1>
                        <p className="text-slate-500 text-lg leading-relaxed">
                            Select your role and experience level to generate a tailored resume template that passes ATS checks and impresses recruiters.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {/* Role Selection */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">1</div>
                                <h3 className="text-xl font-bold text-slate-900">What is your target role?</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {RESUME_ROLES.map(role => (
                                    <div
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        className={cn(
                                            "cursor-pointer p-5 rounded-xl border-2 transition-all hover:shadow-lg relative group",
                                            selectedRole === role.id
                                                ? "border-primary bg-primary/5 shadow-md"
                                                : "border-slate-100 bg-white hover:border-slate-300"
                                        )}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className={cn("p-2 rounded-lg", selectedRole === role.id ? "bg-primary/20" : "bg-slate-100 group-hover:bg-slate-200")}>
                                                <Briefcase className={cn("w-5 h-5", selectedRole === role.id ? "text-primary" : "text-slate-600")} />
                                            </div>
                                            {selectedRole === role.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                                        </div>
                                        <div className="font-bold text-slate-900 mb-1">{role.label}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold opacity-70">{role.category}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Experience Level */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">2</div>
                                    <h3 className="text-xl font-bold text-slate-900">Experience Level</h3>
                                </div>
                                <div className="space-y-3">
                                    {EXPERIENCE_LEVELS.map(level => (
                                        <div
                                            key={level.id}
                                            onClick={() => setSelectedLevel(level.id)}
                                            className={cn(
                                                "cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between group",
                                                selectedLevel === level.id
                                                    ? "border-primary bg-primary/5 shadow-sm"
                                                    : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm"
                                            )}
                                        >
                                            <span className="font-semibold text-slate-900">{level.label}</span>
                                            {selectedLevel === level.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resume Type */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">3</div>
                                    <h3 className="text-xl font-bold text-slate-900">Resume Style</h3>
                                </div>
                                <div className="space-y-3">
                                    {RESUME_TYPES.map(type => (
                                        <div
                                            key={type.id}
                                            onClick={() => setSelectedType(type.id)}
                                            className={cn(
                                                "cursor-pointer p-4 rounded-xl border-2 transition-all group",
                                                selectedType === type.id
                                                    ? "border-primary bg-primary/5 shadow-sm"
                                                    : "border-slate-100 bg-white hover:border-slate-300 hover:shadow-sm"
                                            )}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-bold text-slate-900">{type.label}</span>
                                                {selectedType === type.id && <CheckCircle2 className="w-5 h-5 text-primary" />}
                                            </div>
                                            <p className="text-xs text-slate-500">{type.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-8 border-t border-slate-100 mt-8">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-orange-600 text-white shadow-lg shadow-orange-200 rounded-full px-8 h-12 text-base font-semibold transition-transform hover:scale-105 active:scale-95"
                            onClick={() => setConfigStep(2)}
                        >
                            Next: Edit & Preview <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    // 2. Editor & View Mode
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-slate-900 leading-tight">Resume Builder</h1>
                            <p className="text-xs text-slate-500">
                                {RESUME_ROLES.find(r => r.id === selectedRole)?.label} • {EXPERIENCE_LEVELS.find(l => l.id === selectedLevel)?.label}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => setConfigStep(1)}>
                            <Settings className="w-4 h-4 mr-2" /> Change Config
                        </Button>
                        <Button onClick={handleDownload} disabled={isGenerating} className="bg-primary hover:bg-orange-600 text-white gap-2">
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            Download PDF
                        </Button>
                    </div>
                </div>
            </header>

            <div className="flex-1 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 overflow-hidden h-full">
                {/* Editor Panel */}
                <Card className="w-full lg:w-1/3 flex flex-col max-h-[calc(100vh-8rem)] overflow-y-auto">
                    <div className="p-4 border-b bg-slate-50/50">
                        <h2 className="font-semibold text-slate-800">Editor</h2>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900">Personal Info</h3>
                                <div className="grid gap-3">
                                    <Input value={resumeData.name} onChange={(e) => setResumeData({ ...resumeData, name: e.target.value })} placeholder="Full Name" />
                                    <Input value={resumeData.email} onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })} placeholder="Email" />
                                    <Input value={resumeData.phone} onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })} placeholder="Phone" />
                                    <Input value={resumeData.location} onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })} placeholder="Location" />
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-700">{activeConfig.labels.summary || "Summary"}</label>
                                        <Textarea value={resumeData.summary} onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })} placeholder={activeConfig.placeholders.summary} className="h-24" />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-200" />

                            {/* Dynamic Sections */}
                            {activeConfig.sections.map(sectionId => {
                                if (sectionId === 'header' || sectionId === 'summary') return null; // Already specialized above
                                return renderEditorSection(sectionId);
                            })}

                        </div>
                    </ScrollArea>
                </Card>

                {/* Preview Panel */}
                <div className="flex-1 bg-slate-200/50 rounded-xl overflow-auto p-8 flex justify-center">
                    <div
                        ref={resumeRef}
                        className="bg-white shadow-xl w-[210mm] min-h-[297mm] p-[15mm] text-slate-900"
                        style={{ transform: "scale(0.85)", transformOrigin: "top center" }}
                    >
                        {/* Header is always first */}
                        <div className="border-b-2 border-slate-900 pb-6 mb-6">
                            <h1 className="text-4xl font-extrabold text-slate-900 uppercase tracking-tight">{resumeData.name}</h1>
                            <p className="text-xl text-primary font-medium mt-1">{RESUME_ROLES.find(r => r.id === selectedRole)?.label}</p>
                            <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600 font-medium">
                                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {resumeData.email}</span>
                                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {resumeData.phone}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {resumeData.location}</span>
                            </div>
                        </div>

                        {/* Dynamic Rendering of Sections */}
                        {activeConfig.sections.map(sectionId => {
                            if (sectionId === 'header') return null; // Already rendered
                            return renderSectionContent(sectionId);
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
