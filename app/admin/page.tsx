"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Briefcase, TrendingUp } from "lucide-react";

const stats = [
    { title: "Total Users", value: "15,234", change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Daily Applications", value: "845", change: "+5%", icon: FileText, color: "text-green-600", bg: "bg-green-100" },
    { title: "Active Recruiters", value: "320", change: "+8%", icon: Briefcase, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Mock Tests Taken", value: "2,100", change: "+15%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
];

export default function AdminOverviewPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
                <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-none shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                    <span className="text-xs font-medium text-green-600">{stat.change}</span>
                                </div>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-muted-foreground">
                            Chart Placeholder
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Platform Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-muted-foreground">
                            Activity Graph Placeholder
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
