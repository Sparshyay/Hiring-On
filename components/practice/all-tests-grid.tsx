"use client";

import { TestCard } from "./test-card";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "./practice-filters";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export function AllTestsGrid({ searchQuery = "", category = "all" }: { searchQuery?: string, category?: string }) {
    const router = useRouter();

    // Fetch Topics (Aggregated) from Convex
    const topicsQuery = useQuery(api.tests.getTopics, {
        search: searchQuery,
    });

    const isLoading = topicsQuery === undefined;
    const topics = topicsQuery || [];

    // Fetch Recommended Tests
    const recommended = useQuery(api.recommendations.getRecommendedTests, { limit: 4 });

    // Group topics by Broad Category Sections
    const sections = useMemo(() => {
        const ignoredCategories = ["Engineering", "AI Generated"];
        const CATEGORY_MAP: Record<string, string[]> = {
            "aptitude": ["Aptitude", "Quant", "Logical", "Reasoning", "Data Interpretation"],
            "coding": ["Python", "Java", "C++", "C", "JavaScript", "React", "Node.js", "DSA", "OOPS", "Computer Fundamentals", "Operating Systems", "DBMS", "Computer Networks"],
            "english": ["English", "Verbal Ability", "Grammar"],
            "domain": ["Financial Accounting", "Marketing", "Sales", "Economics", "Supply Chain", "Brand Management", "Micro-Economics", "Macro-Economics", "Retail Management", "Digital Marketing", "Banking Management", "Credit Risk Management"],
            "reasoning": ["Reasoning", "Logical Reasoning", "LRDI"],
        };

        const getBroadCategory = (testCat: string) => {
            const lowerCat = testCat.toLowerCase();
            for (const [broad, keywords] of Object.entries(CATEGORY_MAP)) {
                if (keywords.some(k => lowerCat.includes(k.toLowerCase())) || lowerCat === broad) {
                    return broad;
                }
            }
            return "other";
        };

        const sectionGroups: Record<string, { topic: string, data: typeof topics[0] }[]> = {};

        topics.forEach(topic => {
            if (ignoredCategories.includes(topic.category)) return;

            const broadId = getBroadCategory(topic.category);

            if (category !== "all" && broadId !== category && broadId !== "other") {
                if (topic.category.toLowerCase() !== category.toLowerCase()) return;
            }
            if (category !== "all" && broadId !== category) return;

            if (!sectionGroups[broadId]) {
                sectionGroups[broadId] = [];
            }
            sectionGroups[broadId].push({ topic: topic.category, data: topic });
        });

        return CATEGORIES.map(cat => ({
            id: cat.id,
            label: cat.label,
            items: sectionGroups[cat.id] || []
        })).filter(section => section.items.length > 0);

    }, [topics, category, searchQuery]);

    const handleTopicClick = (topicData: any) => {
        // Navigate to the new level selection page
        router.push(`/practice/category/${encodeURIComponent(topicData.category)}`);
    };

    return (
        <section className="space-y-12">
            {/* Recommendation Section - Only on "All" tab and no search query */}
            {category === "all" && !searchQuery && recommended && (
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-6 w-1 rounded-full bg-gradient-to-b from-orange-400 to-orange-600"></div>
                        <h3 className="text-xl font-bold text-slate-800">
                            Recommended for You <span className="text-slate-400 font-normal text-sm ml-2">(Based on your profile)</span>
                        </h3>
                    </div>

                    {recommended.tests.length > 0 ? (
                        <div className="flex overflow-x-auto pb-4 gap-4 md:flex md:flex-wrap md:gap-6 md:overflow-visible scrollbar-hide snap-x w-full max-w-full">
                            {/* Filter unique topics from recommendations to avoid duplicates */}
                            {Array.from(new Map(recommended.tests.map(t => [t.category, t])).values()).map(test => (
                                <div key={test._id} className="min-w-[240px] w-[240px] md:w-[260px] flex-shrink-0 snap-center">
                                    <TestCard
                                        id={test._id}
                                        title={test.category} // Show Topic Name "Python"
                                        category={test.category}
                                        questions={10} // Placeholder or agg
                                        duration={`${test.duration || 30} mins`}
                                        difficulty="3 Levels" // Static for topic card
                                        imageColor={test.imageColor}
                                        description={test.description}
                                        onClick={() => router.push(`/practice/category/${encodeURIComponent(test.category)}`)} // Go to Level Selection
                                        buttonText="Start Practice"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-8 text-center">
                            <h4 className="text-lg font-bold text-slate-800 mb-2">Build your profile to get personalized recommendations</h4>
                            <p className="text-slate-600 mb-6 text-sm max-w-md mx-auto">
                                Upload your resume or add your skills to get AI-curated practice papers tailored to your career goals.
                            </p>
                            <Button className="rounded-full bg-orange-500 hover:bg-orange-600 text-white" onClick={() => router.push("/profile/edit")}>
                                Complete Profile
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {sections.length > 0 ? (
                sections.map(section => (
                    <div key={section.id} className="relative group">
                        {/* Only show header if showing multiple sections? Or always? Always good for context. */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className={`h-6 w-1 rounded-full bg-slate-900`}></div>
                            <h3 className="text-xl font-bold text-slate-800">{section.label}</h3>
                            <div className="text-sm text-slate-400 ml-2">({section.items.length} topics)</div>
                        </div>

                        {category === "all" ? (
                            <div className="px-1">
                                <Carousel
                                    opts={{
                                        align: "start",
                                        dragFree: true,
                                    }}
                                    className="w-full"
                                >
                                    <CarouselContent className="-ml-4 pb-4">
                                        {section.items.map(({ topic, data }) => (
                                            <CarouselItem key={topic} className="pl-4 basis-[240px] md:basis-[260px] grow-0 shrink-0">
                                                <div className="h-full">
                                                    <TestCard
                                                        id={data.levels[0]?.id || "topic"} // Placeholder ID
                                                        title={topic} // "Python"
                                                        category={topic}
                                                        questions={data.totalQuestions}
                                                        duration={`${data.levels.length} Variations`} // Or sum duration
                                                        difficulty={`${data.levels.length} Levels`}
                                                        imageColor={data.imageColor}
                                                        description={data.description || `Practice ${topic} questions.`}
                                                        onClick={() => handleTopicClick(data)}
                                                        buttonText="Select Level"
                                                        hideStats={false}
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="hidden md:flex -left-4 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 bg-white shadow-md border-slate-200" />
                                    <CarouselNext className="hidden md:flex -right-4 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 bg-white shadow-md border-slate-200" />
                                </Carousel>
                            </div>
                        ) : (
                            // Grid View for specific category tabs - Fixed Width Cards using Flex Wrap
                            <div className="flex flex-wrap gap-6">
                                {section.items.map(({ topic, data }) => {
                                    const durations = data.levels.map((l: any) => l.duration);
                                    const minDur = durations.length ? Math.min(...durations) : 30;
                                    const maxDur = durations.length ? Math.max(...durations) : 30;
                                    const durLabel = minDur === maxDur ? `${minDur} mins` : `${minDur}-${maxDur} mins`;

                                    return (
                                        <div key={topic} className="w-[240px] md:w-[260px] flex-shrink-0">
                                            <TestCard
                                                id={data.levels[0]?.id || "topic"}
                                                title={topic}
                                                category={topic}
                                                questions={data.totalQuestions}
                                                duration={durLabel}
                                                difficulty={`${data.levels.length} Levels`}
                                                imageColor={data.imageColor}
                                                description={data.description || `Practice ${topic} questions.`}
                                                onClick={() => handleTopicClick(data)}
                                                buttonText="Select Level"
                                                hideStats={false}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-12 text-slate-500">
                    {isLoading ? "Loading topics..." : (searchQuery ? `No topics found matching "${searchQuery}"` : "No practice topics available.")}
                </div>
            )}
        </section>
    );
}
