"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, Bell, Search, Settings, Users, Building2, Briefcase } from "lucide-react";

// Mock Data for Job Portal Admin
const ACTIVITY_DATA = [
    { name: 'Mon', applications: 145, jobs: 12 },
    { name: 'Tue', applications: 230, jobs: 18 },
    { name: 'Wed', applications: 185, jobs: 15 },
    { name: 'Thu', applications: 278, jobs: 22 },
    { name: 'Fri', applications: 190, jobs: 25 },
    { name: 'Sat', applications: 120, jobs: 8 },
    { name: 'Sun', applications: 95, jobs: 5 },
];

const RECENT_ACTIVITIES = [
    { action: "New Job Posted", details: "Senior React Dev at Tech Corp", time: "2 min ago", type: "job" },
    { action: "Recruiter Signup", details: "Design Studio Ltd.", time: "15 min ago", type: "user" },
    { action: "New Application", details: "John Doe -> Frontend Role", time: "1 hour ago", type: "application" },
    { action: "Job Reported", details: "Suspicious listing #402", time: "3 hours ago", type: "alert" },
    { action: "Subscription", details: "Startup Inc upgraded to Pro", time: "5 hours ago", type: "money" },
];

export function DashboardContent() {
    return (
        <div className="space-y-8 p-8 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Overview</h1>
                    <p className="text-slate-500">Platform health and moderation console.</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Header Controls Removed as per user request */}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Card 1: Candidates (Blue) */}
                <Card className="bg-blue-600 text-white border-none shadow-xl shadow-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-blue-100 text-2xl">●</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium text-blue-100 mb-1">Total Candidates</div>
                        <div className="text-3xl font-bold mb-4">12,543</div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="bg-white/20 px-2 py-1 rounded text-white flex gap-1 items-center">
                                <ArrowUpRight className="w-3 h-3" /> +125 Today
                            </span>
                            <span className="text-blue-100">85% Profile Completion</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 2: Recruiters (Orange) */}
                <Card className="bg-orange-100 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="p-2 bg-orange-500 rounded-lg text-white">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <span className="text-orange-300 transform rotate-180 text-xl">▼</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium text-slate-600 mb-1">Recruiters</div>
                        <div className="text-3xl font-bold text-slate-900 mb-4">845</div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-orange-600 font-semibold flex gap-1 items-center">
                                <ArrowUpRight className="w-3 h-3" /> +12 Pending
                            </span>
                            <span className="text-slate-400">Needs Verification</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 3: Jobs (Black) */}
                <Card className="bg-slate-900 text-white border-none shadow-xl shadow-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="text-sm font-medium text-slate-400">Active Jobs</div>
                        <Briefcase className="w-5 h-5 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-1">2,304</div>
                        <div className="text-green-400 text-sm font-medium mb-8">+45 New Today</div>
                        <div className="text-slate-500 text-xs">
                            Total Applications: 45,231
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-7">
                {/* Chart Section */}
                <Card className="col-span-4 border-none shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Platform Activity</CardTitle>
                            <div className="flex gap-4 text-sm text-slate-500">
                                <span className="text-slate-900 font-medium">Weekly</span>
                                <span>Monthly</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ACTIVITY_DATA} barSize={20}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="applications" name="Applications" fill="#2563eb" radius={[4, 4, 0, 0]} stackId="a" />
                                    <Bar dataKey="jobs" name="New Jobs" fill="#fb923c" radius={[4, 4, 0, 0]} stackId="a" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activities List */}
                <Card className="col-span-3 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {RECENT_ACTIVITIES.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${item.type === 'job' ? 'bg-orange-500' :
                                            item.type === 'user' ? 'bg-blue-500' :
                                                item.type === 'alert' ? 'bg-red-500' : 'bg-green-500'
                                            }`} />
                                        <div>
                                            <div className="font-medium text-slate-700 text-sm">{item.action}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-[150px]">{item.details}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-400">{item.time}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
