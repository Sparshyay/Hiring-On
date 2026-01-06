"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Building2, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ApplicationsContent() {
    const applications = useQuery(api.applications.getMyApplications);

    if (applications === undefined) {
        return (
            <div className="container mx-auto px-4 py-8 space-y-4">
                <h1 className="text-3xl font-bold">My Applications</h1>
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="w-full h-32">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-4 w-[150px]" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">My Applications</h1>
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-slate-100 p-6 rounded-full">
                        <FileText className="h-12 w-12 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900">No applications yet</h2>
                    <p className="text-slate-500 max-w-sm">
                        You haven't applied to any jobs or internships yet. Start exploring opportunities!
                    </p>
                    <Button asChild className="mt-4">
                        <Link href="/jobs">Browse Jobs</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "applied": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
            case "shortlisted": return "bg-green-100 text-green-700 hover:bg-green-100";
            case "rejected": return "bg-red-100 text-red-700 hover:bg-red-100";
            case "selected": return "bg-purple-100 text-purple-700 hover:bg-purple-100";
            case "round 2": return "bg-orange-100 text-orange-700 hover:bg-orange-100";
            default: return "bg-slate-100 text-slate-700 hover:bg-slate-100";
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-3xl font-bold mb-2">My Applications</h1>
            <p className="text-slate-500 mb-8">Track the status of your job and internship applications.</p>

            <div className="grid gap-4">
                {applications.map((app: any) => (
                    <Card key={app._id} className="hover:shadow-md transition-shadow duration-200">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-lg border bg-white flex items-center justify-center overflow-hidden shrink-0">
                                        {app.company?.logo ? (
                                            <Image
                                                src={app.company.logo}
                                                alt={app.company.name}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        ) : (
                                            <Building2 className="w-8 h-8 text-slate-400" />
                                        )}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-lg text-slate-900">
                                                {app.job.title}
                                            </h3>
                                            <Badge variant="outline" className="text-xs font-normal">
                                                {app.job.type}
                                            </Badge>
                                        </div>

                                        <p className="text-slate-600 font-medium">{app.company?.name || "Unknown Company"}</p>

                                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{app.job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>Applied on {format(new Date(app.appliedAt), "MMM d, yyyy")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-4 md:w-auto w-full border-t md:border-t-0 pt-4 md:pt-0">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-xs text-slate-500 uppercase font-semibold">Status</span>
                                        <Badge className={`px-3 py-1 rounded-full ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </Badge>
                                    </div>

                                    {/* Link to Job Details or Application Details? 
                                        Clicking card could go to details. For now, add a button.
                                    */}
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/jobs/${app.jobId}`}>
                                            <ChevronRight className="w-5 h-5 text-slate-400" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Optional: Timeline or Feedback if present */}
                            {app.feedback && (
                                <div className="mt-4 bg-yellow-50 p-3 rounded-md text-sm text-yellow-800 border border-yellow-100">
                                    <strong>Recruiter Feedback:</strong> {app.feedback}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
