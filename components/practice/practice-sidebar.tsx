"use client";

import React, { useState, useEffect } from "react";
import { PracticeFilters } from "./practice-filters";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface PracticeSidebarProps {
    activeCategory: string;
    setActiveCategory: (id: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export function PracticeSidebar({
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
}: PracticeSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Auto-collapse on tablet/smaller screens
    useEffect(() => {
        const checkSize = () => {
            const width = window.innerWidth;
            if (width < 1024) { // lg breakpoint
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
            setIsMobile(width < 768);
        };

        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <TooltipProvider>
            <div
                className={cn(
                    "flex flex-col border-r border-slate-200 bg-white shadow-sm transition-all duration-300 ease-in-out relative h-[calc(100vh-5rem)] rounded-2xl overflow-hidden",
                    isCollapsed ? "w-[80px]" : "w-[260px]"
                )}
            >
                {/* Header / Toggle */}
                <div className={cn("p-4 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                    {!isCollapsed && <span className="font-bold text-slate-800 text-lg">Filters</span>}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    >
                        {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </Button>
                </div>

                {/* Filters Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar">
                    <PracticeFilters
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        isCollapsed={isCollapsed}
                    />
                </div>
            </div>
        </TooltipProvider>
    );
}
