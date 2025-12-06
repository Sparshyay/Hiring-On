"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { useGetJobs, useUpdateJobStatus } from "@/lib/api";

export default function JobManagementPage() {
    const jobs = useGetJobs();
    const updateStatus = useUpdateJobStatus();

    const handleApprove = async (id: string) => {
        // @ts-ignore
        await updateStatus({ id, status: "Active" });
    };

    const handleReject = async (id: string) => {
        // @ts-ignore
        await updateStatus({ id, status: "Rejected" });
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Job Management</h1>
                    <p className="text-muted-foreground">Review and manage job postings.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Job Postings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Job Title</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Posted Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!jobs ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Loading jobs...</TableCell>
                                </TableRow>
                            ) : (
                                jobs.map((job) => (
                                    <TableRow key={job._id}>
                                        <TableCell className="font-medium">{job.title}</TableCell>
                                        <TableCell>{job.company?.name || "Unknown"}</TableCell>
                                        <TableCell>{new Date(job.postedAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    job.status === "Active" ? "default" :
                                                        job.status === "Pending" ? "secondary" : "destructive"
                                                }
                                                className={
                                                    job.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-200" :
                                                        job.status === "Pending" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" :
                                                            "bg-red-100 text-red-700 hover:bg-red-200"
                                                }
                                            >
                                                {job.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                {job.status === "Pending" && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            onClick={() => handleApprove(job._id)}
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleReject(job._id)}
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
