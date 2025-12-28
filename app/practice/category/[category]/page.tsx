"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Zap, BarChart3, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const DIFFICULTY_CONFIG: Record<string, { color: string; bg: string; bars: number }> = {
    "Novice": { color: "bg-emerald-400", bg: "bg-emerald-50", bars: 1 },
    "Easy": { color: "bg-emerald-500", bg: "bg-emerald-50", bars: 2 },
    "Intermediate": { color: "bg-yellow-400", bg: "bg-yellow-50", bars: 3 },
    "Master": { color: "bg-orange-500", bg: "bg-orange-50", bars: 4 },
    "Expert": { color: "bg-red-600", bg: "bg-red-50", bars: 5 },
};

export default function LevelSelectionPage() {
    const params = useParams();
    const router = useRouter();
    // decodeURIComponent is needed because category might have spaces or special chars
    const category = decodeURIComponent(params.category as string);

    // Fetch tests for this category
    const tests = useQuery(api.tests.getTests, {
        category: category,
        type: "standard"
    });

    if (!tests) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse text-slate-400">Loading levels...</div>
            </div>
        );
    }

    // Define standard levels structure
    const LEVEL_ORDER = ["Novice", "Easy", "Intermediate", "Master", "Expert"];

    const handleSelect = (testId: string) => {
        router.push(`/practice/${testId}`);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 relative">
            {/* Back Button - Top Left */}
            <div className="absolute top-8 left-8">
                <Button
                    variant="ghost"
                    className="gap-2 text-slate-500 hover:text-slate-900"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </Button>
            </div>

            <div className="max-w-6xl mx-auto w-full space-y-16">
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Select difficulty level</h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Assessment: <span className="font-semibold text-slate-800">{category}</span>
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {LEVEL_ORDER.map((levelName) => {
                        // Find matching test
                        const matchingTest = tests && tests.find(t => t.difficulty === levelName);
                        const config = DIFFICULTY_CONFIG[levelName] || DIFFICULTY_CONFIG["Intermediate"];
                        const isLocked = !matchingTest;

                        return (
                            <button
                                key={levelName}
                                onClick={() => matchingTest && handleSelect(matchingTest._id)}
                                disabled={isLocked}
                                className={cn(
                                    "group flex flex-col items-center justify-center p-6 h-64 bg-white rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden",
                                    isLocked
                                        ? "border-slate-100 bg-slate-50/50 cursor-not-allowed"
                                        : "border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1"
                                )}
                            >
                                {/* Active State Background Hover */}
                                {!isLocked && (
                                    <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300", config.color.replace('bg-', 'bg-'))} />
                                )}

                                {/* Bar Chart Icon */}
                                <div className="flex items-end gap-1.5 h-20 mb-8">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "w-3 rounded-t-full transition-all duration-300",
                                                i < config.bars
                                                    ? (isLocked ? "bg-slate-200" : config.color)
                                                    : "bg-slate-100",
                                                "h-full"
                                            )}
                                            style={{
                                                height: `${(i + 1) * 20}%`
                                            }}
                                        />
                                    ))}
                                </div>

                                <span className={cn("text-lg font-bold transition-colors mb-1", isLocked ? "text-slate-300" : "text-slate-800 group-hover:text-slate-900")}>
                                    {levelName}
                                </span>

                                {!isLocked && (
                                    <div className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-blue-600/70 transition-colors">
                                        {matchingTest?.questionsCount} Questions
                                    </div>
                                )}

                                {isLocked && (
                                    <div className="absolute top-5 right-5 text-slate-200">
                                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Empty State / No Levels Found */}
                {tests.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <BarChart3 className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-lg font-medium">No levels found for {category}</p>
                        <p className="text-sm">Please check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
