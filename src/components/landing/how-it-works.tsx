import { ClipboardList, Sparkles, Map, Rocket } from "lucide-react";
import { AnimateOnScroll } from "./animate-on-scroll";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Build your student profile",
    description:
      "Tell us about your interests, skills, preferred work style, learning habits, and career goals. The more you share, the more accurate your matches will be.",
    detail: "Skills · Interests · Goals · Work Style · Availability",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Receive personalised career matches",
    description:
      "PathWise analyses your profile against a curated library of career paths using a multi-factor matching algorithm — producing ranked recommendations with clear match scores.",
    detail: "Match Score · Skill Gap Analysis · Why It Fits You",
  },
  {
    number: "03",
    icon: Map,
    title: "Explore your learning roadmap",
    description:
      "Each recommended career comes with a structured, phase-by-phase learning roadmap — showing you exactly what to learn, in what order, and the best resources for each stage.",
    detail: "Phases · Resources · Timelines · Milestones",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Take action with clarity",
    description:
      "Track your progress through your roadmap, save careers you're exploring, and revisit your recommendations as your profile grows. Your career plan, always in one place.",
    detail: "Progress Tracking · Saved Careers · Dashboard",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section bg-white">
      <div className="container-page">
        {/* Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              From profile to roadmap in four clear steps
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              No ambiguity. No generic advice. Just a clear, structured process
              built around your specific situation.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop */}
          <div className="hidden lg:block absolute top-14 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <AnimateOnScroll key={step.number} animation="fade-up" delay={i * 100}>
                  <div className="relative flex flex-col h-full">
                    {/* Step number + icon */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center shadow-md shadow-brand-600/20 relative z-10">
                          <Icon size={22} className="text-white" />
                        </div>
                      </div>
                      <span className="text-4xl font-bold text-slate-100 leading-none select-none">
                        {step.number}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-base font-semibold text-slate-900 mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">
                      {step.description}
                    </p>

                    {/* Detail tags */}
                    <p className="text-xs text-brand-600 font-medium bg-brand-50 px-3 py-2 rounded-lg">
                      {step.detail}
                    </p>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
