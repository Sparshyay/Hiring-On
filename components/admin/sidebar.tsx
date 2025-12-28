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
    Shield,
    Megaphone,
    GraduationCap
} from "lucide-react";

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
            { name: "Manage Admins", href: "/admin/settings/admins", icon: Users },
            { name: "Settings", href: "/admin/settings", icon: Settings },
        ],
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 border-r bg-slate-50/50 min-h-[calc(100vh-4rem)] p-4 flex flex-col gap-2">
            {sidebarGroups.map((group, index) => (
                <div key={index} className="mb-4">
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
    );
}

