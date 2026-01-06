import { Suspense } from "react";
import { PracticeContent } from "@/components/practice-content";

export const dynamic = "force-dynamic";

export default function PracticePage() {
    return (
        <Suspense fallback={<div>Loading practice...</div>}>
            <PracticeContent />
        </Suspense>
    );
}
