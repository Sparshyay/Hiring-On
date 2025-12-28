"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    User,
    FileText,
    Info,
    Zap,
    GraduationCap,
    Briefcase,
    Award,
    Share2,
    CheckCircle2,
    Camera,
    Pencil,
    Eye,
    ArrowLeft,
    Lightbulb,
    ChevronDown,
    Plus,
    X
} from "lucide-react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Ensure Textarea component exists, otherwise use standard textarea or Input with multiline if supported, or create it.
// Assuming ShadCN Textarea exists. If not, I'll fallback to standard.
import { cn } from "@/lib/utils";

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: any;
    onSave: (data: any) => Promise<void>;
    initialTab?: string;
}

const SECTIONS = [
    { id: "basic", label: "Basic Details", icon: CheckCircle2, required: true, completed: true },
    { id: "resume", label: "Resume", icon: CheckCircle2, completed: true },
    { id: "about", label: "About", icon: Info, required: true, completed: false },
    { id: "skills", label: "Skills", icon: Zap, required: true, completed: false },
    { id: "education", label: "Education", icon: GraduationCap, required: true, completed: false },
    { id: "experience", label: "Work Experience", icon: Briefcase, completed: false },
    { id: "accomplishments", label: "Accomplishments & Initiatives", icon: Award, completed: false },
    { id: "personal", label: "Personal Details", icon: User, completed: false },
    { id: "social", label: "Social Links", icon: Share2, completed: false },
];

export function EditProfileDialog({ open, onOpenChange, initialData, onSave, initialTab = "basic" }: EditProfileDialogProps) {
    const convex = useConvex();
    const [activeSection, setActiveSection] = useState(initialTab);
    const [formData, setFormData] = useState(initialData);
    const [isParsing, setIsParsing] = useState(false);
    const [parsedData, setParsedData] = useState<any>(null);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl w-full h-[90vh] p-0 gap-0 border-none bg-slate-50 flex flex-col focus:outline-none rounded-xl">

                {/* Modal Header */}
                <DialogHeader className="bg-white px-4 md:px-6 py-3 md:py-4 border-b flex flex-row items-center gap-4 shrink-0 space-y-0">
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full hover:bg-slate-100 -ml-2">
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </Button>
                    <DialogTitle className="text-lg md:text-xl font-bold text-slate-800">Edit Profile</DialogTitle>
                </DialogHeader>

                {/* MOBILE NAVIGATION tabs (Visible < md) */}
                <div className="md:hidden bg-white border-b px-4 py-2 overflow-x-auto scrollbar-hide flex gap-2 shrink-0">
                    {SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                                activeSection === section.id
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-slate-50 text-slate-600 border-slate-200"
                            )}
                        >
                            {/* Icon optional on mobile to save space, or keep it small */}
                            <section.icon className={cn("w-3.5 h-3.5", activeSection === section.id ? "text-white" : "text-slate-400")} />
                            {section.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* LEFT SIDEBAR - Scrollable - Desktop Only */}
                    <div className="hidden md:flex w-72 bg-white border-r flex-col h-full shrink-0 overflow-y-auto custom-scrollbar">
                        <div className="p-4 space-y-6">

                            {/* Blue Banner CTA */}
                            <div className="bg-blue-600 rounded-xl p-4 text-white flex items-center justify-between shadow-md relative overflow-hidden group cursor-pointer">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FileText className="w-4 h-4 text-blue-100" />
                                        <span className="font-semibold text-sm">Resume</span>
                                    </div>
                                    <p className="text-xs font-medium text-blue-100">Create your Resume</p>
                                </div>
                                <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                                    <Plus className="w-5 h-5" />
                                </div>
                                {/* Decorational circles */}
                                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full" />
                                <div className="absolute top-2 right-10 w-4 h-4 bg-white/10 rounded-full" />
                            </div>

                            {/* Progress Card */}
                            <div className="bg-slate-50 border rounded-xl p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 text-sm">Complete your Profile</h3>
                                    <span className="text-green-600 font-bold text-sm">75%</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
                                    Stay ahead of the competition by regularly updating your profile.
                                </p>
                                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[75%] rounded-full" />
                                </div>
                            </div>

                            {/* Navigation List */}
                            <div className="space-y-1">
                                {SECTIONS.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all group relative",
                                            activeSection === section.id
                                                ? "text-blue-600 bg-blue-50"
                                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                        )}
                                    >
                                        {/* Left Border Indicator for active state */}
                                        {activeSection === section.id && (
                                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-md" />
                                        )}

                                        <section.icon className={cn(
                                            "w-5 h-5 ml-2",
                                            activeSection === section.id ? "text-blue-600" : (section.completed ? "text-green-500" : "text-slate-300 group-hover:text-slate-400")
                                        )} />

                                        <span className="flex-1 text-left">{section.label}</span>

                                        {section.required && (
                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 border-orange-100">
                                                Required
                                            </Badge>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT CONTENT - Scrollable */}
                    <Tabs
                        value={activeSection}
                        onValueChange={setActiveSection}
                        className="flex-1 bg-slate-50 h-full overflow-y-auto relative flex flex-col"
                    >
                        <div className="max-w-4xl mx-auto p-6 md:p-10 pb-24 w-full flex-1">

                            {/* Section Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    <h2 className="text-xl font-bold text-slate-800">{SECTIONS.find(s => s.id === activeSection)?.label}</h2>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                                        <Eye className="w-5 h-5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                                        <Lightbulb className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            <TabsContent value="basic" className="m-0 space-y-0 focus:outline-none">
                                <div className="grid grid-cols-12 gap-8">
                                    {/* Avatar Column */}
                                    <div className="col-span-12 md:col-span-3 flex flex-col items-center">
                                        <div className="relative group">
                                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-red-500 flex items-center justify-center">
                                                <Avatar className="w-full h-full">
                                                    <AvatarImage src={formData.imageUrl} className="object-cover" />
                                                    <AvatarFallback className="bg-red-500 text-white text-4xl">
                                                        {formData.name?.[0] || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border cursor-pointer hover:bg-slate-50 transition-colors">
                                                <Camera className="w-4 h-4 text-slate-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Column */}
                                    <div className="col-span-12 md:col-span-9 space-y-6">
                                        {/* Name Row */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold text-slate-500">First Name <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={formData.name?.split(" ")[0] || ""}
                                                    onChange={(e) => handleChange("name", e.target.value + " " + (formData.name?.split(" ")[1] || ""))}
                                                    className="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold text-slate-500">Last Name</Label>
                                                <Input
                                                    value={formData.name?.split(" ")[1] || ""}
                                                    onChange={(e) => handleChange("name", (formData.name?.split(" ")[0] || "") + " " + e.target.value)}
                                                    className="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-500">Username <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={formData.username}
                                                onChange={(e) => handleChange("username", e.target.value)}
                                                className="h-11 bg-slate-50 border-slate-200 text-slate-500"
                                                readOnly
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between">
                                                <Label className="text-xs font-semibold text-slate-500">Email <span className="text-red-500">*</span></Label>
                                                <Button variant="link" className="p-0 h-auto text-xs text-blue-600">Update Email</Button>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    value={formData.email}
                                                    readOnly
                                                    className="h-11 bg-slate-50 border-slate-200 text-slate-500 pr-10"
                                                />
                                                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Domain</Label>
                                                <SearchableSelect
                                                    placeholder="Select Domain"
                                                    searchFetcher={async (q) => {
                                                        const domains = await convex.query(api.master_data.getDomains, {});
                                                        // Use _id as value to store ID for dependencies
                                                        return domains.map((d: any) => ({ value: d._id, label: d.name }));
                                                    }}
                                                    value={formData.domainId || formData.domain || ""} // Prioritize ID if valid, else string (will fail match but show text if consistent?) No, ID is better.
                                                    // Problem: If I bind to ID, Select shows Label of that ID.
                                                    // If initialData only has Name, I don't have ID.
                                                    // Compromise: Use Name as value, store ID in formData.
                                                    onSelect={(val, item) => {
                                                        handleChange("domain", item?.label);
                                                        handleChange("domainId", val);
                                                        // Reset dependents
                                                        handleChange("course", "");
                                                        handleChange("courseId", "");
                                                        handleChange("specialization", "");
                                                        handleChange("specializationId", "");
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Course</Label>
                                                <SearchableSelect
                                                    placeholder="Select Course"
                                                    disabled={!formData.domainId}
                                                    searchFetcher={async (q) => {
                                                        if (!formData.domainId) return [];
                                                        const courses = await convex.query(api.master_data.getCourses, { domainId: formData.domainId });
                                                        return courses.map((c: any) => ({ value: c._id, label: c.name }));
                                                    }}
                                                    value={formData.courseId || formData.course || ""}
                                                    onSelect={(val, item) => {
                                                        handleChange("course", item?.label);
                                                        handleChange("courseId", val);
                                                        handleChange("specialization", "");
                                                        handleChange("specializationId", "");
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Specialization</Label>
                                                <SearchableSelect
                                                    placeholder="Select Specialization"
                                                    disabled={!formData.courseId}
                                                    searchFetcher={async (q) => {
                                                        if (!formData.courseId) return [];
                                                        const specs = await convex.query(api.master_data.getSpecializations, { courseId: formData.courseId });
                                                        return specs
                                                            .filter((s: any) => s.name.toLowerCase().includes(q.toLowerCase()))
                                                            .map((s: any) => ({ value: s._id, label: s.name }));
                                                    }}
                                                    value={formData.specializationId || formData.specialization || ""}
                                                    onSelect={(val, item) => {
                                                        handleChange("specialization", item?.label);
                                                        handleChange("specializationId", val);
                                                    }}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Course Duration <span className="text-red-500">*</span></Label>
                                                <div className="flex gap-4">
                                                    <Select
                                                        value={formData.courseDuration?.startYear || ""}
                                                        onValueChange={(val) => handleChange("courseDuration", { ...(formData.courseDuration || {}), startYear: val })}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Start Year" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from({ length: 10 }, (_, i) => (2020 + i).toString()).map((year) => (
                                                                <SelectItem key={year} value={year}>{year}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <Select
                                                        value={formData.courseDuration?.endYear || ""}
                                                        onValueChange={(val) => handleChange("courseDuration", { ...(formData.courseDuration || {}), endYear: val })}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="End Year" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from({ length: 10 }, (_, i) => (2024 + i).toString()).map((year) => (
                                                                <SelectItem key={year} value={year}>{year}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Organisation / College <span className="text-red-500">*</span></Label>
                                                <SearchableSelect
                                                    placeholder="Search College/University..."
                                                    searchFetcher={async (q) => {
                                                        const results = await convex.query(api.master_data.searchUniversities, { query: q });
                                                        return results.map((u: any) => ({
                                                            value: u._id,
                                                            label: u.name,
                                                            description: `${u.city}`
                                                        }));
                                                    }}
                                                    value={formData.organization || ""}
                                                    onSelect={(val, item) => handleChange("organization", item?.label || val)}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Current Components (Role)</Label>
                                                <Select value={formData.role || ""} onValueChange={(val) => handleChange("role", val)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Student">Student</SelectItem>
                                                        <SelectItem value="Professional">Professional</SelectItem>
                                                        <SelectItem value="Freelancer">Freelancer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <Label>Bio</Label>
                                        <Textarea
                                            value={formData.bio}
                                            onChange={(e) => handleChange("bio", e.target.value)}
                                            placeholder="Tell us about yourself"
                                        />

                                        <div className="space-y-2">
                                            <Label>Career Goals</Label>
                                            <Textarea
                                                value={formData.careerGoals}
                                                onChange={(e) => handleChange("careerGoals", e.target.value)}
                                                placeholder="What are your long term career goals?"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Purpose</Label>
                                            <Select value={formData.purpose || ""} onValueChange={(val) => handleChange("purpose", val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Purpose" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="To find a job">To find a job</SelectItem>
                                                    <SelectItem value="To hire talent">To hire talent</SelectItem>
                                                    <SelectItem value="To offer mentorship">To offer mentorship</SelectItem>
                                                    <SelectItem value="To find a mentor">To find a mentor</SelectItem>
                                                    <SelectItem value="To network">To network</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Current Location</Label>
                                                <Input
                                                    value={formData.location}
                                                    onChange={(e) => handleChange("location", e.target.value)}
                                                    placeholder="City, Country"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Years of Experience</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.experience}
                                                    onChange={(e) => handleChange("experience", parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="education" className="space-y-4 m-0 focus:outline-none">
                                <div className="space-y-4 border p-4 rounded-md">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Qualification Level</Label>
                                            <Select
                                                value={formData.education?.[0]?.degree || ""}
                                                onValueChange={(val) => {
                                                    const currentEdu = formData.education || [{}];
                                                    currentEdu[0] = { ...currentEdu[0], degree: val };
                                                    handleChange("education", [...currentEdu]);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="High School (10th)">High School (10th)</SelectItem>
                                                    <SelectItem value="Intermediate (12th)">Intermediate (12th)</SelectItem>
                                                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                                                    <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                                                    <SelectItem value="PhD">PhD</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>University / Board</Label>
                                            <SearchableSelect
                                                placeholder="Search University..."
                                                searchFetcher={async (q) => {
                                                    const results = await convex.query(api.master_data.searchUniversities, { query: q });
                                                    return results.map((u: any) => ({
                                                        value: u._id,
                                                        label: u.name,
                                                        description: `${u.city}, ${u.state}`
                                                    }));
                                                }}
                                                value={formData.education?.[0]?.universityId || ""}
                                                onSelect={(val, item) => {
                                                    const currentEdu = formData.education || [{}];
                                                    currentEdu[0] = {
                                                        ...currentEdu[0],
                                                        universityName: item?.label,
                                                        universityId: val,
                                                        institution: ""
                                                    };
                                                    handleChange("education", [...currentEdu]);
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>College / Institute</Label>
                                            <SearchableSelect
                                                placeholder="Search College..."
                                                disabled={!formData.education?.[0]?.universityId}
                                                searchFetcher={async (q) => {
                                                    const uid = formData.education?.[0]?.universityId;
                                                    if (!uid) return [];
                                                    const results = await convex.query(api.master_data.searchColleges, { query: q, universityId: uid });
                                                    return results.map((c: any) => ({ value: c._id, label: c.name, description: c.city }));
                                                }}
                                                value={formData.education?.[0]?.institutionId || ""}
                                                onSelect={(val, item) => {
                                                    const currentEdu = formData.education || [{}];
                                                    currentEdu[0] = {
                                                        ...currentEdu[0],
                                                        institution: item?.label,
                                                        institutionId: val
                                                    };
                                                    handleChange("education", [...currentEdu]);
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Course / Degree</Label>
                                            <Input
                                                value={formData.education?.[0]?.course || ""}
                                                onChange={(e) => {
                                                    const currentEdu = formData.education || [{}];
                                                    currentEdu[0] = { ...currentEdu[0], course: e.target.value };
                                                    handleChange("education", [...currentEdu]);
                                                }}
                                                placeholder="e.g. B.Tech, MBA"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Specialization / Major</Label>
                                            <Input
                                                value={formData.education?.[0]?.specialization || ""}
                                                onChange={(e) => {
                                                    const currentEdu = formData.education || [{}];
                                                    currentEdu[0] = { ...currentEdu[0], specialization: e.target.value };
                                                    handleChange("education", [...currentEdu]);
                                                }}
                                                placeholder="e.g. Computer Science"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-2">
                                                <Label>Start Year</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.education?.[0]?.startYear || ""}
                                                    onChange={(e) => {
                                                        const currentEdu = formData.education || [{}];
                                                        currentEdu[0] = { ...currentEdu[0], startYear: e.target.value };
                                                        handleChange("education", [...currentEdu]);
                                                    }}
                                                    placeholder="e.g. 2019"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>End Year</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.education?.[0]?.endYear || ""}
                                                    onChange={(e) => {
                                                        const currentEdu = formData.education || [{}];
                                                        currentEdu[0] = { ...currentEdu[0], endYear: e.target.value };
                                                        handleChange("education", [...currentEdu]);
                                                    }}
                                                    placeholder="e.g. 2023"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="skills" className="space-y-4 m-0 focus:outline-none">
                                <div className="space-y-2">
                                    <Label>Skills</Label>
                                    <MultiSelect
                                        selected={formData.skills || []}
                                        onSelectedChange={(skills) => handleChange("skills", skills)}
                                        placeholder="Add skills (e.g. React, Node.js)..."
                                        allowCustom={true}
                                        searchFetcher={async (q) => {
                                            const results = await convex.query(api.master_data.searchSkills, { query: q });
                                            return results.map((s: any) => ({ value: s.name, label: s.name }));
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground">Type to search. Press Enter to add custom skills.</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="about" className="space-y-4 m-0 focus:outline-none">
                                <div className="space-y-2">
                                    <Label>About You</Label>
                                    <Textarea
                                        value={formData.bio || ""}
                                        onChange={(e) => handleChange("bio", e.target.value)}
                                        placeholder="Write a short professional summary..."
                                        className="min-h-[150px]"
                                    />
                                    <p className="text-xs text-muted-foreground">This will be displayed on your profile header.</p>
                                </div>
                            </TabsContent>

                            <TabsContent value="experience" className="space-y-4 m-0 focus:outline-none">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label>Work Experience</Label>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const currentExp = formData.experience || [];
                                                handleChange("experience", [...currentExp, {}]);
                                            }}
                                        >
                                            <Plus className="w-4 h-4 mr-2" /> Add Experience
                                        </Button>
                                    </div>

                                    {(formData.experience || []).map((exp: any, index: number) => (
                                        <div key={index} className="space-y-4 p-4 border rounded-xl relative group bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => {
                                                    const newExp = [...(formData.experience || [])];
                                                    newExp.splice(index, 1);
                                                    handleChange("experience", newExp);
                                                }}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground">Designation / Job Title</Label>
                                                    <Input
                                                        value={exp.designation || exp.jobTitle || ""}
                                                        onChange={(e) => {
                                                            const newExp = [...(formData.experience || [])];
                                                            newExp[index] = { ...newExp[index], designation: e.target.value };
                                                            handleChange("experience", newExp);
                                                        }}
                                                        placeholder="e.g. Senior Developer"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground">Company</Label>
                                                    <Input
                                                        value={exp.organisation || exp.company || ""}
                                                        onChange={(e) => {
                                                            const newExp = [...(formData.experience || [])];
                                                            newExp[index] = { ...newExp[index], organisation: e.target.value };
                                                            handleChange("experience", newExp);
                                                        }}
                                                        placeholder="e.g. Google"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground">Location</Label>
                                                    <Input
                                                        value={exp.location || ""}
                                                        onChange={(e) => {
                                                            const newExp = [...(formData.experience || [])];
                                                            newExp[index] = { ...newExp[index], location: e.target.value };
                                                            handleChange("experience", newExp);
                                                        }}
                                                        placeholder="City, Country"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">Start Date</Label>
                                                        <Input
                                                            value={exp.duration?.startDate || exp.startDate || ""}
                                                            onChange={(e) => {
                                                                const newExp = [...(formData.experience || [])];
                                                                newExp[index] = {
                                                                    ...newExp[index],
                                                                    duration: { ...(newExp[index].duration || {}), startDate: e.target.value }
                                                                };
                                                                handleChange("experience", newExp);
                                                            }}
                                                            placeholder="YYYY-MM"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs text-muted-foreground">End Date</Label>
                                                        <Input
                                                            value={exp.duration?.endDate || exp.endDate || ""}
                                                            onChange={(e) => {
                                                                const newExp = [...(formData.experience || [])];
                                                                newExp[index] = {
                                                                    ...newExp[index],
                                                                    duration: { ...(newExp[index].duration || {}), endDate: e.target.value }
                                                                };
                                                                handleChange("experience", newExp);
                                                            }}
                                                            placeholder="Present or YYYY-MM"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs text-muted-foreground">Description</Label>
                                                <Textarea
                                                    value={exp.description || ""}
                                                    onChange={(e) => {
                                                        const newExp = [...(formData.experience || [])];
                                                        newExp[index] = { ...newExp[index], description: e.target.value };
                                                        handleChange("experience", newExp);
                                                    }}
                                                    placeholder="Role responsibilities..."
                                                    className="min-h-[80px]"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {(!formData.experience || formData.experience.length === 0) && (
                                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-xl bg-slate-50/50">
                                            No work experience added yet.
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="personal" className="space-y-4 m-0 focus:outline-none">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Address / Location</Label>
                                        <Input
                                            value={formData.location || ""}
                                            onChange={(e) => handleChange("location", e.target.value)}
                                            placeholder="e.g. Mumbai, India"
                                        />
                                        <p className="text-xs text-muted-foreground">This helps recruiters find candidates near them.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Gender</Label>
                                            <Select
                                                value={formData.gender || ""}
                                                onValueChange={(val) => handleChange("gender", val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Mobile Number</Label>
                                            <Input
                                                value={formData.mobile || ""}
                                                onChange={(e) => handleChange("mobile", e.target.value)}
                                                placeholder="+91 XXXXXXXXXX"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {SECTIONS.filter(s => !["basic", "skills", "education", "resume", "about", "experience", "personal"].includes(s.id)).map(section => (
                                <TabsContent key={section.id} value={section.id} className="space-y-4 m-0 focus:outline-none">
                                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 text-slate-400">
                                        <Pencil className="w-12 h-12 opacity-20" />
                                        <p>Content for {section.label} is coming soon.</p>
                                    </div>
                                </TabsContent>
                            ))}

                            <TabsContent value="resume" className="space-y-4 m-0 focus:outline-none">
                                <div className="space-y-4 border p-6 rounded-xl bg-white shadow-sm">
                                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                                            <FileText className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-800">Upload Resume</h3>
                                            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                                                Upload your resume (PDF) to automatically autofill your profile details using our AI engine.
                                            </p>
                                        </div>

                                        <div className="w-full max-w-sm">
                                            <Input
                                                type="file"
                                                accept=".pdf"
                                                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    if (file.type !== "application/pdf") {
                                                        alert("Please upload a PDF file.");
                                                        return;
                                                    }

                                                    try {
                                                        setIsParsing(true);
                                                        const postUrl = await convex.mutation(api.files.generateUploadUrl);

                                                        const result = await fetch(postUrl, {
                                                            method: "POST",
                                                            headers: { "Content-Type": file.type },
                                                            body: file,
                                                        });

                                                        if (!result.ok) throw new Error("Upload failed");
                                                        const { storageId } = await result.json();
                                                        handleChange("resume", storageId);

                                                        const response = await convex.action(api.ai.extractDetailsFromResume, { storageId });
                                                        console.log("AI Response:", response);
                                                        const data = response?.draftProfile || response;
                                                        if (data) {
                                                            console.log("Setting Parsed Data:", data);
                                                            setParsedData(data); // Set for review instead of autofilling immediately
                                                        }

                                                    } catch (error) {
                                                        console.error(error);
                                                        alert("Failed to upload or parse resume.");
                                                    } finally {
                                                        setIsParsing(false);
                                                        // Reset the input value to allow selecting the same file again if needed
                                                        e.target.value = "";
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {isParsing && (
                                        <div className="flex items-center justify-center p-4 text-blue-600 bg-blue-50 rounded-lg animate-pulse">
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                                            Analyzing resume...
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </div>

                        {/* Floating Save Button */}
                        <div className="absolute bottom-6 right-10 z-10">
                            <Button onClick={() => onSave(formData)} size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 px-8 h-12 text-base">
                                <CheckCircle2 className="w-5 h-5 mr-2" /> Save
                            </Button>
                        </div>
                    </Tabs>

                </div>
            </DialogContent >

            {/* Nested Review Modal */}
            <Dialog open={!!parsedData} onOpenChange={(open) => !open && setParsedData(null)}>
                <DialogContent className="max-w-2xl bg-white p-0 gap-0 overflow-hidden focus:outline-none z-[9999]">
                    <div className="p-6 border-b flex items-center justify-between bg-slate-50">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                Resume Analyzed
                            </h3>
                            <p className="text-sm text-slate-500">Review the extracted details before applying them.</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setParsedData(null)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            Discard
                        </Button>
                    </div>

                    <ScrollArea className="h-[500px] p-6">
                        <div className="space-y-6">
                            {/* Basic Details Review */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Basic Details</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <label className="text-slate-400 block text-xs mb-1">First Name</label>
                                        <Input
                                            value={parsedData?.basicDetails?.firstName?.value || parsedData?.basicDetails?.firstName || ""}
                                            onChange={(e) => {
                                                const newVal = e.target.value;
                                                setParsedData((prev: any) => ({
                                                    ...prev,
                                                    basicDetails: { ...prev.basicDetails, firstName: newVal }
                                                }));
                                            }}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 block text-xs mb-1">Last Name</label>
                                        <Input
                                            value={parsedData?.basicDetails?.lastName?.value || parsedData?.basicDetails?.lastName || ""}
                                            onChange={(e) => {
                                                const newVal = e.target.value;
                                                setParsedData((prev: any) => ({
                                                    ...prev,
                                                    basicDetails: { ...prev.basicDetails, lastName: newVal }
                                                }));
                                            }}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-slate-400 block text-xs mb-1">Email</label>
                                        <Input
                                            value={parsedData?.basicDetails?.email?.value || parsedData?.basicDetails?.email || ""}
                                            onChange={(e) => {
                                                const newVal = e.target.value;
                                                setParsedData((prev: any) => ({
                                                    ...prev,
                                                    basicDetails: { ...prev.basicDetails, email: newVal }
                                                }));
                                            }}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 block text-xs mb-1">Mobile</label>
                                        <Input
                                            value={parsedData?.basicDetails?.mobile?.value || parsedData?.basicDetails?.mobile || ""}
                                            onChange={(e) => {
                                                const newVal = e.target.value;
                                                setParsedData((prev: any) => ({
                                                    ...prev,
                                                    basicDetails: { ...prev.basicDetails, mobile: newVal }
                                                }));
                                            }}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-400 block text-xs mb-1">Location</label>
                                        <Input
                                            value={parsedData?.basicDetails?.currentLocation?.value || parsedData?.basicDetails?.currentLocation || ""}
                                            onChange={(e) => {
                                                const newVal = e.target.value;
                                                setParsedData((prev: any) => ({
                                                    ...prev,
                                                    basicDetails: { ...prev.basicDetails, currentLocation: newVal }
                                                }));
                                            }}
                                            className="h-8 text-sm"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-slate-400 block text-xs mb-1">About Me / Bio</label>
                                        <Textarea
                                            value={parsedData?.aboutMe?.value || parsedData?.aboutMe || ""}
                                            onChange={(e) => {
                                                const newVal = e.target.value;
                                                setParsedData((prev: any) => ({
                                                    ...prev,
                                                    aboutMe: newVal
                                                }));
                                            }}
                                            className="min-h-[80px] text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Skills Review */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Skills Found</h4>
                                <div className="p-3 border rounded-lg bg-slate-50">
                                    <MultiSelect
                                        selected={parsedData?.skills || []}
                                        onSelectedChange={(newSkills) => setParsedData((prev: any) => ({ ...prev, skills: newSkills }))}
                                        placeholder="Add or remove skills..."
                                        allowCustom={true}
                                        searchFetcher={async (query) => []}
                                    />
                                </div>
                            </div>

                            {/* Education Review */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Education</h4>
                                {parsedData?.education?.map((edu: any, i: number) => (
                                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm space-y-2 relative group">
                                        {/* Remove Button */}
                                        <button
                                            onClick={() => {
                                                const newEdu = [...parsedData.education];
                                                newEdu.splice(i, 1);
                                                setParsedData((prev: any) => ({ ...prev, education: newEdu }));
                                            }}
                                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                placeholder="Institution"
                                                value={edu.institution || edu.college || edu.university || ""}
                                                onChange={(e) => {
                                                    const newEdu = [...parsedData.education];
                                                    newEdu[i] = { ...newEdu[i], institution: e.target.value, college: e.target.value, university: e.target.value };
                                                    setParsedData((prev: any) => ({ ...prev, education: newEdu }));
                                                }}
                                                className="h-8 text-sm font-semibold"
                                            />
                                            <Input
                                                placeholder="Degree"
                                                value={edu.qualification || edu.degree || ""}
                                                onChange={(e) => {
                                                    const newEdu = [...parsedData.education];
                                                    newEdu[i] = { ...newEdu[i], qualification: e.target.value, degree: e.target.value };
                                                    setParsedData((prev: any) => ({ ...prev, education: newEdu }));
                                                }}
                                                className="h-8 text-sm"
                                            />
                                            <Input
                                                placeholder="Start Year"
                                                value={edu.startYear || ""}
                                                onChange={(e) => {
                                                    const newEdu = [...parsedData.education];
                                                    newEdu[i] = { ...newEdu[i], startYear: e.target.value };
                                                    setParsedData((prev: any) => ({ ...prev, education: newEdu }));
                                                }}
                                                className="h-8 text-sm"
                                            />
                                            <Input
                                                placeholder="End Year"
                                                value={edu.endYear || ""}
                                                onChange={(e) => {
                                                    const newEdu = [...parsedData.education];
                                                    newEdu[i] = { ...newEdu[i], endYear: e.target.value };
                                                    setParsedData((prev: any) => ({ ...prev, education: newEdu }));
                                                }}
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Work Experience Review */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Work Experience</h4>
                                {parsedData?.experience?.map((exp: any, i: number) => (
                                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm space-y-2 relative group">
                                        <button
                                            onClick={() => {
                                                const newExp = [...parsedData.experience];
                                                newExp.splice(i, 1);
                                                setParsedData((prev: any) => ({ ...prev, experience: newExp }));
                                            }}
                                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Input
                                                placeholder="Job Title"
                                                value={exp.jobTitle || exp.designation || ""}
                                                onChange={(e) => {
                                                    const newExp = [...parsedData.experience];
                                                    newExp[i] = { ...newExp[i], jobTitle: e.target.value, designation: e.target.value };
                                                    setParsedData((prev: any) => ({ ...prev, experience: newExp }));
                                                }}
                                                className="h-8 text-sm font-semibold"
                                            />
                                            <Input
                                                placeholder="Company"
                                                value={exp.company || exp.organisation || ""}
                                                onChange={(e) => {
                                                    const newExp = [...parsedData.experience];
                                                    newExp[i] = { ...newExp[i], company: e.target.value, organisation: e.target.value };
                                                    setParsedData((prev: any) => ({ ...prev, experience: newExp }));
                                                }}
                                                className="h-8 text-sm"
                                            />
                                            <Input
                                                placeholder="Start Date"
                                                value={exp.startDate || ""}
                                                onChange={(e) => {
                                                    const newExp = [...parsedData.experience];
                                                    newExp[i] = { ...newExp[i], startDate: e.target.value };
                                                    setParsedData((prev: any) => ({ ...prev, experience: newExp }));
                                                }}
                                                className="h-8 text-sm"
                                            />
                                            <Input
                                                placeholder="End Date"
                                                value={exp.endDate || ""}
                                                onChange={(e) => {
                                                    const newExp = [...parsedData.experience];
                                                    newExp[i] = { ...newExp[i], endDate: e.target.value };
                                                    setParsedData((prev: any) => ({ ...prev, experience: newExp }));
                                                }}
                                                className="h-8 text-sm"
                                            />
                                            <Textarea
                                                placeholder="Description"
                                                value={Array.isArray(exp.description) ? exp.description.join("\n") : (exp.description || "")}
                                                onChange={(e) => {
                                                    const newExp = [...parsedData.experience];
                                                    newExp[i] = { ...newExp[i], description: e.target.value };
                                                    setParsedData((prev: any) => ({ ...prev, experience: newExp }));
                                                }}
                                                className="col-span-2 min-h-[60px] text-xs"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t flex justify-end gap-3 bg-slate-50">
                        <Button variant="outline" onClick={() => setParsedData(null)}>Cancel</Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={async () => {
                                const newData = {
                                    ...formData,
                                    name: (formData.name || (
                                        (parsedData.basicDetails?.firstName?.value || parsedData.basicDetails?.firstName || "") + " " +
                                        (parsedData.basicDetails?.lastName?.value || parsedData.basicDetails?.lastName || "")
                                    ).trim()),

                                    location: formData.location || parsedData.basicDetails?.currentLocation?.value || parsedData.basicDetails?.currentLocation || "",
                                    mobile: formData.mobile || parsedData.basicDetails?.mobile?.value || parsedData.basicDetails?.mobile || "",
                                    gender: formData.gender || parsedData.basicDetails?.gender?.value || parsedData.basicDetails?.gender || "",
                                    bio: formData.bio || parsedData.aboutMe?.value || parsedData.aboutMe || "",

                                    skills: [...new Set([...(formData.skills || []), ...(parsedData.skills || [])])],

                                    education: (formData.education && formData.education.length > 0) ? formData.education : (parsedData.education?.map((e: any) => ({
                                        degree: e.qualification || e.degree,
                                        institution: e.institution || e.college || e.university,
                                        startYear: e.startYear,
                                        endYear: e.endYear,
                                        course: e.course,
                                        specialization: e.specialization
                                    })) || []),

                                    experience: (formData.experience && formData.experience.length > 0) ? formData.experience : (parsedData.experience?.map((e: any) => ({
                                        designation: e.jobTitle || e.designation,
                                        organisation: e.company || e.organisation,
                                        location: e.location,
                                        duration: {
                                            startDate: e.startDate,
                                            endDate: e.endDate
                                        },
                                        description: Array.isArray(e.description) ? e.description.join("\n") : e.description
                                    })) || []),

                                    social: {
                                        ...formData.social,
                                        linkedin: formData.social?.linkedin || parsedData.links?.linkedin,
                                        github: formData.social?.github || parsedData.links?.github,
                                        portfolio: formData.social?.portfolio || parsedData.links?.portfolio
                                    }
                                };

                                setFormData(newData);
                                setParsedData(null);

                                try {
                                    await onSave(newData);
                                    alert("Profile updated with resume details!");
                                    setActiveSection("basic");
                                } catch (err) {
                                    console.error("Auto-save failed:", err);
                                    alert("Data applied but auto-save failed. Please click Save manually.");
                                }
                            }}
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Confirm & Apply
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Dialog >
    );
}
