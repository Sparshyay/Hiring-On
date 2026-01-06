"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, FileText, ChevronRight, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function MyAttempts() {
    const attempts = useQuery(api.tests.getMyAttempts);

    if (attempts === undefined) {
        return <AttemptsSkeleton />;
    }

    // Sort by most recent
    const sortedAttempts = [...attempts].sort((a, b) => b.startTime - a.startTime);

    return (
        <Card className="border shadow-sm bg-white overflow-hidden flex flex-col">
            <CardHeader className="py-4 px-5 border-b bg-slate-50/50">
                <CardTitle className="text-base font-semibold text-slate-900">My Attempts</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
                {sortedAttempts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center px-4 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-slate-900 text-sm">No attempts yet</p>
                            <p className="text-xs text-slate-500">Start a practice test to see your progress here.</p>
                        </div>
                    </div>
                ) : (
                    <ScrollArea className="h-[200px] pr-4">
                        <div className="divide-y divide-slate-100">
                            {sortedAttempts.map((attempt) => (
                                <div key={attempt._id} className="p-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-semibold text-sm text-slate-900 line-clamp-1 pr-2">
                                            {attempt.testTitle}
                                        </h4>
                                        <div className="flex items-center gap-1">
                                            <Link href={`/practice/analysis/${attempt._id}`}>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600" title="Analysis">
                                                    <FileText className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            {/* Ideally this link restarts the test or goes to test start page */}
                                            <Link href={`/practice/${attempt.testId}`}>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-900" title="Retake">
                                                    <Play className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <div className="space-y-1">
                                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Last attempted:</p>
                                            <p className="font-medium text-slate-700">{new Date(attempt.startTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Score</p>
                                            <p className="font-medium text-slate-900">{attempt.score || 0}/30</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}

function AttemptsSkeleton() {
    return (
        <Card className="border-none shadow-sm bg-white h-full">
            <CardHeader className="pb-2">
                <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between gap-4">
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
