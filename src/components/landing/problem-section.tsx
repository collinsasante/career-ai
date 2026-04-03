import { AlertTriangle, Compass, TrendingDown } from "lucide-react";
import { AnimateOnScroll } from "./animate-on-scroll";

const problems = [
  {
    icon: Compass,
    title: "Overwhelmed by options",
    description:
      "With hundreds of career paths and new roles emerging every year, most students don't know where to even begin exploring what's right for them.",
    stat: "68%",
    statLabel: "of graduates feel underprepared for career decisions",
  },
  {
    icon: AlertTriangle,
    title: "Generic, one-size-fits-all advice",
    description:
      "Career guidance often comes in the form of broad assessments or surface-level suggestions that don't reflect a student's actual skills and context.",
    stat: "3 in 4",
    statLabel: "students say standard career advice didn't match their situation",
  },
  {
    icon: TrendingDown,
    title: "No clear path forward",
    description:
      "Even when a student identifies a career interest, they rarely know what skills to build, in what order, or how long it will realistically take.",
    stat: "52%",
    statLabel: "of graduates change career direction within two years",
  },
];

export function ProblemSection() {
  return (
    <section className="section bg-surface-subtle">
      <div className="container-page">
        {/* Section label */}
        <AnimateOnScroll animation="fade-up">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
            The Problem
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            Most students graduate without a clear career plan
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Career indecision isn&apos;t a personal failing — it&apos;s a systems problem. The
            guidance available hasn&apos;t kept up with how fast the job market evolves.
          </p>
        </div>
        </AnimateOnScroll>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((problem, i) => {
            const Icon = problem.icon;
            return (
              <AnimateOnScroll key={problem.title} animation="fade-up" delay={i * 100}>
              <div
                className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 flex flex-col h-full"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-red-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  {problem.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">
                  {problem.description}
                </p>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <p className="text-2xl font-bold text-slate-900">{problem.stat}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{problem.statLabel}</p>
                </div>
              </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
