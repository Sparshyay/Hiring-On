import { Suspense } from "react";
import { PostInternshipContent } from "@/components/recruiter/new-internship-content";

export const dynamic = "force-dynamic";

export default function PostInternshipPage() {
    return (
        <Suspense fallback={<div>Loading internship form...</div>}>
            <PostInternshipContent />
        </Suspense>
    );
}
