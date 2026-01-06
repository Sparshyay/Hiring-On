import { Suspense } from "react";
import { RecruiterLoginContent } from "@/components/auth/recruiter-login-content";

export const dynamic = "force-dynamic";

export default function RecruiterAuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RecruiterLoginContent />
        </Suspense>
    );
}
