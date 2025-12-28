"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProfileSidebar } from "@/components/shared/profile-sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, MapPin, Building2, CheckCircle2, XCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function ApplicationsPage() {
    const applications = useQuery(api.applications.getMyApplications);

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative items-start">

                    <ProfileSidebar />

                    <div className="lg:col-span-9 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">My Applications</h1>
                            <p className="text-slate-500">Track the status of your job applications.</p>
                        </div>

                        <div className="space-y-4">
                            {!applications ? (
                                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                                    <p className="text-slate-500">Loading your applications...</p>
                                </div>
                            ) : applications.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">No applications yet</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto">Start applying to jobs and tracked them here.</p>
                                    </div>
                                    <Button asChild className="bg-orange-600 hover:bg-orange-700">
                                        <Link href="/jobs">Browse Jobs</Link>
                                    </Button>
                                </div>
                            ) : (
                                applications.map((app) => (
                                    <Card key={app._id} className="hover:shadow-md transition-all border-slate-200 overflow-hidden group">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-1">
                                                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                                                                <Link href={`/jobs/${app.jobId}`}>{app.job?.title || "Job Unavailable"}</Link>
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-slate-600 font-medium">
                                                                <Building2 className="w-4 h-4 text-slate-400" />
                                                                <span>{app.job?.companyId || "Company"}</span>
                                                                {app.job?.location && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <MapPin className="w-4 h-4 text-slate-400" />
                                                                        <span>{app.job.location}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <Badge className={`
                                                            px-3 py-1 text-sm font-medium capitalize
                                                            ${app.status === 'Applied' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                                            ${app.status === 'Shortlisted' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                                            ${app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                                            ${app.status === 'Interview' ? 'bg-purple-50 text-purple-700 border-purple-200' : ''}
                                                        `}>
                                                            {app.status}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-sm text-slate-500 pt-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-4 h-4" />
                                                            Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                                        </div>
                                                        {app.customAnswers && app.customAnswers.length > 0 && (
                                                            <div className="flex items-center gap-1.5">
                                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                                Questions Answered
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status Steps Visualization (Simplified) */}
                                            <div className="mt-6 relative pt-4 border-t border-slate-100">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all duration-500 ${app.status === 'Rejected' ? 'bg-red-500 w-full' :
                                                                app.status === 'Shortlisted' ? 'bg-green-500 w-2/3' :
                                                                    'bg-blue-500 w-1/3'
                                                            }`}
                                                    ></div>
                                                </div>
                                                <div className="flex justify-between text-xs font-medium text-slate-500 pt-2">
                                                    <span className={app.status !== 'Applied' ? 'text-blue-600' : 'text-slate-900'}>Applied</span>
                                                    <span className={app.status === 'Shortlisted' ? 'text-green-600' : ''}>Reviewed</span>
                                                    <span className={app.status === 'Shortlisted' ? 'text-green-600' : ''}>Shortlisted</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
