"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Briefcase, FileText, Settings, LogOut, Building2 } from "lucide-react";

const sidebarItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Recruiters", href: "/admin/recruiters", icon: Building2 },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Job Management", href: "/admin/jobs", icon: Briefcase },
    { name: "Test Management", href: "/admin/tests", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-secondary text-white shrink-0 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                    <div className="text-xl font-bold">HIRING-ON Admin</div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                                pathname === item.href
                                    ? "bg-primary text-white shadow-lg shadow-orange-500/20"
                                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
