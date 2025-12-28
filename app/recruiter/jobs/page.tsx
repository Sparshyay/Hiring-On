"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Users, Eye, MousePointer } from "lucide-react";
import Link from "next/link";

function timeAgo(date: number) {
    const seconds = Math.floor((Date.now() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

function getDaysLeft(deadline: number | undefined) {
    if (!deadline) return null;
    const diff = deadline - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
}

import { FilterBar } from "@/components/shared/filter-bar";
import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function MyJobsPage() {
    const jobs = useQuery(api.jobs.get, { limit: 50 });
    const updateJobStatus = useMutation(api.jobs.updateStatus);

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>({});

    const handleCloseJob = async (id: Id<"jobs">) => {
        if (!confirm("Are you sure you want to close this job? It will no longer accept applications.")) return;
        try {
            await updateJobStatus({ id, status: "closed" });
            toast.success("Job closed successfully.");
        } catch (err) {
            console.error(err);
            toast.error("Failed to close job.");
        }
    };

    const filteredJobs = jobs?.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !filters["status"] || job.status.toLowerCase() === filters["status"].toLowerCase();
        return matchesSearch && matchesStatus;
    });

    if (!jobs) {
        return <div className="p-8 text-center">Loading jobs...</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Jobs</h1>
                    <p className="text-slate-500">Manage your job postings and view applications.</p>
                </div>
                <Link href="/recruiter/post-job">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <Briefcase className="w-4 h-4 mr-2" /> Post New Job
                    </Button>
                </Link>
            </div>

            <FilterBar
                onSearchChange={setSearchQuery}
                onFilterChange={setFilters}
                searchPlaceholder="Search by title or location..."
                filterGroups={[
                    {
                        id: "status",
                        label: "Status",
                        options: [
                            { label: "Active", value: "active" },
                            { label: "Closed", value: "closed" },
                            { label: "Draft", value: "draft" }
                        ]
                    }
                ]}
            />

            <div className="grid grid-cols-1 gap-6 mt-6">
                {filteredJobs?.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No jobs found matching your filters</h3>
                        <p className="text-slate-500 mb-6">Try adjusting your search criteria.</p>
                        <Button variant="outline" onClick={() => { setSearchQuery(""); setFilters({}); }}>Clear Filters</Button>
                    </div>
                ) : (
                    filteredJobs?.map((job) => {
                        const daysLeft = getDaysLeft(job.applicationDeadline);
                        return (
                            <Card key={job._id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-1">{job.title}</h3>
                                                <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                                                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {job.location} ({job.workMode})</span>
                                                    <span className="flex items-center"><DollarSign className="w-3 h-3 mr-1" /> {job.salary} {job.salaryDuration === 'month' ? '/ mo' : '/ yr'}</span>
                                                    <span className="flex items-center text-indigo-600 font-medium">{job.type}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Badge className={job.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-slate-100 text-slate-700'}>
                                                    {job.status}
                                                </Badge>
                                                {daysLeft !== null && (
                                                    <span className={`text-xs font-medium ${daysLeft < 5 ? 'text-red-500' : 'text-slate-500'}`}>
                                                        {daysLeft} days left
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center gap-6 text-sm text-slate-500">
                                            <div className="flex items-center gap-1 title='Views'">
                                                <Eye className="w-4 h-4" /> <span>{job.views || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1 title='Clicks'">
                                                <MousePointer className="w-4 h-4" /> <span>{job.clicks || 0}</span>
                                            </div>
                                            <div className="flex items-center gap-1 font-medium text-slate-700 title='Applicants'">
                                                <Users className="w-4 h-4" /> <span>0 Applicants</span>
                                            </div>
                                            <span className="text-xs ml-auto text-slate-400">Posted {timeAgo(job.postedAt)}</span>
                                        </div>

                                    </div>
                                    <div className="flex flex-col gap-2 justify-center border-l pl-6 border-slate-100 min-w-[200px]">
                                        <Link href={`/jobs/${job._id}`} className="w-full" target="_blank">
                                            <Button variant="outline" size="sm" className="w-full">View Public Page</Button>
                                        </Link>
                                        <Link href={`/recruiter/candidates/${job._id}`} className="w-full">
                                            <Button variant="secondary" size="sm" className="w-full">View Applicants</Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={() => handleCloseJob(job._id)}
                                            disabled={job.status === 'closed'}
                                        >
                                            {job.status === 'closed' ? 'Closed' : 'Close Job'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}

