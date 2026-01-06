import { Suspense } from "react";
import { RecruiterJobsContent } from "@/components/recruiter/jobs-content";

export const dynamic = "force-dynamic";

export default function RecruiterJobsPage() {
    return (
        <Suspense fallback={<div>Loading jobs...</div>}>
            <RecruiterJobsContent />
        </Suspense>
    );
}
