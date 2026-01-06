"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useClerk, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function JobSeekerLoginContent() {
    const { openSignIn } = useClerk();
    const { isSignedIn, isLoaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded) return;

        // Set intent cookie
        Cookies.set("auth_intent", "candidate", { expires: 1, path: "/" });

        if (isSignedIn) {
            // Already logged in, just redirect
            router.push("/");
            return;
        }

        // Redirect to Clerk Login
        openSignIn({
            afterSignInUrl: "/jobs",
            afterSignUpUrl: "/profile/edit", // Candidates go to profile setup
        });
    }, [openSignIn, isSignedIn, isLoaded, router]);

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Redirecting to Login...</h2>
                <p className="text-gray-500">Please wait while we set up your secure session.</p>
            </div>
        </div>
    );
}
