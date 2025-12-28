"use client";

import React from "react";
import { Search, Code, Brain, BookOpen, Building2, Briefcase, GraduationCap, Calculator, Languages } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// MOVED CONSTANTS HERE OR ACCEPT AS PROPS (Better to keep them here if static)
export const CATEGORIES = [
    { id: "aptitude", label: "Aptitude", icon: Calculator, color: "bg-blue-100 text-blue-600" },
    { id: "reasoning", label: "Reasoning", icon: Brain, color: "bg-purple-100 text-purple-600" },
    { id: "english", label: "English", icon: Languages, color: "bg-green-100 text-green-600" },
    { id: "coding", label: "Coding", icon: Code, color: "bg-orange-100 text-orange-600" },
    { id: "company", label: "Company Mock", icon: Building2, color: "bg-indigo-100 text-indigo-600" },
    { id: "role", label: "Job Role", icon: Briefcase, color: "bg-pink-100 text-pink-600" },
    { id: "domain", label: "Domain Skills", icon: GraduationCap, color: "bg-cyan-100 text-cyan-600" },
];

const FILTERS = [
    { label: "Difficulty", options: ["Beginner", "Intermediate", "Advanced"] },
    { label: "Type", options: ["Skill Tests", "Company Tests", "Job Role"] },
    { label: "Duration", options: ["Short", "Medium", "Long"] },
];

interface PracticeFiltersProps {
    activeCategory: string;
    setActiveCategory: (id: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    className?: string; // To support styling wrapper if needed
}

export function PracticeFilters({ activeCategory, setActiveCategory, searchQuery, setSearchQuery, className }: PracticeFiltersProps) {
    return (
        <div className={cn("space-y-8", className)}>
            {/* Search */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Search</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search tests..."
                        className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Categories</h2>
                <div className="space-y-2">
                    <button
                        onClick={() => setActiveCategory("all")}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left text-sm",
                            activeCategory === "all"
                                ? "bg-slate-900 text-white shadow-md font-medium"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        )}
                    >
                        <div className={cn("p-1.5 rounded-full", activeCategory === "all" ? "bg-white/20" : "bg-slate-100")}>
                            <BookOpen className="h-3.5 w-3.5" />
                        </div>
                        <span>All Categories</span>
                    </button>
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left text-sm",
                                activeCategory === cat.id
                                    ? "bg-slate-900 text-white shadow-md font-medium"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <div className={cn("p-1.5 rounded-full", activeCategory === cat.id ? "bg-white/20" : cat.color)}>
                                <cat.icon className="h-3.5 w-3.5" />
                            </div>
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Filters</h2>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-slate-500 hover:text-slate-900 text-xs">Reset</Button>
                </div>
                <div className="space-y-3">
                    {FILTERS.map((filter) => (
                        <div key={filter.label} className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filter.label}</label>
                            <select className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer hover:border-slate-300 transition-colors">
                                <option value="">Any {filter.label}</option>
                                {filter.options.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                    <div className="pt-2 flex gap-2">
                        <Badge variant="outline" className="flex-1 justify-center py-2 cursor-pointer hover:bg-slate-50 hover:border-slate-300 font-medium text-slate-600 transition-all">Free</Badge>
                        <Badge variant="outline" className="flex-1 justify-center py-2 cursor-pointer hover:bg-slate-50 hover:border-slate-300 font-medium text-slate-600 transition-all">Premium</Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}
