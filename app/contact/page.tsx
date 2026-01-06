import { Suspense } from "react";
import { ContactContent } from "@/components/contact-content";

export const dynamic = "force-dynamic";

export default function ContactPage() {
    return (
        <Suspense fallback={<div>Loading contact form...</div>}>
            <ContactContent />
        </Suspense>
    );
}
