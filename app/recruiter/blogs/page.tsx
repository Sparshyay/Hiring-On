import { Suspense } from "react";
import { RecruiterBlogsContent } from "@/components/recruiter/blogs-content";

export const dynamic = "force-dynamic";

export default function RecruiterBlogsPage() {
    return (
        <Suspense fallback={<div>Loading blogs...</div>}>
            <RecruiterBlogsContent />
        </Suspense>
    );
}
