import { Suspense } from "react";
import { DashboardContent } from "@/components/admin/dashboard-content";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
    return (
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
