"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Loader2,
  RefreshCw,
  ExternalLink,
  Play,
  FileText,
  Code2,
  FolderOpen,
  GraduationCap,
  Award,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PersonalizedRoadmap, RoadmapPhase, RoadmapStep } from "@/lib/agent/roadmap-generator";

// ── Resource type icons ───────────────────────
const RESOURCE_ICONS: Record<string, React.ReactNode> = {
  course:   <BookOpen   size={12} className="text-brand-500"   />,
  video:    <Play       size={12} className="text-rose-500"    />,
  book:     <FileText   size={12} className="text-amber-500"   />,
  practice: <Code2      size={12} className="text-emerald-500" />,
  project:  <FolderOpen size={12} className="text-violet-500"  />,
};

// ── Alternative Pathways ──────────────────────

interface Pathway {
  id: string;
  icon: React.ReactNode;
  label: string;
  badge: string;
  badgeColor: string;
  duration: string;
  intro: string;
  steps: string[];
}

function computePathways(careerTitle: string): Pathway[] {
  return [
    {
      id: "university",
      icon: <GraduationCap size={18} className="text-violet-600" />,
      label: "University",
      badge: "Traditional",
      badgeColor: "bg-violet-100 text-violet-700",
      duration: "3–4 years",
      intro: `Earn a degree to build deep theoretical foundations and graduate credentials for ${careerTitle}.`,
      steps: [
        "Research universities and courses relevant to this field",
        "Complete required A-levels or equivalent qualifications",
        "Apply through UCAS or your national admissions system",
        "Supplement with internships and industry projects each year",
        "Use careers services and alumni networks to land your first role",
      ],
    },
    {
      id: "self-taught",
      icon: <BookOpen size={18} className="text-emerald-600" />,
      label: "Self-Taught",
      badge: "Flexible",
      badgeColor: "bg-emerald-100 text-emerald-700",
      duration: "6–18 months",
      intro: `Break into ${careerTitle} at your own pace using free and paid online resources.`,
      steps: [
        "Pick 2–3 high-quality resources (YouTube, Coursera, freeCodeCamp, documentation)",
        "Follow a structured syllabus — don't just consume content, build things",
        "Complete 3–5 portfolio projects that demonstrate real-world ability",
        "Join communities (Reddit, Discord, LinkedIn groups) to get feedback and network",
        "Apply to entry-level roles or internships with your portfolio as proof",
      ],
    },
    {
      id: "certification",
      icon: <Award size={18} className="text-amber-600" />,
      label: "Certification / Bootcamp",
      badge: "Fast-track",
      badgeColor: "bg-amber-100 text-amber-700",
      duration: "3–12 months",
      intro: `Use industry-recognised certifications and intensive bootcamps to signal competence fast.`,
      steps: [
        "Identify the top 2–3 certifications that employers in this field value",
        "Enrol in a structured course or bootcamp (online or in-person)",
        "Combine study with hands-on practice — projects matter as much as the cert",
        "List earned certifications prominently on your CV and LinkedIn profile",
        "Use bootcamp career services and alumni networks to land your first role",
      ],
    },
    {
      id: "freelance",
      icon: <Briefcase size={18} className="text-brand-600" />,
      label: "Freelance",
      badge: "Earn as you learn",
      badgeColor: "bg-brand-100 text-brand-700",
      duration: "Start in 1–3 months",
      intro: `Build real experience and early income through freelance work in ${careerTitle}.`,
      steps: [
        "Create profiles on Fiverr, Upwork, or Contra with a clearly defined niche",
        "Set competitive initial rates to attract your first 3–5 clients and reviews",
        "Deliver excellent work — your reputation compounds quickly",
        "Document every project as a case study for your portfolio",
        "Raise rates steadily as reviews, testimonials, and case studies grow",
      ],
    },
  ];
}

function PathwaysSection({ careerTitle }: { careerTitle: string }) {
  const [selected, setSelected] = useState<string>("self-taught");
  const pathways = computePathways(careerTitle);
  const active = pathways.find((p) => p.id === selected)!;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-6">
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Alternative Pathways
        </p>
        <h2 className="text-lg font-bold text-slate-900">How to get there</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Every career has multiple valid routes. Pick the one that fits your situation.
        </p>
      </div>

      {/* Pathway tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {pathways.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`flex flex-col gap-1 p-3 rounded-xl border-2 text-left transition-all duration-150 ${
              selected === p.id
                ? "border-brand-500 bg-brand-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                {p.icon}
              </div>
              {selected === p.id && <CheckCircle2 size={14} className="text-brand-500" />}
            </div>
            <p className="text-xs font-semibold text-slate-800 mt-1 leading-tight">{p.label}</p>
            <span className={`self-start text-2xs px-1.5 py-0.5 rounded-md font-medium ${p.badgeColor}`}>
              {p.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Active pathway detail */}
      <div className="bg-slate-50 rounded-xl p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">{active.label} Path</p>
            <p className="text-xs text-slate-500 mt-0.5">{active.intro}</p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1 flex-shrink-0">
            {active.duration}
          </span>
        </div>
        <div className="space-y-2">
          {active.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-2xs font-bold">
                {i + 1}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-200">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(`how to become ${careerTitle} ${active.label.toLowerCase()} path`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1"
          >
            Explore {active.label.toLowerCase()} resources for {careerTitle}
            <ChevronRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Step card ─────────────────────────────────
function StepCard({
  step,
  isCompleted,
  onToggle,
}: {
  step: RoadmapStep;
  isCompleted: boolean;
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border transition-all duration-150 ${
      isCompleted
        ? "border-emerald-200 bg-emerald-50/50"
        : "border-slate-200 bg-white"
    }`}>
      <div
        className="flex items-start gap-3 p-4 cursor-pointer select-none"
        onClick={() => setExpanded((v) => !v)}
      >
        <button
          className="flex-shrink-0 mt-0.5"
          onClick={(e) => { e.stopPropagation(); onToggle(step.id); }}
          title={isCompleted ? "Mark incomplete" : "Mark complete"}
        >
          {isCompleted
            ? <CheckCircle2 size={20} className="text-emerald-500" />
            : <Circle       size={20} className="text-slate-300 hover:text-brand-400 transition-colors" />
          }
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${isCompleted ? "text-emerald-700 line-through decoration-emerald-300" : "text-slate-800"}`}>
            {step.title}
          </p>
          {!expanded && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{step.description}</p>
          )}
        </div>
        <button className="flex-shrink-0 text-slate-400 ml-1">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-100 pt-3">
          <p className="text-sm text-slate-600 leading-relaxed mb-3">{step.description}</p>
          {step.resources.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Resources
              </p>
              <div className="space-y-1.5">
                {step.resources.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {RESOURCE_ICONS[r.type] ?? <ExternalLink size={12} className="text-slate-400" />}
                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-600 hover:text-brand-800 hover:underline flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {r.title}
                        <ExternalLink size={10} className="flex-shrink-0" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-700">{r.title}</span>
                    )}
                    <Badge variant="slate" size="sm" className="capitalize">{r.type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Phase card ────────────────────────────────
function PhaseCard({
  phase,
  completedSteps,
  onToggleStep,
}: {
  phase: RoadmapPhase;
  completedSteps: Set<string>;
  onToggleStep: (id: string) => void;
}) {
  const completedCount  = phase.steps.filter((s) => completedSteps.has(s.id)).length;
  const isPhaseComplete = completedCount === phase.steps.length;
  const [open, setOpen] = useState(completedCount < phase.steps.length);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
      <button
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isPhaseComplete ? "bg-emerald-100" : "bg-brand-100"
        }`}>
          {isPhaseComplete
            ? <CheckCircle2 size={20} className="text-emerald-600" />
            : <span className="text-sm font-bold text-brand-700">{phase.phaseNumber}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-slate-900">{phase.title}</h3>
            {isPhaseComplete && <Badge variant="emerald" size="sm">Complete</Badge>}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {phase.durationWeeks} weeks · {completedCount}/{phase.steps.length} steps done
          </p>
        </div>
        <div className="hidden md:flex flex-col items-end gap-1 flex-shrink-0">
          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / phase.steps.length) * 100}%` }}
            />
          </div>
          <span className="text-2xs text-slate-400">
            {Math.round((completedCount / phase.steps.length) * 100)}%
          </span>
        </div>
        <div className="ml-2 text-slate-400 flex-shrink-0">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500 leading-relaxed mb-4">{phase.description}</p>
          {phase.skillsCovered.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {phase.skillsCovered.map((skill) => (
                <span key={skill} className="px-2 py-0.5 rounded-lg bg-brand-50 border border-brand-100 text-xs text-brand-700 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          )}
          <div className="space-y-2">
            {phase.steps.map((step) => (
              <StepCard
                key={step.id}
                step={step}
                isCompleted={completedSteps.has(step.id)}
                onToggle={onToggleStep}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────
export default function RoadmapDetailPage() {
  const params   = useParams<{ careerId: string }>();
  const careerId = params.careerId;

  const [roadmap,        setRoadmap]        = useState<PersonalizedRoadmap | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState<string | null>(null);
  const [saving,         setSaving]         = useState(false);

  const fetchRoadmap = useCallback(async (clearCache = false) => {
    setLoading(true);
    setError(null);
    try {
      if (clearCache) {
        await fetch(`/api/roadmap/${careerId}`, { method: "DELETE" });
      }
      const res = await fetch(`/api/roadmap/${careerId}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error ?? `Error ${res.status}`);
      }
      const { data } = await res.json();
      setRoadmap(data.roadmap as PersonalizedRoadmap);
      setCompletedSteps(new Set(data.completedSteps as string[]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load roadmap.");
    } finally {
      setLoading(false);
    }
  }, [careerId]);

  useEffect(() => { fetchRoadmap(); }, [fetchRoadmap]);

  const handleToggleStep = useCallback(async (stepId: string) => {
    const next = new Set(completedSteps);
    if (next.has(stepId)) next.delete(stepId);
    else next.add(stepId);
    setCompletedSteps(next);

    setSaving(true);
    try {
      await fetch(`/api/roadmap/${careerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completedSteps: Array.from(next) }),
      });
    } catch {
      // silent — progress still shows locally
    } finally {
      setSaving(false);
    }
  }, [completedSteps, careerId]);

  // ── Loading state ─────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={32} className="text-brand-600 animate-spin" />
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">Building your personalised roadmap...</p>
          <p className="text-xs text-slate-400 mt-1">Analysing your profile and skills — this takes a few seconds</p>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────
  if (error || !roadmap) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <BookOpen size={24} className="text-red-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">{error ?? "Roadmap unavailable"}</p>
          <p className="text-xs text-slate-400 mt-1">Something went wrong. Please try again in a moment.</p>
        </div>
        <Button onClick={() => fetchRoadmap(false)} variant="outline" leftIcon={<RefreshCw size={14} />}>
          Try again
        </Button>
      </div>
    );
  }

  const totalSteps     = roadmap.phases.reduce((acc, p) => acc + p.steps.length, 0);
  const totalCompleted = completedSteps.size;
  const overallPct     = totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0;

  return (
    <div className="pb-12 pt-2 lg:pt-0 mt-4 lg:mt-0">
      <Link
        href="/roadmap"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft size={16} />
        My Roadmaps
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
              Personalised Learning Roadmap
            </p>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{roadmap.careerTitle}</h1>
            <p className="text-sm text-slate-500">
              {roadmap.totalWeeks} weeks total · {roadmap.phases.length} phases · {totalSteps} steps
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 md:min-w-40">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-500"
                style={{ width: `${overallPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500">{totalCompleted}/{totalSteps} steps</span>
              <span className="text-xs font-bold text-brand-600">{overallPct}% done</span>
            </div>
            <button
              onClick={() => fetchRoadmap(true)}
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <RefreshCw size={11} />
              Regenerate
            </button>
          </div>
        </div>
        {saving && (
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <Loader2 size={11} className="animate-spin" /> Saving progress...
          </p>
        )}
      </div>

      {/* Alternative Pathways */}
      <PathwaysSection careerTitle={roadmap.careerTitle} />

      {/* Phases */}
      <div className="space-y-4">
        {roadmap.phases.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            completedSteps={completedSteps}
            onToggleStep={handleToggleStep}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link href="/chat">
          <Button variant="outline" rightIcon={<ExternalLink size={14} />}>
            Discuss this roadmap with AI Advisor
          </Button>
        </Link>
      </div>
    </div>
  );
}
