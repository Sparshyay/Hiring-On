

import { ProfileSidebar } from "@/components/shared/profile-sidebar";
import { FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function ApplicationsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
            <div className="min-h-screen bg-slate-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative items-start">
                        {/* LEFT SIDEBAR */}
                        <ProfileSidebar className="hidden lg:block lg:col-span-3 sticky top-24" />

                        {/* MAIN CONTENT */}
                        <div className="lg:col-span-9 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <h1 className="text-2xl font-bold text-slate-900 mb-2">My Applications</h1>
                                <p className="text-slate-500 mb-6">Track the status of your job applications.</p>

                                {/* Empty State / Placeholder */}
                                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                        <FolderGit2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900">No applications yet</h3>
                                    <p className="text-slate-500 max-w-sm mt-2 mb-6">Start applying to jobs and internships to see them appear here.</p>
                                    <Button asChild>
                                        <Link href="/jobs">Explore Jobs</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
