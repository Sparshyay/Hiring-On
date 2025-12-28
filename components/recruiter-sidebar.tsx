"use client";

import Link from "next/link";
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
    ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const sidebarGroups = [
    {
        title: "Overview",
        items: [
            { name: "Dashboard", href: "/recruiter", icon: LayoutDashboard },
        ],
    },
    {
        title: "Jobs",
        items: [
            { name: "Post a Job", href: "/recruiter/post-job", icon: PlusCircle },
            { name: "Manage Jobs", href: "/recruiter/jobs", icon: Briefcase },
        ],
    },
    {
        title: "Internships",
        items: [
            { name: "Post Internship", href: "/recruiter/internships/new", icon: PlusCircle },
            { name: "Manage Internships", href: "/recruiter/internships", icon: GraduationCap },
        ],
    },
    {
        title: "People",
        items: [
            { name: "Candidates", href: "/recruiter/candidates", icon: Users },
        ],
    },
    {
        title: "Company",
        items: [
            { name: "Settings", href: "/recruiter/settings", icon: Settings },
        ],
    },
];

export function RecruiterSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 border-r bg-slate-50/50 min-h-[calc(100vh-4rem)] p-4 flex flex-col gap-2">
            <div className="flex-1 space-y-4">
                {sidebarGroups.map((group, index) => (
                    <div key={index} className="mb-2">
                        <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            {group.title}
                        </div>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                        pathname === item.href
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    )}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Plan Card */}
            <div className="mt-auto pt-4">
                <Card className="bg-slate-900 text-white border-none shadow-lg">
                    <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Crown className="w-4 h-4 text-yellow-400" />
                            </div>
                            <div>
                                <div className="font-semibold text-sm">Free Plan</div>
                                <div className="text-xs text-slate-400">Upgrade for more</div>
                            </div>
                        </div>
                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 text-xs h-8 font-semibold">
                            View Plans
                        </Button>
                    </CardContent>
                </Card>
                <Link href="/" className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
            </div>
        </div>
    );
}
