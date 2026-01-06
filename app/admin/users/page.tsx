import { Suspense } from "react";
import { UsersContent } from "@/components/admin/users-content";

export const dynamic = "force-dynamic";

export default function UserManagementPage() {
    return (
        <Suspense fallback={<div>Loading users...</div>}>
            <UsersContent />
        </Suspense>
    );
}
