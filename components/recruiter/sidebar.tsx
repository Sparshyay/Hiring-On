"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    PlusCircle,
    Briefcase,
    Settings,
    FileText
} from "lucide-react";

const sidebarItems = [
    { name: "Dashboard", href: "/recruiter", icon: LayoutDashboard },
    { name: "Post a Job", href: "/recruiter/post-job", icon: PlusCircle },
    { name: "My Jobs", href: "/recruiter/jobs", icon: Briefcase },
    { name: "Settings", href: "/recruiter/settings", icon: Settings },
];

export function RecruiterSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 border-r bg-slate-50/50 min-h-[calc(100vh-4rem)] p-4 flex flex-col gap-2">
            <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Recruiter Portal
            </div>
            {sidebarItems.map((item) => (
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
    );
}
