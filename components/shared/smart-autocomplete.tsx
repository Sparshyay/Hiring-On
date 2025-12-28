"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Fuse from "fuse.js";
import { useState, useEffect } from "react";

type SearchType = "colleges" | "jobTitles" | "skills" | "companies" | "locations" | "universities";

interface SmartAutocompleteProps {
    type: SearchType;
    placeholder?: string;
    onSelect: (value: string, item?: any) => void;
    value?: string;
    extraArgs?: Record<string, any>;
}

export function SmartAutocomplete({ type, placeholder, onSelect, value, extraArgs }: SmartAutocompleteProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedTerm(searchTerm), 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Select API Query based on type
    const queryMap = {
        colleges: api.master_data.searchColleges,
        jobTitles: api.search.searchJobTitles, // Keep existing for now
        skills: api.master_data.searchSkills,
        companies: api.search.searchCompanies, // Keep existing
        locations: api.search.searchLocations, // Keep existing
        universities: api.master_data.searchUniversities,
    };

    const searchFieldMap = {
        colleges: "name",
        jobTitles: "title",
        skills: "name",
        companies: "name",
        locations: "city",
        universities: "name",
    };

    // Fetch Prefix Matches from Convex
    // Cast to any to avoid complex union type issues with Fuse.js since we know the structure
    const results = useQuery(queryMap[type], { query: debouncedTerm, ...extraArgs }) as any[] | undefined;

    // Client-side Fuzzy Refinement using Fuse.js
    const [filteredResults, setFilteredResults] = useState<any[]>([]);

    useEffect(() => {
        if (!results) {
            setFilteredResults([]);
            return;
        }

        let rawResults = results;
        if (debouncedTerm.trim() !== "") {
            const keys = [searchFieldMap[type]];
            const fuse = new Fuse(results, {
                keys: keys,
                threshold: 0.4, // Sensitivity
            });

            const fuseResults = fuse.search(debouncedTerm);
            if (fuseResults.length > 0) {
                rawResults = fuseResults.map(r => r.item);
            }
        }

        // Deduplication Logic
        const seen = new Set();
        const uniqueResults = rawResults.filter(item => {
            const val = item[searchFieldMap[type]];
            if (seen.has(val)) return false;
            seen.add(val);
            return true;
        });

        setFilteredResults(uniqueResults);

    }, [results, debouncedTerm, type]);

    const displayValue = value || "Select...";

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value ? value : <span className="text-slate-500">{placeholder || "Search..."}</span>}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <Command shouldFilter={false}> {/* Disable internal command filtering, we do it */}
                    <CommandInput
                        placeholder={placeholder || "Type to search..."}
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                    />
                    <CommandList>
                        {debouncedTerm && results === undefined && <div className="p-2 text-center text-sm text-slate-500 flex justify-center"><Loader2 className="animate-spin w-4 h-4" /></div>}

                        {!results?.length && debouncedTerm && (
                            <CommandEmpty>No results found.</CommandEmpty>
                        )}

                        <CommandGroup>
                            {filteredResults.map((item: any) => {
                                const val = item[searchFieldMap[type]];
                                const key = item._id;
                                return (
                                    <CommandItem
                                        key={key}
                                        value={val} // This is used by Command for internal logic usually, but we handle onSelect
                                        onSelect={() => {
                                            onSelect(val, item);
                                            setOpen(false);
                                            setSearchTerm(""); // Clear search on select? Optional.
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === val ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <div className="flex flex-col">
                                            <span>{val}</span>
                                            {/* Show extra context if available */}
                                            {type === 'colleges' && <span className="text-xs text-slate-400">{item.city}, {item.state}</span>}
                                            {type === 'companies' && <span className="text-xs text-slate-400">{item.industry}</span>}
                                            {type === 'locations' && <span className="text-xs text-slate-400">{item.state}, {item.country}</span>}
                                            {type === 'skills' && <span className="text-xs text-slate-400 capitalize">{item.category || item.type}</span>}
                                            {type === 'universities' && <span className="text-xs text-slate-400">{item.city}, {item.state}</span>}
                                        </div>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
