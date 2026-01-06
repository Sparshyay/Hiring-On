import { Suspense } from "react";
import { JobSeekerOnboardingContent } from "@/components/job-seeker-onboarding-content";

export const dynamic = "force-dynamic";

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div>Loading onboarding...</div>}>
            <JobSeekerOnboardingContent />
        </Suspense>
    );
}
