import { Suspense } from "react";
import { RecruitersListContent } from "@/components/recruiters-list-content";

export const dynamic = "force-dynamic";

export default function RecruitersPage() {
    return (
        <Suspense fallback={<div>Loading recruiters...</div>}>
            <RecruitersListContent />
        </Suspense>
    );
}
