"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const DIFFICULTY_CONFIG: Record<string, { color: string; bg: string; bars: number }> = {
    "Beginner": { color: "bg-emerald-500", bg: "bg-emerald-50", bars: 1 },
    "Intermediate": { color: "bg-yellow-400", bg: "bg-yellow-50", bars: 2 },
    "Expert": { color: "bg-red-600", bg: "bg-red-50", bars: 3 },
};

export function LevelSelectionContent({ topic }: { topic: string }) {
    const router = useRouter();

    // Re-using getTests and filtering client-side or we could add a query for this.
    // Ideally we use getTopics but that aggregates. Let's use getTests with category.
    const tests = useQuery(api.tests.getTests, {
        category: topic
    });

    if (tests === undefined) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
        );
    }

    // Sort to ensure Beginner -> Intermediate -> Expert
    const sortedTests = [...tests].sort((a, b) => {
        const order = ["Beginner", "Intermediate", "Expert"];
        return order.indexOf(a.difficulty) - order.indexOf(b.difficulty);
    });

    const handleSelect = (testId: string) => {
        router.push(`/practice/${testId}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            {/* Back Button */}
            <div className="absolute top-6 left-6">
                <Button variant="ghost" onClick={() => router.back()} className="text-slate-600 hover:text-slate-900 px-2 md:px-4">
                    <ArrowLeft className="w-5 h-5 md:w-4 md:h-4 md:mr-2" /> <span className="hidden md:inline">Back to Topics</span>
                </Button>
            </div>

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-800 mb-4">Select difficulty level</h1>
                <p className="text-slate-500 text-lg">Choose your proficiency in {topic}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                {sortedTests.map((test) => {
                    // Only show 3 main levels if exists
                    const config = DIFFICULTY_CONFIG[test.difficulty];
                    if (!config) return null;

                    return (
                        <button
                            key={test._id}
                            onClick={() => handleSelect(test._id)}
                            className="group flex flex-col items-center justify-center p-6 md:p-10 h-48 md:h-64 bg-white rounded-3xl border border-slate-200 hover:border-blue-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${config.bg}`}></div>

                            {/* Bar Chart Icon */}
                            <div className="flex items-end gap-1.5 h-12 md:h-16 mb-4 md:mb-8 relative z-10">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "w-2 md:w-3 rounded-t-full transition-all duration-300",
                                            i < config.bars ? config.color : "bg-slate-100",
                                            "h-full"
                                        )}
                                        style={{
                                            height: `${(i + 1) * 33}%`
                                        }}
                                    />
                                ))}
                            </div>

                            <span className="font-bold text-lg md:text-xl text-slate-700 group-hover:text-slate-900 relative z-10">
                                {test.difficulty}
                            </span>

                            <div className="mt-2 text-xs md:text-sm text-slate-400 group-hover:text-slate-500 relative z-10">
                                {test.duration} mins • {test.questions?.length || test.questionsCount} Questions
                            </div>
                        </button>
                    );
                })}
            </div>

            {sortedTests.length === 0 && (
                <div className="text-slate-500">No tests available for this topic yet.</div>
            )}
        </div>
    );
}
