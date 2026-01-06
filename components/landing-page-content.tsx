"use client";

import Image from "next/image";
import { HeroSection } from "@/components/shared/hero-section";
import { FeaturedJobs } from "@/components/shared/featured-jobs";
import { TestimonialsCarousel } from "@/components/shared/testimonials-carousel";
import { MockTestSection } from "@/components/landing/mock-test-section";
import { SkillBasedAssessments } from "@/components/practice/skill-based-assessments";
import { MotivationalBanner } from "@/components/landing/motivational-banner";
import { AdBanner } from "@/components/shared/ad-banner";
import { RoleRedirect } from "@/components/auth/role-redirect";

export function LandingPageContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <RoleRedirect />
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <AdBanner
          title="Need guidance? Get Winning Tips From Top Mentors!"
          subtitle="Connect with industry experts who have cracked the toughest interviews. Get personalized roadmap and mock interview feedback."
          ctaText="Find a Mentor"
          ctaLink="/mentorships"
          variant="blue"
        />
      </div>
      <FeaturedJobs />
      <div className="container mx-auto px-4 py-8">
        <SkillBasedAssessments />
      </div>
      <MockTestSection />
      <MotivationalBanner />
      <TestimonialsCarousel />
    </div>
  );
}
