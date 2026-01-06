import { Suspense } from "react";
import { InternshipsContent } from "@/components/recruiter/internships-content";

export const dynamic = "force-dynamic";

export default function ManageInternshipsPage() {
    return (
        <Suspense fallback={<div>Loading internships...</div>}>
            <InternshipsContent />
        </Suspense>
    );
}
