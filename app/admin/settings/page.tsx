import { Suspense } from "react";
import { SettingsContent } from "@/components/admin/settings-content";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
    return (
        <Suspense fallback={<div>Loading settings...</div>}>
            <SettingsContent />
        </Suspense>
    );
}
