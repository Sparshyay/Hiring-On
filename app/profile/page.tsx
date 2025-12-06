"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    Users,
    Layers,
    Clock,
    Share2,
    Eye,
    Github,
    Twitter,
    Linkedin,
    Globe as GlobeIcon,
    Settings,
    Crown,
    BookOpen,
    LogOut,
    Phone,
    X,
    Loader2
} from "lucide-react";
import { useGetUser } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
    const { user: clerkUser } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const user = useGetUser();

    const [isSaving, setIsSaving] = useState(false);

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
        name: formData.name || "Sparsh Singh Deshmukh",
        email: user?.email || clerkUser?.primaryEmailAddress?.emailAddress || "sparshdeshmukh2@gmail.com",
        username: formData.username,
        college: formData.college,
        bio: formData.bio,
        location: formData.location,
        imageUrl: clerkUser?.imageUrl
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
    const radius = 46;
    const circumference = 2 * Math.PI * radius;
    const progress = 75;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative items-start">

                    {/* LEFT SIDEBAR - Navigation (Sticky) - Hidden on Mobile */}
                    <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-20">
                        {/* Profile Completion */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={demoUser.imageUrl} />
                                    <AvatarFallback>{demoUser.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold truncate">{demoUser.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{demoUser.email}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-green-600">Profile Completion</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-1.5 bg-slate-100" indicatorClassName="bg-green-500" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <div className="p-4 border-b">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">For Users</h3>
                            </div>
                            <div className="p-2 space-y-1">
                                {[
                                    { label: "Registrations/Applications", icon: Users },
                                    { label: "My Jobs & Internships", icon: Briefcase },
                                    { label: "My Opportunities", icon: Layers },
                                    { label: "Watchlist", icon: Star },
                                    { label: "Bookmarked Questions", icon: Layers },
                                    { label: "Recently Viewed", icon: Clock },
                                    { label: "Mentor Sessions", icon: Users },
                                    { label: "Courses", icon: BookOpen },
                                    { label: "Certificates", icon: FileText },
                                    { label: "Settings", icon: Settings },
                                ].map((item: any, i) => (
                                    <Button key={i} variant="ghost" className="w-full justify-start text-slate-600 font-medium h-10 px-3 hover:bg-orange-50 hover:text-primary">
                                        {/* @ts-ignore icon type */}
                                        {item.icon && <item.icon className="w-4 h-4 mr-3" />}
                                        <span className="flex-1 text-left truncate">{item.label}</span>
                                        {item.badge && <Badge variant="secondary" className="bg-red-50 text-red-600 text-[10px] h-5 px-1.5">{item.badge}</Badge>}
                                    </Button>
                                ))}

                                <div className="my-2 border-t border-slate-100"></div>

                                <Button variant="ghost" className="w-full justify-start text-slate-600 font-medium h-10 px-3 hover:bg-orange-50 hover:text-primary">
                                    <Phone className="w-4 h-4 mr-3" />
                                    <span className="flex-1 text-left">Contact Us</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-slate-600 font-medium h-10 px-3 hover:bg-red-50 hover:text-red-600"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    <span className="flex-1 text-left">Logout</span>
                                </Button>

                            </div>
                        </div>
                    </div>

                    {/* CENTER COLUMN - Profile Content (Scrollable) */}
                    <div className="lg:col-span-6 space-y-6">

                        {/* Profile Header Card */}
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            {/* Cover Image */}
                            <div className="h-32 bg-gradient-to-tr from-secondary to-blue-900 relative">
                                <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full w-8 h-8 bg-white/20 hover:bg-white/40 text-white border-none shadow-none">
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="px-6 pb-6 pt-0 relative">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="-mt-12 relative flex justify-center">
                                            {/* Circular Progress Avatar */}
                                            <div className="relative h-28 w-28 flex items-center justify-center">
                                                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                                                    {/* Background Circle */}
                                                    <circle
                                                        cx="50" cy="50" r={radius}
                                                        fill="white"
                                                        stroke="#f1f5f9"
                                                        strokeWidth="4"
                                                    />
                                                    {/* Progress Circle */}
                                                    <circle
                                                        cx="50" cy="50" r={radius}
                                                        fill="transparent"
                                                        stroke="var(--color-primary)" // Using CSS var or hardcoded hex
                                                        strokeWidth="4"
                                                        strokeDasharray={circumference}
                                                        strokeDashoffset={strokeDashoffset}
                                                        strokeLinecap="round"
                                                        className="text-primary transition-all duration-1000 ease-out"
                                                    />
                                                </svg>
                                                <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-white">
                                                    <Avatar className="h-full w-full">
                                                        <AvatarImage src={demoUser.imageUrl} />
                                                        <AvatarFallback className="text-3xl font-bold text-primary">SD</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <div className="absolute -bottom-1 bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-primary border shadow-sm z-10">
                                                    {progress}%
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 space-y-1">
                                            <h1 className="text-xl font-bold text-slate-900">{demoUser.name}</h1>
                                            <p className="text-sm text-muted-foreground">{demoUser.username}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                                                <GraduationCap className="w-3 h-3" />
                                                <span>{demoUser.college}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-primary font-medium cursor-pointer hover:underline mt-0.5">
                                                <FileText className="w-3 h-3" />
                                                <span>Resume</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 mt-4">
                                        <div className="flex gap-2 justify-end">
                                            <Button size="icon" variant="ghost" className="rounded-full w-8 h-8 text-slate-500 hover:text-slate-900 border">
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="rounded-full w-8 h-8 text-slate-500 hover:text-slate-900 border">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <Button
                                            asChild
                                            className="rounded-full bg-primary hover:bg-orange-600 text-white px-6 h-9 text-sm font-medium"
                                        >
                                            <Link href="/profile/edit">
                                                <Pencil className="w-3 h-3 mr-2" /> Edit Profile
                                            </Link>
                                        </Button>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About */}
                        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold text-slate-900">About</h2>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {demoUser.bio}
                            </p>
                            <Button variant="link" className="text-primary p-0 h-auto text-sm font-medium hover:text-orange-600">Add About</Button>
                        </div>

                        {/* Resume Section */}
                        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold text-slate-900">Resume</h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><Pencil className="w-4 h-4" /></Button>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg max-w-md">
                                <div className="h-10 w-10 bg-red-100 rounded flex items-center justify-center text-red-500 font-bold text-xs shrink-0">PDF</div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">Sparsh Singh Deshmukh-resume</p>
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold text-slate-900">Skills</h2>
                            </div>
                            <p className="text-xs text-muted-foreground">Spotlight your unique skills and catch the eye of recruiters looking for your exact talents!</p>
                            <Button variant="link" className="text-primary p-0 h-auto text-sm font-medium hover:text-orange-600">Add Skills</Button>
                        </div>

                        {/* Work Experience */}
                        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                            <h2 className="font-bold text-slate-900">Work Experience</h2>
                            <p className="text-xs text-muted-foreground">Narrate your professional journey and fast-track your way to new career heights!</p>
                            <Button variant="link" className="text-primary p-0 h-auto text-sm font-medium hover:text-orange-600">Add Work Experience</Button>
                        </div>

                        {/* Education */}
                        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                            <h2 className="font-bold text-slate-900">Education</h2>
                            <p className="text-xs text-muted-foreground">Showcase your academic journey and open doors to your dream career opportunities!</p>
                            <Button variant="link" className="text-primary p-0 h-auto text-sm font-medium hover:text-orange-600">Add Education</Button>
                        </div>

                        {/* Responsibilities */}
                        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                            <h2 className="font-bold text-slate-900">Responsibilities</h2>
                            <p className="text-xs text-muted-foreground">Highlight the responsibilities you've mastered to demonstrate your leadership and expertise!</p>
                            <Button variant="link" className="text-primary p-0 h-auto text-sm font-medium hover:text-orange-600">Add Responsibility</Button>
                        </div>

                        {/* Certificate */}
                        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                            <h2 className="font-bold text-slate-900">Certificate</h2>
                            <p className="text-xs text-muted-foreground">Flaunt your certifications and show recruiters that you're a step ahead in your field!</p>
                            <Button variant="link" className="text-primary p-0 h-auto text-sm font-medium hover:text-orange-600">Add Certificate</Button>
                        </div>

                        {/* Projects */}
                        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                            <h2 className="font-bold text-slate-900">Projects</h2>
                            <p className="text-xs text-muted-foreground">Unveil your projects to the world and pave your path to professional greatness!</p>
                            <Button variant="link" className="text-primary p-0 h-auto text-sm font-medium hover:text-orange-600">Add Project</Button>
                        </div>

                        {/* Achievements */}
                        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                            <h2 className="font-bold text-slate-900">Achievements</h2>
                            <p className="text-xs text-muted-foreground">Broadcast your triumphs and make a remarkable impression on industry leaders!</p>
                            <Button variant="link" className="text-primary p-0 h-auto text-sm font-medium hover:text-orange-600">Add Achievement</Button>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold text-slate-900">Social Links</h2>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Plus className="w-4 h-4" /></Button>
                            </div>

                            <div className="flex gap-3">
                                {[Github, Twitter, Linkedin, GlobeIcon].map((Icon, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 cursor-pointer transition-colors">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT SIDEBAR - Extras (Sticky) - Hidden on Mobile */}
                    <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-20">

                        {/* Create Resume CTA */}
                        <div className="bg-gradient-to-r from-secondary to-[#2a5d91] rounded-xl p-0 overflow-hidden shadow-sm flex flex-col">
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="bg-white p-1 rounded shadow-sm shrink-0">
                                        <FileText className="w-8 h-8 text-secondary" />
                                    </div>
                                    <h3 className="font-bold text-white text-sm leading-tight">Create your Resume</h3>
                                </div>
                                <p className="text-xs text-blue-100">Career goals, ftw! In 12-15 months, where do you see yourself being a pro?</p>
                            </div>
                        </div>

                        {/* Career Goals */}
                        <div className="bg-white rounded-xl shadow-sm border p-4 space-y-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground font-normal">Field of Interest</Label>
                                <Select>
                                    <SelectTrigger className="h-9 w-full text-xs">
                                        <SelectValue placeholder="Select Your Field of Interest" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="eng">Engineering</SelectItem>
                                        <SelectItem value="des">Design</SelectItem>
                                        <SelectItem value="prod">Product</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground font-normal">Preferred Work Location</Label>
                                <div className="border rounded-md px-3 py-2 text-sm text-slate-900 bg-slate-50">
                                    {demoUser.location}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Button variant="outline" className="h-8 text-xs rounded-full">Cancel</Button>
                                <Button className="h-8 text-xs rounded-full bg-primary text-white hover:bg-orange-600">Next</Button>
                            </div>
                        </div>

                        {/* Rankings */}
                        <div className="bg-white rounded-xl shadow-sm border p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-900">Rankings</h3>
                                <Button variant="link" className="text-xs text-primary p-0 h-auto hover:text-orange-600">How it works?</Button>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-600">Total Points</span>
                                    <div className="flex items-center text-primary font-bold text-sm">
                                        0 <span className="ml-2">›</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-600">Total Badges</span>
                                    <div className="flex items-center text-primary font-bold text-sm">
                                        2 <span className="ml-2">›</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
