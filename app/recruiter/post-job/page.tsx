import { Suspense } from "react";
import { PostJobContent } from "@/components/recruiter/post-job-content";

export const dynamic = "force-dynamic";

export default function PostJobPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PostJobContent />
        </Suspense>
    );
}
