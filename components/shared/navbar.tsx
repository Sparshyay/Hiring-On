"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, ChevronDown, BookOpen, Mail } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ProfileDropdown } from "./profile-dropdown";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { GlobalSearch } from "@/components/global-search";
import { NotificationsPopover } from "@/components/notifications-popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const allNavItems = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: "Internships", href: "/internships" },
    { name: "Practice", href: "/practice" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact Us", href: "/contact" },
];

const primaryNavItems = allNavItems.slice(0, 4); // Home, Jobs, Internships, Practice
const secondaryNavItems = allNavItems.slice(4);  // Blogs, Contact

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const user = useQuery(api.auth.getUser);

    const isRecruiter = user?.role === "recruiter" && (user as any)?.verificationStatus === "verified";
    const isAdmin = user?.role === "admin";

    // Helper for active link styles
    const getLinkClass = (href: string) => cn(
        "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap",
        pathname === href ? "text-primary font-bold" : "text-slate-600"
    );

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-20 items-center px-4 gap-4">

                {/* --- LEFT SECTION: Hamburger (Tablet/Mobile) & Logo --- */}
                <div className="flex items-center gap-4">
                    {/* Tablet/Mobile Hamburger */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button variant="ghost" size="icon" className="-ml-2 h-10 w-10 text-slate-700 hover:bg-orange-50 rounded-full">
                                <div className="flex flex-col gap-1.5 items-center justify-center w-6 h-6 overflow-visible">
                                    <span className={cn("h-0.5 w-6 bg-slate-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] origin-center", isOpen ? "rotate-45 translate-y-2" : "")} />
                                    <span className={cn("h-0.5 w-6 bg-slate-900 rounded-full transition-all duration-300 ease-out", isOpen ? "opacity-0 scale-x-0" : "")} />
                                    <span className={cn("h-0.5 w-6 bg-slate-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] origin-center", isOpen ? "-rotate-45 -translate-y-2" : "")} />
                                </div>
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>

                        {/* Sidebar / Mobile Menu */}
                        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 border-r border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl">
                            <div className="flex flex-col h-full overflow-hidden">
                                {/* Header */}
                                <div className="p-6 pt-8 border-b border-slate-100">
                                    <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                                    {/* Logo */}
                                    <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-0">
                                        <Image src="/logo-full.png" alt="Hiring On" width={500} height={150} className="h-20 w-auto object-contain" />
                                    </Link>
                                </div>

                                {/* Menu Items */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {/* Search in Menu for Tablet/Mobile */}
                                    <div className="pb-4 border-b border-slate-100 lg:hidden">
                                        <GlobalSearch />
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Navigation</p>
                                        {allNavItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
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
                                                <Link href="/recruiter" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-600">
                                                    Recruiter Dashboard
                                                </Link>
                                            )}
                                            {isAdmin && (
                                                <Link href="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:bg-orange-50 hover:text-orange-600">
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Logo (Always Visible) */}
                    <Link href="/" className="flex items-center gap-0 mr-4">
                        <Image src="/logo-full.png" alt="Hiring On" width={500} height={150} className="h-16 sm:h-24 w-auto object-contain" />
                    </Link>
                </div>

                {/* --- CENTER SECTION: Navigation (Desktop & Laptop) --- */}
                <div className="hidden lg:flex flex-1 items-center justify-center gap-6">
                    {/* Primary Items (Always Visible on Large) */}
                    {primaryNavItems.map((item) => (
                        <Link key={item.href} href={item.href} className={getLinkClass(item.href)}>
                            {item.name}
                        </Link>
                    ))}

                    {/* Desktop (XL): Show Secondary Items Inline */}
                    <div className="hidden xl:flex items-center gap-6">
                        {secondaryNavItems.map((item) => (
                            <Link key={item.href} href={item.href} className={getLinkClass(item.href)}>
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Laptop (LG but not XL): "More" Dropdown */}
                    <div className="flex xl:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="group gap-1.5 h-9 px-3 font-medium text-slate-600 hover:text-primary hover:bg-orange-50/50 rounded-full transition-all duration-200">
                                    More
                                    <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                sideOffset={8}
                                className="w-56 p-2 rounded-2xl border border-slate-100/50 bg-white/80 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.2)] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2"
                            >
                                {secondaryNavItems.map((item) => (
                                    <DropdownMenuItem key={item.href} asChild className="focus:bg-transparent">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer outline-none group",
                                                pathname === item.href
                                                    ? "bg-orange-50 text-orange-600 font-semibold"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            {item.name === "Blogs" && <BookOpen className={cn("w-4 h-4", pathname === item.href ? "text-orange-600" : "text-slate-400 group-hover:text-slate-600")} />}
                                            {item.name === "Contact Us" && <Mail className={cn("w-4 h-4", pathname === item.href ? "text-orange-600" : "text-slate-400 group-hover:text-slate-600")} />}

                                            <span>{item.name}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* --- RIGHT SECTION: Actions (Always Visible) --- */}
                <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                    {/* Dashboards, Host, Search - Desktop/Laptop */}
                    <div className="hidden lg:flex items-center gap-4">
                        {/* Dashboards (Moved Here) */}
                        {isRecruiter && (
                            <Link href="/recruiter" className={getLinkClass("/recruiter")}>Recruiter Dashboard</Link>
                        )}
                        {isAdmin && (
                            <Link href="/admin" className={getLinkClass("/admin")}>Admin Dashboard</Link>
                        )}
                        {(isRecruiter || isAdmin) && (
                            <div className="h-6 w-px bg-slate-200" />
                        )}

                        <Button asChild variant="ghost" className="rounded-full text-[#234B73] font-bold hover:bg-blue-50">
                            <Link href="/recruiter/onboarding">Host</Link>
                        </Button>
                        <div className="h-6 w-px bg-slate-200" />

                        <GlobalSearch />
                    </div>

                    {/* User Actions - Always Visible */}
                    <div className="flex items-center gap-2">
                        <SignedIn>
                            <NotificationsPopover />
                            <ProfileDropdown />
                        </SignedIn>
                        <SignedOut>
                            {/* Desktop/Laptop: Full Buttons */}
                            <div className="hidden lg:flex items-center gap-2">
                                <Button variant="ghost" asChild className="rounded-full">
                                    <Link href="/auth/jobseeker">Login</Link>
                                </Button>
                                <Button asChild className="rounded-full bg-[#FF7A3D] hover:bg-[#E06B32] text-white">
                                    <Link href="/auth/jobseeker">Sign Up</Link>
                                </Button>
                            </div>
                            {/* Tablet/Mobile: Subtle Login */}
                            <div className="flex lg:hidden items-center">
                                <Button asChild size="sm" className="rounded-full bg-[#FF7A3D] hover:bg-[#E06B32] text-white text-xs px-4 h-8">
                                    <Link href="/auth/jobseeker">Login</Link>
                                </Button>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    );
}
