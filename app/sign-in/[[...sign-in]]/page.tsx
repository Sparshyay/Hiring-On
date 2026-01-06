import { Suspense } from "react";
import { ClerkSignInContent } from "@/components/clerk-sign-in-content";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading sign in...</div>}>
            <ClerkSignInContent />
        </Suspense>
    );
}
