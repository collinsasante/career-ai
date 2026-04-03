import {
  Target,
  BookOpen,
  BarChart2,
  Layers,
  Route,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import { AnimateOnScroll } from "./animate-on-scroll";

const features = [
  {
    icon: Target,
    title: "Multi-factor career matching",
    description:
      "Goes beyond simple interest quizzes. Our engine scores careers across skills, subjects, industries, work style, and goals simultaneously.",
    highlight: "Precision over guesswork",
  },
  {
    icon: BookOpen,
    title: "Curated learning roadmaps",
    description:
      "Each career path comes with a phased learning roadmap — from foundational knowledge to portfolio-ready skills — with real resources at every step.",
    highlight: "No more aimless self-study",
  },
  {
    icon: BarChart2,
    title: "Transparent match scores",
    description:
      "Every recommendation comes with a clear score and specific reasons — so you understand why a path is right for you, not just that it is.",
    highlight: "Full transparency",
  },
  {
    icon: MessageCircle,
    title: "AI Career Advisor",
    description:
      "Ask any career question and get thoughtful, streaming answers from our built-in AI advisor — covering every field from technology to healthcare, law, and the arts.",
    highlight: "Like ChatGPT for your career",
  },
  {
    icon: Layers,
    title: "Skill gap analysis",
    description:
      "Know exactly which skills you already have and which you need to develop for each career, so you can plan your learning with precision.",
    highlight: "Know what to build",
  },
  {
    icon: ShieldCheck,
    title: "Real, up-to-date career data",
    description:
      "Career information includes salary ranges, job demand levels, required tools, and possible job titles — grounded in real industry data.",
    highlight: "Data-backed decisions",
  },
];

export function Features() {
  return (
    <section id="features" className="section bg-surface-subtle">
      <div className="container-page">
        {/* Header */}
        <AnimateOnScroll animation="fade-up">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
              Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              Everything you need to make a confident career decision
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              PathWise is built for depth, not surface-level guidance. Every
              feature exists to give you a clearer, more confident path forward.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <AnimateOnScroll key={feature.title} animation="fade-up" delay={i * 80}>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 flex flex-col gap-4 hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 h-full">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <Icon size={20} className="text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <span className="mt-auto text-xs font-semibold text-brand-600">
                    {feature.highlight}
                  </span>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
