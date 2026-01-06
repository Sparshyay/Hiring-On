import { Suspense } from "react";
import { JobSeekerLoginContent } from "@/components/auth/jobseeker-login-content";

export const dynamic = "force-dynamic";

export default function JobSeekerAuthPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <JobSeekerLoginContent />
        </Suspense>
    );
}
