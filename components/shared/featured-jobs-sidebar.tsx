"use client";

import { useGetFeaturedJobs } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Building2 } from "lucide-react";

export function FeaturedJobsSidebar() {
    const jobs = useGetFeaturedJobs();

    return (
        <div className="space-y-6">
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-lg mb-4 text-slate-900">Featured</h3>
                <div className="space-y-4">
                    {!jobs ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-3">
                                <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : (
                        jobs.slice(0, 5).map((job) => (
                            <Link
                                key={job._id}
                                href={`/jobs/${job._id}`}
                                className="flex items-start gap-3 group p-2 hover:bg-white rounded-lg transition-colors"
                            >
                                <div className="h-10 w-10 rounded-lg bg-white border shadow-sm flex items-center justify-center text-sm font-bold text-slate-700 shrink-0 group-hover:scale-105 transition-transform">
                                    {job.company?.name?.[0] || "C"}
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm text-slate-900 group-hover:text-primary line-clamp-2 leading-tight">
                                        {job.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <Building2 className="h-3 w-3" /> {job.company?.name || "Unknown"}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Ad / Promo Placeholder */}
            <div className="bg-gradient-to-br from-primary/10 to-orange-100 rounded-xl p-6 text-center space-y-4">
                <h3 className="font-bold text-lg text-primary">Get Hired Faster</h3>
                <p className="text-sm text-muted-foreground">Boost your profile and get noticed by top recruiters.</p>
                <Link href="/premium" className="text-sm font-semibold text-primary hover:underline">
                    Upgrade to Premium
                </Link>
            </div>
        </div>
    );
}
