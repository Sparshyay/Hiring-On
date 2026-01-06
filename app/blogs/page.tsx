import { Suspense } from "react";
import { BlogsListContent } from "@/components/blogs/blogs-list-content";

export const dynamic = "force-dynamic";

export default function BlogsPage() {
    return (
        <Suspense fallback={<div>Loading blogs...</div>}>
            <BlogsListContent />
        </Suspense>
    );
}
