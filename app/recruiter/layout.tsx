"use client";

import { Navbar } from "@/components/shared/navbar";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { RecruiterSidebar } from "@/components/recruiter-sidebar";
export default function RecruiterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isRecruiter, isLoading, user: rawUser } = useUserRole();
    const user = rawUser as any;
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            // 1. Not a recruiter -> Home
            if (!isRecruiter && !pathname.startsWith("/recruiter/onboarding")) {
                router.push("/");
                return;
            }

            // 2. Recruiter but Incomplete (No Company) -> Onboarding
            if (isRecruiter && !user?.companyId) {
                if (!pathname.startsWith("/recruiter/onboarding")) {
                    router.push("/recruiter/onboarding");
                }
                return;
            }

            // 3. Pending or Rejected -> Pending Page
            if (isRecruiter && user?.companyId && (user?.verificationStatus === "pending" || user?.verificationStatus === "rejected")) {
                if (pathname !== "/recruiter/pending") {
                    router.push("/recruiter/pending");
                }
                return;
            }

            // 4. Approved -> Dashboard (and other internal pages)
            if (isRecruiter && user?.verificationStatus === "verified") {
                // Prevent going back to onboarding or pending
                if (pathname.startsWith("/recruiter/onboarding") || pathname === "/recruiter/pending") {
                    router.push("/recruiter");
                }
                return;
            }
        }
    }, [isLoading, isRecruiter, router, pathname, user?.verificationStatus, user?.companyId]);

    if (pathname.startsWith("/recruiter/onboarding") || pathname === "/recruiter/pending") {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isRecruiter) {
        return null;
    }

    return (
        <div className="flex flex-col h-screen bg-muted/20">
            {/* Navbar is sticky in its own component but here we want it fixed at top? 
               Navbar component has `sticky top-0`. 
               If we make outer h-screen, we need to handle full height constraints.
            */}
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <aside className="hidden md:block w-64 border-r bg-background overflow-y-auto">
                    <RecruiterSidebar />
                </aside>

                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
