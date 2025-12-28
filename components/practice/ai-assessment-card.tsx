"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

export function AiAssessmentCard() {
    return (
        <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-10 -translate-x-10"></div>

            <CardContent className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-6 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Assessments</span>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold text-white mb-3">
                            Generate Your Personalised Assessment
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Our AI analyzes your profile and learning goals to create a custom practice test just for you. Challenge yourself with dynamic questions tailored to your skill level.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25">
                            Start AI Assessment <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>

                <div className="relative shrink-0">
                    <div className="w-48 h-48 md:w-56 md:h-56 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center relative z-10 animate-pulse-slow shadow-2xl shadow-blue-500/20">
                        <Brain className="w-24 h-24 text-white" />
                    </div>
                    {/* Ring effects */}
                    <div className="absolute inset-0 border-4 border-white/5 rounded-full scale-110"></div>
                    <div className="absolute inset-0 border-2 border-white/5 rounded-full scale-125"></div>
                </div>
            </CardContent>
        </Card>
    );
}
