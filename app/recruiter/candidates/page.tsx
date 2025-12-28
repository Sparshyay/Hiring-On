"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Briefcase, GraduationCap, Users, ArrowRight, Calendar, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function RecruiterCandidatesPage() {
    const jobStats = useQuery(api.applications.getJobApplicationStats);
    const [filter, setFilter] = useState("all"); // 'all', 'Job', 'Internship'
    const [search, setSearch] = useState("");

    const filteredStats = jobStats?.filter(stat => {
        const matchesType = filter === "all" || stat.type === filter;
        const matchesSearch = stat.title.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    if (jobStats === undefined) {
        return (
            <div className="flex h-[500px] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Candidates</h1>
                    <p className="text-slate-500">Manage applications by job or internship posting.</p>
                </div>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                    <Button
                        variant={filter === "all" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setFilter("all")}
                        className={filter === "all" ? "bg-white text-slate-900 shadow-sm hover:bg-white" : "text-slate-600"}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "Job" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setFilter("Job")}
                        className={filter === "Job" ? "bg-white text-slate-900 shadow-sm hover:bg-white" : "text-slate-600"}
                    >
                        Jobs
                    </Button>
                    <Button
                        variant={filter === "Internship" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setFilter("Internship")}
                        className={filter === "Internship" ? "bg-white text-slate-900 shadow-sm hover:bg-white" : "text-slate-600"}
                    >
                        Internships
                    </Button>
                </div>
            </div>

            <div className="relative max-w-md">
                <Input
                    placeholder="Search roles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>

            {filteredStats && filteredStats.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-xl bg-slate-50/50">
                    <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No postings found matching your filters.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStats?.map((stat) => (
                        <Card key={stat.id} className="group hover:shadow-md transition-shadow duration-200 border-slate-200">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className={`
                                        ${stat.type === 'Job' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'}
                                    `}>
                                        {stat.type}
                                    </Badge>
                                    <Badge variant={stat.status === "Active" ? "default" : "secondary"}>
                                        {stat.status}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                                    {stat.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 text-xs">
                                    <Calendar className="h-3 w-3" />
                                    Posted {new Date(stat.created_at).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
                                    <div>
                                        <div className="text-2xl font-bold text-slate-900">{stat.applicationCount}</div>
                                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Applicants</div>
                                    </div>
                                    <Button asChild size="sm" className="gap-2">
                                        <Link href={`/recruiter/candidates/${stat.id}`}>
                                            View Applicants <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
