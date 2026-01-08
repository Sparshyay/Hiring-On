"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Star,
    Layers,
    Clock,
    BookOpen,
    FileText,
    Settings,
    Phone,
    LogOut
} from "lucide-react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { cn } from "@/lib/utils";

export function ProfileSidebar({ className }: { className?: string }) {
    const { signOut } = useClerk();
    const router = useRouter();
    const pathname = usePathname();
    const badges = useQuery(api.notifications.getBadgeCounts);

    const handleLogout = async () => {
        await signOut();
        router.push("/");
    };

    const isActive = (path: string) => pathname === path;

    return (
        <div className={cn("space-y-6", className)}>
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-4 border-b border-border/40">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">For Users</h3>
                </div>
                <div className="p-2 space-y-1">
                    {[
                        { label: "Profile", icon: Users, href: "/profile" },
                        { label: "Registrations/Applications", icon: Layers, href: "/profile/applications", badge: (badges?.notifications || 0) > 0 ? badges?.notifications : undefined },
                        { label: "Watchlist", icon: Star, href: "/profile/watchlist" },
                        { label: "Bookmarked Questions", icon: Layers, href: "/profile/bookmarks" },
                        { label: "Recently Viewed", icon: Clock, href: "/profile/recently-viewed" },
                        { label: "Mentor Sessions", icon: Users, href: "/profile/mentorships" },
                        { label: "Courses", icon: BookOpen, href: "/profile/courses" },
                        { label: "Certificates", icon: FileText, href: "/profile/certificates" },
                        { label: "Settings", icon: Settings, href: "/profile/settings" },
                    ].map((item: any, i) => (
                        <Button
                            key={i}
                            asChild
                            variant="ghost"
                            className={`w-full justify-start text-slate-600 font-medium h-10 px-3 hover:bg-orange-50 hover:text-orange-600 transition-colors ${isActive(item.href) ? 'bg-orange-50 text-orange-600' : ''}`}
                        >
                            <Link href={item.href || "#"}>
                                {/* @ts-ignore icon type */}
                                {item.icon && <item.icon className="w-4 h-4 mr-3" />}
                                <span className="flex-1 text-left truncate">{item.label}</span>
                                {item.badge && <Badge variant="secondary" className="bg-red-50 text-red-600 text-[10px] h-5 px-1.5">{item.badge}</Badge>}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>

            <div className="my-2 border-t border-slate-100"></div>

            <Button variant="ghost" className="w-full justify-start text-slate-600 font-medium h-10 px-3 hover:bg-orange-50 hover:text-orange-600">
                <Link href="/contact" className="w-full flex items-center">
                    <Phone className="w-4 h-4 mr-3" />
                    <span className="flex-1 text-left">Contact Us</span>
                </Link>
            </Button>

            <Button
                variant="ghost"
                className="w-full justify-start text-slate-600 font-medium h-10 px-3 hover:bg-red-50 hover:text-red-600"
                onClick={handleLogout}
            >
                <LogOut className="w-4 h-4 mr-3" />
                <span className="flex-1 text-left">Logout</span>
            </Button>
        </div>
    );
}
