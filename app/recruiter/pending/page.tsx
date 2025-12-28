"use client";

import { useEffect } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PendingVerificationPage() {
    const { user: rawUser, isLoading } = useUserRole();
    const user = rawUser as any;
    const router = useRouter();

    useEffect(() => {
        if (user?.verificationStatus === "verified") {
            router.push("/recruiter");
        }
    }, [user?.verificationStatus, router]);

    if (isLoading || user?.verificationStatus === "verified") return null;

    if (user?.verificationStatus === "rejected") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Application Rejected</h1>
                <p className="text-muted-foreground max-w-md mb-8">
                    Unfortunately, your recruiter profile could not be verified at this time.
                    This may be due to unverifiable company details or policy violations.
                </p>
                <div className="mt-4">
                    <Button variant="outline" onClick={() => window.location.href = "mailto:support@hiring.on"}>Contact Support</Button>
                </div>
                <div className="mt-4">
                    <Button variant="ghost" onClick={() => router.push("/")}>Return to Home</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-12 h-12 text-yellow-600" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">Verification Pending</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                Thanks for setting up your company profile! Our team is currently reviewing your details.
                You will receive full access to the dashboard once approved.
            </p>

            <div className="bg-white p-6 rounded-xl border shadow-sm max-w-md w-full text-left space-y-4">
                <h3 className="font-semibold text-sm uppercase text-slate-500 tracking-wider">What happens next?</h3>
                <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <div>
                        <p className="font-medium text-sm">Profile Review</p>
                        <p className="text-xs text-muted-foreground">We verify your company details and website.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-slate-300 shrink-0" />
                    <div>
                        <p className="font-medium text-sm">Approval & Access</p>
                        <p className="text-xs text-muted-foreground">You'll get an email when your dashboard is ready.</p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Button variant="outline" onClick={() => router.push("/")}>Return to Home</Button>
            </div>
        </div>
    );
}
