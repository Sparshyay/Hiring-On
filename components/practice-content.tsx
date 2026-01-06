"use client";

import React, { useState } from "react";
import { Filter, Gift } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PracticeFilters } from "@/components/practice/practice-filters";
import { PracticeSidebar } from "@/components/practice/practice-sidebar";
import { AllTestsGrid } from "@/components/practice/all-tests-grid";
import { MyAttempts } from "@/components/practice/my-attempts";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";

import { PracticeHero } from "@/components/practice/practice-hero";

export function PracticeContent() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-6">
            <div className="w-full px-4 md:px-6 max-w-[1920px] mx-auto">

                {/* Hero Section */}
                <PracticeHero />

                <div className="flex flex-col md:flex-row gap-4 lg:gap-6 relative items-start">

                    {/* Left Sidebar - Filters (Responsive) */}
                    <div className="hidden md:block flex-shrink-0 sticky top-16 h-fit z-30">
                        <PracticeSidebar
                            activeCategory={activeCategory}
                            setActiveCategory={setActiveCategory}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0 space-y-8">
                        {/* Mobile Search & Filter */}
                        <div className="md:hidden space-y-3 mb-4 w-full">
                            <div className="flex gap-2 w-full max-w-[100vw]">
                                <Input
                                    placeholder="Search..."
                                    className="bg-white h-10 shadow-sm flex-1 min-w-0" // Added min-w-0 to prevent flex item overflow
                                    value={searchQuery}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                />
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-white"><Filter className="w-4 h-4" /></Button>
                                    </SheetTrigger>
                                    <SheetContent side="left">
                                        <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                                        <div className="mt-6">
                                            <PracticeFilters activeCategory={activeCategory} setActiveCategory={setActiveCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>

                        {/* All Topics Grid (Catalog) */}
                        <div>
                            <div className="flex flex-col items-center justify-center mb-8 mt-6 px-4">
                                <h2 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 tracking-tight mb-3 text-center break-words max-w-full">
                                    Explore All Categories
                                </h2>
                                <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-blue-600 rounded-full"></div>
                                <p className="text-slate-500 mt-3 text-center max-w-lg mx-auto">
                                    Browse our comprehensive collection of practice tests designed to help you master your skills.
                                </p>
                            </div>
                            <AllTestsGrid searchQuery={searchQuery} category={activeCategory} />
                        </div>
                    </div>

                    {/* Right Sidebar - My Attempts & Refer */}
                    <div className="hidden md:block w-[260px] xl:w-[300px] flex-shrink-0 space-y-6 sticky top-16 z-10">

                        {/* My Attempts */}
                        <MyAttempts />

                        {/* Refer & Win */}
                        <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-blue-50 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <CardContent className="p-5 relative z-10">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base">Refer & Win</h3>
                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                            Invite friends and win exclusive rewards including MacBook & iPhone!
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                        <Gift className="w-5 h-5 text-indigo-600" />
                                    </div>
                                </div>
                                <Button className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-xs h-8">
                                    Invite Now
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
