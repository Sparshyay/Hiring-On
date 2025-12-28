"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, MapPin, DollarSign, Building2, User, GraduationCap, CheckCircle2 } from "lucide-react";

interface JobDetailModalProps {
    job: any; // Type as needed
    isOpen: boolean;
    onClose: () => void;
}

export function JobDetailModal({ job, isOpen, onClose }: JobDetailModalProps) {
    if (!job) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
                <div className="p-6 border-b flex items-start justify-between bg-slate-50">
                    <div>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            {job.title}
                            <Badge variant={job.status === 'Published' ? "default" : "secondary"}>
                                {job.status}
                            </Badge>
                        </DialogTitle>
                        <div className="flex items-center gap-4 text-slate-500 mt-2 text-sm">
                            <div className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> Provider {job.companyId}</div>
                            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</div>
                            <div className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {job.salary}</div>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Col */}
                        <div className="md:col-span-2 space-y-6">
                            <section>
                                <h3 className="font-semibold text-lg mb-2">Description</h3>
                                <p className="text-slate-600 whitespace-pre-line leading-relaxed">{job.description}</p>
                            </section>

                            <section>
                                <h3 className="font-semibold text-lg mb-2">Requirements</h3>
                                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                                    {job.requirements?.map((req: string, i: number) => (
                                        <li key={i}>{req}</li>
                                    ))}
                                </ul>
                            </section>

                            <section>
                                <h3 className="font-semibold text-lg mb-2">Custom Questions</h3>
                                {job.customQuestions?.length > 0 ? (
                                    <ul className="space-y-2">
                                        {job.customQuestions.map((q: any, i: number) => (
                                            <li key={i} className="bg-slate-50 p-3 rounded border text-sm">
                                                <span className="font-medium text-slate-800">{q.question}</span>
                                                <span className="text-slate-400 ml-2">({q.type})</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-slate-400 italic">None</p>}
                            </section>
                        </div>

                        {/* Right Col */}
                        <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Eligibility Criteria
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b border-blue-100 pb-2">
                                        <span className="text-blue-700">Min Experience</span>
                                        <span className="font-semibold text-blue-900">{job.minExperience || 0} Years</span>
                                    </div>
                                    <div className="flex justify-between border-b border-blue-100 pb-2">
                                        <span className="text-blue-700">Education</span>
                                        <span className="font-semibold text-blue-900">{job.minEducation || "Any"}</span>
                                    </div>
                                    <div>
                                        <span className="text-blue-700 block mb-1">Required Skills</span>
                                        <div className="flex flex-wrap gap-1">
                                            {job.requiredSkills?.map((s: string) => (
                                                <Badge key={s} variant="outline" className="bg-white text-blue-700 border-blue-200">
                                                    {s}
                                                </Badge>
                                            ))}
                                            {(!job.requiredSkills || job.requiredSkills.length === 0) && "None"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-slate-50 flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
