"use client";

import { ProfileSidebar } from "@/components/shared/profile-sidebar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { JobCard } from "@/components/shared/job-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { History } from "lucide-react";
import { Suspense } from "react";



export default function RecentlyViewedPage() {
    const recentlyViewed = useQuery(api.user_actions.getRecentlyViewed, {});

    const isLoading = recentlyViewed === undefined;
    const hasItems = recentlyViewed && recentlyViewed.length > 0;

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
                                    <h1 className="text-2xl font-bold text-slate-900">Recently Viewed</h1>
                                    <p className="text-slate-500 mt-1">Jobs and internships you have viewed recently.</p>
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
                                                <History className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">No history yet</h3>
                                            <p className="text-slate-500 mb-6 max-w-sm text-center">
                                                Jobs and internships you view will appear here.
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {recentlyViewed.map((item: any) => (
                                                item.details ? (
                                                    <JobCard
                                                        key={item._id}
                                                        id={item.targetId}
                                                        title={item.details.title}
                                                        company={item.details.company?.name || "Unknown"}
                                                        location={item.details.location}
                                                        type={item.details.type}
                                                        salary={item.type === "internship" ? (item.details.stipend || "Unpaid") : item.details.salary}
                                                        tags={item.details.tags || []}
                                                        logo={item.details.company?.logo}
                                                        variant="grid"
                                                        postedAt={item.details.postedAt}
                                                        bookmarkType={item.type === "internship" ? "internship" : "job"}
                                                    />
                                                ) : null
                                            ))}
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
