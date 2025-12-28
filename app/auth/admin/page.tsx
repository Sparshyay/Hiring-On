"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useClerk } from "@clerk/nextjs";

export default function AdminAuthPage() {
    const { openSignIn } = useClerk();

    useEffect(() => {
        // Set intent cookie
        Cookies.set("auth_intent", "admin", { expires: 1, path: "/" });

        // Redirect to Clerk Login
        openSignIn({
            afterSignInUrl: "/admin",
            afterSignUpUrl: "/admin",
        });
    }, [openSignIn]);

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Redirecting to Admin Portal...</h2>
                <p className="text-gray-500">Please wait while we set up your secure session.</p>
            </div>
        </div>
    );
}
