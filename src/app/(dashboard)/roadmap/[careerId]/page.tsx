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
                    <span className="text-xs text-slate-700">{r.title}</span>
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

  const fetchRoadmap = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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
          <p className="text-sm font-semibold text-slate-700">Generating your personalised roadmap...</p>
          <p className="text-xs text-slate-400 mt-1">Claude is building a plan tailored to your profile</p>
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
          <p className="text-xs text-slate-400 mt-1">Make sure your ANTHROPIC_API_KEY is configured.</p>
        </div>
        <Button onClick={fetchRoadmap} variant="outline" leftIcon={<RefreshCw size={14} />}>
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
              onClick={fetchRoadmap}
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
