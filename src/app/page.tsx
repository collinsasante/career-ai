import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { CareerShowcase } from "@/components/landing/career-showcase";
import { RoadmapPreview } from "@/components/landing/roadmap-preview";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";
import { getSession } from "@/lib/auth/session";

export default async function LandingPage() {
  const session = await getSession();

  return (
    <>
      <Navbar variant="landing" session={session} />
      <main>
        <Hero session={session} />
        <ProblemSection />
        <HowItWorks />
        <Features />
        <CareerShowcase />
        <RoadmapPreview />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
