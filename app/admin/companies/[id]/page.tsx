import { Suspense } from "react";
import { CompanyDetailsContent } from "@/components/admin/company-details-content";

export const dynamic = "force-dynamic";

export default function CompanyProfilePage() {
    return (
        <Suspense fallback={<div>Loading company...</div>}>
            <CompanyDetailsContent />
        </Suspense>
    );
}
