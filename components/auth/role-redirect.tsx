"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RoleRedirect() {
    const router = useRouter();
    const user = useQuery(api.auth.getUser);

    useEffect(() => {
        if (user && user.role === "recruiter") {
            router.push("/recruiter");
        }
    }, [user, router]);

    return null;
}
