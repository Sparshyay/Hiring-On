import { Suspense } from "react";
import { LevelSelectionContent } from "@/components/practice/level-selection-content";

export const dynamic = "force-dynamic";

export default async function LevelSelectionPage({ params }: { params: Promise<{ topic: string }> }) {
    const { topic } = await params;
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading levels...</div>}>
            <LevelSelectionContent topic={decodeURIComponent(topic)} />
        </Suspense>
    );
}
