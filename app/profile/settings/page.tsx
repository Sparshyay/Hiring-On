import { Suspense } from "react";
import { SettingsContent } from "@/components/profile/settings-content";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
    return (
        <Suspense fallback={<div>Loading settings...</div>}>
            <SettingsContent />
        </Suspense>
    );
}
