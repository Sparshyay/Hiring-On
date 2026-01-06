import { Suspense } from "react";
import { JobDetailsContent } from "@/components/jobs/job-details-content";

export const dynamic = "force-dynamic";

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div>Loading job details...</div>}>
            <JobDetailsContent params={params} />
        </Suspense>
    );
}
