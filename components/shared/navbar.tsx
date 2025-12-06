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

const navItems = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: "Events", href: "/events" },
    { name: "Practice", href: "/practice" },
    { name: "Mock Tests", href: "/mock-tests" },
    { name: "Blogs", href: "/blogs" },
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800" />
                    <span className="text-xl font-bold text-slate-900">HIRING-ON</span>
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
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <Button asChild variant="outline" className="rounded-full border-2 border-[#234B73] text-[#FF7A3D] hover:bg-[#234B73] hover:text-white transition-all bg-transparent font-bold">
                        <Link href="/host/signup">Host</Link>
                    </Button>
                    <div className="h-6 w-px bg-slate-200" />

                    <SignedOut>
                        <Button variant="ghost" asChild className="rounded-full">
                            <Link href="/sign-in">Login</Link>
                        </Button>
                        <Button asChild className="rounded-full bg-[#FF7A3D] hover:bg-[#E06B32] text-white">
                            <Link href="/sign-up">Sign Up</Link>
                        </Button>
                    </SignedOut>

                    <ProfileDropdown />
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
                            <div className="h-px bg-border my-4" />
                            <Button asChild variant="outline" className="w-full rounded-full border-2 border-[#234B73] text-[#FF7A3D]" onClick={() => setIsOpen(false)}>
                                <Link href="/host/signup">Host</Link>
                            </Button>
                            <Button variant="ghost" asChild onClick={() => setIsOpen(false)} className="w-full rounded-full">
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild onClick={() => setIsOpen(false)} className="w-full rounded-full bg-[#FF7A3D] text-white">
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
