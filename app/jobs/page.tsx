"use client";

import { JobCard } from "@/components/shared/job-card";
import { JobFilters } from "@/components/shared/job-filters";
import { FeaturedJobsSidebar } from "@/components/shared/featured-jobs-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSearchParams } from "next/navigation";
import { useGetJobs } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, Suspense } from "react";
import { cn } from "@/lib/utils";

function JobsContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("search") || "";
    const initialLocation = searchParams.get("location") || "";

    const allJobs = useGetJobs();
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [locationQuery, setLocationQuery] = useState(initialLocation);

    // Initial Filter to show only jobs (exclude internships)
    // And Apply Search & Location Filters
    const jobs = allJobs?.filter(job => {
        const isJob = !job.type.toLowerCase().includes("intern");
        if (!isJob) return false;

        const matchesSearch = !searchQuery ||
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesLocation = !locationQuery ||
            job.location.toLowerCase().includes(locationQuery.toLowerCase());

        return matchesSearch && matchesLocation;
    })?.sort((a, b) => {
        // Sort Featured First
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
    }) || [];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Search Section */}
            <div className="bg-white border-b sticky top-16 z-30">
                <div className="container mx-auto px-4 py-6">
                    <div className="max-w-4xl mx-auto space-y-8">

                        <div className="bg-white p-2 rounded-full shadow-xl border border-slate-200 flex flex-col md:flex-row gap-2 max-w-3xl mx-auto items-center">
                            <div className="flex-1 flex items-center px-6 h-14 border-b md:border-b-0 md:border-r border-slate-100 w-full md:w-auto">
                                <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                                <Input
                                    placeholder="Job title, skills, or company"
                                    className="border-none bg-transparent shadow-none focus-visible:ring-0 h-full text-base placeholder:text-slate-400 p-0"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 flex items-center px-6 h-14 w-full md:w-auto">
                                <MapPin className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                                <Input
                                    placeholder="City, state, or remote"
                                    className="border-none bg-transparent shadow-none focus-visible:ring-0 h-full text-base placeholder:text-slate-400 p-0"
                                    value={locationQuery}
                                    onChange={(e) => setLocationQuery(e.target.value)}
                                />
                            </div>
                            <Button size="lg" className="h-12 px-8 rounded-full bg-primary hover:bg-orange-600 text-white font-medium text-base shadow-lg shadow-orange-200 min-w-[140px] m-1">
                                Search
                            </Button>
                        </div>

                        {/* Mobile Filter Trigger */}
                        <div className="md:hidden flex justify-center mt-4">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="lg" className="gap-2 rounded-full border-slate-300">
                                        <SlidersHorizontal className="w-4 h-4" /> Filters
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                                    <div className="py-6">
                                        <JobFilters />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
                        {["All Jobs", "Software Engineering", "Design", "Marketing", "Product", "Sales", "Data Science"].map((cat, i) => (
                            <Button
                                key={cat}
                                variant={i === 0 ? "default" : "outline"}
                                className={`rounded-full ${i === 0 ? "bg-secondary hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50"}`}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Left Sidebar Filters (Desktop) */}
                    <aside className="hidden md:block w-64 shrink-0">
                        <div className="sticky top-48">
                            <JobFilters />
                        </div>
                    </aside>

                    {/* Center Job List */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">Showing {jobs?.length || 0} Jobs</h2>

                            <div className="flex items-center gap-4">
                                {/* View Toggle */}
                                <div className="flex items-center bg-white rounded-lg border p-1">
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={cn(
                                            "p-1.5 rounded-md transition-all",
                                            viewMode === "list" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                        )}
                                        title="List View"
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={cn(
                                            "p-1.5 rounded-md transition-all",
                                            viewMode === "grid" ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                        )}
                                        title="Grid View"
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>Sort by:</span>
                                    <select className="bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer">
                                        <option>Most Relevant</option>
                                        <option>Newest</option>
                                        <option>Salary: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={cn(
                            "grid gap-4",
                            viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                        )}>
                            {!jobs ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className={cn(
                                        "rounded-xl border bg-white p-6 space-y-4",
                                        viewMode === "list" ? "flex gap-4" : ""
                                    )}>
                                        <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-[200px]" />
                                            <Skeleton className="h-4 w-[150px]" />
                                            {viewMode === "grid" && <Skeleton className="h-10 w-full mt-4" />}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                jobs.map((job) => (
                                    <JobCard
                                        key={job._id}
                                        id={job._id}
                                        title={job.title}
                                        company={job.company?.name || "Unknown"}
                                        location={job.location}
                                        type={job.type}
                                        salary={job.salary}
                                        salaryDuration={job.salaryDuration}
                                        tags={job.tags}
                                        logo={job.logoUrl || job.company?.logo}
                                        variant={viewMode}
                                        applicationDeadline={job.applicationDeadline}
                                        postedAt={job.postedAt}
                                        isFeatured={job.isFeatured}
                                    />
                                ))
                            )}
                        </div>

                        <div className="mt-12 flex justify-center">
                            <Button variant="outline" size="lg" className="min-w-[200px]">
                                Load More Jobs
                            </Button>
                        </div>
                    </div>

                    {/* Right Sidebar Featured (Desktop/Large screens) */}
                    <aside className="hidden xl:block w-80 shrink-0">
                        <div className="sticky top-48">
                            <FeaturedJobsSidebar />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default function JobsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        }>
            <JobsContent />
        </Suspense>
    );
}
