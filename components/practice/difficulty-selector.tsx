"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

interface DifficultySelectorProps {
    onSelect: (difficulty: string) => void;
}

const DIFFICULTIES = [
    {
        id: "Beginner",
        label: "Beginner",
        color: "text-emerald-500",
        bg: "bg-emerald-500",
        bars: 1
    },
    {
        id: "Intermediate",
        label: "Intermediate",
        color: "text-yellow-500",
        bg: "bg-yellow-500",
        bars: 2
    },
    {
        id: "Expert",
        label: "Expert",
        color: "text-red-600",
        bg: "bg-red-600",
        bars: 3
    }
];

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-bold text-slate-800 mb-12">Select difficulty level</h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full max-w-5xl px-4">
                {DIFFICULTIES.map((diff) => (
                    <Card
                        key={diff.id}
                        className="group relative cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-slate-100 hover:border-blue-100 p-8 flex flex-col items-center justify-center gap-6 min-h-[200px]"
                        onClick={() => onSelect(diff.id)}
                    >
                        <div className="flex items-end gap-1 h-12 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-2 rounded-t-sm transition-all duration-300",
                                        i < diff.bars ? diff.bg : "bg-slate-100",
                                        "h-full"
                                    )}
                                    style={{
                                        height: `${(i + 1) * 20}%`
                                    }}
                                />
                            ))}
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-slate-900">
                            {diff.label}
                        </span>
                    </Card>
                ))}
            </div>
        </div>
    );
}
