"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Loader2, Briefcase, GraduationCap, ChevronRight, Users, ArrowRight, Calendar, Filter } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

// Component to display applicants for a specific job/internship
function ApplicantList({ jobId, onClose }: { jobId: Id<"jobs"> | Id<"internships">, onClose: () => void }) {
    const applications = useQuery(api.applications.getRecruiterApplications, { jobId });

    if (!applications) {
        return <div className="p-8 text-center text-muted-foreground">Loading applicants...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Applicants ({applications.length})</h3>
                <Button variant="ghost" size="sm" onClick={onClose}>Back to List</Button>
            </div>

            <div className="rounded-md border overflow-x-auto">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Applied</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applications.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No applications yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            applications.map((app) => {
                                if (!app) return null;
                                return (
                                    <TableRow key={app._id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {app.candidate.avatar && <img src={app.candidate.avatar} className="w-6 h-6 rounded-full" />}
                                                {app.candidate.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>{app.candidate.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={app.status === "Shortlisted" ? "default" : "secondary"}>
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={app.resumeUrl} target="_blank">View Resume</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export function CandidatesContent() {
    const jobStats = useQuery(api.applications.getAllJobApplicationStats); // Using the new admin-scoped query

    // State to track drilled-down view
    const [selectedPosting, setSelectedPosting] = useState<{ id: string, title: string } | null>(null);
    const [filter, setFilter] = useState("all"); // 'all', 'Job', 'Internship'
    const [search, setSearch] = useState("");

    const filteredStats = jobStats?.filter(stat => {
        const matchesType = filter === "all" || stat.type === filter;
        const matchesSearch = stat.title.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch;
    });

    if (jobStats === undefined) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
                <p className="text-muted-foreground">
                    View applications grouped by Job or Internship.
                </p>
            </div>

            {selectedPosting ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="text-muted-foreground cursor-pointer hover:underline" onClick={() => setSelectedPosting(null)}>Postings</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            {selectedPosting.title}
                        </CardTitle>
                        <CardDescription>Manage applications for this posting.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ApplicantList jobId={selectedPosting.id as any} onClose={() => setSelectedPosting(null)} />
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                        <div className="relative max-w-sm w-full md:w-auto">
                            <Input
                                placeholder="Search roles..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        </div>
                    </div>

                    {filteredStats && filteredStats.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-slate-50/50">
                            <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No postings found matching your filters.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStats?.map((stat) => (
                                <Card key={stat.id} className="group hover:shadow-md transition-shadow duration-200 border-slate-200 cursor-pointer" onClick={() => setSelectedPosting({ id: stat.id, title: stat.title })}>
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline" className={`
                                                ${stat.type === 'Job' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-blue-50 text-blue-700 border-blue-100'}
                                            `}>
                                                {stat.type}
                                            </Badge>
                                            <Badge variant={stat.status === "active" || stat.status === "Active" ? "default" : "secondary"}>
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
                                            <Button size="sm" className="gap-2" variant="secondary">
                                                View Applicants <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
