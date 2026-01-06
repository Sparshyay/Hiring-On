"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Code2, Brain, Terminal, Target } from "lucide-react";
import { motion } from "framer-motion";

export function PracticeHero() {
    return (
        <div className="w-full max-w-full relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-[#020617] min-h-[300px] md:min-h-[400px] flex items-center p-6 md:p-16 mb-8 md:mb-12 shadow-2xl ring-1 ring-white/5 isolate group">

            {/* --- Dynamic Background --- */}
            <div className="absolute inset-0 z-0">
                {/* Brand Orange Glow (Top Right) */}
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-orange-500/15 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[4000ms]"></div>
                {/* Brand Blue Glow (Bottom Left) */}
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-[6000ms]"></div>
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">

                {/* --- Left Content: Copy & CTA --- */}
                <div className="space-y-8 max-w-2xl">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-flex"
                    >
                        <div className="relative overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-slate-950">
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFEDD5_0%,#F97316_50%,#FFEDD5_100%)]" />
                            <span className="inline-flex h-full w-full cursor-default items-center justify-center rounded-full bg-slate-950/90 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-3xl gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                                <span className="tracking-wider uppercase text-orange-100">AI-Powered Evaluation</span>
                            </span>
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                        className="space-y-2"
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                            Ace Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-orange-400 animate-text-shimmer bg-[length:200%_auto]">
                                Technical Rounds
                            </span>
                        </h1>
                    </motion.div>

                    {/* Subtext */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    >
                        <p className="text-slate-300 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
                            Practice with tailored coding challenges, aptitude tests, and mock interviews.
                            <span className="text-orange-200/80"> Get ready to get hired.</span>
                        </p>
                    </motion.div>

                    {/* Stats / Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-wrap gap-4 pt-4"
                    >
                        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md group/pill">
                            <Code2 className="w-5 h-5 text-orange-400 group-hover/pill:text-orange-300 transition-colors" />
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">500+</span>
                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Coding Problems</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md group/pill">
                            <Target className="w-5 h-5 text-blue-400 group-hover/pill:text-blue-300 transition-colors" />
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">Adaptive</span>
                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Skill Testing</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* --- Right Content: Floating Visualization --- */}
                <div className="hidden lg:flex justify-end items-center relative h-full min-h-[400px]">
                    <div className="relative w-[500px] h-[400px] perspective-1000">

                        {/* IDE Card (Tilted) */}
                        <motion.div
                            initial={{ rotateY: -10, rotateX: 5, opacity: 0, scale: 0.9 }}
                            animate={{ rotateY: -10, rotateX: 5, opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] bg-[#0F172A] rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden z-20 group-hover:shadow-orange-500/10 transition-shadow duration-500"
                        >
                            {/* Window Toolbar */}
                            <div className="h-9 bg-[#1E293B] flex items-center px-4 gap-2 border-b border-slate-700/50">
                                <div className="flex gap-1.5 s-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="ml-4 text-[11px] text-slate-400 font-mono flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                    solution.js
                                </div>
                            </div>

                            {/* Code Area */}
                            <div className="p-6 font-mono text-xs leading-relaxed opacity-90 text-slate-300">
                                <CodeLine n={1} content={<>import <span className="text-purple-400">{`{ Candidate }`}</span> from <span className="text-green-400">'@hiring/platform'</span>;</>} />
                                <CodeLine n={2} content="" />
                                <CodeLine n={3} content={<><span className="text-blue-400">async function</span> <span className="text-orange-400">getHired</span>(skills) {`{`}</>} />
                                <CodeLine n={4} content={<>&nbsp;&nbsp;<span className="text-blue-400">const</span> prep = <span className="text-blue-400">new</span> Candidate(skills);</>} />
                                <CodeLine n={5} content={<>&nbsp;&nbsp;<span className="text-blue-400">while</span> (!prep.ready) {`{`}</>} />
                                <CodeLine n={6} content={<>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">await</span> prep.solve(<span className="text-green-400">'challenges'</span>);</>} />
                                <CodeLine n={7} content={<>&nbsp;&nbsp;{`}`}</>} />
                                <CodeLine n={8} content={<>&nbsp;&nbsp;<span className="text-blue-400">return</span> <span className="text-green-400">"Offer Letter 🚀"</span>;</>} />
                                <CodeLine n={9} content={<>{`}`}</>} />
                            </div>

                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-blue-500/20 opacity-0 blur-xl z-[-1] group-hover:opacity-100 transition-opacity duration-700"></div>
                        </motion.div>

                        {/* Floating Cards Behind */}
                        <motion.div
                            initial={{ x: 50, y: -50, opacity: 0 }}
                            animate={{ x: 80, y: -60, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="absolute top-10 right-0 z-10 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl w-40"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                    <Terminal className="w-4 h-4 text-green-400" />
                                </div>
                                <div className="h-1.5 w-12 bg-white/20 rounded-full"></div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-1.5 w-full bg-white/10 rounded-full"></div>
                                <div className="h-1.5 w-2/3 bg-white/10 rounded-full"></div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: -50, y: 50, opacity: 0 }}
                            animate={{ x: -60, y: 80, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="absolute bottom-10 left-0 z-30 p-3 bg-slate-900/90 border border-orange-500/20 rounded-xl shadow-xl w-48 flex items-center gap-3 backdrop-blur-md"
                        >
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full border-2 border-orange-500 flex items-center justify-center bg-orange-500/10">
                                    <span className="text-orange-400 text-xs font-bold">A+</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-slate-200 text-xs font-bold">Feedback Ready</div>
                                <div className="text-slate-500 text-[10px]">Detailed Analysis</div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function CodeLine({ n, content }: { n: number; content: React.ReactNode }) {
    return (
        <div className="flex gap-4 group/line hover:bg-white/5 rounded px-2 -mx-2 transition-colors">
            <span className="text-slate-600 select-none w-4 text-right font-mono text-[10px] pt-0.5">{n}</span>
            <span className="text-slate-300">{content}</span>
        </div>
    );
}
