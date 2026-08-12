import { ClosingCtaSection } from "@/app/home/_components/sections/closing-cta-section";
import { LandingHeroSection } from "@/app/home/_components/sections/hero-section";
import { LandingPipelineSection } from "@/app/home/_components/sections/pipeline-section";
import { LandingStorySection } from "@/app/home/_components/sections/story-section";
import { LandingVideoSection } from "@/app/home/_components/sections/video-section";
import { UrlAnatomySection } from "@/app/home/_components/sections/url-anatomy-section";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export function LandingExperience() {
  return (
    <main className="landing-grain overflow-clip bg-canvas">
      <SiteHeader variant="landing" />

      <LandingHeroSection />
      <LandingVideoSection />
      <LandingStorySection />
      <UrlAnatomySection />
      <div className="relative z-10 flex flex-col bg-canvas">
        <LandingPipelineSection />
        <ClosingCtaSection />
        <SiteFooter variant="landing" />
      </div>
    </main>
  );
}
