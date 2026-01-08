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
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { FilterBar } from "@/components/shared/filter-bar";
import { useState } from "react";
import { JobDetailModal } from "@/components/admin/job-detail-modal";

export function JobsMonitorContent() {
    const jobs = useQuery(api.jobs.getAllJobsAdmin);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [selectedJob, setSelectedJob] = useState<any>(null);

    const filteredJobs = jobs?.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.companyName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !filters["status"] || job.status === filters["status"];
        return matchesSearch && matchesStatus;
    });

    if (jobs === undefined) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Jobs Monitor</h1>
                <p className="text-muted-foreground">
                    Monitor all job postings across the platform.
                </p>
            </div>

            <FilterBar
                onSearchChange={setSearchQuery}
                onFilterChange={setFilters}
                searchPlaceholder="Search jobs or companies..."
                filterGroups={[
                    {
                        id: "status",
                        label: "Status",
                        options: [
                            { label: "Active", value: "Active" },
                            { label: "Closed", value: "Closed" },
                            { label: "Pending", value: "Pending" }
                        ]
                    }
                ]}
            />

            <Card>
                <CardHeader>
                    <CardTitle>All Jobs</CardTitle>
                    <CardDescription>A list of all jobs posted by any recruiter.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table className="min-w-[1000px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Posted Date</TableHead>
                                <TableHead className="text-right">Stats</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredJobs?.map((job) => (
                                <TableRow
                                    key={job._id}
                                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => setSelectedJob(job)}
                                >
                                    <TableCell className="font-medium">{job.title}</TableCell>
                                    <TableCell>{job.companyName}</TableCell>
                                    <TableCell>{job.location}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                job.status === "Active"
                                                    ? "default"
                                                    : job.status === "Closed"
                                                        ? "secondary"
                                                        : "outline"
                                            }
                                        >
                                            {job.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Calendar className="mr-2 h-3 w-3" />
                                            {format(job.postedAt, "MMM d, yyyy")}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center">
                                                <Eye className="mr-1 h-3 w-3" />
                                                {job.views || 0}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredJobs?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                        No jobs found matching your filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <JobDetailModal
                job={selectedJob}
                isOpen={!!selectedJob}
                onClose={() => setSelectedJob(null)}
            />
        </div>
    );
}
