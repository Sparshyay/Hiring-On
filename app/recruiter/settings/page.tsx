import { Suspense } from "react";
import { RecruiterSettingsContent } from "@/components/recruiter/settings-content";

export const dynamic = "force-dynamic";

export default function RecruiterSettingsPage() {
    return (
        <Suspense fallback={<div>Loading settings...</div>}>
            <RecruiterSettingsContent />
        </Suspense>
    );
}
