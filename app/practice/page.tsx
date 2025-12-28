"use client";

import React, { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PracticeFilters } from "@/components/practice/practice-filters";
import { RecommendedSection } from "@/components/practice/recommended-section";
import { TestCollections } from "@/components/practice/test-collections";
import { AllTestsGrid } from "@/components/practice/all-tests-grid";
import { AdaptiveBanner } from "@/components/practice/adaptive-banner";
import { AiAssessmentCard } from "@/components/practice/ai-assessment-card";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function PracticePage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Sidebar - Desktop Only */}
                    <aside className="hidden lg:block w-80 shrink-0 space-y-8">
                        <div className="sticky top-24 space-y-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
                            <PracticeFilters
                                activeCategory={activeCategory}
                                setActiveCategory={setActiveCategory}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-8">
                        {/* Title & Mobile Filter Toggle */}
                        <div className="space-y-6 text-center max-w-4xl mx-auto mb-2">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                                    Practice & Prepare
                                </h1>
                                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                    Master your skills with our curated collection of mock tests.
                                </p>
                            </div>

                            {/* Mobile Filter Button */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="lg:hidden mx-auto">
                                        <Filter className="w-4 h-4 mr-2" />
                                        Filters & Categories
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] overflow-y-auto">
                                    <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-8">
                                        <PracticeFilters
                                            activeCategory={activeCategory}
                                            setActiveCategory={setActiveCategory}
                                            searchQuery={searchQuery}
                                            setSearchQuery={setSearchQuery}
                                        />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Sections */}
                        <div className="space-y-12">
                            {/* Section 1: Recommended */}
                            <RecommendedSection searchQuery={searchQuery} category={activeCategory} />

                            {/* Section 4: Adaptive Learning Banner */}
                            <AdaptiveBanner />

                            {/* Section: AI-Powered Practice Card */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900">AI-Powered Practice</h2>
                                <AiAssessmentCard />
                            </div>

                            {/* Section 3: Popular Test Collections */}
                            {activeCategory === "all" && !searchQuery && <TestCollections />}

                            {/* Section 2: All Practice Tests */}
                            <AllTestsGrid searchQuery={searchQuery} category={activeCategory} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
