import { Suspense } from "react";
import RecentlyViewedContent from "./content";

export const dynamic = "force-dynamic";

export default function RecentlyViewedPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
            <RecentlyViewedContent />
        </Suspense>
    );
}
