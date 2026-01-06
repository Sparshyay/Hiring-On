import { Suspense } from "react";
import { RecruiterCandidatesContent } from "@/components/recruiter/candidates-content";

export const dynamic = "force-dynamic";

export default function RecruiterCandidatesPage() {
    return (
        <Suspense fallback={<div>Loading candidates...</div>}>
            <RecruiterCandidatesContent />
        </Suspense>
    );
}
