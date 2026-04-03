"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, TrendingUp, ChevronRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CareerIcon } from "@/components/ui/career-icon";
import { CAREERS_DATA } from "@/lib/recommendation/careers-data";
import { formatSalary } from "@/lib/utils";
import type { CareerCategory } from "@/lib/types";

const categoryLabels: Record<CareerCategory, string> = {
  software: "Software",
  data: "Data & Analytics",
  design: "Design",
  security: "Security",
  management: "Management",
  infrastructure: "Infrastructure",
  ai: "AI & ML",
  healthcare: "Healthcare",
  law: "Law",
  business: "Business",
  education: "Education",
  engineering: "Engineering",
  creative: "Creative",
  science: "Science",
  media: "Media",
  social: "Social",
  finance: "Finance",
  legal: "Legal",
  environment: "Environment",
  construction: "Construction",
  logistics: "Logistics",
  hospitality: "Hospitality",
  agriculture: "Agriculture",
  "real-estate": "Real Estate",
  sports: "Sports",
  nonprofit: "Nonprofit",
  government: "Government",
  trades: "Trades",
};

const demandColors: Record<string, string> = {
  very_high: "text-emerald-600",
  high: "text-blue-600",
  moderate: "text-amber-600",
  low: "text-slate-500",
};

const demandLabels: Record<string, string> = {
  very_high: "Very High Demand",
  high: "High Demand",
  moderate: "Moderate Demand",
  low: "Low Demand",
};

const ALL_CATEGORIES = [
  { value: "all",            label: "All Careers" },
  { value: "software",       label: "Software" },
  { value: "data",           label: "Data & Analytics" },
  { value: "design",         label: "Design" },
  { value: "management",     label: "Management" },
  { value: "business",       label: "Business" },
  { value: "finance",        label: "Finance" },
  { value: "creative",       label: "Creative" },
  { value: "media",          label: "Media & Marketing" },
  { value: "healthcare",     label: "Healthcare" },
  { value: "security",       label: "Security" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "social",         label: "People & HR" },
  { value: "ai",            label: "AI & ML" },
  { value: "education",     label: "Education" },
  { value: "engineering",   label: "Engineering" },
  { value: "science",       label: "Science" },
  { value: "legal",         label: "Legal" },
  { value: "environment",   label: "Environment" },
  { value: "construction",  label: "Construction" },
  { value: "logistics",     label: "Logistics" },
  { value: "hospitality",   label: "Hospitality" },
  { value: "agriculture",   label: "Agriculture" },
  { value: "real-estate",   label: "Real Estate" },
  { value: "sports",        label: "Sports" },
  { value: "nonprofit",     label: "Nonprofit" },
  { value: "government",    label: "Government" },
  { value: "trades",        label: "Trades" },
];

export default function CareersPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = CAREERS_DATA.filter((career) => {
    const matchesQuery =
      query.trim() === "" ||
      career.title.toLowerCase().includes(query.toLowerCase()) ||
      career.description.toLowerCase().includes(query.toLowerCase()) ||
      career.required_skills.some((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      );
    const matchesCategory =
      activeCategory === "all" || career.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-8 pt-2 lg:pt-0 mt-4 lg:mt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Career Library
        </h1>
        <p className="text-sm text-slate-500">
          Explore {CAREERS_DATA.length} career paths with salaries, skills, and
          learning roadmaps.
        </p>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by career, skill, or keyword…"
        leftElement={<Search size={16} />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all border ${
              activeCategory === cat.value
                ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-400 font-medium">
        {filtered.length} career{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Career grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Search size={36} className="mx-auto text-slate-200 mb-4" />
          <p className="font-semibold text-slate-700 mb-1">No careers found</p>
          <p className="text-sm text-slate-500">
            Try a different search term or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((career) => (
            <Link
              key={career.id}
              href={`/careers/${career.id}`}
              className="group bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex flex-col gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <CareerIcon careerId={career.id} size={18} className="text-brand-600" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="slate" size="sm">{categoryLabels[career.category]}</Badge>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={11} className={demandColors[career.job_demand]} />
                    <span className={`text-xs font-medium ${demandColors[career.job_demand]}`}>
                      {demandLabels[career.job_demand]}
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
                {career.required_skills.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {career.required_skills.length > 5 && (
                  <span className="text-xs text-slate-400 px-1 py-0.5">
                    +{career.required_skills.length - 5} more
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
          ))}
        </div>
      )}
    </div>
  );
}
