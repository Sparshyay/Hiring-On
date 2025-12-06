"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Code2, BrainCircuit, Mic } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function PracticeHighlight() {
    return (
        <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
            {/* Background accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    <div className="flex-1 space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            Ace Your Interviews with <br />
                            <span className="text-primary">AI-Powered Practice</span>
                        </h2>
                        <p className="text-lg text-slate-300 max-w-xl">
                            Prepare for your dream job with our comprehensive practice suite.
                            From coding challenges to AI mock interviews, we've got you covered.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { icon: Code2, text: "Coding Challenges" },
                                { icon: BrainCircuit, text: "Aptitude Tests" },
                                { icon: Mic, text: "AI Mock Interviews" },
                                { icon: CheckCircle2, text: "Real-time Feedback" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <item.icon className="w-6 h-6 text-primary" />
                                    <span className="font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-orange-600 text-white" asChild>
                            <Link href="/practice">Start Practicing Now</Link>
                        </Button>
                    </div>

                    <div className="flex-1">
                        {/* Abstract representation of practice interface */}
                        <div className="relative bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-2xl">
                            <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="space-y-4 font-mono text-sm">
                                <div className="text-blue-400">function solveChallenge(input) {"{"}</div>
                                <div className="pl-4 text-slate-300">const result = analyze(input);</div>
                                <div className="pl-4 text-slate-300">return result.optimize();</div>
                                <div className="text-blue-400">{"}"}</div>
                                <div className="h-4" />
                                <div className="flex items-center gap-2 text-green-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Test Cases Passed: 5/5</span>
                                </div>
                            </div>

                            {/* Floating badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                                className="absolute -bottom-6 -right-6 bg-white text-slate-900 p-4 rounded-xl shadow-xl font-bold flex items-center gap-2"
                            >
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">A+</div>
                                Score: 98%
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
