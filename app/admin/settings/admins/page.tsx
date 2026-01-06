import { Suspense } from "react";
import { SettingsAdminsContent } from "@/components/admin/settings-admins-content";

export const dynamic = "force-dynamic";

export default function ManageAdminsPage() {
    return (
        <Suspense fallback={<div>Loading admins...</div>}>
            <SettingsAdminsContent />
        </Suspense>
    );
}
