import { Suspense } from "react";
import { ProfilePageContent } from "@/components/profile/profile-page-content";
import { MobileJobSeekerMenu } from "@/components/mobile/mobile-job-seeker-menu";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
    return (
        <Suspense fallback={<div>Loading profile...</div>}>
            <ProfilePageContent />
        </Suspense>
    );
}
