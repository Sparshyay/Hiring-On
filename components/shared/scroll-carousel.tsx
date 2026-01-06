"use client";

import { useRef, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScrollCarouselProps {
    children: ReactNode;
    className?: string;
}

export function ScrollCarousel({ children, className }: ScrollCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            // Scroll by one container width or a reasonable amount
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className={cn("relative group", className)}>
            {/* Scroll Buttons - Visible on Desktop on Hover */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 h-10 w-10 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-slate-100 text-slate-700 hover:bg-white hover:text-blue-600 hidden md:flex opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
            >
                <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 h-10 w-10 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-slate-100 text-slate-700 hover:bg-white hover:text-blue-600 hidden md:flex opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
            >
                <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Scroll Area */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto pb-6 gap-4 md:gap-6 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
            >
                {children}
            </div>
        </div>
    );
}
