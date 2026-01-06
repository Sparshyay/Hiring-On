import { Suspense } from "react";
import { AdminLoginContent } from "@/components/admin/login-content";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div>Loading login...</div>}>
            <AdminLoginContent />
        </Suspense>
    );
}
