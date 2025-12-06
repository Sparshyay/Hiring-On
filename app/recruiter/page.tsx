"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, Calendar, TrendingUp, MoreHorizontal, CheckCircle2, XCircle, Clock } from "lucide-react";
import Link from "next/link";

const stats = [
    { title: "Active Jobs", value: "12", icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Applicants", value: "1,234", icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Interviews Scheduled", value: "28", icon: Calendar, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Hiring Rate", value: "18%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
];

const candidates = [
    { name: "Sarah Williams", role: "Senior Frontend Dev", match: "98%", status: "Shortlisted", avatar: "S" },
    { name: "Michael Chen", role: "Product Designer", match: "92%", status: "Reviewing", avatar: "M" },
    { name: "Jessica Davis", role: "Marketing Manager", match: "88%", status: "Interview", avatar: "J" },
    { name: "David Kim", role: "Backend Engineer", match: "95%", status: "Shortlisted", avatar: "D" },
];

const jobPosts = [
    { title: "Senior Frontend Engineer", applicants: 145, status: "Active", posted: "2 days ago" },
    { title: "Product Designer", applicants: 89, status: "Active", posted: "5 days ago" },
    { title: "Marketing Specialist", applicants: 234, status: "Closed", posted: "2 weeks ago" },
];

import { useState } from "react";

export default function RecruiterDashboard() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const runAiAnalysis = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            alert("AI Analysis Complete! Candidate rankings updated.");
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4 space-y-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Recruiter Dashboard</h1>
                        <p className="text-muted-foreground">Manage your hiring pipeline and track performance.</p>
                    </div>
                    <Button className="bg-primary hover:bg-orange-600 text-white" asChild>
                        <Link href="/recruiter/post-job">Post New Job</Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <Card key={stat.title} className="border-none shadow-sm hover:shadow-md transition-all">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content - Candidates */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        AI Shortlisted Candidates
                                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">Beta</Badge>
                                    </CardTitle>
                                    <CardDescription>Top candidates matched by our AI engine.</CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={runAiAnalysis}
                                    disabled={isAnalyzing}
                                    className={isAnalyzing ? "animate-pulse" : ""}
                                >
                                    {isAnalyzing ? "Analyzing..." : "Refresh Analysis"}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {candidates.map((candidate, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-white border flex items-center justify-center font-bold text-slate-700 shadow-sm">
                                                    {candidate.avatar}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{candidate.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{candidate.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-green-600">{candidate.match} Match</div>
                                                    <Badge variant="outline" className="mt-1">{candidate.status}</Badge>
                                                </div>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="w-5 h-5" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-xl">Recent Job Posts</CardTitle>
                                <Button variant="outline" size="sm">Manage Jobs</Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {jobPosts.map((job, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border rounded-xl">
                                            <div>
                                                <h4 className="font-bold text-slate-900">{job.title}</h4>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <Clock className="w-3 h-3" /> Posted {job.posted}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-center">
                                                    <div className="font-bold text-slate-900">{job.applicants}</div>
                                                    <div className="text-xs text-muted-foreground">Applicants</div>
                                                </div>
                                                <Badge variant={job.status === "Active" ? "default" : "secondary"} className={job.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}>
                                                    {job.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Schedule */}
                    <div className="space-y-6">
                        <Card className="bg-secondary text-white border-none shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Today's Interviews</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { time: "10:00 AM", name: "Alex Johnson", role: "Frontend Dev" },
                                    { time: "02:30 PM", name: "Maria Garcia", role: "Product Manager" },
                                    { time: "04:00 PM", name: "James Wilson", role: "UX Designer" },
                                ].map((interview, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <div className="text-sm font-bold text-orange-300 w-16">{interview.time}</div>
                                        <div>
                                            <div className="font-medium">{interview.name}</div>
                                            <div className="text-xs text-slate-300">{interview.role}</div>
                                        </div>
                                    </div>
                                ))}
                                <Button className="w-full bg-white text-secondary hover:bg-slate-100 mt-4">
                                    View Calendar
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start"><Briefcase className="w-4 h-4 mr-2" /> Post a Job</Button>
                                <Button variant="outline" className="w-full justify-start"><Users className="w-4 h-4 mr-2" /> Search Candidates</Button>
                                <Button variant="outline" className="w-full justify-start"><TrendingUp className="w-4 h-4 mr-2" /> View Analytics</Button>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
