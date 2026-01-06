import { Suspense } from "react";
import { InternshipsListContent } from "@/components/internships/internships-list-content";

export const dynamic = "force-dynamic";

export default function InternshipsPage() {
    return (
        <Suspense fallback={<div>Loading internships...</div>}>
            <InternshipsListContent />
        </Suspense>
    );
}
