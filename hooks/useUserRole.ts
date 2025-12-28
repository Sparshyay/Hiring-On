import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useUserRole() {
    const user = useQuery(api.auth.getUser);

    // Default to candidate if not loaded or no role
    const isLoading = user === undefined;
    const role = user?.role || "candidate";
    const isRecruiter = role === "recruiter";
    const isAdmin = role === "admin";
    const isCandidate = role === "candidate";

    return {
        role,
        isRecruiter,
        isAdmin,
        isCandidate,
        isLoading,
        user,
    };
}
