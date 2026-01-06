"use client";

import { ProfileSidebar } from "@/components/shared/profile-sidebar";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TestCard } from "@/components/practice/test-card";
import { Bookmark } from "lucide-react";
import { findTestById } from "@/components/practice/mock-data";
import { Suspense } from "react";



export default function BookmarksPage() {
    const practiceBookmarks = useQuery(api.user_actions.getBookmarks, { type: "practice_paper" });
    const questionBookmarks = useQuery(api.user_actions.getBookmarks, { type: "question" });

    const isLoading = practiceBookmarks === undefined || questionBookmarks === undefined;
    const hasItems = (practiceBookmarks?.length || 0) + (questionBookmarks?.length || 0) > 0;

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
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                                <div className="p-6 border-b border-slate-100">
                                    <h1 className="text-2xl font-bold text-slate-900">Bookmarked Questions</h1>
                                    <p className="text-slate-500 mt-1">Practice papers and questions you have saved.</p>
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
                                                <Bookmark className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">No bookmarks yet</h3>
                                            <p className="text-slate-500 mb-6 max-w-sm text-center">
                                                Saved questions and practice papers will appear here.
                                            </p>
                                            <Button asChild>
                                                <Link href="/practice">Start Practicing</Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {/* Practice Papers Section */}
                                            {practiceBookmarks && practiceBookmarks.length > 0 && (
                                                <div className="space-y-4">
                                                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                        Practice Papers <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{practiceBookmarks.length}</span>
                                                    </h2>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {practiceBookmarks.map((bookmark: any) => {
                                                            const details = bookmark.details || findTestById(bookmark.targetId);

                                                            // Fallback for old "skill-x" IDs if they exist and we want to show *something*
                                                            // or just let them be filtered out if inconsistent.
                                                            if (!details && bookmark.targetId.startsWith("skill-")) {
                                                                // Optional: Maybe try to parse index? But it's ambiguous.
                                                                // Let's hide them to encourage re-bookmarking, or show a "Legacy Bookmark"
                                                                return null;
                                                            }

                                                            if (!details) return null;

                                                            return (
                                                                <div key={bookmark._id} className="h-[280px]">
                                                                    <TestCard
                                                                        id={bookmark.targetId}
                                                                        title={details.title}
                                                                        category={details.category}
                                                                        questions={details.questions?.length || 30} // default
                                                                        duration={details.duration || "45 mins"} // default
                                                                        difficulty={details.difficulty || "Intermediate"} // default
                                                                        description={details.desc || details.description}
                                                                        hideBanner={true}
                                                                    />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Questions - Placeholder for now as we don't have question cards separate yet */}
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
