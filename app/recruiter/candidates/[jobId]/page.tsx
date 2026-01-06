import { Suspense } from "react";
import { JobCandidatesContent } from "@/components/recruiter/job-candidates-content";

export const dynamic = "force-dynamic";

export default function JobCandidatesPage() {
    return (
        <Suspense fallback={<div>Loading job candidates...</div>}>
            <JobCandidatesContent />
        </Suspense>
    );
}
