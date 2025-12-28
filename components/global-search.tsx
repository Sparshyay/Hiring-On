"use client";

import * as React from "react";
import { Search, Loader2, Briefcase, Building2, User, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useUserRole } from "@/hooks/useUserRole";

export function GlobalSearch() {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const router = useRouter();
    const { isAdmin } = useUserRole();

    // Simple debounce implementation if hook missing
    const [debouncedQuery, setDebouncedQuery] = React.useState("");
    React.useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const results = useQuery(api.search.searchGlobal, { query: debouncedQuery });
    const isLoading = results === undefined && debouncedQuery.length >= 2;

    const handleSelect = (item: any) => {
        setOpen(false);
        if (isAdmin && item.type === "Company") {
            router.push(`/admin/companies/${item.id}`);
        } else {
            router.push(item.link);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] p-0 gap-0 overflow-hidden">
                <DialogTitle className="sr-only">Global Search</DialogTitle>
                <DialogHeader className="px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search jobs, internships, companies..."
                            className="border-0 focus-visible:ring-0 px-0 h-auto text-base"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </DialogHeader>

                <div className="max-h-[300px] overflow-y-auto">
                    {isLoading && (
                        <div className="p-4 flex justify-center items-center text-muted-foreground text-sm">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Searching...
                        </div>
                    )}

                    {!isLoading && debouncedQuery.length < 2 && (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            Type at least 2 characters to search.
                        </div>
                    )}

                    {!isLoading && results && results.length === 0 && debouncedQuery.length >= 2 && (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            No results found for "{debouncedQuery}".
                        </div>
                    )}

                    {!isLoading && results && results.length > 0 && (
                        <div className="py-2">
                            {results.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="px-4 py-3 hover:bg-muted/50 cursor-pointer flex items-center gap-3 transition-colors"
                                    onClick={() => handleSelect(item)}
                                >
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                        {item.type === "Job" && <Briefcase className="h-4 w-4 text-orange-500" />}
                                        {item.type === "Internship" && <GraduationCapIcon className="h-4 w-4 text-blue-500" />}
                                        {item.type === "Company" && <Building2 className="h-4 w-4 text-slate-500" />}
                                        {item.type === "Candidate" && <User className="h-4 w-4 text-green-500" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{item.title}</p>
                                        <p className="text-xs text-muted-foreground truncate">{item.type} • {item.subtitle}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

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
