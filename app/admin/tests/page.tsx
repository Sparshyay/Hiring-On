import { Suspense } from "react";
import { TestsContent } from "@/components/admin/tests-content";

export const dynamic = "force-dynamic";

export default function TestManagementPage() {
    return (
        <Suspense fallback={<div>Loading tests...</div>}>
            <TestsContent />
        </Suspense>
    );
}
