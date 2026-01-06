import { Suspense } from "react";
import { AdminAdsContent } from "@/components/admin/ads-content";

export const dynamic = "force-dynamic";

export default function AdminAdsPage() {
    return (
        <Suspense fallback={<div>Loading ads...</div>}>
            <AdminAdsContent />
        </Suspense>
    );
}
