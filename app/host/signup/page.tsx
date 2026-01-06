import { Suspense } from "react";
import { HostSignupContent } from "@/components/host/signup-content";

export const dynamic = "force-dynamic";

export default function HostSignupPage() {
    return (
        <Suspense fallback={<div>Loading signup...</div>}>
            <HostSignupContent />
        </Suspense>
    );
}
