"use client";

import { JobCard } from "@/components/shared/job-card";
import { JobFilters } from "@/components/shared/job-filters";
import { FeaturedJobsSidebar } from "@/components/shared/featured-jobs-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useSearchParams } from "next/navigation";
import { useGetJobs } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function JobsContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("search") || "";
    const initialLocation = searchParams.get("location") || "";
    const typeParam = searchParams.get("type");

    const allJobs = useGetJobs();
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [locationQuery, setLocationQuery] = useState(initialLocation);

    // Sync with URL params (for Mobile Header Search)
    useEffect(() => {
        setSearchQuery(searchParams.get("search") || "");
        setLocationQuery(searchParams.get("location") || "");
    }, [searchParams]);

    // Process Jobs: Filter -> Sort -> Inject Featured
    const jobs = (() => {
        if (!allJobs) return undefined;

        // 1. Filter
        const filtered = allJobs.filter(job => {
            const isInternship = job.type.toLowerCase().includes("intern");
            // If type="all", show both. Otherwise default to showing Jobs (hide interns)
            if (typeParam !== "all" && isInternship) return false;

            const matchesSearch = !searchQuery ||
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesLocation = !locationQuery ||
                job.location.toLowerCase().includes(locationQuery.toLowerCase());

            return matchesSearch && matchesLocation;
        });

        // 2. Sort by Date (Newest first)
        const sorted = filtered.sort((a, b) => {
            return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        });

        // 3. Inject Featured Jobs (every 3rd item)
        const featured = sorted.filter(j => j.isFeatured);
        const regular = sorted.filter(j => !j.isFeatured);

        if (featured.length === 0) return regular;

        const result = [];
        let regIdx = 0;
        let featIdx = 0;

        while (regIdx < regular.length) {
            // Add up to 3 regular jobs
            for (let i = 0; i < 3 && regIdx < regular.length; i++) {
                result.push(regular[regIdx++]);
            }
            // Inject 1 featured job if available
            if (featIdx < featured.length) {
                result.push(featured[featIdx++]);
            }
        }
        // Append any remaining featured jobs
        while (featIdx < featured.length) {
            result.push(featured[featIdx++]);
        }

        return result;
    })();

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Search Section (Hidden on Mobile now, moved to Global Header) */}
            <div className="hidden md:block bg-white border-b sticky top-16 z-30 shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <div className="max-w-4xl mx-auto space-y-4">

                        <div className="flex gap-3 items-start md:items-center">
                            {/* Desktop Search Panel */}
                            <div className="flex-1 bg-white p-1.5 rounded-3xl md:rounded-full shadow-sm border border-slate-100 flex flex-col md:flex-row gap-0 md:gap-2 items-center">
                                {/* Job Input */}
                                <div className="flex-1 flex items-center px-4 h-12 w-full md:w-auto border-b md:border-b-0 md:border-r border-slate-50 relative group transition-colors hover:bg-slate-50/50 rounded-t-2xl md:rounded-l-full md:rounded-tr-none">
                                    <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="Job title, skills, or company"
                                        className="border-none bg-transparent shadow-none focus-visible:ring-0 h-full text-base placeholder:text-slate-400 p-0 text-slate-700 font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {/* Location Input */}
                                <div className="flex-1 flex items-center px-4 h-12 w-full md:w-auto relative group transition-colors hover:bg-slate-50/50 rounded-b-2xl md:rounded-r-full md:rounded-bl-none">
                                    <MapPin className="w-5 h-5 text-slate-400 mr-3 shrink-0 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        placeholder="City, state, or remote"
                                        className="border-none bg-transparent shadow-none focus-visible:ring-0 h-full text-base placeholder:text-slate-400 p-0 text-slate-700 font-medium"
                                        value={locationQuery}
                                        onChange={(e) => setLocationQuery(e.target.value)}
                                    />
                                </div>

                                {/* Desktop Search Button */}
                                <Button size="lg" className="hidden md:flex h-12 px-8 rounded-full bg-primary hover:bg-orange-600 text-white font-bold tracking-wide text-base shadow-lg shadow-orange-200/50 min-w-[120px] m-1 transition-all hover:scale-105 active:scale-95">
                                    Search
                                </Button>
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
                        {/* Mobile Filter Pill */}
                        <div className="md:hidden fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
                            <div className="bg-[#1C1C1E] text-white rounded-full px-1 py-1 flex items-center shadow-2xl border border-white/10">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" className="rounded-full h-10 px-6 text-sm font-medium hover:bg-white/10 text-white gap-2">
                                            <SlidersHorizontal className="w-4 h-4" />
                                            Filter
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="bottom" className="h-[85vh] rounded-t-[20px] p-0">
                                        <SheetTitle className="sr-only">Filters</SheetTitle>
                                        <div className="h-full flex flex-col bg-white rounded-t-[20px]">
                                            <div className="p-4 border-b flex justify-center">
                                                <div className="w-12 h-1 bg-slate-200 rounded-full" />
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-4 pb-20">
                                                <JobFilters />
                                            </div>
                                            <div className="p-4 border-t bg-slate-50 safe-area-bottom">
                                                <Button className="w-full h-12 rounded-full font-bold text-lg" onClick={() => { }}>Show Results</Button>
                                            </div>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                                <div className="w-[1px] h-6 bg-white/20 mx-1" />
                                <Button variant="ghost" className="rounded-full h-10 px-6 text-sm font-medium hover:bg-white/10 text-white gap-2">
                                    <List className="w-4 h-4" />
                                    Sort By
                                </Button>
                            </div>
                        </div>

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
