"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    X,
    Upload,
    Trash2,
    Linkedin,
    Github,
    Twitter,
    Facebook,
    Instagram,
    Globe,
    Youtube,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useGetUser, useUpdateProfile } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { useMutation, useConvexAuth, useConvex, useQuery } from "convex/react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MultiSelect } from "@/components/ui/multi-select";

const SECTIONS = [
    { id: "basic", label: "Basic Details", icon: User, required: true },
    { id: "resume", label: "Resume", icon: FileText },
    { id: "about", label: "About", icon: Info, required: true },
    { id: "skills", label: "Skills", icon: Zap, required: true },
    { id: "education", label: "Education", icon: GraduationCap, required: true },
    { id: "experience", label: "Work Experience", icon: Briefcase },
    { id: "accomplishments", label: "Accomplishments & Initiatives", icon: Award },
    { id: "personal", label: "Personal Details", icon: User },
    { id: "social", label: "Social Links", icon: Share2 },
];

const COMMON_SKILLS = [
    "Angular", "React", "Vue.js", "Node.js", "Python", "Java", "JavaScript",
    "TypeScript", "Google Search Console", "Adobe InDesign", "Figma", "Photoshop",
    "AWS", "Docker", "Kubernetes", "MongoDB", "PostgreSQL", "MySQL"
];

const SOCIAL_PLATFORMS = [
    { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
    { id: "github", label: "GitHub", icon: Github, color: "text-slate-900" },
    { id: "twitter", label: "Twitter", icon: Twitter, color: "text-sky-500" },
    { id: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
    { id: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-600" },
    { id: "youtube", label: "YouTube", icon: Youtube, color: "text-red-600" },
    { id: "website", label: "Website", icon: Globe, color: "text-green-600" },
    { id: "portfolio", label: "Portfolio", icon: Globe, color: "text-purple-600" },
];

export default function EditProfilePage() {
    const router = useRouter();
    const { user: clerkUser } = useUser();
    const { isAuthenticated } = useConvexAuth();
    const convexUser = useGetUser();
    const updateProfile = useUpdateProfile();
    const createUser = useMutation(api.users.createUser);
    const domains = useQuery(api.master_data.getDomains) || [];
    const convex = useConvex();

    const [activeSection, setActiveSection] = useState("basic");
    const [isSaving, setIsSaving] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [hobbyInput, setHobbyInput] = useState("");
    const [isCreatingUser, setIsCreatingUser] = useState(false);
    const [parsedData, setParsedData] = useState<any>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    // Auto-create user in Convex if doesn't exist
    useEffect(() => {
        const initializeUser = async () => {
            // Only create if: authenticated, user exists in Clerk, no Convex user, and not already creating
            if (isAuthenticated && clerkUser && convexUser === null && !isCreatingUser) {
                setIsCreatingUser(true);
                try {
                    console.log("Creating user in Convex...");
                    await createUser({
                        name: clerkUser.fullName || clerkUser.username || "User",
                        email: clerkUser.primaryEmailAddress?.emailAddress || "",
                    });
                    console.log("User created successfully");
                } catch (error) {
                    console.error("Error creating user:", error);
                    // Reset flag on error to allow retry
                    setIsCreatingUser(false);
                }
                // Don't reset isCreatingUser on success to prevent re-creation
            }
        };

        initializeUser();
        initializeUser();
    }, [isAuthenticated, clerkUser, convexUser, createUser, isCreatingUser]);


    const [formData, setFormData] = useState<any>({
        // Basic Details - Initialize with empty strings to avoid undefined
        firstName: "",
        lastName: "",
        username: "",
        mobile: "",
        gender: "",
        userType: "",
        domain: "",
        domainId: "",
        course: "",
        courseId: "",
        courseSpecialization: "",
        specializationId: "",
        courseDuration: { startYear: "", endYear: "" },
        organization: "",
        organizationId: "",
        purpose: "",
        role: "",
        preferredWorkLocation: "",
        currentLocation: "",

        // Resume & About
        resume: "",
        about: "",

        // Skills & Others
        skills: [],
        education: [],
        experience: [],
        certificates: [],
        projects: [],
        achievements: [],
        responsibilities: [],
        hobbies: [],
        socialLinks: {},

        // Personal Details
        pronouns: "",
        dateOfBirth: "",
        currentAddress: {
            line1: "",
            line2: "",
            landmark: "",
            pincode: "",
            location: "",
        },
        permanentAddress: {
            line1: "",
            line2: "",
            landmark: "",
            pincode: "",
            location: "",
        },
    });

    // Load user data from Convex
    useEffect(() => {
        if (convexUser) {
            const user = convexUser as any; // Cast to any to handle Union Types (Admin | Recruiter | JobSeeker)
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                username: user.username || "",
                mobile: user.mobile || "",
                gender: user.gender || "",
                userType: user.userType || "",
                domain: user.domain || "",
                domainId: user.domainId || "",
                course: user.course || "",
                courseId: user.courseId || "",
                courseSpecialization: user.courseSpecialization || "",
                specializationId: user.specializationId || "",
                courseDuration: user.courseDuration || { startYear: "", endYear: "" },
                organization: user.organization || "",
                organizationId: user.organizationId || "",
                purpose: user.purpose || "",
                role: user.role || "",
                preferredWorkLocation: user.preferredWorkLocation || "",
                currentLocation: user.currentLocation || "",
                resume: (user.resume && !user.resume.startsWith("blob:")) ? user.resume : "",
                about: user.about || "",
                skills: user.skills || [],
                education: user.education || [],
                experience: user.experience || [],
                certificates: user.certificates || [],
                projects: user.projects || [],
                achievements: user.achievements || [],
                responsibilities: user.responsibilities || [],
                hobbies: user.hobbies || [],
                socialLinks: user.socialLinks || {},
                pronouns: user.pronouns || "",
                dateOfBirth: user.dateOfBirth || "",
                currentAddress: user.currentAddress || {
                    line1: "",
                    line2: "",
                    landmark: "",
                    pincode: "",
                    location: "",
                },
                permanentAddress: user.permanentAddress || {
                    line1: "",
                    line2: "",
                    landmark: "",
                    pincode: "",
                    location: "",
                },
            });
        }
    }, [convexUser]);

    const courses = useQuery(api.master_data.getCourses, formData.domainId ? { domainId: formData.domainId as any } : "skip");

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const handleSave = async (dataToSave?: any) => {
        // Check if user is authenticated with Clerk
        if (!clerkUser) {
            alert("❌ You must be logged in to save your profile.");
            router.push("/sign-in");
            return;
        }

        // Wait a moment if user is still being loaded/created
        if (convexUser === undefined) {
            alert("⏳ Loading your profile. Please wait a moment and try again.");
            return;
        }

        const data = dataToSave || formData;

        setIsSaving(true);
        try {
            console.log("Saving profile data:", data);
            console.log("User state:", {
                hasClerkUser: !!clerkUser,
                hasConvexUser: !!convexUser
            });

            const result = await updateProfile(data);

            console.log("Profile saved successfully:", result);
            alert("✅ Profile updated successfully!");

            router.push("/profile");
        } catch (error) {
            console.error("Failed to save profile:", error);
            const errorMessage = (error as Error).message;

            // Check if it's an authentication error
            if (errorMessage.includes("authentication") || errorMessage.includes("logged in")) {
                alert(`❌ Authentication Error\n\n${errorMessage}\n\nPlease sign out and sign in again.`);
                router.push("/sign-in");
            } else {
                alert(`❌ Failed to save profile.\n\n${errorMessage}`);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            handleChange("skills", [...formData.skills, skillInput.trim()]);
            setSkillInput("");
        }
    };

    const removeSkill = (skill: string) => {
        handleChange("skills", formData.skills.filter((s: string) => s !== skill));
    };

    const addHobby = () => {
        if (hobbyInput.trim() && !formData.hobbies.includes(hobbyInput.trim())) {
            handleChange("hobbies", [...formData.hobbies, hobbyInput.trim()]);
            setHobbyInput("");
        }
    };

    const removeHobby = (hobby: string) => {
        handleChange("hobbies", formData.hobbies.filter((h: string) => h !== hobby));
    };

    const addEducation = () => {
        handleChange("education", [...formData.education, {
            qualification: "",
            course: "",
            specialization: "",
            college: "",
            duration: { startYear: "", endYear: "" },
        }]);
    };

    const updateEducation = (index: number, field: string, value: any) => {
        const updated = [...formData.education];
        updated[index] = { ...updated[index], [field]: value };
        handleChange("education", updated);
    };

    const removeEducation = (index: number) => {
        handleChange("education", formData.education.filter((_: any, i: number) => i !== index));
    };

    const addExperience = () => {
        handleChange("experience", [...formData.experience, {
            designation: "",
            organisation: "",
            employmentType: "",
            duration: { startDate: "", endDate: "" },
            location: "",
        }]);
    };

    const updateExperience = (index: number, field: string, value: any) => {
        const updated = [...formData.experience];
        updated[index] = { ...updated[index], [field]: value };
        handleChange("experience", updated);
    };

    const removeExperience = (index: number) => {
        handleChange("experience", formData.experience.filter((_: any, i: number) => i !== index));
    };

    const renderBasicDetails = () => (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3 flex flex-col items-center">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-primary/10 flex items-center justify-center">
                        <Avatar className="w-full h-full">
                            <AvatarImage src={clerkUser?.imageUrl} className="object-cover" />
                            <AvatarFallback className="bg-primary/20 text-primary text-4xl">
                                {formData.firstName?.[0] || clerkUser?.firstName?.[0] || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border cursor-pointer hover:bg-slate-50 transition-colors">
                        <Camera className="w-4 h-4 text-slate-600" />
                    </div>
                </div>
            </div>

            <div className="lg:col-span-9 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-500">First Name <span className="text-red-500">*</span></Label>
                        <Input
                            value={formData.firstName}
                            onChange={(e) => handleChange("firstName", e.target.value)}
                            className="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter first name"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-500">Last Name</Label>
                        <Input
                            value={formData.lastName}
                            onChange={(e) => handleChange("lastName", e.target.value)}
                            className="h-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter last name"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-500">Username <span className="text-red-500">*</span></Label>
                    <Input
                        value={formData.username}
                        onChange={(e) => handleChange("username", e.target.value)}
                        className="h-11 bg-white border-slate-200"
                        placeholder="@username"
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between">
                        <Label className="text-xs font-semibold text-slate-500">Email <span className="text-red-500">*</span></Label>
                        <span className="text-xs text-blue-600 cursor-pointer hover:underline">Update Email</span>
                    </div>
                    <div className="relative">
                        <Input
                            value={clerkUser?.primaryEmailAddress?.emailAddress || ""}
                            readOnly
                            className="h-11 bg-slate-50 border-slate-200 text-slate-500 pr-10"
                        />
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-500">Mobile Number <span className="text-red-500">*</span></Label>
                    <div className="flex gap-3">
                        <div className="h-11 w-20 flex items-center justify-center border border-slate-200 rounded-md bg-white text-sm font-medium text-slate-700">
                            +91 <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
                        </div>
                        <div className="relative flex-1">
                            <Input
                                value={formData.mobile}
                                onChange={(e) => handleChange("mobile", e.target.value)}
                                className="h-11 bg-white border-slate-200"
                                placeholder="Enter mobile number"
                                type="tel"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500">Gender <span className="text-red-500">*</span></Label>
                    <div className="flex gap-3 flex-wrap">
                        {["Male", "Female", "Other"].map((option) => (
                            <Button
                                key={option}
                                type="button"
                                variant="outline"
                                onClick={() => handleChange("gender", option)}
                                className={cn(
                                    "h-10 px-6 rounded-full",
                                    formData.gender === option
                                        ? "border-blue-600 bg-blue-50 text-blue-600"
                                        : "border-slate-200 text-slate-600"
                                )}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-slate-500">User Type <span className="text-red-500">*</span></Label>
                    <div className="flex flex-wrap gap-3">
                        {["College Student", "Professional", "School Student", "Fresher"].map((type) => (
                            <Button
                                key={type}
                                type="button"
                                variant="outline"
                                onClick={() => handleChange("userType", type)}
                                className={cn(
                                    "h-10 px-4 rounded-full",
                                    formData.userType === type
                                        ? "border-blue-600 bg-blue-50 text-blue-600"
                                        : "border-slate-200 text-slate-600"
                                )}
                            >
                                {type}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-500">Domain <span className="text-red-500">*</span></Label>
                        <Select
                            value={formData.domainId || ""}
                            onValueChange={(val) => {
                                const selected = domains.find((d: any) => d._id === val);
                                handleChange("domain", selected?.name);
                                handleChange("domainId", val);
                                handleChange("course", "");
                                handleChange("courseId", "");
                                handleChange("courseSpecialization", "");
                                handleChange("specializationId", "");
                            }}
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select Domain" />
                            </SelectTrigger>
                            <SelectContent>
                                {domains.map((d: any) => (
                                    <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-500">Course <span className="text-red-500">*</span></Label>
                        <Select
                            disabled={!formData.domainId}
                            value={formData.courseId || ""}
                            onValueChange={(val) => {
                                const selected = courses?.find((c: any) => c._id === val);
                                handleChange("course", selected?.name);
                                handleChange("courseId", val);
                                handleChange("courseSpecialization", "");
                                handleChange("specializationId", "");
                            }}
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses?.map((c: any) => (
                                    <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-500">Course Specialization <span className="text-red-500">*</span></Label>
                    <SearchableSelect
                        className="h-11"
                        placeholder="Select Specialization"
                        disabled={!formData.courseId}
                        searchFetcher={async (q) => {
                            if (!formData.courseId) return [];
                            const specs = await convex.query(api.master_data.getSpecializations, { courseId: formData.courseId });
                            return specs
                                .filter((s: any) => s.name.toLowerCase().includes(q.toLowerCase()))
                                .map((s: any) => ({ value: s._id, label: s.name }));
                        }}
                        value={formData.specializationId || formData.courseSpecialization || ""}
                        onSelect={(val, item) => {
                            handleChange("courseSpecialization", item?.label);
                            handleChange("specializationId", val);
                        }}
                    />
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-500">Course Duration <span className="text-red-500">*</span></Label>
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            value={formData.courseDuration.startYear}
                            onValueChange={(value) => handleNestedChange("courseDuration", "startYear", value)}
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Start Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={formData.courseDuration.endYear}
                            onValueChange={(value) => handleNestedChange("courseDuration", "endYear", value)}
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="End Year" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-500">Organisation / College <span className="text-red-500">*</span></Label>
                    <SearchableSelect
                        className="h-11"
                        placeholder="Search College/University..."
                        searchFetcher={async (q) => {
                            const results = await convex.query(api.master_data.searchColleges, { query: q });
                            return results.map((u: any) => ({
                                value: u._id,
                                label: u.name,
                                description: `${u.city}`
                            }));
                        }}
                        value={formData.organizationId || formData.organization || ""}
                        onSelect={(val, item) => {
                            handleChange("organization", item?.label || val);
                            handleChange("organizationId", val);
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-500">Purpose <span className="text-red-500">*</span></Label>
                        <Select value={formData.purpose} onValueChange={(value) => handleChange("purpose", value)}>
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select purpose" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="job">Job Search</SelectItem>
                                <SelectItem value="internship">Internship</SelectItem>
                                <SelectItem value="practice">Practice & Learn</SelectItem>
                                <SelectItem value="networking">Networking</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-500">Select Role</Label>
                        <Input
                            value={formData.role}
                            onChange={(e) => handleChange("role", e.target.value)}
                            placeholder="e.g., Software Developer"
                            className="h-11"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-500">Preferred Work Location</Label>
                        <Input
                            value={formData.preferredWorkLocation}
                            onChange={(e) => handleChange("preferredWorkLocation", e.target.value)}
                            placeholder="e.g., Bangalore, Remote"
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-slate-500">Current Location <span className="text-red-500">*</span></Label>
                        <Input
                            value={formData.currentLocation}
                            onChange={(e) => handleChange("currentLocation", e.target.value)}
                            placeholder="e.g., Mumbai, Maharashtra"
                            className="h-11"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const [isParsing, setIsParsing] = useState(false);

    // ... (rest of renderResume)

    const renderResume = () => (
        <div className="space-y-6">
            {isParsing && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg flex items-center animate-pulse">
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Analyzing resume with AI... Please wait while we auto-fill your profile.
                </div>
            )}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-900 text-sm mb-1">Resume Upload</h4>
                        <p className="text-xs text-slate-600">
                            Upload your latest resume in PDF format. This will be used when you apply for jobs.
                        </p>
                    </div>
                </div>
            </div>

            {formData.resume ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-lg max-w-md">
                    <div className="h-12 w-12 bg-green-100 rounded flex items-center justify-center text-green-600 font-bold text-sm shrink-0">
                        PDF
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate">
                            {formData.resume.split('/').pop() || 'Resume.pdf'}
                        </p>
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Uploaded
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                            onClick={() => {
                                // In production, this would open/download the file
                                alert("Resume preview coming soon!");
                            }}
                        >
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-100"
                            onClick={() => handleChange("resume", "")}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    onClick={() => {
                        // In production, this would trigger file upload
                        alert("File upload functionality will be added in production with proper storage integration (AWS S3, Convex Storage, etc.)");
                    }}
                >
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                        <Upload className="w-8 h-8 text-blue-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-900 mb-1">Upload your resume</p>
                    <p className="text-xs text-slate-500 mb-4">PDF only (max 5MB)</p>
                    <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        id="resume-upload"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                if (file.type !== "application/pdf") {
                                    alert("Please upload a PDF file.");
                                    return;
                                }
                                if (file.size > 5 * 1024 * 1024) { // 5MB
                                    alert("File size must be less than 5MB.");
                                    return;
                                }

                                try {
                                    setIsParsing(true); // Start parsing loading
                                    // 1. Get Upload URL
                                    const postUrl = await convex.mutation(api.files.generateUploadUrl);

                                    // 2. Upload File
                                    const result = await fetch(postUrl, {
                                        method: "POST",
                                        headers: { "Content-Type": file.type },
                                        body: file,
                                    });

                                    if (!result.ok) {
                                        throw new Error(`Upload failed: ${result.statusText}`);
                                    }

                                    const { storageId } = await result.json();

                                    // 3. Save to state (Store ID, not URL)
                                    handleChange("resume", storageId);

                                    // 4. AI Parsing
                                    try {
                                        console.log("Analyzing resume...");
                                        const parsedData = await convex.action(api.ai.extractDetailsFromResume, { storageId });
                                        console.log("AI Response:", parsedData);
                                        const data = parsedData?.draftProfile || parsedData;

                                        if (data) {
                                            console.log("Setting Parsed Data:", data);
                                            setParsedData(data); // Set for review instead of autofilling immediately
                                            setIsReviewOpen(true);
                                        }

                                    } catch (aiError) {
                                        console.error("AI Parsing failed but upload succeeded:", aiError);
                                        // Don't block upload success
                                    }

                                    alert(`File "${file.name}" uploaded successfully!`);

                                } catch (error) {
                                    console.error("Resume upload failed:", error);
                                    alert("Failed to upload resume. Please try again.");
                                } finally {
                                    setIsParsing(false);
                                }
                            }
                        }}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById("resume-upload")?.click();
                        }}
                    >
                        <Upload className="w-4 h-4 mr-2" /> Choose File
                    </Button>
                    {parsedData && (
                        <Button
                            type="button"
                            variant="outline"
                            className="border-green-600 text-green-600 hover:bg-green-50"
                            onClick={() => setIsReviewOpen(true)}
                        >
                            <FileText className="w-4 h-4 mr-2" /> Review Extracted Data
                        </Button>
                    )}
                </div>
            )}

            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <div className="flex gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                        <h5 className="font-semibold text-sm text-slate-900 mb-1">Pro Tip</h5>
                        <p className="text-xs text-slate-600">
                            Keep your resume updated with your latest experience and skills for better job matches.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAbout = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">About Me <span className="text-red-500">*</span></Label>
                <p className="text-xs text-slate-500">
                    Introduce yourself here! Share a brief overview about who you are, your interests, and connect with fellow users, recruiters & organizers.
                </p>
                <Textarea
                    value={formData.about}
                    onChange={(e) => handleChange("about", e.target.value.slice(0, 1000))}
                    placeholder="Tell us about yourself..."
                    className="min-h-[200px] resize-none"
                />
                <p className="text-xs text-slate-400 text-right">{formData.about?.length || 0}/1000 characters</p>
            </div>
        </div>
    );

    const renderSkills = () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Add Skills</Label>
                <div className="flex gap-2">
                    <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                        placeholder="Type a skill and press Enter"
                        className="flex-1"
                    />
                    <Button type="button" onClick={addSkill} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                </div>
            </div>

            {formData.skills.length > 0 && (
                <div>
                    <Label className="text-sm font-semibold text-slate-700 mb-3 block">Your Skills</Label>
                    <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="ml-2">
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <Label className="text-sm font-semibold text-slate-700 mb-3 block">Suggested Skills</Label>
                <div className="flex flex-wrap gap-2">
                    {COMMON_SKILLS.filter(s => !formData.skills.includes(s)).slice(0, 12).map((skill) => (
                        <Badge
                            key={skill}
                            variant="outline"
                            className="px-3 py-1.5 cursor-pointer hover:bg-slate-100"
                            onClick={() => handleChange("skills", [...formData.skills, skill])}
                        >
                            {skill} <Plus className="w-3 h-3 ml-1" />
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderEducation = () => (
        <div className="space-y-6">
            <Button type="button" onClick={addEducation} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" /> Add Education
            </Button>

            {formData.education.map((edu: any, index: number) => (
                <Card key={index} className="p-6 relative">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEducation(index)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Qualification <span className="text-red-500">*</span></Label>
                                <Input
                                    value={edu.qualification}
                                    onChange={(e) => updateEducation(index, "qualification", e.target.value)}
                                    placeholder="e.g., Bachelor's"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Course <span className="text-red-500">*</span></Label>
                                <Input
                                    value={edu.course}
                                    onChange={(e) => updateEducation(index, "course", e.target.value)}
                                    placeholder="e.g., B.Tech"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Specialization <span className="text-red-500">*</span></Label>
                                <Input
                                    value={edu.specialization}
                                    onChange={(e) => updateEducation(index, "specialization", e.target.value)}
                                    placeholder="e.g., Computer Science"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">College <span className="text-red-500">*</span></Label>
                                <Input
                                    value={edu.college}
                                    onChange={(e) => updateEducation(index, "college", e.target.value)}
                                    placeholder="e.g., ABC University"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Percentage</Label>
                                <Input
                                    type="number"
                                    value={edu.percentage || ""}
                                    onChange={(e) => updateEducation(index, "percentage", parseFloat(e.target.value))}
                                    placeholder="e.g., 85.5"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">CGPA</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={edu.cgpa || ""}
                                    onChange={(e) => updateEducation(index, "cgpa", parseFloat(e.target.value))}
                                    placeholder="e.g., 8.5"
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            ))}

            {formData.education.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No education added yet. Click "Add Education" to get started.</p>
                </div>
            )}
        </div>
    );

    const renderExperience = () => (
        <div className="space-y-6">
            <Button type="button" onClick={addExperience} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" /> Add Experience
            </Button>

            {formData.experience.map((exp: any, index: number) => (
                <Card key={index} className="p-6 relative">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExperience(index)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Designation <span className="text-red-500">*</span></Label>
                                <Input
                                    value={exp.designation}
                                    onChange={(e) => updateExperience(index, "designation", e.target.value)}
                                    placeholder="e.g., Software Engineer"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Organisation <span className="text-red-500">*</span></Label>
                                <Input
                                    value={exp.organisation}
                                    onChange={(e) => updateExperience(index, "organisation", e.target.value)}
                                    placeholder="e.g., Google"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Employment Type <span className="text-red-500">*</span></Label>
                                <Select
                                    value={exp.employmentType}
                                    onValueChange={(value) => updateExperience(index, "employmentType", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="full-time">Full Time</SelectItem>
                                        <SelectItem value="part-time">Part Time</SelectItem>
                                        <SelectItem value="internship">Internship</SelectItem>
                                        <SelectItem value="contract">Contract</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold">Location <span className="text-red-500">*</span></Label>
                                <Input
                                    value={exp.location}
                                    onChange={(e) => updateExperience(index, "location", e.target.value)}
                                    placeholder="e.g., Bangalore, India"
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            ))}

            {formData.experience.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No work experience added yet. Click "Add Experience" to get started.</p>
                </div>
            )}
        </div>
    );

    const renderAccomplishments = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
                { title: "Certificates", icon: Award, color: "bg-blue-500" },
                { title: "Projects", icon: Briefcase, color: "bg-green-500" },
                { title: "Achievements", icon: Award, color: "bg-yellow-500" },
                { title: "Responsibilities", icon: User, color: "bg-purple-500" },
            ].map((item) => (
                <Card key={item.title} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center text-white mb-4`}>
                        <item.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Add {item.title}</h3>
                    <p className="text-sm text-slate-600 mb-4">
                        Showcase your {item.title.toLowerCase()} to stand out
                    </p>
                    <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" /> Add {item.title}
                    </Button>
                </Card>
            ))}
        </div>
    );

    const renderPersonal = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Pronouns</Label>
                    <Input
                        value={formData.pronouns || ""}
                        onChange={(e) => handleChange("pronouns", e.target.value)}
                        placeholder="e.g., He/Him, She/Her, They/Them"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Date of Birth</Label>
                    <Input
                        type="date"
                        value={formData.dateOfBirth || ""}
                        onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Current Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Address Line 1</Label>
                        <Input
                            placeholder="Street address"
                            value={formData.currentAddress?.line1 || ""}
                            onChange={(e) => handleChange("currentAddress", {
                                ...formData.currentAddress,
                                line1: e.target.value
                            })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Address Line 2</Label>
                        <Input
                            placeholder="Apartment, suite, etc."
                            value={formData.currentAddress?.line2 || ""}
                            onChange={(e) => handleChange("currentAddress", {
                                ...formData.currentAddress,
                                line2: e.target.value
                            })}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Landmark</Label>
                        <Input
                            placeholder="Nearby landmark"
                            value={formData.currentAddress?.landmark || ""}
                            onChange={(e) => handleChange("currentAddress", {
                                ...formData.currentAddress,
                                landmark: e.target.value
                            })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Pincode</Label>
                        <Input
                            placeholder="000000"
                            value={formData.currentAddress?.pincode || ""}
                            onChange={(e) => handleChange("currentAddress", {
                                ...formData.currentAddress,
                                pincode: e.target.value
                            })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Location</Label>
                        <Input
                            placeholder="City, State"
                            value={formData.currentAddress?.location || ""}
                            onChange={(e) => handleChange("currentAddress", {
                                ...formData.currentAddress,
                                location: e.target.value
                            })}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Permanent Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Address Line 1</Label>
                        <Input
                            placeholder="Street address"
                            value={formData.permanentAddress?.line1 || ""}
                            onChange={(e) => handleChange("permanentAddress", {
                                ...formData.permanentAddress,
                                line1: e.target.value
                            })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Address Line 2</Label>
                        <Input
                            placeholder="Apartment, suite, etc."
                            value={formData.permanentAddress?.line2 || ""}
                            onChange={(e) => handleChange("permanentAddress", {
                                ...formData.permanentAddress,
                                line2: e.target.value
                            })}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Landmark</Label>
                        <Input
                            placeholder="Nearby landmark"
                            value={formData.permanentAddress?.landmark || ""}
                            onChange={(e) => handleChange("permanentAddress", {
                                ...formData.permanentAddress,
                                landmark: e.target.value
                            })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Pincode</Label>
                        <Input
                            placeholder="000000"
                            value={formData.permanentAddress?.pincode || ""}
                            onChange={(e) => handleChange("permanentAddress", {
                                ...formData.permanentAddress,
                                pincode: e.target.value
                            })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">Location</Label>
                        <Input
                            placeholder="City, State"
                            value={formData.permanentAddress?.location || ""}
                            onChange={(e) => handleChange("permanentAddress", {
                                ...formData.permanentAddress,
                                location: e.target.value
                            })}
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-sm font-semibold">Hobbies</Label>
                <div className="flex gap-2">
                    <Input
                        value={hobbyInput}
                        onChange={(e) => setHobbyInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHobby())}
                        placeholder="Add a hobby"
                    />
                    <Button type="button" onClick={addHobby}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>
                {formData.hobbies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {formData.hobbies.map((hobby: string) => (
                            <Badge key={hobby} variant="secondary" className="px-3 py-1.5">
                                {hobby}
                                <button onClick={() => removeHobby(hobby)} className="ml-2">
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderSocials = () => (
        <div className="space-y-6">
            <p className="text-sm text-slate-600">Click on any platform icon to add or update your profile link</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SOCIAL_PLATFORMS.map((platform) => {
                    const Icon = platform.icon;
                    const hasLink = formData.socialLinks?.[platform.id];

                    return (
                        <div key={platform.id} className="space-y-2">
                            <div
                                className={cn(
                                    "w-full aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all",
                                    hasLink
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                )}
                            >
                                <Icon className={cn("w-8 h-8", hasLink ? platform.color : "text-slate-400")} />
                                <span className="text-xs font-medium text-slate-700">{platform.label}</span>
                            </div>
                            <Input
                                value={formData.socialLinks?.[platform.id] || ""}
                                onChange={(e) => handleChange("socialLinks", {
                                    ...formData.socialLinks,
                                    [platform.id]: e.target.value
                                })}
                                placeholder={`Your ${platform.label} URL`}
                                className="text-sm"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case "basic": return renderBasicDetails();
            case "resume": return renderResume();
            case "about": return renderAbout();
            case "skills": return renderSkills();
            case "education": return renderEducation();
            case "experience": return renderExperience();
            case "accomplishments": return renderAccomplishments();
            case "personal": return renderPersonal();
            case "social": return renderSocials();
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Fixed Header */}
            <div className="bg-white border-b sticky top-16 z-40">
                <div className="container mx-auto px-4 md:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.push("/profile")} className="rounded-full hover:bg-slate-100">
                                <ArrowLeft className="w-5 h-5 text-slate-700" />
                            </Button>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-slate-800">Edit Profile</h1>
                                <p className="text-sm text-muted-foreground hidden md:block">Update your profile information</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={() => router.push("/profile")} className="rounded-full">
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving} className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6">
                                {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* LEFT SIDEBAR - Desktop Only */}
                    <div className="hidden lg:block w-72 shrink-0">
                        <div className="sticky top-24 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
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
                            <div className="bg-white rounded-xl border p-2 space-y-1">
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
                                        {activeSection === section.id && (
                                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-md" />
                                        )}

                                        <section.icon className={cn(
                                            "w-5 h-5 ml-2",
                                            activeSection === section.id ? "text-blue-600" : "text-slate-300 group-hover:text-slate-400"
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

                    {/* MOBILE NAVIGATION - Horizontal Scroll */}
                    <div className="lg:hidden w-full mb-6">
                        <div className="bg-white border rounded-xl p-2 overflow-x-auto scrollbar-hide flex gap-2">
                            {SECTIONS.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border shrink-0",
                                        activeSection === section.id
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-slate-50 text-slate-600 border-slate-200"
                                    )}
                                >
                                    <section.icon className="w-4 h-4" />
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-white rounded-xl border p-6 md:p-10 max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar smooth-scroll">
                            {/* Section Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                                        {SECTIONS.find(s => s.id === activeSection)?.label}
                                    </h2>
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

                            {/* Dynamic Content */}
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Resume Review Modal */}
            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent className="max-w-2xl bg-white p-0 gap-0 overflow-hidden focus:outline-none z-[9999]">
                    <DialogTitle className="sr-only">Resume Review</DialogTitle>
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
                            onClick={() => {
                                setParsedData(null);
                                setIsReviewOpen(false);
                            }}
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
                        <Button variant="outline" onClick={() => setIsReviewOpen(false)}>Cancel</Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={async () => {
                                // Helper to peel off metadata and handle nulls
                                const getValue = (parsedItem: any, existingItem: any) => {
                                    const val = (typeof parsedItem === 'object' && parsedItem !== null && 'value' in parsedItem) ? parsedItem.value : parsedItem;
                                    if (val && typeof val === 'string' && val.trim().length > 0) return val;
                                    return existingItem || "";
                                };
                                const newData = {
                                    ...formData,
                                    firstName: getValue(parsedData.basicDetails?.firstName, formData.firstName),
                                    lastName: getValue(parsedData.basicDetails?.lastName, formData.lastName),

                                    // Simple overwrites
                                    currentLocation: getValue(parsedData.basicDetails?.currentLocation, formData.currentLocation),
                                    mobile: getValue(parsedData.basicDetails?.mobile, formData.mobile),
                                    gender: getValue(parsedData.basicDetails?.gender, formData.gender),
                                    about: getValue(parsedData.aboutMe, formData.about),

                                    skills: [...new Set([...(formData.skills || []), ...(parsedData.skills || [])])],

                                    education: (parsedData.education && parsedData.education.length > 0) ? parsedData.education.map((e: any) => ({
                                        degree: e.qualification || e.degree || "",
                                        institution: e.institution || e.college || e.university || "",
                                        startYear: e.startYear || "",
                                        endYear: e.endYear || "",
                                        course: e.course || "",
                                        specialization: e.specialization || ""
                                    })) : formData.education,

                                    experience: (parsedData.experience && parsedData.experience.length > 0) ? parsedData.experience.map((e: any) => ({
                                        designation: e.jobTitle || e.designation || "",
                                        organisation: e.company || e.organisation || "",
                                        location: e.location || "",
                                        duration: {
                                            startDate: e.startDate || "",
                                            endDate: e.endDate || ""
                                        },
                                        description: Array.isArray(e.description) ? e.description.join("\n") : e.description || ""
                                    })) : formData.experience,
                                };

                                setFormData(newData);
                                setParsedData(null);
                                setIsReviewOpen(false);

                                try {
                                    // Optionally trigger immediate save or just update form
                                    await handleSave(newData);
                                    setActiveSection("basic");
                                } catch (err) {
                                    console.error("Auto-save failed:", err);
                                    alert("Data applied. Please check and click Save Changes.");
                                }
                            }}
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Confirm & Apply
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
