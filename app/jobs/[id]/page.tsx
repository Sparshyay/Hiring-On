"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, Clock, IndianRupee, Share2, Bookmark, Calendar, Globe, Users, Eye, CheckCircle2, Heart, Gift } from "lucide-react";
import { use } from "react";
import { useGetJob, useGetUser } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useProtectedAction } from "@/lib/auth";
import Link from "next/link";

function ApplyButton() {
    const { verifyAccess } = useProtectedAction();

    const handleApply = () => {
        if (verifyAccess("apply for this job")) {
            // Simulate application
            alert("Application Submitted Successfully!");
        }
    };

    return (
        <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 rounded-lg text-lg"
            onClick={handleApply}
        >
            Quick Apply
        </Button>
    );
}

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const job = useGetJob(id);
    const user = useGetUser();

    if (job === undefined) {
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

    if (job === null) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Job Not Found</h1>
                    <p className="text-muted-foreground">The job you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-8">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Header Card */}
                <Card className="border-none shadow-sm mb-6 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
                        {/* Cover Image Placeholder */}
                    </div>
                    <CardContent className="p-6 relative">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-24 h-24 rounded-xl bg-white border-4 border-white shadow-sm flex items-center justify-center text-3xl font-bold text-slate-700 -mt-12 relative z-10">
                                {job.company?.logo || "C"}
                            </div>
                            <div className="flex-1 pt-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{job.title}</h1>
                                <div className="text-slate-600 font-medium mb-4">{job.company?.name}</div>

                                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" /> Updated On: {new Date(job.postedAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-blue-600 hover:underline cursor-pointer">
                                        <Globe className="w-4 h-4" /> Official website
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Navigation Tabs (Visual Only) */}
                        <div className="bg-white rounded-xl p-2 shadow-sm flex gap-2 overflow-x-auto">
                            {["Recruitment Process", "Job Description", "Dates & Deadlines", "Reviews", "FAQs"].map((tab, i) => (
                                <Button
                                    key={tab}
                                    variant={i === 0 ? "secondary" : "ghost"}
                                    className={`rounded-lg text-sm font-medium ${i === 0 ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "text-slate-600"}`}
                                >
                                    {tab}
                                </Button>
                            ))}
                        </div>

                        {/* Recruitment Process */}
                        <Card className="border-none shadow-sm">
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
                                            <h4 className="font-bold text-slate-900">Assessment Round</h4>
                                            <p className="text-sm text-muted-foreground mt-1">Online assessment to test technical skills and aptitude.</p>
                                            <div className="mt-3 flex gap-2">
                                                <Badge variant="outline" className="bg-slate-50">15 Questions</Badge>
                                                <Badge variant="outline" className="bg-slate-50">45 Mins</Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative flex gap-6">
                                        <div className="w-14 h-14 rounded-lg bg-blue-50 text-blue-600 flex flex-col items-center justify-center shrink-0 border border-blue-100 z-10 relative">
                                            <span className="text-xs font-bold">STEP</span>
                                            <span className="text-lg font-bold">3</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Interview</h4>
                                            <p className="text-sm text-muted-foreground mt-1">Final interview with the hiring manager.</p>
                                        </div>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>

                        {/* Eligibility */}
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-blue-600 pl-3">Eligibility</h3>
                                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed">
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>Graduate in any discipline (B.Tech/B.E preferred).</li>
                                        <li>0-2 years of experience in related field.</li>
                                        <li>Strong communication and problem-solving skills.</li>
                                        {job.requirements?.map((req: string, i: number) => (
                                            <li key={i}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Job Description */}
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-blue-600 pl-3">Job Description</h3>
                                <div className="prose prose-slate max-w-none text-sm text-slate-600">
                                    <p>{job.description}</p>
                                    <p className="mt-4">
                                        <strong>Key Responsibilities:</strong>
                                    </p>
                                    <ul className="list-disc pl-4 space-y-1 mt-2">
                                        <li>Develop and maintain high-quality software.</li>
                                        <li>Collaborate with cross-functional teams.</li>
                                        <li>Participate in code reviews and design discussions.</li>
                                    </ul>
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

                                <ApplyButton />
                            </CardContent>
                        </Card>

                        {/* Stats Card */}
                        <Card className="border-none shadow-sm">
                            <CardContent className="p-0 divide-y">
                                <div className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Applied</div>
                                        <div className="font-bold text-slate-900">1,245</div>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Openings</div>
                                        <div className="font-bold text-slate-900">12</div>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <Eye className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Impressions</div>
                                        <div className="font-bold text-slate-900">45.2K</div>
                                    </div>
                                </div>
                                <div className="p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted-foreground">Deadline</div>
                                        <div className="font-bold text-slate-900">15 Days Left</div>
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
