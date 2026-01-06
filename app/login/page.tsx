import { Suspense } from "react";
import { LoginPageContent } from "@/components/login-page-content";

export const dynamic = "force-dynamic";

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading login...</div>}>
            <LoginPageContent />
        </Suspense>
    );
}
