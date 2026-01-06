"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function RoleRedirect() {
    const router = useRouter();
    const pathname = usePathname();
    const user = useQuery(api.auth.getUser);

    useEffect(() => {
        if (user) {
            if (user.role === "recruiter") {
                // Allow recruiters to stay on home page
            } else if ((user.role === "candidate" || user.role === "job_seeker") && pathname === "/sign-in") {
                // Only redirect if explicitly on sign-in page, otherwise preserve intention
                router.push("/");
            }
        }
    }, [user, router, pathname]);

    return null;
}
