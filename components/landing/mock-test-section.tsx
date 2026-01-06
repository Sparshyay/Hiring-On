"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestCard } from "@/components/practice/test-card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ScrollCarousel } from "@/components/shared/scroll-carousel";
import { useState } from "react";

// MOCK_TESTS removed in favor of dynamic fetching


export function MockTestSection() {
    const [activeCategory, setActiveCategory] = useState("Tech");
    const tests = useQuery(api.tests.getTests, { category: activeCategory });

    // Filter to show only a few or specific ones if needed, for now showing first 8 to show scrolling
    const displayTests = tests ? tests.slice(0, 8) : [];

    const itemClass = "min-w-[85vw] sm:min-w-[45%] md:min-w-[31%] lg:min-w-[23%] snap-center h-full";

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
                    {["Tech", "Management", "General"].map((cat) => (
                        <Button
                            key={cat}
                            variant={activeCategory === cat ? "default" : "secondary"}
                            className={`rounded-full px-6 transition-all ${activeCategory === cat ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>

                <div>
                    {!tests ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Loading State - keep grid for skeleton or use carousel too */}
                            {Array(4).fill(0).map((_, i) => (
                                <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <ScrollCarousel>
                            {displayTests.map((test, index) => (
                                <motion.div
                                    key={test._id}
                                    className={itemClass}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <TestCard
                                        id={test._id}
                                        title={test.title}
                                        category={test.category}
                                        questions={test.questionsCount}
                                        duration={`${test.duration} mins`}
                                        difficulty={test.difficulty}
                                        description={test.description}
                                    />
                                </motion.div>
                            ))}
                        </ScrollCarousel>
                    )}
                </div>
            </div>
        </section>
    );
}
