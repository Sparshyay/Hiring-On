import { Suspense } from "react";
import { InternshipDetailsContent } from "@/components/internships/internship-details-content";

export const dynamic = "force-dynamic";

export default function InternshipDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <Suspense fallback={<div>Loading internship details...</div>}>
            <InternshipDetailsContent params={params} />
        </Suspense>
    );
}
