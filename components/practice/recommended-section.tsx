"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TestCard } from "./test-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function RecommendedSection({ searchQuery = "", category = "all" }: { searchQuery?: string, category?: string }) {
    const router = useRouter();
    // Ideally we would have a specific "getRecommended" query, but for now we reuse getTests
    const tests = useQuery(api.tests.getTests, {
        category: category === "all" ? undefined : category,
        search: searchQuery,
        type: "standard" // Fetch only standard tests
    }) || [];

    // Group tests by Category to remove duplicates
    const groupedTests = React.useMemo(() => {
        const groups: Record<string, typeof tests> = {};
        tests.forEach(test => {
            if (!groups[test.category]) groups[test.category] = [];
            groups[test.category].push(test);
        });
        return Object.entries(groups).map(([topic, levels]) => ({ topic, levels }));
    }, [tests]);

    const recommendedTopics = groupedTests.slice(0, 10); // Show top 10 topics

    if (recommendedTopics.length === 0) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        Recommended for You <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
                    </h2>
                    <p className="text-slate-500 mt-1">Based on your profile and recent activity</p>
                </div>
                <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>

            <Carousel className="w-full">
                <CarouselContent className="-ml-4 pb-4">
                    {recommendedTopics.map(({ topic, levels }) => (
                        <CarouselItem key={topic} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                            <TestCard
                                id={levels[0]._id} // Dummy ID
                                title={topic}
                                category={topic}
                                questions={levels.reduce((acc, curr) => acc + curr.questionsCount, 0)}
                                duration={`${Math.max(...levels.map(l => l.duration))} mins`}
                                difficulty={`${levels.length} Levels`}
                                imageColor={levels[0].imageColor}
                                compact={true} // Use smaller layout
                                description={`Assess your ${topic} skills.`}
                                onClick={() => router.push(`/practice/category/${encodeURIComponent(topic)}`)}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-2 mr-4">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                </div>
            </Carousel>
        </section>
    );
}
