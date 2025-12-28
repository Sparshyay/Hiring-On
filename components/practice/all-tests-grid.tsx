"use client";

import { TestCard } from "./test-card";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Layers } from "lucide-react";

export function AllTestsGrid({ searchQuery = "", category = "all" }: { searchQuery?: string, category?: string }) {
    const [visibleGroups, setVisibleGroups] = useState(9);
    const router = useRouter();

    // Fetch tests from Convex
    const testsQuery = useQuery(api.tests.getTests, {
        category: category === "all" ? undefined : category,
        search: searchQuery,
        type: "standard"
    });

    const isLoading = testsQuery === undefined;
    const tests = testsQuery || [];

    // Group tests by Category
    const groupedTests = useMemo(() => {
        const groups: Record<string, typeof tests> = {};

        tests.forEach(test => {
            if (!groups[test.category]) {
                groups[test.category] = [];
            }
            groups[test.category].push(test);
        });

        return Object.entries(groups).map(([topic, levels]) => ({
            topic,
            levels
        }));
    }, [tests]);

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Practice Topics</h2>
                <div className="text-sm text-slate-500">Showing {Math.min(visibleGroups, groupedTests.length)} of {groupedTests.length} topics</div>
            </div>

            {groupedTests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {groupedTests.slice(0, visibleGroups).map(({ topic, levels }) => (
                        <div key={topic} className="h-full">
                            <div key={topic} className="h-full">
                                {/* Topic Card - Reusing the TestCard visual */}
                                <TestCard
                                    id={levels[0]._id} // Dummy ID
                                    title={topic}
                                    category={topic} // Show topic category
                                    questions={levels.reduce((acc, curr) => acc + curr.questionsCount, 0)} // Sum of questions
                                    duration={`${Math.max(...levels.map(l => l.duration))} mins`} // Max duration or range
                                    difficulty={`${levels.length} Levels`} // Show number of levels
                                    imageColor={levels[0].imageColor} // Use color from first test
                                    description={`Practice ${topic} questions across ${levels.length} difficulty levels.`}
                                    onClick={() => router.push(`/practice/category/${encodeURIComponent(topic)}`)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-slate-500">
                    {isLoading ? "Loading topics..." : (searchQuery ? `No topics found matching "${searchQuery}"` : "No practice topics available.")}
                </div>
            )}

            {groupedTests.length > visibleGroups && (
                <div className="mt-10 text-center">
                    <Button
                        variant="outline"
                        size="lg"
                        className="min-w-[200px] rounded-full border-blue-200 text-blue-600 hover:bg-blue-50"
                        onClick={() => setVisibleGroups(prev => prev + 6)}
                    >
                        Load More Topics
                    </Button>
                </div>
            )}
        </section>
    );
}
