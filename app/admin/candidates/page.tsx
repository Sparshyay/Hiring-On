import { Suspense } from "react";
import { CandidatesContent } from "@/components/admin/candidates-content";

export const dynamic = "force-dynamic";

export default function CandidatesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
            </div>
        }>
            <CandidatesContent />
        </Suspense>
    );
}
