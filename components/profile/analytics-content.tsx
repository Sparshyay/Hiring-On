"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Target, Clock, Trophy, BarChart2, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";


export function AnalyticsContent() {
    const router = useRouter();
    const analytics = useQuery(api.analytics.getUserAnalytics, {});

    if (analytics === undefined) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading analytics...</div>;
    }

    if (analytics === null) {
        return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <p>Please log in to view analytics.</p>
            <Button onClick={() => router.push("/login")}>Login</Button>
        </div>;
    }

    const { overview, categoryPerformance, recentActivity, insights } = analytics;

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Skill Analytics</h1>
                    <p className="text-slate-500 text-sm">Track your progress and performance over time</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto space-y-8">

                {/* 1. Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Assessments</p>
                                <h3 className="text-2xl font-bold text-slate-900">{overview.totalTests}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <Target className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Avg. Accuracy</p>
                                <h3 className="text-2xl font-bold text-slate-900">{overview.averageAccuracy}%</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Avg. Score</p>
                                <h3 className="text-2xl font-bold text-slate-900">{overview.averageScore}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Completed</p>
                                <h3 className="text-2xl font-bold text-slate-900">{overview.testsCompleted}</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* 2. Category Performance Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart2 className="w-5 h-5 text-slate-500" />
                                Category Performance
                            </CardTitle>
                            <CardDescription>Average accuracy across different topics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                {categoryPerformance.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={categoryPerformance} layout="vertical" margin={{ left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                            <XAxis type="number" domain={[0, 100]} hide />
                                            <YAxis dataKey="category" type="category" width={100} tick={{ fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                cursor={{ fill: '#f1f5f9' }}
                                            />
                                            <Bar dataKey="accuracy" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                        No sufficient data yet.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. Insights / Strengths */}
                    <div className="space-y-6">
                        <Card className="bg-green-50/50 border-green-100">
                            <CardHeader>
                                <CardTitle className="text-green-700 text-lg">Key Strengths</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {insights.strongCategories.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {insights.strongCategories.map(cat => (
                                            <span key={cat} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">Keep practicing to identify your strengths!</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="bg-amber-50/50 border-amber-100">
                            <CardHeader>
                                <CardTitle className="text-amber-700 text-lg">Focus Areas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {insights.weakCategories.length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            {insights.weakCategories.map(cat => (
                                                <span key={cat} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                        <Button variant="outline" size="sm" className="w-full border-amber-200 text-amber-700 hover:bg-amber-100" onClick={() => router.push("/practice")}>
                                            Practice Now
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-500">No weak areas identified yet. Great job!</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* 4. Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest assessment attempts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            {recentActivity.length > 0 ? recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${activity.status === 'completed' ? 'bg-green-500' : 'bg-slate-300'}`} />
                                        <div>
                                            <p className="font-medium text-slate-900">{activity.testName}</p>
                                            <p className="text-xs text-slate-500">{new Date(activity.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {activity.score !== undefined ? (
                                            <span className="font-bold text-slate-900">{activity.score} <span className="text-xs text-slate-500 font-normal">Marks</span></span>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">In Progress</span>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    No activity yet. Start your first test!
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
