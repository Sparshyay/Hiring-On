"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useClerk, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function RecruiterAuthPage() {
    const { openSignIn } = useClerk();
    const { isSignedIn, isLoaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded) return;

        // Set intent cookie
        Cookies.set("auth_intent", "recruiter", { expires: 1, path: "/" });

        if (isSignedIn) {
            router.push("/recruiter");
        } else {
            // Redirect to Clerk Login
            openSignIn({
                afterSignInUrl: "/recruiter",
                afterSignUpUrl: "/recruiter", // Layout will handle redirection to onboarding
            });
        }
    }, [openSignIn, isSignedIn, isLoaded, router]);

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Redirecting to Recruiter Portal...</h2>
                <p className="text-gray-500">Please wait while we set up your secure session.</p>
            </div>
        </div>
    );
}
