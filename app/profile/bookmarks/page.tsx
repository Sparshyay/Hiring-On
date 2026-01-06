import { Suspense } from "react";
import BookmarksContent from "./content";

export const dynamic = "force-dynamic";

export default function BookmarksPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
            <BookmarksContent />
        </Suspense>
    );
}
