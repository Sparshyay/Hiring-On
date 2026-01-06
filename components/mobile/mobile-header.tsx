"use client";

import { ArrowLeft, Search, X, Menu, BookOpen, Mail } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const allNavItems = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: "Internships", href: "/internships" },
    { name: "Practice", href: "/practice" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact Us", href: "/contact" },
];

export function MobileHeader() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [query, setQuery] = useState(searchParams.get("search") || "");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Sheet state

    // Auth check for Sidebar
    const user = useQuery(api.auth.getUser);
    const isRecruiter = user?.role === "recruiter" && (user as any)?.verificationStatus === "verified";
    const isAdmin = user?.role === "admin";

    // Treat Home as a listing page so it gets the Logo+Tabs header
    const isListingPage = pathname === "/" || pathname.includes("/jobs") || pathname.includes("/internships") || pathname.includes("/practice");

    // Sync local state if URL changes externally
    useEffect(() => {
        setQuery(searchParams.get("search") || "");
    }, [searchParams]);

    const handleSearch = (term: string) => {
        setQuery(term);
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    if (!isListingPage) {
        // Generic Header (e.g. Details Pages)
        return (
            <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 h-16 flex items-center gap-2 md:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="rounded-full -ml-2 hover:bg-slate-100 text-slate-900"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-bold text-lg capitalize text-slate-900">
                    {pathname.split("/").pop()?.replace("-", " ") || "Hiring On"}
                </h1>
            </div>
        );
    }

    // Listing Page Header (Hamburger + Logo/Search + Tabs)
    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b md:hidden flex flex-col">
            {/* Top Row: Hamburger & Logo & Search Toggle */}
            <div className="h-16 px-4 flex items-center justify-between gap-3">
                {!isSearchOpen ? (
                    <>
                        <div className="flex items-center gap-2">
                            {/* Hamburger Menu (Sidebar) */}
                            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="-ml-2 text-slate-700 hover:bg-slate-100 rounded-full">
                                        <Menu className="w-6 h-6" />
                                        <span className="sr-only">Toggle Menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] p-0 border-r border-slate-200 bg-white shadow-2xl">
                                    <div className="flex flex-col h-full overflow-hidden">
                                        <div className="p-6 pt-8 border-b border-slate-100">
                                            <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                                            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-0">
                                                <Image src="/logo-full.png" alt="Hiring On" width={500} height={150} className="h-20 w-auto object-contain" />
                                            </Link>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Navigation</p>
                                                {allNavItems.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className={cn(
                                                            "block px-3 py-2 rounded-md text-base font-medium transition-colors hover:bg-orange-50 hover:text-orange-600",
                                                            pathname === item.href ? "bg-orange-50 text-orange-600" : "text-slate-600"
                                                        )}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                            {(isRecruiter || isAdmin) && (
                                                <div className="space-y-1 pt-4 border-t border-slate-100">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dashboards</p>
                                                    {isRecruiter && (
                                                        <Link href="/recruiter" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-600">
                                                            Recruiter Dashboard
                                                        </Link>
                                                    )}
                                                    {isAdmin && (
                                                        <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-600">
                                                            Admin Dashboard
                                                        </Link>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Logo */}
                            <Image
                                src="/logo-full.png"
                                alt="Hiring On"
                                width={180}
                                height={60}
                                className="h-14 w-auto object-contain"
                                priority
                            />
                        </div>

                        {/* Search Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSearchOpen(true)}
                            className="rounded-full text-slate-600 hover:bg-slate-100"
                        >
                            <Search className="w-6 h-6" />
                        </Button>
                    </>
                ) : (
                    <div className="flex-1 flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                autoFocus
                                placeholder="Search..."
                                className="w-full h-10 pl-9 pr-4 rounded-full bg-slate-100 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsSearchOpen(false)}
                            className="shrink-0 text-slate-500 hover:text-slate-900"
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </div>

            {/* Bottom Row: Tabs */}
            <div className="px-4 pb-3 overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-3">
                    {[
                        { label: "All Opportunities", href: "/jobs?type=all" },
                        { label: "Jobs", href: "/jobs" },
                        { label: "Internships", href: "/internships" },
                        { label: "Practice", href: "/practice" },
                        { label: "Mock Tests", href: "/practice?type=mock_test" },
                        { label: "Resume Builder", href: "/resume-builder" },
                    ].map((tab) => {
                        const isActive =
                            (tab.label === "All Opportunities" && searchParams.get("type") === "all") ||
                            (tab.label === "Jobs" && pathname === "/jobs" && !searchParams.get("type")) ||
                            (tab.label === "Internships" && pathname === "/internships") ||
                            (tab.label === "Practice" && pathname === "/practice" && !searchParams.get("type")) ||
                            (tab.label === "Mock Tests" && pathname === "/practice" && searchParams.get("type") === "mock_test") ||
                            (tab.label === "Resume Builder" && pathname === "/resume-builder");

                        return (
                            <Button
                                key={tab.label}
                                variant="ghost"
                                onClick={() => router.push(tab.href)}
                                className={cn(
                                    "rounded-full px-3 py-1 h-auto text-sm font-medium transition-colors whitespace-nowrap",
                                    isActive
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                )}
                            >
                                {tab.label}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
