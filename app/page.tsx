import Image from "next/image";
import { HeroSection } from "@/components/shared/hero-section";
import { FeaturedJobs } from "@/components/shared/featured-jobs";
import { TestimonialsCarousel } from "@/components/shared/testimonials-carousel";
import { PracticeHighlight } from "@/components/shared/practice-highlight";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedJobs />
      <TestimonialsCarousel />
      <PracticeHighlight />
    </div>
  );
}
