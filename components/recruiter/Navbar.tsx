"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Briefcase, Users, Settings } from "lucide-react";
import Image from "next/image";

export function RecruiterNavbar() {
    const pathname = usePathname();

    const links = [
        {
            href: "/recruiter",
            label: "Dashboard",
            icon: LayoutDashboard,
            active: pathname === "/recruiter",
        },
        {
            href: "/recruiter/jobs",
            label: "Jobs",
            icon: Briefcase,
            active: pathname?.startsWith("/recruiter/jobs"),
        },
        {
            href: "/recruiter/candidates",
            label: "Candidates",
            icon: Users,
            active: pathname?.startsWith("/recruiter/candidates"),
        },
        {
            href: "/recruiter/settings",
            label: "Settings",
            icon: Settings,
            active: pathname?.startsWith("/recruiter/settings"),
        },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-28 items-center px-4">
                <div className="mr-8 flex items-center space-x-4">
                    <Link href="/recruiter" className="flex items-center gap-0">
                        <Image src="/logo-full.png" alt="Hiring On" width={500} height={150} className="h-28 w-auto object-contain" />
                        <span className="text-xs font-medium text-muted-foreground border px-2 py-0.5 rounded-full ml-2">
                            Recruiter
                        </span>
                    </Link>
                </div>

                <div className="flex items-center space-x-6 text-sm font-medium">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center space-x-2 transition-colors hover:text-foreground/80",
                                link.active ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            <link.icon className="h-4 w-4" />
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="ml-auto flex items-center space-x-4">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </nav>
    );
}
