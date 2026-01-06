"use client";

import * as React from "react";
import { Search, Loader2, Briefcase, Building2, User, X } from "lucide-react"; // Added X
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useUserRole";

function GraduationCapIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    )
}

export function GlobalSearch({ className }: { className?: string }) { // Added className prop support
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const router = useRouter();
    const { isAdmin } = useUserRole();
    const searchRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                if (searchQuery.length === 0) {
                    setIsExpanded(false);
                }
                // If query exists, we might want to keep it or close dropdown?
                // Let's keep it simple: close results, keep input expanded if it has text?
                // Or just collapse everything if clicked outside.
                // User request: "become a search tab".
                // I'll collapse if empty. If not empty, maybe keep expanded but hide results?
                // I'll collapse regardless for clean UI, maybe clearing query? No, just collapse.
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchQuery]);


    // Debounce
    const [debouncedQuery, setDebouncedQuery] = React.useState("");
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const results = useQuery(api.search.searchGlobal, { query: debouncedQuery });
    const isLoading = results === undefined && debouncedQuery.length >= 2;

    const handleSelect = (item: any) => {
        setIsExpanded(false);
        setSearchQuery("");
        if (isAdmin && item.type === "Company") {
            router.push(`/admin/companies/${item.id}`);
        } else {
            router.push(item.link);
        }
    };

    const toggleSearch = () => {
        setIsExpanded(!isExpanded);
        if (!isExpanded) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    return (
        <div ref={searchRef} className={cn("relative flex items-center", className)}>
            <div
                className={cn(
                    "flex items-center transition-all duration-300 ease-in-out border rounded-full bg-slate-50 overflow-hidden",
                    isExpanded ? "w-[200px] sm:w-[300px] border-slate-200 shadow-sm" : "w-10 h-10 border-transparent bg-transparent"
                )}
            >
                <Button // Toggle Button (Visible when collapsed)
                    variant="ghost"
                    size="icon"
                    className={cn("h-10 w-10 text-muted-foreground hover:bg-slate-100 rounded-full shrink-0", isExpanded ? "hidden" : "flex")}
                    onClick={toggleSearch}
                >
                    <Search className="h-5 w-5" />
                </Button>

                {/* Input Field (Visible when expanded) */}
                <div className={cn("flex items-center w-full h-full px-3 gap-2", !isExpanded && "hidden")}>
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                        ref={inputRef}
                        placeholder="Search..."
                        className="border-0 focus-visible:ring-0 px-0 h-9 bg-transparent text-sm w-full shadow-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-slate-200"
                            onClick={() => setSearchQuery("")}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Dropdown Results */}
            {isExpanded && debouncedQuery.length >= 2 && (
                <div className="absolute top-full right-0 mt-2 w-[320px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-[60]">
                    <div className="max-h-[300px] overflow-y-auto py-2">
                        {isLoading && (
                            <div className="p-4 flex justify-center items-center text-muted-foreground text-sm">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Searching...
                            </div>
                        )}

                        {!isLoading && results && results.length === 0 && (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                                No results found.
                            </div>
                        )}

                        {!isLoading && results && results.length > 0 && results.map((item: any) => (
                            <div
                                key={item.id}
                                className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0"
                                onClick={() => handleSelect(item)}
                            >
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                    {item.type === "Job" && <Briefcase className="h-4 w-4 text-orange-500" />}
                                    {item.type === "Internship" && <GraduationCapIcon className="h-4 w-4 text-blue-500" />}
                                    {item.type === "Company" && <Building2 className="h-4 w-4 text-slate-500" />}
                                    {item.type === "Candidate" && <User className="h-4 w-4 text-green-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate text-slate-700">{item.title}</p>
                                    <p className="text-xs text-slate-500 truncate">{item.type} • {item.subtitle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
