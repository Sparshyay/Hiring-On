import { Suspense } from "react";
import { LandingPageContent } from "@/components/landing-page-content";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPageContent />
    </Suspense>
  );
}
