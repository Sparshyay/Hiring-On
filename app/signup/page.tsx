import { Suspense } from "react";
import { SignupPageContent } from "@/components/signup-page-content";

export const dynamic = "force-dynamic";

export default function SignupPage() {
    return (
        <Suspense fallback={<div>Loading signup...</div>}>
            <SignupPageContent />
        </Suspense>
    );
}
