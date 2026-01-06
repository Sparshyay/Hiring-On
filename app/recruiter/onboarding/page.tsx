import { Suspense } from "react";
import { OnboardingContent } from "@/components/recruiter/onboarding-content";

export const dynamic = "force-dynamic";

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div>Loading onboarding...</div>}>
            <OnboardingContent />
        </Suspense>
    );
}
