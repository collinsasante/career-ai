"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, TrendingUp, ChevronRight, Clock, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CareerIcon } from "@/components/ui/career-icon";
import { CAREERS_DATA } from "@/lib/recommendation/careers-data";
import { formatSalary } from "@/lib/utils";
import {
  CATEGORY_TO_SECTOR,
  SECTOR_LABELS,
  type CareerSector,
} from "@/lib/types";

// ─────────────────────────────────────────────
// Sector → subcategory display labels
// ─────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  software:       "Software",
  data:           "Data & Analytics",
  ai:             "AI & ML",
  security:       "Cybersecurity",
  infrastructure: "Cloud & DevOps",
  design:         "Design",
  creative:       "Creative",
  media:          "Marketing & Media",
  management:     "Management",
  business:       "Business",
  finance:        "Finance",
  logistics:      "Logistics",
  hospitality:    "Hospitality",
  "real-estate":  "Real Estate",
  healthcare:     "Healthcare",
  science:        "Science",
  sports:         "Sports",
  legal:          "Legal",
  law:            "Law",
  education:      "Education",
  social:         "People & HR",
  nonprofit:      "Non-profit",
  government:     "Government",
  engineering:    "Engineering",
  construction:   "Construction",
  trades:         "Trades & Vocational",
  environment:    "Environment",
  agriculture:    "Agriculture",
};

const DEMAND_COLORS: Record<string, string> = {
  very_high: "text-emerald-600",
  high:      "text-blue-600",
  moderate:  "text-amber-600",
  low:       "text-slate-500",
};

const DEMAND_LABELS: Record<string, string> = {
  very_high: "Very High Demand",
  high:      "High Demand",
  moderate:  "Moderate Demand",
  low:       "Low Demand",
};

// ─────────────────────────────────────────────
// Sector filter config — ordered for display
// ─────────────────────────────────────────────
const ALL_SECTORS: CareerSector[] = [
  "computing-technology",
  "data-ai",
  "engineering",
  "health-sciences",
  "business-management",
  "arts-design-media",
  "legal-compliance",
  "education-social",
  "trades-vocational",
  "environment",
];

// ─────────────────────────────────────────────
// Sector pill button
// ─────────────────────────────────────────────
function SectorPill({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all border ${
        active
          ? "bg-brand-600 text-white border-brand-600 shadow-sm"
          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
      }`}
    >
      {label}
      <span className={`text-xs rounded-full px-1.5 py-0.5 ${
        active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
      }`}>
        {count}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function CareersPage() {
  const [query, setQuery] = useState("");
  const [activeSector, setActiveSector] = useState<CareerSector | "all">("all");
  const [showAllSectors, setShowAllSectors] = useState(false);

  const VISIBLE_SECTORS = showAllSectors ? ALL_SECTORS : ALL_SECTORS.slice(0, 5);

  const filtered = CAREERS_DATA.filter((career) => {
    const matchesQuery =
      query.trim() === "" ||
      career.title.toLowerCase().includes(query.toLowerCase()) ||
      career.description.toLowerCase().includes(query.toLowerCase()) ||
      career.required_skills.some((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      );
    const careerSector = CATEGORY_TO_SECTOR[career.category];
    const matchesSector = activeSector === "all" || careerSector === activeSector;
    return matchesQuery && matchesSector;
  });

  // Count careers per sector for the pills
  const sectorCounts = ALL_SECTORS.reduce<Record<string, number>>((acc, sector) => {
    acc[sector] = CAREERS_DATA.filter(
      (c) => CATEGORY_TO_SECTOR[c.category] === sector
    ).length;
    return acc;
  }, {});

  // Group filtered results by sector for display
  const grouped = filtered.reduce<Record<CareerSector, typeof filtered>>((acc, career) => {
    const sector = CATEGORY_TO_SECTOR[career.category];
    if (!acc[sector]) acc[sector] = [];
    acc[sector].push(career);
    return acc;
  }, {} as Record<CareerSector, typeof filtered>);

  const activeSectors = ALL_SECTORS.filter((s) => grouped[s]?.length > 0);

  return (
    <div className="space-y-6 pb-8 pt-2 lg:pt-0 mt-4 lg:mt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Career Library</h1>
        <p className="text-sm text-slate-500">
          Explore {CAREERS_DATA.length} career paths across{" "}
          {ALL_SECTORS.length} sectors — with salaries, skills, and learning roadmaps.
        </p>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by career, skill, or keyword…"
        leftElement={<Search size={16} />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Sector filter pills */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Browse by sector
        </p>
        <div className="flex gap-2 flex-wrap items-center">
          <SectorPill
            label="All Careers"
            active={activeSector === "all"}
            count={CAREERS_DATA.length}
            onClick={() => setActiveSector("all")}
          />
          {VISIBLE_SECTORS.map((sector) => (
            <SectorPill
              key={sector}
              label={SECTOR_LABELS[sector]}
              active={activeSector === sector}
              count={sectorCounts[sector] ?? 0}
              onClick={() => setActiveSector(activeSector === sector ? "all" : sector)}
            />
          ))}
          {!showAllSectors && (
            <button
              onClick={() => setShowAllSectors(true)}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-brand-600 font-medium px-2 py-1.5 transition-colors"
            >
              More sectors <ChevronDown size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-400 font-medium">
        {filtered.length} career{filtered.length !== 1 ? "s" : ""} found
        {activeSector !== "all" && ` in ${SECTOR_LABELS[activeSector]}`}
        {query.trim() && ` matching "${query.trim()}"`}
      </p>

      {/* Career grid — grouped by sector */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Search size={36} className="mx-auto text-slate-200 mb-4" />
          <p className="font-semibold text-slate-700 mb-1">No careers found</p>
          <p className="text-sm text-slate-500">
            Try a different search term or sector.
          </p>
        </div>
      ) : activeSector !== "all" ? (
        // Single sector — flat grid
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      ) : (
        // All sectors — grouped with headings
        <div className="space-y-10">
          {activeSectors.map((sector) => (
            <section key={sector}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {SECTOR_LABELS[sector]}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {grouped[sector].length} career{grouped[sector].length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => setActiveSector(sector)}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                >
                  View all <ChevronRight size={12} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grouped[sector].slice(0, 4).map((career) => (
                  <CareerCard key={career.id} career={career} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Career card (extracted for reuse)
// ─────────────────────────────────────────────
function CareerCard({ career }: { career: (typeof CAREERS_DATA)[number] }) {
  return (
    <Link
      href={`/careers/${career.id}`}
      className="group bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex flex-col gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
          <CareerIcon careerId={career.id} size={18} className="text-brand-600" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant="slate" size="sm">
            {CATEGORY_LABELS[career.category] ?? career.category}
          </Badge>
          <div className="flex items-center gap-1">
            <TrendingUp size={11} className={DEMAND_COLORS[career.job_demand]} />
            <span className={`text-xs font-medium ${DEMAND_COLORS[career.job_demand]}`}>
              {DEMAND_LABELS[career.job_demand]}
            </span>
          </div>
        </div>
      </div>

      {/* Title + description */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">
          {career.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {career.description}
        </p>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5">
        {career.required_skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="text-xs px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 font-medium"
          >
            {skill}
          </span>
        ))}
        {career.required_skills.length > 4 && (
          <span className="text-xs text-slate-400 px-1 py-0.5">
            +{career.required_skills.length - 4} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-slate-400">Salary</p>
            <p className="text-sm font-semibold text-slate-800">
              {formatSalary(career.avg_salary_min, career.avg_salary_max)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Time to Ready</p>
            <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
              <Clock size={11} className="text-slate-400" />
              {career.time_to_ready}
            </p>
          </div>
        </div>
        <ChevronRight
          size={16}
          className="text-slate-300 group-hover:text-brand-400 transition-colors"
        />
      </div>
    </Link>
  );
}
