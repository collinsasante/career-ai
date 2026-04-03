import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const phases = [
  {
    number: 1,
    title: "Web Fundamentals",
    duration: "6 weeks",
    status: "completed" as const,
    steps: ["HTML & CSS Basics", "JavaScript Fundamentals"],
    progress: 100,
  },
  {
    number: 2,
    title: "Modern JavaScript & React",
    duration: "8 weeks",
    status: "in_progress" as const,
    steps: ["Advanced JavaScript (ES6+)", "React Fundamentals"],
    progress: 45,
  },
  {
    number: 3,
    title: "Professional Tools & TypeScript",
    duration: "6 weeks",
    status: "locked" as const,
    steps: ["TypeScript Essentials", "Testing & Accessibility"],
    progress: 0,
  },
  {
    number: 4,
    title: "Portfolio & Job Readiness",
    duration: "12 weeks",
    status: "locked" as const,
    steps: ["Next.js & Full-Stack React", "3 Portfolio Projects", "Interview Prep"],
    progress: 0,
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badgeColor: "bg-emerald-100 text-emerald-700",
    badgeText: "Completed",
    titleColor: "text-slate-900",
  },
  in_progress: {
    icon: Circle,
    iconColor: "text-brand-500",
    bg: "bg-brand-50",
    border: "border-brand-200",
    badgeColor: "bg-brand-100 text-brand-700",
    badgeText: "In Progress",
    titleColor: "text-slate-900",
  },
  locked: {
    icon: Lock,
    iconColor: "text-slate-300",
    bg: "bg-slate-50",
    border: "border-slate-200",
    badgeColor: "bg-slate-100 text-slate-500",
    badgeText: "Upcoming",
    titleColor: "text-slate-400",
  },
};

export function RoadmapPreview() {
  return (
    <section className="section bg-surface-subtle">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div>
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">
              Learning Roadmaps
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5 leading-tight">
              A clear, structured path from beginner to job-ready
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-6">
              Every recommended career comes with a curated, phase-by-phase
              roadmap — built around real industry requirements, not generic
              checklists.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Broken into phases with clear milestones",
                "Curated resources for each learning step",
                "Estimated time for every phase",
                "Track your progress as you go",
              ].map((point) => (
                <li key={point} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 size={16} className="text-brand-500 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <Link href="/register">
              <Button
                variant="primary"
                rightIcon={<ArrowRight size={15} />}
                size="lg"
              >
                Get Your Roadmap
              </Button>
            </Link>
          </div>

          {/* Right — roadmap preview */}
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card px-5 py-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-800">
                  Frontend Developer Path
                </span>
                <span className="text-xs font-medium text-brand-600">
                  32 weeks total
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={35} className="flex-1" variant="brand" size="md" />
                <span className="text-xs font-semibold text-slate-600 w-10 text-right">
                  35%
                </span>
              </div>
            </div>

            {phases.map((phase) => {
              const cfg = statusConfig[phase.status];
              const Icon = cfg.icon;

              return (
                <div
                  key={phase.number}
                  className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon size={18} className={cfg.iconColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-sm font-semibold ${cfg.titleColor}`}
                        >
                          Phase {phase.number}: {phase.title}
                        </span>
                        <span
                          className={`text-2xs px-2 py-0.5 rounded-full font-medium ${cfg.badgeColor}`}
                        >
                          {cfg.badgeText}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {phase.steps.map((step) => (
                          <span
                            key={step}
                            className="text-2xs text-slate-500 bg-white/60 px-1.5 py-0.5 rounded font-medium"
                          >
                            {step}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-2xs text-slate-400">
                        <span>{phase.duration}</span>
                        {phase.status === "in_progress" && (
                          <span className="text-brand-600 font-medium">
                            {phase.progress}% complete
                          </span>
                        )}
                        {phase.status === "completed" && (
                          <span className="text-emerald-600 font-medium">
                            ✓ Done
                          </span>
                        )}
                      </div>
                      {phase.status === "in_progress" && (
                        <Progress
                          value={phase.progress}
                          className="mt-2"
                          size="xs"
                          variant="brand"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
