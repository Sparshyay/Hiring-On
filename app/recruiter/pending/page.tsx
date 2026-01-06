import { Suspense } from "react";
import { PendingVerificationContent } from "@/components/recruiter/pending-content";

export const dynamic = "force-dynamic";

export default function PendingVerificationPage() {
    return (
        <Suspense fallback={<div>Loading status...</div>}>
            <PendingVerificationContent />
        </Suspense>
    );
}
