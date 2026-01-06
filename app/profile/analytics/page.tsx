import { Suspense } from "react";
import { AnalyticsContent } from "@/components/profile/analytics-content";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
    return (
        <Suspense fallback={<div>Loading analytics...</div>}>
            <AnalyticsContent />
        </Suspense>
    );
}
