"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Loader2, CheckCircle2, AlertTriangle, FileText, Upload } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

interface ApplyModalProps {
    jobId: Id<"jobs">;
    isOpen: boolean;
    onClose: () => void;
}

export function ApplyModal({ jobId, isOpen, onClose }: ApplyModalProps) {
    const job = useQuery(api.jobs.getById, { id: jobId });
    const user = useQuery(api.auth.getUser);
    const existingApp = useQuery(api.applications.getMyApplication, { jobId });
    const applyMutation = useMutation(api.applications.create);

    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [notes, setNotes] = useState("");

    if (!isOpen) return null;
    if (!job || !user) return null;

    // Helper for loose typing locally until codegen
    const safeUser = user as any;

    // Smart Eligibility Check
    const checkEligibility = () => {
        const issues: string[] = [];

        if (!safeUser.resume) issues.push("Resume missing from profile");

        // Skills
        if (job.requiredSkills?.length) {
            const userSkills = (safeUser.skills || []).map((s: string) => s.toLowerCase());
            const missing = job.requiredSkills.filter((req: string) => !userSkills.includes(req.toLowerCase()));
            if (missing.length > 0) issues.push(`Missing skills: ${missing.join(", ")}`);
        }

        // Education (Mock)
        if (job.minEducation && safeUser.education) {
            const hasEdu = safeUser.education.some((e: any) => e.course?.includes(job.minEducation));
            // If loose check fails, we might warn but still allow? Let's block for "Smart" demo.
            if (!hasEdu) issues.push(`Education requirement: ${job.minEducation}`);
        }

        return { eligible: issues.length === 0, issues };
    };

    const eligibility = checkEligibility();

    const handleApply = async () => {
        setSubmitting(true);
        try {
            await applyMutation({
                jobId,
                resumeUrl: safeUser.resume,
                coverLetter: notes
            });
            toast.success("Application Submitted!");
            onClose();
        } catch (error) {
            toast.error("Failed to apply. You may have already applied.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Apply for {job.title}</DialogTitle>
                    <DialogDescription>
                        {job.company?.name} • {job.location}
                    </DialogDescription>
                </DialogHeader>

                {/* Already Applied */}
                {existingApp && (
                    <div className="bg-green-50 p-6 rounded-lg text-center">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <h3 className="font-semibold text-green-900">Application Submitted</h3>
                        <p className="text-sm text-green-700">You applied on {new Date(existingApp.appliedAt).toLocaleDateString()}.</p>
                        <Button className="mt-4" onClick={onClose}>Close</Button>
                    </div>
                )}

                {!existingApp && step === 1 && (
                    <div className="space-y-4 py-2">
                        {/* Eligibility Status */}
                        <div className={`p-4 rounded-lg border ${eligibility.eligible ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <h4 className={`font-semibold flex items-center gap-2 ${eligibility.eligible ? 'text-green-800' : 'text-red-800'}`}>
                                {eligibility.eligible ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                                {eligibility.eligible ? "You match the requirements!" : "You may not be eligible"}
                            </h4>
                            {!eligibility.eligible && (
                                <ul className="list-disc pl-9 mt-2 text-sm text-red-700 space-y-1">
                                    {eligibility.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                                </ul>
                            )}
                            {!eligibility.eligible && (
                                <div className="mt-3 pl-7">
                                    <Link href="/profile/edit" className="text-sm font-medium text-blue-600 hover:underline">
                                        Update Profile →
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Profile Summary */}
                        <div className="grid gap-3 text-sm border p-3 rounded-lg bg-slate-50">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Resume:</span>
                                <span className="font-medium text-slate-800 flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    {safeUser.resume ? "Attached" : "Missing"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Email:</span>
                                <span className="font-medium text-slate-800">{safeUser.email}</span>
                            </div>
                        </div>
                    </div>
                )}

                {!existingApp && step === 2 && (
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cover Letter / Notes (Optional)</label>
                            <Textarea
                                placeholder="Why are you a good fit?"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="h-32"
                            />
                        </div>
                    </div>
                )}

                {!existingApp && (
                    <DialogFooter>
                        {step === 2 && (
                            <Button variant="outline" onClick={() => setStep(1)} disabled={submitting}>Back</Button>
                        )}
                        {step === 1 ? (
                            <Button
                                onClick={() => setStep(2)}
                                disabled={!eligibility.eligible}
                                className={!eligibility.eligible ? "opacity-50" : ""}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button onClick={handleApply} disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Application
                            </Button>
                        )}
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
