import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { JobDemand, SkillLevel } from "@/lib/types";

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format salary range for display
export function formatSalary(min: number, max: number): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  return `${fmt(min)} - ${fmt(max)}`;
}

// Match score to label + color
export function getMatchLabel(score: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (score >= 80)
    return { label: "Excellent Match", color: "text-emerald-700", bg: "bg-emerald-50" };
  if (score >= 65)
    return { label: "Strong Match", color: "text-blue-700", bg: "bg-blue-50" };
  if (score >= 50)
    return { label: "Good Match", color: "text-brand-700", bg: "bg-brand-50" };
  if (score >= 35)
    return { label: "Partial Match", color: "text-amber-700", bg: "bg-amber-50" };
  return { label: "Exploratory", color: "text-slate-600", bg: "bg-slate-50" };
}

// Job demand display
export function getJobDemandLabel(demand: JobDemand): {
  label: string;
  color: string;
} {
  const map: Record<JobDemand, { label: string; color: string }> = {
    very_high: { label: "Very High Demand", color: "text-emerald-700" },
    high: { label: "High Demand", color: "text-blue-700" },
    moderate: { label: "Moderate Demand", color: "text-amber-700" },
    low: { label: "Low Demand", color: "text-slate-500" },
  };
  return map[demand];
}

// Skill level display
export function getSkillLevelLabel(level: SkillLevel): string {
  const map: Record<SkillLevel, string> = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };
  return map[level];
}

// Student level display
export function getStudentLevelLabel(level: string): string {
  const map: Record<string, string> = {
    year_1: "1st Year",
    year_2: "2nd Year",
    year_3: "3rd Year",
    year_4: "4th Year",
    postgraduate: "Postgraduate",
    recent_graduate: "Recent Graduate",
    professional: "Working Professional",
  };
  return map[level] ?? level;
}

// Work style display
export function getWorkStyleLabel(style: string): string {
  const map: Record<string, string> = {
    remote: "Remote",
    office: "In-Office",
    hybrid: "Hybrid",
    flexible: "Flexible",
  };
  return map[style] ?? style;
}

// Learning mode display
export function getLearningModeLabel(mode: string): string {
  const map: Record<string, string> = {
    self_paced: "Self-Paced",
    structured: "Structured Program",
    bootcamp: "Bootcamp Style",
    university: "University Courses",
    mentorship: "Mentorship-Based",
  };
  return map[mode] ?? mode;
}

// Availability display
export function getAvailabilityLabel(avail: string): string {
  const map: Record<string, string> = {
    full_time: "Full-Time",
    part_time: "Part-Time",
    weekends: "Weekends Only",
    evenings: "Evenings Only",
    limited: "Very Limited",
  };
  return map[avail] ?? avail;
}

// Relative time formatting
export function relativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// Calculate roadmap completion percentage
export function calcCompletionPercent(
  completedSteps: string[],
  totalSteps: number
): number {
  if (totalSteps === 0) return 0;
  return Math.round((completedSteps.length / totalSteps) * 100);
}

// Capitalize first letter
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}
