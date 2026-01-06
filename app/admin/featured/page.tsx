import { Suspense } from "react";
import { FeaturedContent } from "@/components/admin/featured-content";

export const dynamic = "force-dynamic";

export default function FeaturedManagementPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <div className="w-8 h-8 border-b-2 border-primary rounded-full animate-spin" />
            </div>
        }>
            <FeaturedContent />
        </Suspense>
    );
}
