"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Clock, IndianRupee, Share2, Bookmark, Calendar, Globe, Users, Eye, CheckCircle2, Heart, Gift, Briefcase } from "lucide-react";
import { use } from "react";
import { useGetInternship, useGetUser, useUpdateJobStatus } from "@/lib/api"; // Added useUpdateJobStatus import even if not used yet for consistency
import { Skeleton } from "@/components/ui/skeleton";
import { useProtectedAction } from "@/lib/auth";
import Link from "next/link";
import { useState } from "react";
import { ApplicationDialog } from "@/components/shared/application-dialog";

function getDaysLeft(deadline: number | undefined) {
    if (!deadline) return null;
    const diff = deadline - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
}

function ApplyButton({ job, user }: { job: any, user: any }) {
    const { verifyAccess } = useProtectedAction();
    const [open, setOpen] = useState(false);

    const handleApply = () => {
        if (verifyAccess("apply for this internship")) {
            setOpen(true);
        }
    };

    return (
        <>
            <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-lg text-lg"
                onClick={handleApply}
            >
                Quick Apply
            </Button>
            <ApplicationDialog job={job} user={user} open={open} onOpenChange={setOpen} />
        </>
    );
}

export default function InternshipDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const internship = useGetInternship(id);
    const user = useGetUser();

    if (internship === undefined) {
        return (
            <div className="min-h-screen bg-slate-50 pb-20 pt-20">
                <div className="container mx-auto px-4 max-w-6xl space-y-8">
                    <Skeleton className="h-40 w-full rounded-xl" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Skeleton className="h-60 w-full rounded-xl" />
                        </div>
                        <div className="space-y-6">
                            <Skeleton className="h-40 w-full rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (internship === null) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Internship Not Found</h1>
                    <p className="text-muted-foreground">The internship you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Helper to format currency/stipend
    const formatStipend = (stipend: string) => {
        return stipend.startsWith("₹") ? stipend : `₹${stipend}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-8">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header Card Redesigned - Brand Banner */}
                <div className="relative bg-white rounded-xl p-8 shadow-sm border border-slate-100 mb-8 overflow-hidden min-h-[200px] flex items-center">
                    {/* Background Watermark */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
                        {internship.logoUrl ? (
                            <img src={internship.logoUrl} alt="" className="h-[400px] w-auto grayscale" />
                        ) : (
                            <div className="text-[300px] font-bold text-slate-900 leading-none">
                                {internship.company?.name?.[0] || "C"}
                            </div>
                        )}
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start w-full">
                        {/* Left: Logo */}
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border bg-white shadow-sm flex items-center justify-center shrink-0 p-4">
                            {internship.logoUrl ? (
                                <img src={internship.logoUrl} alt={internship.company?.name || "Company Logo"} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-4xl font-bold text-slate-700">{internship.company?.name?.[0] || "C"}</span>
                            )}
                        </div>

                        {/* Right: Content */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">{internship.title}</h1>
                                <div className="flex items-center gap-2 mt-2 text-lg font-medium text-slate-600">
                                    <Building2 className="w-5 h-5" />
                                    {internship.company?.name}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border">
                                    <MapPin className="w-3.5 h-3.5" /> {internship.location}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border">
                                    <Clock className="w-3.5 h-3.5" /> {internship.duration}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border">
                                    <Briefcase className="w-3.5 h-3.5" /> {internship.type}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border">
                                    <Calendar className="w-3.5 h-3.5" /> Posted: {new Date(internship.postedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="hidden md:flex flex-col gap-3 shrink-0">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                                Apply Now
                            </Button>
                            <Button variant="outline" className="w-full">
                                <Share2 className="w-4 h-4 mr-2" /> Share
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Navigation Tabs (Functional) */}
                        <div className="bg-white rounded-xl p-2 shadow-sm flex gap-2 overflow-x-auto sticky top-4 z-20 border border-slate-100">
                            {[
                                { label: "Recruitment Process", id: "recruitment-process" },
                                { label: "Internship Description", id: "internship-description" },
                                { label: "Eligibility", id: "eligibility" },
                                { label: "Perks", id: "perks" }
                            ].map((tab, i) => (
                                <Button
                                    key={tab.id}
                                    variant="ghost"
                                    onClick={() => scrollToSection(tab.id)}
                                    className="rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>

                        {/* Recruitment Process */}
                        <Card id="recruitment-process" className="border-none shadow-sm scroll-mt-20">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-6 border-l-4 border-blue-600 pl-3">Recruitment Process</h3>

                                <div className="relative pl-4 space-y-8 before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-100">

                                    <div className="relative flex gap-6">
                                        <div className="w-14 h-14 rounded-lg bg-blue-50 text-blue-600 flex flex-col items-center justify-center shrink-0 border border-blue-100 z-10 relative">
                                            <span className="text-xs font-bold">STEP</span>
                                            <span className="text-lg font-bold">1</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Application Shortlisting</h4>
                                            <p className="text-sm text-muted-foreground mt-1">Candidates will be shortlisted based on their profile and resume.</p>
                                        </div>
                                    </div>

                                    <div className="relative flex gap-6">
                                        <div className="w-14 h-14 rounded-lg bg-blue-50 text-blue-600 flex flex-col items-center justify-center shrink-0 border border-blue-100 z-10 relative">
                                            <span className="text-xs font-bold">STEP</span>
                                            <span className="text-lg font-bold">2</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Task / Interview</h4>
                                            <p className="text-sm text-muted-foreground mt-1">A small task or interview to assess skills and cultural fit.</p>
                                        </div>
                                    </div>

                                    <div className="relative flex gap-6">
                                        <div className="w-14 h-14 rounded-lg bg-blue-50 text-blue-600 flex flex-col items-center justify-center shrink-0 border border-blue-100 z-10 relative">
                                            <span className="text-xs font-bold">STEP</span>
                                            <span className="text-lg font-bold">3</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Selection</h4>
                                            <p className="text-sm text-muted-foreground mt-1">Final offer and onboarding.</p>
                                        </div>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>

                        {/* Eligibility */}
                        <Card id="eligibility" className="border-none shadow-sm scroll-mt-20">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-blue-600 pl-3">Eligibility & Skills</h3>
                                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed mb-4">
                                    <ul className="list-disc list-inside space-y-2">
                                        {internship.requirements?.map((req: string, i: number) => (
                                            <li key={i}>{req}</li>
                                        ))}
                                        {internship.minEducation && <li>Minimum Education: {internship.minEducation}</li>}
                                    </ul>
                                </div>

                                {internship.tags && (
                                    <div className="flex flex-wrap gap-2">
                                        {internship.tags.map((tag: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Internship Description */}
                        <Card id="internship-description" className="border-none shadow-sm scroll-mt-20">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-blue-600 pl-3">Internship Description</h3>
                                <div className="prose prose-slate max-w-none text-sm text-slate-600">
                                    <p>{internship.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Perks - Placeholder as schema doesn't have perks array yet, but good for UI parity */}
                        <Card id="perks" className="border-none shadow-sm scroll-mt-20">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-blue-600 pl-3">Perks & Benefits</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                        <span className="text-slate-700 text-sm">Certificate of Completion</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                        <span className="text-slate-700 text-sm">Letter of Recommendation</span>
                                    </div>
                                    {internship.workMode === "Remote" && (
                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                            <span className="text-slate-700 text-sm">Remote Work</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                        <span className="text-slate-700 text-sm">Flexible Hours</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">

                        {/* User Profile Card */}
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="font-bold text-slate-900">{user?.name || "Guest User"}</div>
                                        <div className="text-xs text-muted-foreground">{user?.email || "Please sign in"}</div>
                                    </div>
                                    {/* Placeholder for eligibility check logic */}
                                    <Badge className="bg-green-600 hover:bg-green-700 text-white gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Eligible
                                    </Badge>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    <Button variant="outline" size="icon" className="flex-1 h-10 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50">
                                        <Heart className="w-5 h-5" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="flex-1 h-10 text-slate-500">
                                        <Calendar className="w-5 h-5" />
                                    </Button>
                                    <Button variant="outline" className="flex-1 h-10 gap-2 text-slate-500">
                                        <Share2 className="w-4 h-4" /> Share
                                    </Button>
                                </div>

                                <ApplyButton job={internship} user={user} />
                            </CardContent>
                        </Card>

                        {/* Stats Card */}
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-0 divide-y">
                                <div className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <IndianRupee className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Stipend</div>
                                        <div className="font-bold text-slate-900">{internship.stipend}</div>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Duration</div>
                                        <div className="font-bold text-slate-900">{internship.duration}</div>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Applied</div>
                                        {/* Mock data for now, or hook up to applications count if available */}
                                        <div className="font-bold text-slate-900">145+</div>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Deadline</div>
                                        <div className={`font-bold ${getDaysLeft(internship.applicationDeadline) && getDaysLeft(internship.applicationDeadline)! < 5 ? 'text-red-600' : 'text-slate-900'}`}>
                                            {getDaysLeft(internship.applicationDeadline) !== null ? `${getDaysLeft(internship.applicationDeadline)} Days Left` : "Open"}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Refer & Win */}
                        <Card className="border-none shadow-sm bg-gradient-to-br from-purple-50 to-pink-50">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-purple-600">
                                        <Gift className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Refer & Win</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Refer a friend and win exciting rewards like MacBook, iPhone and more!</p>
                                        <Button variant="secondary" size="sm" className="mt-3 bg-white hover:bg-white/80 text-purple-700 shadow-sm">
                                            Refer Now
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}
