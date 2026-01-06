import { Suspense } from "react";
import { EditContent } from "@/components/profile/edit-content";

export const dynamic = "force-dynamic";

export default function EditProfilePage() {
    return (
        <Suspense fallback={<div>Loading profile editor...</div>}>
            <EditContent />
        </Suspense>
    );
}
