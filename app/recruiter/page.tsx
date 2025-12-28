"use client";

import { RecentApplicants } from "@/components/recruiter/recent-applicants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, Bell, Search, Briefcase, Users, Eye } from "lucide-react";

// Mock Data
const VISITOR_DATA = [
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 200 },
    { name: 'Wed', value: 150 },
    { name: 'Thu', value: 280 },
    { name: 'Fri', value: 390 },
    { name: 'Sat', value: 180 },
    { name: 'Sun', value: 150 },
];

const RECENT_JOBS = [
    { name: "Senior Frontend Engineer", applicants: 45, status: "Active" },
    { name: "Product Designer", applicants: 12, status: "Active" },
    { name: "Marketing Manager", applicants: 89, status: "Closing Soon" },
    { name: "React Developer", applicants: 34, status: "Active" },
];

export default function RecruiterDashboard() {
    return (
        <div className="space-y-8 p-8 min-h-screen">
            {/* Header - Simplified */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Card 1: Brand Primary (Deep Purple/Blue) */}
                <Card className="bg-indigo-600 text-white border-none shadow-xl shadow-indigo-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-indigo-100 text-2xl">●</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium text-indigo-100 mb-1">Active Jobs</div>
                        <div className="text-3xl font-bold mb-4">12</div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="bg-white/20 px-2 py-1 rounded text-white flex gap-1 items-center">
                                <ArrowUpRight className="w-3 h-3" /> +2 New
                            </span>
                            <span className="text-indigo-100">Most Popular: Engineers</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 2: Secondary Brand (Cyan/Teal) */}
                <Card className="bg-cyan-50 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="p-2 bg-cyan-500 rounded-lg text-white">
                            <Users className="w-5 h-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium text-slate-600 mb-1">Total Candidates</div>
                        <div className="text-3xl font-bold text-slate-900 mb-4">845</div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600 font-semibold flex gap-1 items-center">
                                <ArrowUpRight className="w-3 h-3" /> +12%
                            </span>
                            <span className="text-slate-400">This week</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Card 3: Tertiary (Rose/Pink) */}
                <Card className="bg-rose-50 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="p-2 bg-rose-500 rounded-lg text-white">
                            <Eye className="w-5 h-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium text-slate-600 mb-1">Profile Views</div>
                        <div className="text-3xl font-bold text-slate-900 mb-4">2.4k</div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-rose-600 font-semibold flex gap-1 items-center">
                                <ArrowUpRight className="w-3 h-3" /> +5%
                            </span>
                            <span className="text-slate-400">Unique visitors</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-7">
                {/* Chart Section */}
                <Card className="col-span-4 border-none shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Job Views & Traffic</CardTitle>
                            <div className="flex gap-4 text-sm text-slate-500">
                                <span className="text-indigo-600 font-medium">Weekly</span>
                                <span>Monthly</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={VISITOR_DATA} barSize={20}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 4, 4]} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Jobs List */}
                <Card className="col-span-3 border-none shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Top Performing Jobs</CardTitle>
                            <Button variant="link" size="sm" className="text-indigo-600">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {RECENT_JOBS.map((job, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-3 rounded-full bg-indigo-200" />
                                        <div>
                                            <div className="font-medium text-slate-700">{job.name}</div>
                                            <div className="text-xs text-slate-400">{job.status}</div>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                                        {job.applicants} Applied
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Applicants Widget (New) */}
                <div className="col-span-4 md:col-span-3 lg:col-span-4 lg:col-start-1">
                    <RecentApplicants />
                </div>
            </div>
        </div>
    );
}
