"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ProfileDropdown } from "./profile-dropdown";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { GlobalSearch } from "@/components/global-search";
import { NotificationsPopover } from "@/components/notifications-popover";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: "Internships", href: "/internships" },
    // Events removed as per requirements
    { name: "Practice", href: "/practice" },
    { name: "Blogs", href: "/blogs" },
    { name: "Contact Us", href: "/contact" },
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const user = useQuery(api.auth.getUser);

    const isRecruiter = user?.role === "recruiter";
    const isAdmin = user?.role === "admin";

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-28 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-0">
                    <Image src="/logo.svg" alt="Hiring On Logo" width={100} height={100} className="h-24 w-24" />
                    <Image src="/hiring-on.svg" alt="HIRING-ON" width={300} height={100} className="h-28 w-auto" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === item.href
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}

                    {/* Role-based Links */}
                    {isRecruiter && (
                        <Link
                            href="/recruiter"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith("/recruiter")
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            Recruiter Dashboard
                        </Link>
                    )}

                    {isAdmin && (
                        <Link
                            href="/admin"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith("/admin")
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            )}
                        >
                            Admin Dashboard
                        </Link>
                    )}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Button asChild variant="outline" className="rounded-full border-2 border-[#234B73] text-[#FF7A3D] hover:bg-[#234B73] hover:text-white transition-all bg-transparent font-bold">
                        <Link href="/auth/recruiter">Host</Link>
                    </Button>
                    <div className="h-6 w-px bg-slate-200" />

                    <GlobalSearch />

                    <SignedIn>
                        <NotificationsPopover />
                        <ProfileDropdown />
                    </SignedIn>

                    <SignedOut>
                        <Button variant="ghost" asChild className="rounded-full">
                            <Link href="/auth/jobseeker">Login</Link>
                        </Button>
                        <Button asChild className="rounded-full bg-[#FF7A3D] hover:bg-[#E06B32] text-white">
                            <Link href="/auth/jobseeker">Sign Up</Link>
                        </Button>
                    </SignedOut>
                </div>

                {/* Mobile Menu */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <div className="flex flex-col gap-4 mt-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium hover:text-primary"
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {isRecruiter && (
                                <Link
                                    href="/recruiter"
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium hover:text-primary"
                                >
                                    Recruiter Dashboard
                                </Link>
                            )}

                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium hover:text-primary"
                                >
                                    Admin Dashboard
                                </Link>
                            )}

                            <div className="h-px bg-border my-4" />
                            <Link
                                href="/recruiters"
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium hover:text-primary"
                            >
                                For Recruiters
                            </Link>
                            <Button asChild variant="outline" className="w-full rounded-full border-2 border-[#234B73] text-[#FF7A3D]" onClick={() => setIsOpen(false)}>
                                <Link href="/auth/recruiter">Host</Link>
                            </Button>

                            <SignedOut>
                                <Button variant="ghost" asChild onClick={() => setIsOpen(false)} className="w-full rounded-full">
                                    <Link href="/auth/jobseeker">Login</Link>
                                </Button>
                                <Button asChild onClick={() => setIsOpen(false)} className="w-full rounded-full bg-[#FF7A3D] text-white">
                                    <Link href="/auth/jobseeker">Sign Up</Link>
                                </Button>
                            </SignedOut>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
