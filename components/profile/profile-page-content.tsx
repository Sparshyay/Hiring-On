"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "@/components/shared/edit-profile-dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProfileSidebar } from "@/components/shared/profile-sidebar";
import { useGetUser, useUpdateProfile } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Mail,
    Plus,
    CheckCircle2,
    Briefcase,
    GraduationCap,
    Pencil,
    Link as LinkIcon,
    FileText,
    Award,
    Star,
    LayoutDashboard,
    Settings,
    Phone,
    LogOut,
    Share2,
    Eye,
    Users,
    Sparkles,
    Zap,
    Crown,
    Github,
    Linkedin,
    Twitter,
    Globe as GlobeIcon,
    Layers,
    Clock,
    BookOpen,
    User,
    ArrowRight,
    Camera,
    Layout,
    X,
    Menu,
    Loader2,
    Target,
    Trophy
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
export function ProfilePageContent() {
    const { user: clerkUser } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const user = useGetUser() as any;
    const updateProfile = useUpdateProfile();

    const [isSaving, setIsSaving] = useState(false);

    // Onboarding State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editInitialTab, setEditInitialTab] = useState("basic");

    useEffect(() => {
        // Check if user is loaded and resume is missing
        if (user !== undefined && user !== null) {
            // simplified check for resume or other data
            const hasResume = user.resume;
            const skipped = typeof window !== 'undefined' ? localStorage.getItem("skipped_resume_onboarding") : false;

            if (!hasResume) { // Force resume upload if missing
                setEditInitialTab("resume");
                // Allow user to skip for this session if they close it?
                // For now, we rely on the localStorage set in handleEditOpenChange to avoid loop
                if (!skipped) {
                    setIsEditOpen(true);
                }
            }
        }
    }, [user]);

    const handleEditOpenChange = (open: boolean) => {
        setIsEditOpen(open);
        if (!open) {
            // Mark as skipped/done for now
            if (typeof window !== 'undefined') localStorage.setItem("skipped_resume_onboarding", "true");
        }
    };

    const handleSaveProfileWrapper = async (data: any) => {
        setIsSaving(true);
        try {
            await updateProfile(data);
            setIsEditOpen(false);
        } catch (e) {
            console.error("Failed to save profile", e);
        } finally {
            setIsSaving(false);
        }
    };


    const [showResumePreview, setShowResumePreview] = useState(false);

    // Initial State derived from user data
    const [formData, setFormData] = useState({
        name: user?.name || clerkUser?.fullName || "",
        username: "@sparsdes32098", // Mock
        bio: "Craft an engaging story in your bio and make meaningful connections with peers and recruiters alike!",
        college: "Gyan Ganga Institute of Technology And Sciences (GGITS) Jabalpur",
        location: "Indore, Madhya Pradesh, India",
    });

    // Mock data for UI development if user user is loading
    const demoUser = {
        name: user?.name || formData.name || "Sparsh Singh Deshmukh",
        email: user?.email || clerkUser?.primaryEmailAddress?.emailAddress || "sparshdeshmukh2@gmail.com",
        username: user?.username || formData.username,
        college: user?.education?.[0]?.institution || formData.college,
        bio: user?.about || formData.bio,
        location: user?.currentLocation || formData.location, // Schema uses currentLocation
        imageUrl: clerkUser?.imageUrl,
        education: user?.education || [],
        mobile: user?.mobile
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        // Here you would call a mutation to update the user
    };

    const handleLogout = async () => {
        await signOut();
        router.push("/");
    };

    if (user === undefined) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading profile...</div>;
    }

    // Circular Progress Calculation
    // Circular Progress Calculation
    const calculateCompletion = () => {
        let filled = 0;
        let total = 8; // Total tracked fields

        if (demoUser.name) filled++;
        if (demoUser.email) filled++;
        if (demoUser.bio && demoUser.bio.length > 20) filled++;
        if (demoUser.location) filled++;
        if (demoUser.college) filled++;
        if (demoUser.username) filled++;
        // Check if additional sections are added (simulated for now based on URL params or mock state if we had it)
        // For MVP, we'll assume basic fields + simulated sections if URL has tab
        // Ideally checking user.experience.length, user.skills.length etc.

        // Since we are using demoUser which is flat, we'll add some mock logic:
        // Assume 50% base + added details
        return Math.min(100, Math.round((filled / total) * 100));
    };

    const radius = 46;
    const circumference = 2 * Math.PI * radius;
    const progress = calculateCompletion();
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-8">
                {/* Mobile Menu Trigger */}
                <div className="lg:hidden mb-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full h-11 flex items-center justify-between bg-white border-slate-200 text-slate-700 shadow-sm rounded-xl">
                                <span className="font-bold flex items-center gap-2">
                                    <LayoutDashboard className="w-4 h-4 text-orange-600" />
                                    Profile Menu
                                </span>
                                <Menu className="w-4 h-4 text-slate-400" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] p-0 bg-slate-50 border-r border-slate-200" title="Profile Menu">
                            <div className="p-6 h-full overflow-y-auto">
                                <h2 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-900">
                                    <User className="w-5 h-5 text-orange-600" />
                                    My Profile
                                </h2>
                                <ProfileSidebar className="block" />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative items-start">

                    {/* LEFT SIDEBAR - Navigation (Sticky) - Hidden on Mobile */}
                    <ProfileSidebar className="hidden lg:block lg:col-span-3 sticky top-24" />


                    {/* CENTER COLUMN - Profile Content (Scrollable) */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Profile Header Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group">
                            {/* Cover Image */}
                            <div className="h-40 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full w-8 h-8 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md transition-all">
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="px-8 pb-8 relative">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div className="flex flex-col md:flex-row gap-6 items-start">
                                        <div className="-mt-16 relative flex justify-center">
                                            {/* Circular Progress Avatar */}
                                            <div className="relative h-32 w-32 flex items-center justify-center bg-white rounded-full p-1 shadow-xl">
                                                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                                                    {/* Background Circle */}
                                                    <circle
                                                        cx="50" cy="50" r={radius}
                                                        fill="white"
                                                        stroke="#f1f5f9"
                                                        strokeWidth="3"
                                                    />
                                                    {/* Progress Circle */}
                                                    <circle
                                                        cx="50" cy="50" r={radius}
                                                        fill="transparent"
                                                        stroke="url(#gradient)"
                                                        strokeWidth="3"
                                                        strokeDasharray={circumference}
                                                        strokeDashoffset={strokeDashoffset}
                                                        strokeLinecap="round"
                                                        className="transition-all duration-1000 ease-out"
                                                    />
                                                    <defs>
                                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                            <stop offset="0%" stopColor="#EA580C" />
                                                            <stop offset="100%" stopColor="#FB923C" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                                <div className="absolute inset-2 rounded-full overflow-hidden border-[3px] border-white ring-1 ring-slate-100">
                                                    <Avatar className="h-full w-full">
                                                        <AvatarImage src={demoUser.imageUrl} className="object-cover" />
                                                        <AvatarFallback className="text-4xl font-bold bg-slate-100 text-slate-400">
                                                            {demoUser.name.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="absolute -bottom-2 bg-gradient-to-r from-orange-600 to-red-600 px-3 py-1 rounded-full text-[10px] font-bold text-white border-2 border-white shadow-sm z-10 flex items-center gap-1">
                                                    <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                                                    {progress}% Profile
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 md:mt-2 space-y-2">
                                            <div>
                                                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                                    {demoUser.name || demoUser.username || "User"}
                                                </h1>
                                                <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                                                    {demoUser.email}
                                                    {progress === 100 && <CheckCircle2 className="w-4 h-4 text-orange-500 fill-orange-50" />}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                                {/* University/College */}
                                                {(demoUser.college || demoUser.education?.[0]?.institution) && (
                                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded text-xs font-medium border border-slate-100">
                                                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="truncate max-w-[200px]">{demoUser.college || demoUser.education?.[0]?.institution}</span>
                                                    </div>
                                                )}

                                                {/* Location */}
                                                {demoUser.location && (
                                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded text-xs font-medium border border-slate-100">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{demoUser.location}</span>
                                                    </div>
                                                )}

                                                {/* Mobile */}
                                                {demoUser.mobile && (
                                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded text-xs font-medium border border-slate-100">
                                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{demoUser.mobile}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 pt-1">
                                                <a href={user?.resume || "#"} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1">
                                                    <FileText className="w-3.5 h-3.5" /> View Resume
                                                </a>
                                                <span className="text-slate-300">•</span>
                                                <button className="text-xs font-bold text-slate-500 hover:text-slate-700 hover:underline flex items-center gap-1">
                                                    <Share2 className="w-3.5 h-3.5" /> Share Profile
                                                </button>
                                            </div>


                                        </div>
                                    </div>

                                    {/* Right side actions - kept minimal since main edit moved */}
                                    <div className="flex gap-2 justify-end w-full md:w-auto mt-4 md:mt-0">
                                        <Button
                                            asChild
                                            className="rounded-full bg-orange-600 hover:bg-orange-700 text-white px-6 shadow-md shadow-orange-100 transition-all hover:scale-105"
                                        >
                                            <Link href="/profile/edit">
                                                <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Profile
                                            </Link>
                                        </Button>
                                        <Button size="icon" variant="outline" className="rounded-full w-9 h-9 border-slate-200 text-slate-500 hover:text-orange-600 hover:border-orange-200 bg-white">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="outline" className="rounded-full w-9 h-9 border-slate-200 text-slate-500 hover:text-orange-600 hover:border-orange-200 bg-white">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Users className="w-4 h-4" />
                                    </span>
                                    About
                                </h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" asChild>
                                    <Link href="/profile/edit?tab=about">
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                            {user?.about ? (
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {user.about}
                                </p>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                                    <Link href="/profile/edit?tab=about" className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors mb-2">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-900">Add a Bio</p>
                                        <p className="text-xs text-slate-500 max-w-xs mt-1">Tell us about yourself to make meaningful connections.</p>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Resume Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                                        <FileText className="w-4 h-4" />
                                    </span>
                                    Resume
                                </h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" asChild>
                                    <Link href="/profile/edit?tab=resume">
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>

                            {user?.resume ? (
                                <>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl transition-all hover:shadow-md hover:border-slate-300">
                                        <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold text-xs shrink-0 shadow-sm border border-red-200">PDF</div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-slate-900 truncate">
                                                {user.name ? `${user.name.split(' ')[0]}'s Resume.pdf` : "My Resume.pdf"}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">Updated recently</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50" asChild>
                                                <a href={user.resume} target="_blank" rel="noopener noreferrer">
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full text-xs h-9 border-dashed border-slate-300 text-slate-500 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50"
                                        onClick={() => setShowResumePreview(!showResumePreview)}
                                    >
                                        <Eye className="w-3.5 h-3.5 mr-2" /> {showResumePreview ? "Hide Preview" : "Show Resume Preview"}
                                    </Button>

                                    {showResumePreview && (
                                        <div className="mt-4 border rounded-xl overflow-hidden shadow-sm h-[500px] bg-slate-100 animate-in fade-in zoom-in-95 duration-300">
                                            <iframe
                                                src={`${user.resume}#toolbar=0`}
                                                className="w-full h-full"
                                                title="Resume Preview"
                                            />
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer bg-slate-50/50">
                                    <Link href="/profile/edit?tab=resume" className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-red-500 group-hover:border-red-200 transition-all mb-3">
                                            <Plus className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900">Upload your Resume</p>
                                        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Showcase your journey in a professional format.</p>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <Zap className="w-4 h-4" />
                                    </span>
                                    Skills
                                </h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600" asChild>
                                    <Link href="/profile/edit?tab=skills">
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                            {user?.skills && user.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill: string, index: number) => (
                                        <Badge key={index} variant="secondary" className="bg-slate-50 text-slate-700 border border-slate-200 hover:bg-white hover:border-emerald-200 hover:text-emerald-700 px-3 py-1 text-xs font-medium transition-colors cursor-default">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                                    <Link href="/profile/edit?tab=skills" className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors mb-2">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-900">Add Skills</p>
                                        <p className="text-xs text-slate-500 max-w-xs mt-1">Spotlight your unique talents for recruiters.</p>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Work Experience */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <Briefcase className="w-4 h-4" />
                                    </span>
                                    Work Experience
                                </h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" asChild>
                                    <Link href="/profile/edit?tab=experience">
                                        <Plus className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>

                            {user?.experience && user.experience.length > 0 ? (
                                <div className="space-y-6">
                                    {user.experience.map((exp: any, index: number) => (
                                        <div key={index} className="flex gap-4 group">
                                            <div className="mt-1 relative">
                                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm z-10 relative group-hover:scale-110 transition-transform">
                                                    <Briefcase className="w-5 h-5" />
                                                </div>
                                                {index !== (user.experience?.length || 0) - 1 && (
                                                    <div className="absolute top-12 left-6 w-0.5 h-full bg-slate-100 -ml-[1px] -z-0"></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-900 text-lg">{exp.designation}</h3>
                                                <p className="text-sm font-semibold text-slate-700">{exp.organisation}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                                                        {exp.duration?.startDate} - {exp.duration?.endDate || "Present"}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{exp.location}</span>
                                                </div>
                                                {exp.description && (
                                                    <p className="text-sm text-slate-600 mt-3 leading-relaxed border-l-2 border-slate-100 pl-3">
                                                        {exp.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                                    <Link href="/profile/edit?tab=experience" className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors mb-2">
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-900">Add Work Experience</p>
                                        <p className="text-xs text-slate-500 max-w-xs mt-1">Narrate your professional journey to fast-track your career.</p>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Education */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                        <GraduationCap className="w-4 h-4" />
                                    </span>
                                    Education
                                </h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-orange-600" asChild>
                                    <Link href="/profile/edit?tab=education">
                                        <Plus className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>

                            {user?.education && user.education.length > 0 ? (
                                <div className="space-y-6">
                                    {user.education.map((edu: any, index: number) => (
                                        <div key={index} className="flex gap-4 group">
                                            <div className="mt-1 relative">
                                                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shadow-sm z-10 relative group-hover:scale-110 transition-transform">
                                                    <GraduationCap className="w-5 h-5" />
                                                </div>
                                                {index !== (user.education?.length || 0) - 1 && (
                                                    <div className="absolute top-12 left-6 w-0.5 h-full bg-slate-100 -ml-[1px] -z-0"></div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-900 text-lg">{edu.college}</h3>
                                                <p className="text-sm font-semibold text-slate-700">{edu.course} {edu.specialization && `in ${edu.specialization}`}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                                                        {edu.duration?.startYear} - {edu.duration?.endYear}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                                    <Link href="/profile/edit?tab=education" className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors mb-2">
                                            <GraduationCap className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-900">Add Education</p>
                                        <p className="text-xs text-slate-500 max-w-xs mt-1">Showcase your academic journey.</p>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Certificate */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                        <Award className="w-4 h-4" />
                                    </span>
                                    Certificates
                                </h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-green-600" asChild>
                                    <Link href="/profile/edit?tab=accomplishments">
                                        <Plus className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>

                            {user?.certificates && user.certificates.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {user.certificates.map((cert: any, index: number) => (
                                        <div key={index} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-green-100 transition-all">
                                            <div className="mt-1">
                                                <div className="w-10 h-10 rounded-lg bg-white border border-green-100 flex items-center justify-center text-green-600 shadow-sm">
                                                    <Award className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-sm line-clamp-1" title={cert.name}>{cert.name}</h3>
                                                <p className="text-xs font-medium text-slate-600 mt-0.5">{cert.issuer}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">Issued: {cert.issueDate}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                                    <Link href="/profile/edit?tab=accomplishments" className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-green-100 group-hover:text-green-600 transition-colors mb-2">
                                            <Award className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-900">Add Certificate</p>
                                        <p className="text-xs text-slate-500 max-w-xs mt-1">Flaunt your certifications to industry leaders.</p>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Projects */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                                        <Layers className="w-4 h-4" />
                                    </span>
                                    Projects
                                </h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-purple-600" asChild>
                                    <Link href="/profile/edit?tab=accomplishments">
                                        <Plus className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>

                            {user?.projects && user.projects.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4">
                                    {user.projects.map((project: any, index: number) => (
                                        <div key={index} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all group bg-white">
                                            <div className="mt-1">
                                                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                    <Layers className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-slate-900">{project.name}</h3>
                                                    {project.link && (
                                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-purple-600 hover:underline flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-md">
                                                            <LinkIcon className="w-3 h-3" /> Visit
                                                        </a>
                                                    )}
                                                </div>
                                                {project.role && <p className="text-sm font-medium text-slate-700 mt-0.5">{project.role}</p>}
                                                {project.description && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{project.description}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                                    <Link href="/profile/edit?tab=accomplishments" className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors mb-2">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-900">Add Project</p>
                                        <p className="text-xs text-slate-500 max-w-xs mt-1">Unveil your projects to the world.</p>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Achievements */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                                        <Crown className="w-4 h-4" />
                                    </span>
                                    Achievements
                                </h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-yellow-600" asChild>
                                    <Link href="/profile/edit?tab=accomplishments">
                                        <Plus className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>

                            {user?.achievements && user.achievements.length > 0 ? (
                                <div className="space-y-4">
                                    {user.achievements.map((item: any, index: number) => (
                                        <div key={index} className="flex gap-3 p-3 rounded-lg bg-yellow-50/50 border border-yellow-100/50">
                                            <div className="mt-0.5">
                                                <Crown className="w-5 h-5 text-yellow-500 fill-yellow-200" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                                                <p className="text-sm text-slate-600">{item.description}</p>
                                                {item.date && <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                                    <Link href="/profile/edit?tab=accomplishments" className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-yellow-100 group-hover:text-yellow-600 transition-colors mb-2">
                                            <Crown className="w-5 h-5" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-900">Add Achievement</p>
                                        <p className="text-xs text-slate-500 max-w-xs mt-1">Broadcast your triumphs.</p>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                        <GlobeIcon className="w-4 h-4" />
                                    </span>
                                    Social Links
                                </h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900" asChild>
                                    <Link href="/profile/edit?tab=social">
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="flex gap-4">
                                {user?.socialLinks?.github && (
                                    <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl border-2 border-slate-100 flex items-center justify-center text-slate-600 hover:text-white hover:bg-black hover:border-black cursor-pointer transition-all hover:scale-110 shadow-sm">
                                        <Github className="w-6 h-6" />
                                    </a>
                                )}
                                {user?.socialLinks?.linkedin && (
                                    <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl border-2 border-blue-50 flex items-center justify-center text-blue-600 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] cursor-pointer transition-all hover:scale-110 shadow-sm bg-blue-50/30">
                                        <Linkedin className="w-6 h-6" />
                                    </a>
                                )}
                                {user?.socialLinks?.twitter && (
                                    <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl border-2 border-sky-50 flex items-center justify-center text-sky-500 hover:text-white hover:bg-sky-500 hover:border-sky-500 cursor-pointer transition-all hover:scale-110 shadow-sm bg-sky-50/30">
                                        <Twitter className="w-6 h-6" />
                                    </a>
                                )}
                                {user?.socialLinks?.website && (
                                    <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl border-2 border-emerald-50 flex items-center justify-center text-emerald-600 hover:text-white hover:bg-emerald-600 hover:border-emerald-600 cursor-pointer transition-all hover:scale-110 shadow-sm bg-emerald-50/30">
                                        <GlobeIcon className="w-6 h-6" />
                                    </a>
                                )}
                                {/* Add placeholder if no links */}
                                {(!user?.socialLinks || Object.keys(user.socialLinks).length === 0) && (
                                    <div className="text-center w-full py-4 border-2 border-dashed border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
                                        <Link href="/profile/edit?tab=social" className="flex flex-col items-center">
                                            <p className="text-sm font-medium text-slate-500 group-hover:text-slate-900 transition-colors">Add your social links</p>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT SIDEBAR - Extras (Sticky) - Hidden on Mobile */}
                    <div className="hidden lg:block lg:col-span-2 space-y-6 sticky top-24">

                        {/* Create Resume CTA */}
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-0 overflow-hidden shadow-lg shadow-indigo-100 flex flex-col group cursor-pointer transition-transform hover:scale-[1.02]">
                            <div className="p-5 flex flex-col gap-3 relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <FileText className="w-24 h-24 text-white rotate-12" />
                                </div>
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl shadow-sm shrink-0 border border-white/10">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-white text-lg leading-tight">Create your Resume</h3>
                                </div>
                                <p className="text-sm text-indigo-100 font-medium relative z-10">Career goals, ftw! In 12-15 months, where do you see yourself being a pro?</p>
                                <Button onClick={() => router.push("/resume-builder")} className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold group-hover:shadow-md transition-all">
                                    Start Building <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>

                        {/* Career Goals */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
                            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                                <Target className="w-4 h-4 text-slate-500" />
                                Career Goals
                            </h3>
                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Field of Interest</Label>
                                <Select>
                                    <SelectTrigger className="h-9 w-full text-sm bg-slate-50 border-slate-200">
                                        <SelectValue placeholder="Select Your Field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="eng">Engineering</SelectItem>
                                        <SelectItem value="des">Design</SelectItem>
                                        <SelectItem value="prod">Product</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-500 font-medium uppercase tracking-wider">Preferred Location</Label>
                                <div className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 bg-slate-50 flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="truncate">{demoUser.location}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg border-slate-200 text-slate-600 hover:text-slate-900">Cancel</Button>
                                <Button size="sm" className="h-8 text-xs rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-sm">Save Goals</Button>
                            </div>
                        </div>

                        {/* Rankings */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                    Rankings
                                </h3>
                                <Button variant="link" className="text-[10px] text-slate-500 p-0 h-auto hover:text-slate-900 font-medium">How it works?</Button>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-slate-50/80 rounded-xl border border-slate-100 transition-colors hover:bg-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs ring-4 ring-white">
                                            <Star className="w-4 h-4 fill-blue-600" />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">Total Points</span>
                                    </div>
                                    <div className="flex items-center text-slate-900 font-bold text-lg">
                                        0 <span className="text-slate-300 text-sm font-normal ml-2">›</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50/80 rounded-xl border border-slate-100 transition-colors hover:bg-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-xs ring-4 ring-white">
                                            <Award className="w-4 h-4 fill-yellow-600" />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">Badges</span>
                                    </div>
                                    <div className="flex items-center text-slate-900 font-bold text-lg">
                                        2 <span className="text-slate-300 text-sm font-normal ml-2">›</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Onboarding Dialog */}
            <EditProfileDialog
                open={isEditOpen}
                onOpenChange={handleEditOpenChange}
                initialData={user || {}}
                onSave={handleSaveProfileWrapper}
                initialTab={editInitialTab}
            />
        </div>
    );
}
