"use client";

import { User, Layers, Bookmark, Briefcase, Users, FileText, BarChart, Settings, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";

export function MobileJobSeekerMenu() {
    const { user } = useUser();

    if (!user) return null;

    const userInitials = user.fullName
        ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "U";

    const menuItems = [
        { label: "Profile", icon: User, href: "/profile/edit" }, // Pointing to Edit/Details
        { label: "Registrations/Applications", icon: Layers, href: "/profile/applications" },
        { label: "Watchlist", icon: Bookmark, href: "/profile/watchlist" },
        { label: "Bookmarked Questions", icon: Bookmark, href: "/profile/bookmarks" },
        { label: "Recently Viewed", icon: Briefcase, href: "/profile/recent" },
        { label: "Mentor Sessions", icon: Users, href: "/profile/mentors" },
        { label: "Courses", icon: FileText, href: "/profile/courses" },
        { label: "Certificates", icon: BarChart, href: "/profile/certificates" },
        { label: "Settings", icon: Settings, href: "/settings" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header / Title */}
            <div className="bg-white px-4 py-4 border-b sticky top-0 z-10">
                <h1 className="text-xl font-bold uppercase tracking-wider text-slate-500 text-xs mb-2">FOR USERS</h1>

                {/* User Card */}
                <div className="flex items-center gap-4 py-2">
                    <Avatar className="h-12 w-12 border-2 border-slate-100">
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h2 className="font-bold text-lg leading-tight">{user.fullName}</h2>
                        <p className="text-sm text-slate-500">{user.primaryEmailAddress?.emailAddress}</p>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-2">
                {menuItems.map((item, idx) => {
                    const isProfile = item.label === "Profile";
                    return (
                        <Link
                            key={idx}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all",
                                isProfile ? "bg-orange-50/50 text-orange-600" : "bg-transparent text-slate-700 hover:bg-white"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", isProfile ? "text-orange-500" : "text-slate-400")} />
                            <span className={cn("font-medium text-base", isProfile && "text-orange-700 font-bold")}>
                                {item.label}
                            </span>
                            {/* Optional Chevron for list feel */}
                            {!isProfile && <ChevronRight className="w-5 h-5 text-slate-300 ml-auto" />}
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
