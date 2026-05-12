"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, BookOpen, TrendingUp, ChevronDown, ChevronUp, GraduationCap, Briefcase, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CareerIcon } from "@/components/ui/career-icon";
import { CAREERS_DATA } from "@/lib/recommendation/careers-data";
import { GHANA_EDUCATION_TRACKS, type GhanaTrack, type GhanaProgram } from "@/lib/data/ghana-education";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Track icon + colours
// ─────────────────────────────────────────────
const TRACK_CONFIG: Record<string, {
  icon: React.ReactNode;
  bg: string;
  pill: string;
  activePill: string;
  border: string;
  headerBg: string;
}> = {
  shs: {
    icon: <GraduationCap size={18} />,
    bg: "bg-emerald-50",
    pill: "border-emerald-200 text-emerald-700 hover:border-emerald-400",
    activePill: "bg-emerald-600 text-white border-emerald-600",
    border: "border-emerald-200",
    headerBg: "bg-emerald-600",
  },
  university: {
    icon: <BookOpen size={18} />,
    bg: "bg-blue-50",
    pill: "border-blue-200 text-blue-700 hover:border-blue-400",
    activePill: "bg-blue-600 text-white border-blue-600",
    border: "border-blue-200",
    headerBg: "bg-blue-600",
  },
  tvet: {
    icon: <Wrench size={18} />,
    bg: "bg-amber-50",
    pill: "border-amber-200 text-amber-700 hover:border-amber-400",
    activePill: "bg-amber-600 text-white border-amber-600",
    border: "border-amber-200",
    headerBg: "bg-amber-600",
  },
};

// ─────────────────────────────────────────────
// Build a fast career lookup map
// ─────────────────────────────────────────────
const CAREER_MAP = new Map(CAREERS_DATA.map((c) => [c.id, c]));

// ─────────────────────────────────────────────
// Program card
// ─────────────────────────────────────────────
function ProgramCard({
  program,
  trackId,
}: {
  program: GhanaProgram;
  trackId: string;
}) {
  const [open, setOpen] = useState(false);
  const cfg = TRACK_CONFIG[trackId];

  const careers = program.suggestedCareerIds
    .map((id) => CAREER_MAP.get(id))
    .filter(Boolean) as (typeof CAREERS_DATA)[number][];

  return (
    <div className={cn("bg-white rounded-2xl border shadow-card overflow-hidden", cfg.border)}>
      {/* Header — always visible */}
      <button
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-slate-900 mb-0.5">
            {program.name}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
            {program.description}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
          <Badge variant="slate" size="sm">
            {careers.length} career{careers.length !== 1 ? "s" : ""}
          </Badge>
          {open ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-5">
          {/* Courses / subjects */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Courses / Subjects
            </p>
            <div className="flex flex-wrap gap-1.5">
              {program.courses.map((course) => (
                <span
                  key={course}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-lg border font-medium",
                    cfg.bg,
                    cfg.border,
                    "text-slate-700"
                  )}
                >
                  {course}
                </span>
              ))}
            </div>
          </div>

          {/* Career suggestions */}
          {careers.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Suggested Career Paths
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {careers.map((career) => (
                  <Link
                    key={career.id}
                    href={`/careers/${career.id}`}
                    className="group flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-brand-200 hover:bg-brand-50 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:border-brand-200 transition-colors">
                      <CareerIcon careerId={career.id} size={14} className="text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 group-hover:text-brand-700 transition-colors truncate">
                        {career.title}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <TrendingUp size={10} className={
                          career.job_demand === "very_high" ? "text-emerald-500" :
                          career.job_demand === "high" ? "text-blue-500" :
                          "text-amber-500"
                        } />
                        <span className="text-xs text-slate-400 capitalize">
                          {career.job_demand.replace("_", " ")} demand
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-400 transition-colors flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Track tab pill
// ─────────────────────────────────────────────
function TrackTab({
  track,
  active,
  onClick,
}: {
  track: GhanaTrack;
  active: boolean;
  onClick: () => void;
}) {
  const cfg = TRACK_CONFIG[track.id];
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all",
        active ? cfg.activePill : `bg-white ${cfg.pill}`
      )}
    >
      {cfg.icon}
      {track.shortName}
      <span className={cn(
        "text-xs rounded-full px-1.5 py-0.5",
        active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
      )}>
        {track.programs.length}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function CareersPage() {
  const [activeTrackId, setActiveTrackId] = useState<string>("shs");

  const activeTrack = GHANA_EDUCATION_TRACKS.find((t) => t.id === activeTrackId)!;

  return (
    <div className="space-y-6 pb-8 pt-2 lg:pt-0 mt-4 lg:mt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Career Pathways
        </h1>
        <p className="text-sm text-slate-500">
          Explore career paths by your educational background in Ghana — SHS,
          University, or TVET. Select a programme to see courses and suggested careers.
        </p>
      </div>

      {/* Track tabs */}
      <div className="flex gap-2 flex-wrap">
        {GHANA_EDUCATION_TRACKS.map((track) => (
          <TrackTab
            key={track.id}
            track={track}
            active={activeTrackId === track.id}
            onClick={() => setActiveTrackId(track.id)}
          />
        ))}
      </div>

      {/* Active track description */}
      <div className={cn(
        "rounded-xl border p-4 text-sm text-slate-600 leading-relaxed",
        TRACK_CONFIG[activeTrackId].bg,
        TRACK_CONFIG[activeTrackId].border
      )}>
        <span className="font-semibold text-slate-800">{activeTrack.name}: </span>
        {activeTrack.description}
      </div>

      {/* Programme count */}
      <p className="text-xs text-slate-400 font-medium">
        {activeTrack.programs.length} programme{activeTrack.programs.length !== 1 ? "s" : ""} — click any card to see courses and career suggestions
      </p>

      {/* Program cards */}
      <div className="space-y-3">
        {activeTrack.programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            trackId={activeTrackId}
          />
        ))}
      </div>
    </div>
  );
}
