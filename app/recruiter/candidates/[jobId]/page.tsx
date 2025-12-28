"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Loader2, Search, ArrowLeft, CheckCircle2, XCircle, FileText, Briefcase, GraduationCap, Zap, Eye, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner"; // Assuming sonner is installed or generic alert

export default function JobCandidatesPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.jobId as Id<"jobs">; // Cast generic ID

    // Fetch Candidates
    const applications = useQuery(api.applications.getRecruiterApplications, { jobId });
    const updateStatus = useMutation(api.applications.updateStatus);

    // States
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedApplication, setSelectedApplication] = useState<any>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const safeApplications = applications?.filter((a): a is NonNullable<typeof a> => a !== null) || [];

    // Filter Logic
    const filteredCandidates = safeApplications.filter(app => {
        const matchesStatus = statusFilter === "all" || app.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesSearch = app.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.candidate.role.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleStatusUpdate = async (appId: Id<"applications">, newStatus: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        try {
            await updateStatus({ applicationId: appId, status: newStatus });
            toast.success(`Candidate ${newStatus}`);
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("Failed to update status");
        }
    };

    const handleCardClick = (app: any) => {
        setSelectedApplication(app);
        setIsSheetOpen(true);
    };

    if (applications === undefined) {
        return (
            <div className="flex h-[500px] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <div className="mb-6">
                <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all" onClick={() => router.push("/recruiter/candidates")}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {safeApplications[0]?.job.title || safeApplications[0]?.job?.title || "Candidates"}
                        </h1>
                        <p className="text-slate-500">
                            Managed {filteredCandidates.length} applicants for this role.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 sticky top-0 bg-white z-10 py-4 border-b">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search by candidate name..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredCandidates.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-lg border-2 border-dashed">
                        <p className="text-slate-500">No candidates found.</p>
                    </div>
                ) : (
                    filteredCandidates.map((app) => (
                        <Card
                            key={app._id}
                            className="hover:shadow-md transition-shadow cursor-pointer group"
                            onClick={() => handleCardClick(app)}
                        >
                            <div className="p-4 flex flex-col sm:flex-row items-center gap-4">
                                <Avatar className="h-12 w-12 border">
                                    <AvatarImage src={app.candidate.avatar} />
                                    <AvatarFallback>{app.candidate.name.charAt(0)}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 text-center sm:text-left min-w-0">
                                    <h3 className="font-bold text-slate-900 truncate">{app.candidate.name}</h3>
                                    <p className="text-sm text-slate-500 truncate">{app.candidate.role}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={`
                                        ${app.status === 'Applied' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                        ${app.status === 'Shortlisted' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                        ${app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                    `}>
                                        {app.status}
                                    </Badge>

                                    {app.status === "Applied" && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={(e) => handleStatusUpdate(app._id, "Shortlisted", e)}>
                                                <CheckCircle2 className="h-5 w-5" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={(e) => handleStatusUpdate(app._id, "Rejected", e)}>
                                                <XCircle className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Reuse similar Sheet Logic from previous file or keep generic */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
                    {selectedApplication && (
                        <div className="space-y-6">
                            <SheetHeader>
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={selectedApplication.candidate.avatar} />
                                        <AvatarFallback className="text-xl bg-slate-100">{selectedApplication.candidate.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <SheetTitle className="text-2xl">{selectedApplication.candidate.name}</SheetTitle>
                                        <SheetDescription className="text-base font-medium text-slate-600">
                                            {selectedApplication.candidate.role}
                                        </SheetDescription>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <Badge className={`
                                                ${selectedApplication.status === 'Applied' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''}
                                                ${selectedApplication.status === 'Shortlisted' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                                                ${selectedApplication.status === 'Rejected' ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
                                            `}>
                                                {selectedApplication.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </SheetHeader>

                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={(e) => {
                                        handleStatusUpdate(selectedApplication._id, "Shortlisted", e);
                                        setIsSheetOpen(false);
                                    }}
                                >
                                    Shortlist Candidate
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={(e) => {
                                        handleStatusUpdate(selectedApplication._id, "Rejected", e);
                                        setIsSheetOpen(false);
                                    }}
                                >
                                    Reject
                                </Button>
                            </div>

                            <Separator />

                            {/* Brief Profile content for MVP */}
                            <div className="space-y-4 text-sm">
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-slate-400" /> Experience
                                    </h4>
                                    {selectedApplication.candidate.info.experience?.length > 0 ? (
                                        selectedApplication.candidate.info.experience.map((exp: any, i: number) => (
                                            <p key={i} className="text-slate-600">{exp.designation} at {exp.organisation}</p>
                                        ))
                                    ) : <p className="text-slate-500 italic">No experience listed</p>}
                                </div>

                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-slate-400" /> Education
                                    </h4>
                                    {selectedApplication.candidate.info.education?.length > 0 ? (
                                        selectedApplication.candidate.info.education.map((edu: any, i: number) => (
                                            <p key={i} className="text-slate-600">{edu.course} - {edu.college}</p>
                                        ))
                                    ) : <p className="text-slate-500 italic">No education listed</p>}
                                </div>

                                {selectedApplication.resumeUrl && (
                                    <Button variant="outline" className="w-full" asChild>
                                        <a href={selectedApplication.resumeUrl} target="_blank">
                                            <FileText className="w-4 h-4 mr-2" /> View Resume
                                        </a>
                                    </Button>
                                )}
                            </div>

                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
