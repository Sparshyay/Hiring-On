"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestCard } from "./test-card";
import { useRouter } from "next/navigation";
import { ASSESSMENT_DATA } from "./mock-data";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function AssessmentScrollContainer({ items, router, slugify }: { items: any[], router: any, slugify: (s: string) => string }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 340; // Approx card width + gap
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="relative group">
            {/* Scroll Buttons - Visible on Desktop */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-slate-100 text-slate-600 hover:bg-white hover:text-blue-600 hidden md:flex opacity-0 group-hover:opacity-100 transition-all"
                onClick={() => scroll('left')}
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-slate-100 text-slate-600 hover:bg-white hover:text-blue-600 hidden md:flex opacity-0 group-hover:opacity-100 transition-all"
                onClick={() => scroll('right')}
            >
                <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Scroll Area */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory scrollbar-hide md:custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
            >
                {items.map((item, i) => {
                    const id = `mock-${slugify(item.title)}`;
                    return (
                        <div key={id} className="min-w-[85vw] sm:min-w-[300px] md:min-w-[320px] snap-center h-full">
                            <TestCard
                                id={id}
                                title={item.title}
                                category={item.category}
                                questions={30} // Dummy
                                duration="45 mins" // Dummy
                                difficulty="Intermediate" // Dummy
                                description={item.desc}
                                onClick={() => router.push(`/practice/category/${encodeURIComponent(item.category)}`)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function SkillBasedAssessments() {
    const router = useRouter();
    const slugify = (str: string) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    return (
        <section className="mb-12">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-slate-900">Skill-Based Mock Test (Assessments)</h2>
                    </div>
                    <p className="text-slate-500">Master your concepts with level-wise tests, followed by full-length mock exams.</p>
                </div>
            </div>

            <Tabs defaultValue="Tech" className="w-full">
                <TabsList className="w-full justify-start h-auto bg-transparent p-0 mb-6 gap-2 flex-wrap border-b border-transparent overflow-x-auto scrollbar-hide">
                    {Object.keys(ASSESSMENT_DATA).map((tab) => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            className="rounded-full border border-slate-200 px-6 py-2 text-slate-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 data-[state=active]:shadow-none bg-white hover:bg-slate-50 transition-all font-medium whitespace-nowrap"
                        >
                            {tab}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {Object.entries(ASSESSMENT_DATA).map(([tab, items]) => (
                    <TabsContent key={tab} value={tab} className="mt-0 focus-visible:ring-0">
                        <AssessmentScrollContainer items={items} router={router} slugify={slugify} />
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    );
}
