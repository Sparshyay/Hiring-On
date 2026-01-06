import { Suspense } from "react";
import { ClerkSignUpContent } from "@/components/clerk-sign-up-content";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading sign up...</div>}>
            <ClerkSignUpContent />
        </Suspense>
    );
}
