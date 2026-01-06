"use client";

import { Navbar } from "@/components/shared/navbar";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Menu, Search, Bell } from "lucide-react";
import { RecruiterSidebar } from "@/components/recruiter-sidebar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
            <div className="hidden md:block">
                <Navbar />
            </div>

            {/* Mobile Header for Recruiter */}
            <div className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="-ml-2"><Menu className="w-6 h-6" /></Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-[80%]">
                            <SheetTitle className="sr-only">Recruiter Menu</SheetTitle>
                            <div className="h-full py-6">
                                <RecruiterSidebar />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <h1 className="font-bold text-lg">Dashboard</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon"><Search className="w-5 h-5 text-slate-500" /></Button>
                    <Button variant="ghost" size="icon"><Bell className="w-5 h-5 text-slate-500" /></Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <aside className="hidden md:block flex-shrink-0">
                    <RecruiterSidebar />
                </aside>

                <main className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
