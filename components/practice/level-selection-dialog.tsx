"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, BarChart3, Star, Trophy, Zap } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

interface TestLevel {
    id: Id<"tests">;
    difficulty: string;
    questionsCount: number;
    duration: number;
}

interface LevelSelectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    topic: string;
    levels: TestLevel[];
}

const DIFFICULTY_CONFIG: Record<string, { color: string; bg: string; bars: number }> = {
    "Novice": { color: "bg-emerald-400", bg: "bg-emerald-50", bars: 1 },
    "Easy": { color: "bg-emerald-500", bg: "bg-emerald-50", bars: 2 },
    "Intermediate": { color: "bg-yellow-400", bg: "bg-yellow-50", bars: 3 },
    "Master": { color: "bg-orange-500", bg: "bg-orange-50", bars: 4 },
    "Expert": { color: "bg-red-600", bg: "bg-red-50", bars: 5 },
};

export function LevelSelectionDialog({ isOpen, onClose, topic, levels }: LevelSelectionDialogProps) {
    const router = useRouter();

    const handleSelect = (testId: string) => {
        router.push(`/practice/${testId}`);
        onClose();
    };

    // Sort levels
    const sortedLevels = [...levels].sort((a, b) => {
        const order = ["Novice", "Easy", "Intermediate", "Master", "Expert"];
        return order.indexOf(a.difficulty) - order.indexOf(b.difficulty);
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl p-12 bg-white border-none shadow-2xl rounded-3xl">
                <DialogHeader className="mb-10">
                    <DialogTitle className="text-3xl font-bold text-slate-800 text-center">
                        Select difficulty level
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {sortedLevels.map((level) => {
                        const config = DIFFICULTY_CONFIG[level.difficulty] || DIFFICULTY_CONFIG["Intermediate"];

                        return (
                            <button
                                key={level.id}
                                onClick={() => handleSelect(level.id)}
                                className="group flex flex-col items-center justify-center p-6 h-40 bg-white rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
                            >
                                {/* Bar Chart Icon */}
                                <div className="flex items-end gap-1 h-12 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "w-2 rounded-t-sm transition-all duration-300",
                                                i < config.bars ? config.color : "bg-slate-100", // Active vs Inactive
                                                "h-full"
                                            )}
                                            style={{
                                                height: `${(i + 1) * 20}%` // Staggered heights 20%, 40%...
                                            }}
                                        />
                                    ))}
                                </div>

                                <span className="font-semibold text-slate-700 group-hover:text-slate-900">
                                    {level.difficulty}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
