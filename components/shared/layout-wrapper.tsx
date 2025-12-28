"use client";

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { usePathname } from "next/navigation";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

import Cookies from "js-cookie";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { isAuthenticated } = useConvexAuth();
    const syncUser = useMutation(api.auth.syncUser); // Corrected path

    useEffect(() => {
        if (isAuthenticated) {
            // Read intent from cookie
            const intent = Cookies.get("auth_intent") || "candidate";
            syncUser({ role: intent }).catch((err) => console.error("User sync failed:", err));
        }
    }, [isAuthenticated, syncUser]);

    // Hide Global Nav/Footer for Admin and Recruiter Dashboards
    const isDashboard = pathname?.startsWith("/admin") || pathname?.startsWith("/recruiter");

    // Also hide for the Test Runner flow (but not the main practice directory)
    // /practice/[id] -> Hide
    // /practice -> Show
    const isTestRunner = pathname?.startsWith("/practice/") && pathname !== "/practice";

    const shouldHideGlobalNav = isDashboard || isTestRunner;

    return (
        <div className="flex flex-col min-h-screen">
            {!shouldHideGlobalNav && <Navbar />}
            <main className="flex-1">
                {children}
            </main>
            {!shouldHideGlobalNav && <Footer />}
        </div>
    );
}
