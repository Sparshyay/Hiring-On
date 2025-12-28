"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Zap } from "lucide-react";

export function AdaptiveBanner() {
    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative px-8 py-10 md:px-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Personalization</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                        Your Level: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Intermediate</span>
                    </h2>

                    <p className="text-slate-400 text-lg leading-relaxed">
                        We analyze your performance and adapt the test difficulty in real-time. Upgrade your skills with personalized challenges.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <span>Smart Recommendations</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span>Progress Tracking</span>
                        </div>
                    </div>
                </div>

                <div className="shrink-0">
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-blue-50 hover:scale-105 transition-all font-semibold rounded-full px-8 h-12 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        Upgrade Your Skill Level
                    </Button>
                </div>
            </div>
        </section>
    );
}
