"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bookmark, Briefcase, CheckCircle, TrendingUp, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useProtectedAction } from "@/lib/auth";
import { useRouter } from "next/navigation";

const stats = [
    {
        title: "Saved Jobs",
        value: "12",
        icon: Bookmark,
        color: "text-blue-600",
        bg: "bg-blue-100",
    },
    {
        title: "Applied Jobs",
        value: "8",
        icon: Briefcase,
        color: "text-orange-600",
        bg: "bg-orange-100",
    },
    {
        title: "Assessments",
        value: "3",
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
    },
    {
        title: "Profile Views",
        value: "45",
        icon: TrendingUp,
        color: "text-purple-600",
        bg: "bg-purple-100",
    },
];

const recommendedJobs = [
    { title: "Senior React Developer", company: "TechCorp", location: "Pune", salary: "₹12L+" },
    { title: "UX Designer", company: "CreativeStudio", location: "Indore", salary: "₹8L+" },
    { title: "Product Manager", company: "StartUp Inc", location: "Bhopal", salary: "₹14L+" },
];

export default function DashboardPage() {
    const { verifyAccess } = useProtectedAction();
    const router = useRouter();
    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="container mx-auto px-4 space-y-8">

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Welcome back, Alex! 👋</h1>
                        <p className="text-muted-foreground">Here's what's happening with your job search today.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="rounded-full relative">
                            <Bell className="w-5 h-5 text-slate-600" />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                        </Button>
                        <div className="flex items-center gap-3 pl-4 border-l">
                            <div className="w-10 h-10 rounded-full bg-slate-200" />
                            <div className="hidden md:block">
                                <div className="font-medium text-sm">Alex Johnson</div>
                                <div className="text-xs text-muted-foreground">Software Engineer</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Completion */}
                <Card className="border-none shadow-md bg-white overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                    <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-1 space-y-2 w-full">
                            <div className="flex justify-between text-sm font-medium">
                                <span>Profile Completion</span>
                                <span className="text-primary">85%</span>
                            </div>
                            <Progress value={85} className="h-3 bg-slate-100" />
                            <p className="text-sm text-muted-foreground">
                                Complete your profile to appear in 3x more searches. <span className="text-primary cursor-pointer hover:underline">Add skills now</span>
                            </p>
                        </div>
                        <Button className="shrink-0 bg-secondary hover:bg-slate-800 text-white">
                            Complete Profile
                        </Button>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="border-none shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
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
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recommended Jobs */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900">Recommended for you</h2>
                            <Button variant="link" className="text-primary">View all</Button>
                        </div>
                        <div className="space-y-4">
                            {recommendedJobs.map((job, i) => (
                                <Card key={i} className="group hover:border-primary/50 transition-colors cursor-pointer">
                                    <CardContent className="p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                                {job.company[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">{job.title}</h3>
                                                <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium text-slate-900">{job.salary}</div>
                                            <div className="text-xs text-muted-foreground">Posted 2d ago</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Side Panel - Skill Assessments & Mock Interview */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Skill Assessments</h2>
                        <Card className="bg-slate-900 text-white border-none">
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">React.js Assessment</h3>
                                    <p className="text-sm text-slate-400">Prove your skills and get a verified badge.</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-300">
                                    <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> 15 Questions</div>
                                    <div className="flex items-center gap-1"><TrendingUp className="w-4 h-4" /> Intermediate</div>
                                </div>
                                <Button
                                    className="w-full bg-primary hover:bg-orange-600 text-white"
                                    onClick={() => verifyAccess("start assessment") && router.push("/practice/1")}
                                >
                                    Start Assessment
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none">
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">AI Mock Interview</h3>
                                    <p className="text-sm text-blue-100">Practice with our AI interviewer and get instant feedback.</p>
                                </div>
                                <Button
                                    variant="secondary"
                                    className="w-full bg-white text-blue-900 hover:bg-blue-50"
                                    onClick={() => verifyAccess("start mock interview")}
                                >
                                    Start Interview
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Recent Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { text: "Applied to Senior Frontend Dev", time: "2h ago" },
                                    { text: "Profile viewed by Google", time: "5h ago" },
                                    { text: "Completed JS Assessment", time: "1d ago" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm">
                                        <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0" />
                                        <div>
                                            <p className="font-medium text-slate-900">{item.text}</p>
                                            <p className="text-xs text-muted-foreground">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    );
}
