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
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData: any;
    onSave: (data: any) => Promise<void>;
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

export function EditProfileDialog({ open, onOpenChange, initialData, onSave }: EditProfileDialogProps) {
    const [activeSection, setActiveSection] = useState("basic");
    const [formData, setFormData] = useState(initialData);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl w-full h-[90vh] p-0 gap-0 border-none bg-slate-50 overflow-hidden flex flex-col focus:outline-none rounded-xl">

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
                    <div className="flex-1 bg-slate-50 h-full overflow-y-auto relative">
                        <div className="max-w-4xl mx-auto p-6 md:p-10 pb-24">

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

                            {activeSection === "basic" ? (
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
                                                readOnly // As per image style hinting at slightly diff state, but keeping editable for now or readOnly if desired
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

                                        <div className="space-y-1.5">
                                            <Label className="text-xs font-semibold text-slate-500">Mobile <span className="text-red-500">*</span></Label>
                                            <div className="flex gap-3">
                                                <div className="h-11 w-20 flex items-center justify-center border border-slate-200 rounded-md bg-white text-sm font-medium text-slate-700">
                                                    +91 <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
                                                </div>
                                                <div className="relative flex-1">
                                                    <Input
                                                        value="7987349009"
                                                        readOnly
                                                        className="h-11 bg-white border-slate-200"
                                                    />
                                                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-slate-500">Gender <span className="text-red-500">*</span></Label>
                                            <div className="flex gap-3">
                                                <Button variant="outline" className="h-10 px-6 rounded-full border-blue-600 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700">
                                                    Male
                                                </Button>
                                                <Button variant="outline" className="h-10 px-6 rounded-full border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50">
                                                    Female
                                                </Button>
                                                <Button variant="outline" className="h-10 px-6 rounded-full border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50">
                                                    More Options
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-semibold text-slate-500">User Type <span className="text-red-500">*</span></Label>
                                            <div className="flex flex-wrap gap-3">
                                                {["College Students", "Professional", "School Student", "Fresher"].map((type) => (
                                                    <Button
                                                        key={type}
                                                        variant="outline"
                                                        className={cn(
                                                            "h-10 px-4 rounded-full gap-2",
                                                            type === "College Students"
                                                                ? "border-blue-600 bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                        )}
                                                    >
                                                        {type === "College Students" && <GraduationCap className="w-4 h-4" />}
                                                        {type === "Professional" && <Briefcase className="w-4 h-4" />}
                                                        {type === "School Student" && <Info className="w-4 h-4" />}
                                                        {type === "Fresher" && <User className="w-4 h-4" />}
                                                        {type}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 pt-2">
                                            <Label className="text-xs font-semibold text-slate-500">Domain <span className="text-red-500">*</span></Label>
                                            {/* Not explicitly shown in the main view but implied by "User Type" context or scroll */}
                                        </div>

                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 text-slate-400">
                                    <Pencil className="w-12 h-12 opacity-20" />
                                    <p>Content for {SECTIONS.find(s => s.id === activeSection)?.label}</p>
                                </div>
                            )}

                        </div>

                        {/* Floating Save Button */}
                        <div className="absolute bottom-6 right-10">
                            <Button onClick={() => onSave(formData)} size="lg" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 px-8 h-12 text-base">
                                <CheckCircle2 className="w-5 h-5 mr-2" /> Save
                            </Button>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
