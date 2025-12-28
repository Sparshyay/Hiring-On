"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestCard } from "@/components/practice/test-card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// MOCK_TESTS removed in favor of dynamic fetching


export function MockTestSection() {
    const tests = useQuery(api.tests.getTests, { category: "all" });

    // Filter to show only a few or specific ones if needed, for now showing first 4
    const displayTests = tests ? tests.slice(0, 4) : [];

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-3xl font-bold text-slate-900 mb-2">
                            AI-Powered Skill Based <span className="text-blue-600">Mock Tests</span>
                        </h2>
                        <p className="text-slate-600 max-w-xl text-lg">
                            Master your concepts with AI-Powered full-length mock tests for 360° preparation!
                        </p>
                    </div>
                    <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 gap-2 font-semibold">
                        View all <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {["Tech", "Management", "General"].map((cat, i) => (
                        <Button
                            key={cat}
                            variant={i === 0 ? "default" : "secondary"}
                            className={`rounded-full px-6 transition-all ${i === 0 ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                <div className="relative">
                    {/* Navigation Buttons (Visual Only for now) */}
                    <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors md:flex hidden hover:scale-110 active:scale-95 duration-200">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors md:flex hidden hover:scale-110 active:scale-95 duration-200">
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {!tests ? (
                            // Loading State
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
                            ))
                        ) : (
                            displayTests.map((test, index) => (
                                <div key={test._id} className="h-full">
                                    <TestCard
                                        id={test._id}
                                        title={test.title}
                                        category={test.category}
                                        questions={test.questionsCount}
                                        duration={`${test.duration} mins`}
                                        difficulty={test.difficulty}
                                        imageColor={test.imageColor || "bg-blue-500"}
                                        bannerImage={test.type === "standard" ? undefined : ""} // Add logic for banner if needed
                                        companyLogos={[]} // Can add logic later
                                        description={test.description}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
