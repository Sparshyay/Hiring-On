"use client";

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { usePathname, useSearchParams } from "next/navigation";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { OnboardingModal } from "@/components/onboarding/onboarding-modal";
import { useQuery } from "convex/react";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { MobileBottomNav } from "@/components/mobile/mobile-bottom-nav";
import { cn } from "@/lib/utils";

import Cookies from "js-cookie";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { isAuthenticated } = useConvexAuth();
    const syncUser = useMutation(api.auth.syncUser); // Corrected path
    const userData = useQuery(api.users.getUser); // Fetch user data to check onboarding status
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            // Read intent from cookie
            const intent = Cookies.get("auth_intent") || "candidate";
            syncUser({ role: intent }).catch((err) => console.error("User sync failed:", err));
        }
    }, [isAuthenticated, syncUser]);

    useEffect(() => {
        if (userData && isAuthenticated) {
            // Show modal if status is pending and user is a candidate (job seeker)
            if (userData.role === "candidate" || userData.role === "job_seeker") { // Check specific role string
                const isForced = searchParams?.get("complete_profile") === "true";
                if (userData.onboardingStatus === "pending" || !userData.onboardingStatus || isForced) {
                    setShowOnboarding(true);
                }
            }
        }
    }, [userData, isAuthenticated, searchParams]);

    // Hide Global Nav/Footer for Admin and Recruiter Dashboards
    const isDashboard = pathname?.startsWith("/admin") || pathname?.startsWith("/recruiter");

    // Also hide for the Test Runner flow (but not the main practice directory)
    // /practice/[id] -> Hide
    // /practice -> Show
    const isTestRunner = pathname?.startsWith("/practice/") && pathname !== "/practice";

    const shouldHideGlobalNav = isDashboard || isTestRunner;

    const isListingPage = pathname?.includes("/jobs") || pathname?.includes("/internships") || (pathname?.includes("/practice") && !isTestRunner);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Desktop Navbar - Hidden on Mobile */}
            {!shouldHideGlobalNav && (
                <div className="hidden md:block">
                    <Navbar />
                </div>
            )}

            {/* Mobile Header - Visible only on Mobile */}
            {!shouldHideGlobalNav && <MobileHeader />}

            <main className={cn(
                "flex-1",
                // Mobile Padding Logic
                !shouldHideGlobalNav && "md:pt-0", // Reset on desktop
                !shouldHideGlobalNav && (isListingPage ? "pt-[110px]" : "pt-16"), // Mobile top padding
                !shouldHideGlobalNav && "pb-[80px] md:pb-0" // Mobile bottom padding for nav
            )}>
                {children}
            </main>

            {/* Footer */}
            {!shouldHideGlobalNav && <Footer />}

            <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />

            {/* Mobile Bottom Nav */}
            <MobileBottomNav />
        </div>
    );
}
