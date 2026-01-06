import { Suspense } from "react";
import WatchlistContent from "./content";

export const dynamic = "force-dynamic";

export default function WatchlistPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
            <WatchlistContent />
        </Suspense>
    );
}
