import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useGetUser } from "@/lib/api";

export function useProtectedAction() {
    const router = useRouter();
    const { isSignedIn, isLoaded } = useUser();
    const user = useGetUser();

    const verifyAccess = (actionName: string = "perform this action") => {
        if (!isLoaded) return false;

        if (!isSignedIn) {
            if (confirm(`You must be logged in to ${actionName}. Go to login?`)) {
                router.push("/sign-in");
            }
            return false;
        }

        if (user === undefined) return false; // Loading Convex user

        if (!user || !user.resume) {
            if (confirm(`You need to complete your profile to ${actionName}. Go to onboarding?`)) {
                router.push("/onboarding");
            }
            return false;
        }

        return true;
    };

    return { verifyAccess, user, isSignedIn, isLoaded };
}
