import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimateOnScroll } from "./animate-on-scroll";

export function FinalCTA() {
  return (
    <section className="section bg-brand-900 relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 50%, rgb(99 102 241 / 0.3) 0%, transparent 50%),
            radial-gradient(circle at 75% 50%, rgb(79 70 229 / 0.2) 0%, transparent 50%)`,
        }}
      />

      <div className="container-page relative">
        <AnimateOnScroll animation="fade-up">
        <div className="max-w-2xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-8">
            <span className="text-xs font-medium text-white/80">
              Free to get started · No credit card required
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            Start navigating your career with clarity — today.
          </h2>

          {/* Subtext */}
          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-lg mx-auto">
            Five minutes to complete your profile. A lifetime of direction. Join
            thousands of students who chose PathWise over uncertainty.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button
                size="xl"
                variant="primary"
                rightIcon={<ArrowRight size={18} />}
                className="bg-white text-brand-700 hover:bg-slate-100 shadow-lg shadow-black/20 !text-brand-700"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/careers">
              <Button
                size="xl"
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                Browse Career Paths
              </Button>
            </Link>
          </div>

          {/* Sub-note */}
          <p className="mt-8 text-sm text-white/40">
            Used by students at 50+ universities · Built for clarity, not complexity
          </p>
        </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
