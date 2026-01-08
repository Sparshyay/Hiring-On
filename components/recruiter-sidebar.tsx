"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUserRole } from "@/hooks/useUserRole";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Users,
    Settings,
    PlusCircle,
    GraduationCap,
    Crown,
    Building2,
    LogOut,
    HelpCircle,
    Menu,
    ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const sidebarGroups = [
    {
        title: "Menu",
        items: [
            { name: "Dashboard", href: "/recruiter", icon: LayoutDashboard },
            { name: "Post a Job", href: "/recruiter/post-job", icon: PlusCircle },
            { name: "Manage Jobs", href: "/recruiter/jobs", icon: Briefcase },
            { name: "Internships", href: "/recruiter/internships", icon: GraduationCap },
            { name: "Candidates", href: "/recruiter/candidates", icon: Users },
            { name: "Blogs", href: "/recruiter/blogs", icon: FileText },
        ],
    },
    {
        title: "Settings",
        items: [
            { name: "Company Profile", href: "/recruiter/settings", icon: Building2 },
            { name: "Help Center", href: "/contact", icon: HelpCircle },
        ],
    },
];

export function RecruiterSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user } = useUserRole();
    const companyId = (user as any)?.companyId;
    const badges = useQuery(api.recruiters.getBadgeCounts, companyId ? { companyId } : "skip");

    // Auto-collapse logic
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
                    {!isCollapsed && <span className="font-bold text-slate-800 text-lg">Recruiter</span>}
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

                                    // Collapsed View
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
                                                        <div className="relative">
                                                            <item.icon className="h-5 w-5" />
                                                            {item.name === "Candidates" && (badges?.applications ?? 0) > 0 && (
                                                                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border border-white" />
                                                            )}
                                                        </div>
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
                                            <div className="flex-1 flex items-center justify-between min-w-0">
                                                <span>{item.name}</span>
                                                {item.name === "Candidates" && (badges?.applications ?? 0) > 0 && (
                                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto">
                                                        {badges?.applications}
                                                    </span>
                                                )}
                                            </div>
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
                        <div className="space-y-2 flex flex-col items-center">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="p-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl">
                                        <Crown className="w-5 h-5 text-yellow-400" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="right">Free Plan (Upgrade)</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" className="w-10 h-10 p-0 justify-center text-red-500 hover:text-red-700 hover:bg-red-50">
                                        <LogOut className="w-5 h-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">Log out</TooltipContent>
                            </Tooltip>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl rounded-xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <Crown className="w-24 h-24 rotate-12" />
                                </div>
                                <CardContent className="p-4 space-y-3 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                                            <Crown className="w-4 h-4 text-yellow-400" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-xs">Free Plan</div>
                                            <div className="text-[10px] text-slate-400">Upgrade for more features</div>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 text-[10px] h-7 font-bold rounded-lg shadow-lg">
                                        View Plans
                                    </Button>
                                </CardContent>
                            </Card>
                            <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                                <LogOut className="w-4 h-4" /> Log out
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}
