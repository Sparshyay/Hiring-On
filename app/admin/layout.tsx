"use client";

import { AdminSidebar } from "@/components/admin/sidebar";
import { Navbar } from "@/components/shared/navbar";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAdmin, isLoading } = useUserRole();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !isAdmin && pathname !== "/admin/login") {
            router.push("/");
        }
    }, [isLoading, isAdmin, router, pathname]);

    // Allow access to login page even if not admin (it handles its own auth check)
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen bg-muted/20">
            {/* Shared Navbar at the top */}
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <aside className="hidden w-64 md:block border-r bg-background overflow-y-auto">
                    <AdminSidebar />
                </aside>

                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
