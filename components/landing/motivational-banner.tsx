"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Code, FileText, Layout, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MotivationalBanner() {
    return (
        <section className="py-8 bg-slate-50 space-y-16">
            <div className="container mx-auto px-4">

                {/* Banner 1: Practice Coding */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Practice Coding & Ace Hiring Assessments
                            </h2>
                            <p className="text-slate-600 mt-2">
                                Level up your coding skills by practicing the hiring assessments of your dream companies!
                            </p>
                        </div>
                        <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 gap-2 shrink-0 group" asChild>
                            <Link href="/practice">
                                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Main Hero Card */}
                        <div className="lg:col-span-5 relative group overflow-hidden rounded-3xl bg-blue-600 text-white p-8 md:p-10 flex flex-col justify-between min-h-[400px]">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 opacity-50" />

                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl mb-6 shadow-sm">
                                    <Code className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Master your<br />Coding Skills</h3>
                                <p className="text-blue-100 text-lg leading-relaxed mb-8 max-w-sm">
                                    Practice actual interview questions from top tech giants like Google, Amazon, and Microsoft.
                                </p>
                            </div>

                            <div className="relative z-10 mt-auto">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                                        <span className="block text-2xl font-bold">400+</span>
                                        <span className="text-xs text-blue-200 uppercase tracking-wider">Problems</span>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                                        <span className="block text-2xl font-bold">50+</span>
                                        <span className="text-xs text-blue-200 uppercase tracking-wider">Companies</span>
                                    </div>
                                </div>
                                <Button size="lg" asChild className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-xl h-12 shadow-lg hover:shadow-xl transition-all">
                                    <Link href="/practice">
                                        Start Practicing Now <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Feature Grid */}
                        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                {
                                    icon: Terminal,
                                    color: "bg-purple-100 text-purple-600",
                                    title: "Interview Prep",
                                    desc: "Curated paths to crack top product companies in 45 days.",
                                    stat: "Detailed Roadmap",
                                    link: "/practice/interview-prep"
                                },
                                {
                                    icon: Layout,
                                    color: "bg-orange-100 text-orange-600",
                                    title: "Project Building",
                                    desc: "Build real-world projects that stand out on your resume.",
                                    stat: "15+ Pro Projects",
                                    link: "/practice/projects"
                                },
                                {
                                    icon: Code,
                                    color: "bg-green-100 text-green-600",
                                    title: "Mock Tests",
                                    desc: "Simulate real exam environments with timed assessments.",
                                    stat: "Live Contests",
                                    link: "/practice/mock-tests"
                                },
                                {
                                    icon: FileText,
                                    color: "bg-pink-100 text-pink-600",
                                    title: "Skill Assessments",
                                    desc: "Verify your skills and earn badges to show recruiters.",
                                    stat: "Get Certified",
                                    link: "/practice/assessments"
                                }
                            ].map((item, i) => (
                                <Link key={i} href={item.link || "/practice"} className="block h-full">
                                    <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col h-full hover:scale-[1.02]">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center`}>
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ArrowRight className="w-4 h-4 text-slate-400" />
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1">
                                            {item.desc}
                                        </p>
                                        <div className="pt-4 border-t border-slate-50 mt-auto">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.stat}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section >
    );
}
