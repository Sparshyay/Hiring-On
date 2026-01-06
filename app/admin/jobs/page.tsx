import { Suspense } from "react";
import { JobsMonitorContent } from "@/components/admin/jobs-content";

export const dynamic = "force-dynamic";

export default function JobsMonitorPage() {
    return (
        <Suspense fallback={
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
            </div>
        }>
            <JobsMonitorContent />
        </Suspense>
    );
}
