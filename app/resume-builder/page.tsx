import { Suspense } from "react";
import { ResumeBuilderContent } from "@/components/resume-builder-content";

export const dynamic = "force-dynamic";

export default function ResumeBuilderPage() {
    return (
        <Suspense fallback={<div>Loading resume builder...</div>}>
            <ResumeBuilderContent />
        </Suspense>
    );
}
