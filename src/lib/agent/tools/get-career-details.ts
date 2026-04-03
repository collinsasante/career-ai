// ─────────────────────────────────────────────
// Tool: getCareerDetails
//
// Looks up a career by ID, slug, or title in the
// PathWise career library. Supports fuzzy title
// matching so the agent can resolve user phrasing
// like "data science" → "Data Scientist".
// ─────────────────────────────────────────────

import { CAREERS_DATA } from "@/lib/recommendation/careers-data";
import type { ToolResult, CareerDetailsData } from "../types";

function norm(s: string) {
  return s.toLowerCase().trim();
}

/**
 * Try to resolve a user-provided career name/id to
 * a career in the library. Returns the first match.
 */
export function resolveCareer(query: string) {
  const q = norm(query);

  // 1. Exact ID / slug match
  const byId = CAREERS_DATA.find((c) => c.id === q || c.slug === q);
  if (byId) return byId;

  // 2. Exact title match (case-insensitive)
  const byTitle = CAREERS_DATA.find((c) => norm(c.title) === q);
  if (byTitle) return byTitle;

  // 3. Title contains query
  const byContains = CAREERS_DATA.find((c) => norm(c.title).includes(q));
  if (byContains) return byContains;

  // 4. Query contains title (e.g. "frontend dev" matches "Frontend Developer")
  const byReverse = CAREERS_DATA.find((c) =>
    q.includes(norm(c.title).split(" ")[0]) // first word of title
  );
  if (byReverse) return byReverse;

  return null;
}

export async function getCareerDetails(
  careerId: string
): Promise<ToolResult<CareerDetailsData>> {
  const career = resolveCareer(careerId);

  if (!career) {
    return {
      success: false,
      error: `"${careerId}" was not found in PathWise's career library. Available fields: technology, healthcare, law, finance, engineering, creative, education, science, media, and more.`,
      source: "memory",
    };
  }

  return {
    success: true,
    data: {
      id: career.id,
      title: career.title,
      category: career.category,
      description: career.description,
      overview: career.overview,
      salaryMin: career.avg_salary_min,
      salaryMax: career.avg_salary_max,
      demandLevel: career.job_demand,
      requiredSkills: career.required_skills,
      tools: career.tools,
      possibleRoles: career.possible_roles,
      industries: career.industries,
      workStyles: career.work_styles,
      timeToReady: career.time_to_ready,
    },
    source: "memory",
  };
}
