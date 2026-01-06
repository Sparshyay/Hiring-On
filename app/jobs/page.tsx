import { Suspense } from "react";
import { JobsContent } from "@/components/jobs/jobs-content";

export const dynamic = "force-dynamic";

export default function JobsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        }>
            <JobsContent />
        </Suspense>
    );
}
