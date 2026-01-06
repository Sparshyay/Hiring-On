import { Suspense } from "react";
import { RecruiterDashboardContent } from "@/components/recruiter/dashboard-content";

export const dynamic = "force-dynamic";

export default function RecruiterDashboard() {
    return (
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <RecruiterDashboardContent />
        </Suspense>
    );
}
