"use client";

import { ProfileSidebar } from "@/components/shared/profile-sidebar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { JobCard } from "@/components/shared/job-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Suspense } from "react";



export default function WatchlistPage() {
    // Fetch bookmarks for jobs and internships
    const jobBookmarks = useQuery(api.user_actions.getBookmarks, { type: "job" });
    const internshipBookmarks = useQuery(api.user_actions.getBookmarks, { type: "internship" });

    const isLoading = jobBookmarks === undefined || internshipBookmarks === undefined;
    const hasItems = (jobBookmarks?.length || 0) + (internshipBookmarks?.length || 0) > 0;

    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
            <div className="min-h-screen bg-slate-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar */}
                        <aside className="lg:w-64 shrink-0">
                            <ProfileSidebar />
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100">
                                    <h1 className="text-2xl font-bold text-slate-900">My Watchlist</h1>
                                    <p className="text-slate-500 mt-1">Saved jobs and internships you are interested in.</p>
                                </div>

                                <div className="p-6">
                                    {isLoading ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[1, 2, 3, 4].map((i) => (
                                                <Skeleton key={i} className="h-48 rounded-xl" />
                                            ))}
                                        </div>
                                    ) : !hasItems ? (
                                        <div className="text-center py-20 flex flex-col items-center">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                <Heart className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">No saved items yet</h3>
                                            <p className="text-slate-500 mb-6 max-w-sm text-center">
                                                Items you bookmark will appear here. Browse jobs and internships to get started.
                                            </p>
                                            <div className="flex gap-4">
                                                <Button asChild>
                                                    <Link href="/jobs">Browse Jobs</Link>
                                                </Button>
                                                <Button variant="outline" asChild>
                                                    <Link href="/internships">Browse Internships</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {/* Jobs Section */}
                                            {jobBookmarks && jobBookmarks.length > 0 && (
                                                <div className="space-y-4">
                                                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                        Jobs <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{jobBookmarks.length}</span>
                                                    </h2>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {jobBookmarks.map((bookmark: any) => (
                                                            bookmark.details ? (
                                                                <JobCard
                                                                    key={bookmark._id}
                                                                    id={bookmark.targetId}
                                                                    title={bookmark.details.title}
                                                                    company={bookmark.details.company?.name || "Unknown"}
                                                                    location={bookmark.details.location}
                                                                    type={bookmark.details.type}
                                                                    salary={bookmark.details.salary}
                                                                    tags={bookmark.details.tags || []}
                                                                    logo={bookmark.details.company?.logo}
                                                                    variant="grid"
                                                                    postedAt={bookmark.details.postedAt}
                                                                    bookmarkType="job"
                                                                />
                                                            ) : null
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Internships Section */}
                                            {internshipBookmarks && internshipBookmarks.length > 0 && (
                                                <div className="space-y-4">
                                                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                        Internships <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{internshipBookmarks.length}</span>
                                                    </h2>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {internshipBookmarks.map((bookmark: any) => (
                                                            bookmark.details ? (
                                                                <JobCard
                                                                    key={bookmark._id}
                                                                    id={bookmark.targetId}
                                                                    title={bookmark.details.title}
                                                                    company={bookmark.details.company?.name || "Unknown"}
                                                                    location={bookmark.details.location}
                                                                    type={bookmark.details.type}
                                                                    salary={bookmark.details.stipend || "Unpaid"}
                                                                    tags={bookmark.details.tags || []}
                                                                    logo={bookmark.details.company?.logo}
                                                                    variant="grid"
                                                                    postedAt={bookmark.details.postedAt}
                                                                    bookmarkType="internship"
                                                                />
                                                            ) : null
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
