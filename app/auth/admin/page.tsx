import { Suspense } from "react";
import { AdminLoginContent } from "@/components/auth/admin-login-content";

export const dynamic = "force-dynamic";

export default function AdminAuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AdminLoginContent />
        </Suspense>
    );
}
