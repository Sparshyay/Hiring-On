"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { SignInButton, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ShieldAlert, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

export default function AdminLoginPage() {
    const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
    const { isAdmin, isLoading: roleLoading, user } = useUserRole();
    const router = useRouter();
    const { signOut } = useClerk();

    // Auth & Logic
    const requestAccess = useMutation(api.admin_requests.requestAccess);
    const [requestStatus, setRequestStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleRequestAccess = async () => {
        setRequestStatus("loading");
        try {
            await requestAccess();
            setRequestStatus("success");
        } catch (error) {
            console.error(error);
            setRequestStatus("idle");
            alert("Failed to request access. Try again.");
        }
    };


    const isLoading = authLoading || roleLoading;

    const syncUser = useMutation(api.auth.syncUser);

    useEffect(() => {
        if (!isLoading && isAdmin) {
            router.push("/admin");
        }
    }, [isLoading, isAdmin, router]);

    // Auto-fix for Super Admin or migration issues
    useEffect(() => {
        if (isAuthenticated && !isAdmin && !isLoading) {
            syncUser({ role: "admin" }).then(() => {
                // After sync, if logic worked, role might change.
                // The useUserRole hook typically auto-updates if the query result changes.
            }).catch(e => console.error("Sync failed", e));
        }
    }, [isAuthenticated, isAdmin, isLoading, syncUser]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Image src="/logo.svg" alt="Logo" width={48} height={48} className="h-12 w-12" />
                        <Image src="/hiring-on.svg" alt="HIRING-ON" width={160} height={32} className="h-8 w-auto" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Admin Portal</CardTitle>
                    <CardDescription className="text-center">
                        Restricted access for platform administrators only.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    {!isAuthenticated ? (
                        <SignInButton mode="modal">
                            <Button className="w-full bg-slate-900 hover:bg-slate-800">
                                Sign In to Admin Console
                            </Button>
                        </SignInButton>
                    ) : (
                        <div className="text-center space-y-4 w-full">
                            <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-center gap-3 text-left">
                                <ShieldAlert className="h-6 w-6 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold">Access Denied</p>
                                    <p>Your account does not have administrator privileges.</p>
                                </div>
                            </div>

                            <div className="flex gap-2 w-full">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => signOut(() => router.push("/"))}
                                >
                                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                                </Button>

                                {((user as any)?.isRequestingAdmin || requestStatus === "success") ? (
                                    <Button disabled className="flex-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/50">
                                        Pending Approval
                                    </Button>
                                ) : (
                                    <Button
                                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                                        onClick={handleRequestAccess}
                                        disabled={requestStatus === "loading"}
                                    >
                                        {requestStatus === "loading" ? "Requesting..." : "Request Access"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
