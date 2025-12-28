"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AssessmentLoaderProps {
    onComplete: () => void;
}

export function AssessmentLoader({ onComplete }: AssessmentLoaderProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500); // Small delay after 100%
                    return 100;
                }
                return prev + 2; // increments to reach 100 in ~3 seconds (50 steps * 60ms)
            });
        }, 60);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen animate-in fade-in zoom-in duration-500 bg-slate-50/50">
            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100 max-w-lg w-full text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500" />

                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-slate-900/20">
                    <Sparkles className="w-8 h-8" />
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Preparing Assessment</h2>
                <p className="text-slate-500 mb-8 text-lg">
                    Personalizing your experience...
                </p>

                <div className="relative pt-4">
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                        <span>Analyzing</span>
                        <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3 rounded-full bg-slate-100" indicatorClassName="bg-slate-900" />
                </div>

                <p className="text-xs text-slate-400 mt-6 font-medium">
                    This will only take a moment
                </p>
            </div>
        </div>
    );
}
