import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useGetUser, useCheckProfileCompletion } from "@/lib/api";

export function useProtectedAction() {
    const router = useRouter();
    const { isSignedIn, isLoaded } = useUser();
    const user = useGetUser();
    const profileCompletion = useCheckProfileCompletion();

    const verifyAccess = (actionName: string = "perform this action") => {
        if (!isLoaded) return false;

        if (!isSignedIn) {
            if (confirm(`You must be logged in to ${actionName}. Go to login?`)) {
                router.push("/sign-in");
            }
            return false;
        }

        if (user === undefined || profileCompletion === undefined) return false; // Loading Convex user

        if (!user) {
            if (confirm(`You need to complete your profile to ${actionName}. Go to onboarding?`)) {
                router.push("/onboarding");
            }
            return false;
        }

        // Check if profile is complete
        if (!profileCompletion?.isComplete) {
            if (confirm(`You need to complete your profile to ${actionName}. Complete your profile?`)) {
                router.push("/profile/edit");
            }
            return false;
        }

        return true;
    };

    return { verifyAccess, user, isSignedIn, isLoaded, profileCompletion };
}
