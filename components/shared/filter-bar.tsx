"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";
import { useState, useEffect } from "react";

interface FilterOption {
    label: string;
    value: string;
}

interface FilterGroup {
    id: string;
    label: string;
    options: FilterOption[];
}

interface FilterBarProps {
    onSearchChange?: (query: string) => void;
    onFilterChange?: (filters: Record<string, string>) => void;
    searchPlaceholder?: string;
    filterGroups?: FilterGroup[];
    className?: string;
}

export function FilterBar({
    onSearchChange,
    onFilterChange,
    searchPlaceholder = "Search...",
    filterGroups = [],
    className = "",
}: FilterBarProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onSearchChange) onSearchChange(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, onSearchChange]);

    const handleFilterSelect = (groupId: string, value: string) => {
        const newFilters = { ...activeFilters, [groupId]: value };
        // If "all" or empty is selected, remove the key
        if (value === "all" || value === "") {
            delete newFilters[groupId];
        }

        setActiveFilters(newFilters);
        if (onFilterChange) onFilterChange(newFilters);
    };

    const clearFilters = () => {
        setSearchQuery("");
        setActiveFilters({});
        if (onSearchChange) onSearchChange("");
        if (onFilterChange) onFilterChange({});
    };

    const hasActiveFilters = searchQuery !== "" || Object.keys(activeFilters).length > 0;

    return (
        <div className={`flex flex-col md:flex-row gap-4 items-center mb-6 bg-white p-4 rounded-xl border shadow-sm ${className}`}>
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-50 border-slate-200"
                />
            </div>

            <div className="flex flex-1 gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 items-center">
                {filterGroups.map((group) => (
                    <Select
                        key={group.id}
                        value={activeFilters[group.id] || "all"}
                        onValueChange={(val) => handleFilterSelect(group.id, val)}
                    >
                        <SelectTrigger className="w-[140px] bg-white text-slate-600 border-slate-200">
                            <SelectValue placeholder={group.label} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All {group.label}</SelectItem>
                            {group.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ))}

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-auto md:ml-2"
                    >
                        <X className="w-4 h-4 mr-1" /> Clear
                    </Button>
                )}
            </div>
        </div>
    );
}
