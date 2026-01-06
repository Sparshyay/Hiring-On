"use client";

import { Home, Search, Briefcase, User, LayoutDashboard, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function MobileBottomNav() {
    const pathname = usePathname();
    const convexUser = useQuery(api.auth.getUser);
    const role = convexUser?.role || "candidate";

    const isRecruiter = role === "recruiter";
    const isAdmin = role === "admin";

    const getProfileTab = () => {
        if (isRecruiter) return { name: "Dashboard", href: "/recruiter", icon: LayoutDashboard };
        if (isAdmin) return { name: "Dashboard", href: "/admin", icon: LayoutDashboard };
        return { name: "Profile", href: "/profile", icon: User };
    };

    const tabs = [
        { name: "Home", href: "/", icon: Home },
        { name: "Search", href: "/jobs", icon: Search }, // Also covers Internships/Practice
        { name: "Applied", href: "/profile/applications", icon: Briefcase },
        getProfileTab(),
    ];

    // Hide on Assessment Pages (e.g. /practice/123...)
    if (pathname.startsWith("/practice/") && pathname !== "/practice") {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
            <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-full px-1.5 py-1.5 shadow-2xl shadow-slate-200/50 flex items-center justify-between ring-1 ring-black/5">
                {tabs.map((tab) => {
                    let isActive = false;

                    // Specific Logic to avoid overlap
                    if (tab.name === "Home") {
                        isActive = pathname === "/";
                    } else if (tab.name === "Profile" && tab.href === "/profile") {
                        // Profile matches /profile* but NOT /profile/applications
                        isActive = pathname.startsWith("/profile") && !pathname.startsWith("/profile/applications");
                    } else if (tab.name === "Search") {
                        // Search matches Jobs, Internships, Practice
                        isActive = pathname.startsWith("/jobs") || pathname.startsWith("/internships") || pathname.startsWith("/practice");
                    } else {
                        // Default (e.g. Applied /profile/applications, Dashboard /recruiter)
                        isActive = pathname.startsWith(tab.href);
                    }

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "relative flex items-center justify-center h-12 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-full",
                                isActive ? "flex-[2] bg-orange-50 text-orange-600 shadow-sm" : "flex-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <div className="flex items-center gap-2 px-2 relative z-10 overflow-hidden">
                                <tab.icon className={cn("w-5 h-5 shrink-0 transition-all duration-300", isActive ? "stroke-[2.5px] scale-110" : "stroke-[2px]")} />
                                {isActive && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }}
                                        className="text-sm font-bold whitespace-nowrap"
                                    >
                                        {tab.name}
                                    </motion.span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
