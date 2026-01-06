import { Suspense } from "react";
import { BlogDetailsContent } from "@/components/blogs/blog-details-content";

export const dynamic = "force-dynamic";

export default function BlogDetailPage() {
    return (
        <Suspense fallback={<div>Loading post...</div>}>
            <BlogDetailsContent />
        </Suspense>
    );
}
