"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Briefcase, GraduationCap, MapPin, Mail, Phone, Globe, ExternalLink, Award, User, Code } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CandidateProfileDialogProps {
    candidate: any; // Using any for flexibility with schema changes, ideally verify with Doc<"job_seekers">
    isOpen: boolean;
    onClose: () => void;
}

export function CandidateProfileDialog({ candidate, isOpen, onClose }: CandidateProfileDialogProps) {
    if (!candidate) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 border-2 border-border">
                            <AvatarImage src={candidate.image} alt={candidate.name} />
                            <AvatarFallback className="text-lg">{candidate.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-bold">{candidate.name}</DialogTitle>
                            <DialogDescription className="text-base font-medium text-foreground/80">
                                {candidate.headline || candidate.role || "Passionate Candidate"}
                            </DialogDescription>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {candidate.email}</span>
                                {candidate.mobile && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {candidate.mobile}</span>}
                                {candidate.currentLocation && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {candidate.currentLocation}</span>}
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6 pb-6">
                    <div className="space-y-6">

                        {/* About */}
                        {candidate.about && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" /> About
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{candidate.about}</p>
                            </div>
                        )}

                        {/* Resume */}
                        {candidate.resume && (
                            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
                                <ExternalLink className="w-5 h-5 text-blue-600" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium">Resume / CV</h4>
                                    <p className="text-xs text-muted-foreground">View uploaded resume</p>
                                </div>
                                <Link
                                    href={candidate.resume.startsWith("http") ? candidate.resume : "#"}
                                    target="_blank"
                                    className="text-sm font-medium text-blue-600 hover:underline"
                                >
                                    View File
                                </Link>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Skills */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    <Code className="w-4 h-4 text-primary" /> Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.skills?.length > 0 ? (
                                        candidate.skills.map((skill: string, i: number) => (
                                            <Badge key={i} variant="secondary">{skill}</Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No skills listed.</p>
                                    )}
                                </div>
                            </div>

                            {/* Domain & Education Summary */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Focus Area</h3>
                                    <div className="p-3 border rounded bg-card">
                                        <div className="font-medium">{candidate.domain || "N/A"}</div>
                                        <div className="text-sm text-muted-foreground">{candidate.course} {candidate.courseSpecialization ? `• ${candidate.courseSpecialization}` : ""}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Experience */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-primary" /> Experience
                            </h3>
                            <div className="space-y-4">
                                {candidate.experience?.length > 0 ? (
                                    candidate.experience.map((exp: any, i: number) => (
                                        <div key={i} className="relative pl-4 border-l-2 border-muted pb-1 last:pb-0">
                                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                                            <div className="font-medium">{exp.jobTitle}</div>
                                            <div className="text-sm text-primary/80">{exp.company}</div>
                                            <div className="text-xs text-muted-foreground mb-1">
                                                {exp.startDate} - {exp.endDate} {exp.location ? `• ${exp.location}` : ""}
                                            </div>
                                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{exp.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No experience added.</p>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Education */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-primary" /> Education
                            </h3>
                            <div className="space-y-4">
                                {candidate.education?.length > 0 ? (
                                    candidate.education.map((edu: any, i: number) => (
                                        <div key={i} className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                            <div>
                                                <div className="font-medium">{edu.institution}</div>
                                                <div className="text-sm text-muted-foreground">{edu.qualification || edu.course} {edu.specialization ? `in ${edu.specialization}` : ""}</div>
                                                {edu.grade && <div className="text-xs text-muted-foreground">Grade: {edu.grade}</div>}
                                            </div>
                                            <div className="text-sm text-muted-foreground whitespace-nowrap">
                                                {edu.startYear} - {edu.endYear}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No education details added.</p>
                                )}
                            </div>
                        </div>

                        {/* Projects & Achievements */}
                        {(candidate.projects?.length > 0 || candidate.achievements?.length > 0) && <Separator />}

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Projects */}
                            {candidate.projects?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-primary" /> Projects
                                    </h3>
                                    <ul className="space-y-3">
                                        {candidate.projects.map((proj: any, i: number) => (
                                            <li key={i} className="text-sm">
                                                <div className="font-medium flex items-center gap-2">
                                                    {proj.title}
                                                    {proj.link && <Link href={proj.link} target="_blank" className="text-blue-600"><ExternalLink className="w-3 h-3" /></Link>}
                                                </div>
                                                <p className="text-muted-foreground">{proj.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Achievements */}
                            {candidate.achievements?.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Award className="w-4 h-4 text-primary" /> Achievements
                                    </h3>
                                    <ul className="space-y-2">
                                        {candidate.achievements.map((ach: any, i: number) => (
                                            <li key={i} className="text-sm flex gap-2">
                                                <span className="text-primary">•</span>
                                                <span className="text-muted-foreground">{ach.title || ach.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
