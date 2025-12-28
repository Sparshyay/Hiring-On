"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, GraduationCap, Star, Loader2, MapPin, Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function FeaturedManagementPage() {
    const jobs = useQuery(api.jobs.getAllJobsAdmin);
    const internships = useQuery(api.internships.getInternshipsForAdmin);
    const toggleJobFeatured = useMutation(api.jobs.toggleFeatured);
    const toggleInternshipFeatured = useMutation(api.internships.toggleFeatured);

    const [search, setSearch] = useState("");

    // Filter Logic
    const filteredJobs = jobs?.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.companyName?.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const filteredInternships = internships?.filter(intern =>
        intern.title.toLowerCase().includes(search.toLowerCase()) ||
        intern.company?.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const handleJobToggle = async (id: Id<"jobs">, currentState: boolean | undefined) => {
        try {
            await toggleJobFeatured({ id, isFeatured: !currentState });
            toast.success(currentState ? "Removed from properties" : "Marked as Featured");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleInternshipToggle = async (id: Id<"internships">, currentState: boolean | undefined) => {
        try {
            await toggleInternshipFeatured({ id, isFeatured: !currentState });
            toast.success(currentState ? "Removed from featured" : "Marked as Featured");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (!jobs || !internships) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Featured Listings</h1>
                    <p className="text-slate-500 mt-1">Manage featured jobs and internships displayed on the homepage.</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search listings..."
                        className="pl-9 bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="jobs" className="space-y-6">
                <TabsList className="bg-white border p-1 h-12 rounded-xl">
                    <TabsTrigger value="jobs" className="rounded-lg px-6 h-10 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                        <Briefcase className="w-4 h-4 mr-2" /> Jobs
                        <Badge variant="secondary" className="ml-2 bg-slate-200 text-slate-700">{filteredJobs.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="internships" className="rounded-lg px-6 h-10 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
                        <GraduationCap className="w-4 h-4 mr-2" /> Internships
                        <Badge variant="secondary" className="ml-2 bg-slate-200 text-slate-700">{filteredInternships.length}</Badge>
                    </TabsTrigger>
                </TabsList>

                {/* Jobs Content */}
                <TabsContent value="jobs">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredJobs.map((job) => (
                            <Card key={job._id} className={`overflow-hidden transition-all duration-300 ${job.isFeatured ? 'border-primary ring-1 ring-primary/20 shadow-md bg-primary/5' : 'hover:border-slate-300'}`}>
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-lg font-bold text-slate-700 shadow-sm shrink-0">
                                                {job.companyName ? job.companyName[0] : "C"}
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold line-clamp-1">{job.title}</CardTitle>
                                                <CardDescription className="text-xs font-medium flex items-center gap-1 mt-0.5">
                                                    <Building2 className="w-3 h-3" /> {job.companyName}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={!!job.isFeatured}
                                            onCheckedChange={() => handleJobToggle(job._id, job.isFeatured)}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-2 space-y-3">
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{job.type}</span>
                                    </div>

                                    {job.isFeatured && (
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mt-2">
                                            <Star className="w-3.5 h-3.5 fill-primary" /> Featured Listing
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Internships Content */}
                <TabsContent value="internships">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredInternships.map((intern) => (
                            <Card key={intern._id} className={`overflow-hidden transition-all duration-300 ${intern.isFeatured ? 'border-primary ring-1 ring-primary/20 shadow-md bg-primary/5' : 'hover:border-slate-300'}`}>
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-lg font-bold text-slate-700 shadow-sm shrink-0">
                                                {intern.company?.name ? intern.company.name[0] : "I"}
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold line-clamp-1">{intern.title}</CardTitle>
                                                <CardDescription className="text-xs font-medium flex items-center gap-1 mt-0.5">
                                                    <Building2 className="w-3 h-3" /> {intern.company?.name || "Unknown"}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={!!intern.isFeatured}
                                            onCheckedChange={() => handleInternshipToggle(intern._id, intern.isFeatured)}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-2 space-y-3">
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {intern.location}</span>
                                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">{intern.stipend}</span>
                                    </div>

                                    {intern.isFeatured && (
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mt-2">
                                            <Star className="w-3.5 h-3.5 fill-primary" /> Featured Listing
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
