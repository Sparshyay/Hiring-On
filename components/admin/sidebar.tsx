"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    FileText,
    Settings,
    Building2,
    Megaphone,
    GraduationCap,
    LogOut,
    Shield,
    Menu,
    ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const sidebarGroups = [
    {
        title: "Dashboard",
        items: [
            { name: "Overview", href: "/admin", icon: LayoutDashboard },
            { name: "Companies", href: "/admin/companies", icon: Building2 },
            { name: "Recruiters", href: "/admin/recruiters", icon: Megaphone },
            { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
            { name: "Internships", href: "/admin/internships", icon: GraduationCap },
            { name: "Candidates", href: "/admin/candidates", icon: Users },
        ],
    },
    {
        title: "Content",
        items: [
            { name: "Blogs", href: "/admin/blogs", icon: FileText },
            { name: "Ads & Banners", href: "/admin/ads", icon: Megaphone },
        ],
    },
    {
        title: "System",
        items: [
            { name: "Manage Admins", href: "/admin/settings/admins", icon: Shield },
            { name: "Settings", href: "/admin/settings", icon: Settings },
        ],
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Auto-collapse logic (similar to PracticeSidebar)
    useEffect(() => {
        const checkSize = () => {
            if (window.innerWidth < 1024) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };
        checkSize();
        window.addEventListener("resize", checkSize);
        return () => window.removeEventListener("resize", checkSize);
    }, []);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <TooltipProvider>
            <div
                className={cn(
                    "flex flex-col border border-slate-200 bg-white shadow-sm transition-all duration-300 ease-in-out relative h-[calc(100vh-6rem)] m-4 rounded-2xl overflow-hidden",
                    isCollapsed ? "w-[80px]" : "w-[260px]"
                )}
            >
                {/* Header / Toggle */}
                <div className={cn("p-4 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                    {!isCollapsed && <span className="font-bold text-slate-800 text-lg">Admin</span>}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    >
                        {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar space-y-6">
                    {sidebarGroups.map((group, index) => (
                        <div key={index} className="space-y-2">
                            {/* Group Title - Hide if collapsed */}
                            {!isCollapsed && (
                                <div className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {group.title}
                                </div>
                            )}

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href;

                                    // Collapsed View (Icon only + Tooltip)
                                    if (isCollapsed) {
                                        return (
                                            <Tooltip key={item.href}>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={item.href}
                                                        className={cn(
                                                            "w-10 h-10 flex items-center justify-center rounded-xl transition-all mx-auto",
                                                            isActive
                                                                ? "bg-[#FF7A3D] text-white shadow-md"
                                                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                                        )}
                                                    >
                                                        <item.icon className="h-5 w-5" />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">{item.name}</TooltipContent>
                                            </Tooltip>
                                        );
                                    }

                                    // Expanded View
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left text-sm",
                                                isActive
                                                    ? "bg-[#FF7A3D] text-white shadow-md font-medium"
                                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            <div className={cn("p-1.5 rounded-full", isActive ? "bg-white/20" : "bg-slate-100 group-hover:bg-slate-200")}>
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-slate-100 mt-auto">
                    {isCollapsed ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" className="w-full h-10 p-0 justify-center text-red-500 hover:text-red-600 hover:bg-red-50">
                                    <LogOut className="w-5 h-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">Log out</TooltipContent>
                        </Tooltip>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                                    AD
                                </div>
                                <div className="overflow-hidden">
                                    <div className="text-xs font-bold text-slate-900 truncate">Admin User</div>
                                    <div className="text-[10px] text-slate-500 truncate">Super Admin</div>
                                </div>
                            </div>
                            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 h-9 px-3">
                                <LogOut className="w-4 h-4 mr-2" />
                                Log out
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}
