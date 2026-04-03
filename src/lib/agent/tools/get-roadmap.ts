// ─────────────────────────────────────────────
// Tool: getRoadmap
//
// Returns the personalised learning roadmap for a given career.
// If a roadmap has been generated and cached in Airtable for this user
// it is returned directly. Otherwise a brief phase overview is computed
// from the career's required skills and the user is directed to the
// roadmap page to trigger full generation.
// ─────────────────────────────────────────────

import { CAREERS_DATA } from "@/lib/recommendation/careers-data";
import type { ToolResult, RoadmapData, RoadmapPhaseData } from "../types";
import { resolveCareer } from "./get-career-details";

export async function getRoadmap(
  careerId: string,
  userId?: string
): Promise<ToolResult<RoadmapData>> {
  const career = resolveCareer(careerId);

  if (!career) {
    const available = CAREERS_DATA.slice(0, 8)
      .map((c) => c.id)
      .join(", ");
    return {
      success: false,
      error: `No career found for "${careerId}". Try a career ID like: ${available}...`,
      source: "memory",
    };
  }

  // Try to return a cached personalized roadmap from Airtable
  if (userId) {
    try {
      const { getRoadmap: getAirtableRoadmap } = await import("@/lib/airtable/client");
      const cached = await getAirtableRoadmap(userId, career.id);
      if (cached) {
        const roadmap = cached as {
          careerTitle: string;
          totalWeeks: number;
          phases: Array<{
            id: string;
            phaseNumber: number;
            title: string;
            description: string;
            durationWeeks: number;
            skillsCovered: string[];
            steps: Array<{
              id: string;
              title: string;
              description: string;
              resources: Array<{ title: string; type: string }>;
            }>;
          }>;
        };
        const phases: RoadmapPhaseData[] = roadmap.phases.map((p) => ({
          phaseNumber:   p.phaseNumber,
          title:         p.title,
          description:   p.description,
          durationWeeks: p.durationWeeks,
          skillsCovered: p.skillsCovered,
          steps: p.steps.map((s) => ({
            title:          s.title,
            description:    s.description,
            type:           "lesson",
            estimatedHours: 5,
            resources:      s.resources.map((r) => r.title),
          })),
        }));
        return {
          success: true,
          data: {
            careerId:    career.id,
            careerTitle: roadmap.careerTitle,
            totalWeeks:  roadmap.totalWeeks,
            phases,
          },
          source: "database",
        };
      }
    } catch {
      // Airtable unavailable — fall through to computed overview
    }
  }

  // Compute a phase overview from the career's required skills
  const skills = career.required_skills;
  const chunk  = Math.ceil(skills.length / 4);
  const phaseNames  = ["Foundations", "Core Skills", "Advanced Practice", "Portfolio & Job Prep"];
  const phaseWeeks  = [4, 6, 6, 4];
  const computedPhases: RoadmapPhaseData[] = [];

  for (let i = 0; i < 4; i++) {
    const covered = skills.slice(chunk * i, chunk * (i + 1));
    if (covered.length === 0) continue;
    computedPhases.push({
      phaseNumber:   i + 1,
      title:         phaseNames[i],
      description:   `Build ${covered.join(", ")} skills and apply them in practical exercises.`,
      durationWeeks: phaseWeeks[i],
      skillsCovered: covered,
      steps: [],
    });
  }

  const totalWeeks = computedPhases.reduce((a, p) => a + p.durationWeeks, 0);

  return {
    success: true,
    data: {
      careerId:    career.id,
      careerTitle: career.title,
      totalWeeks,
      phases:      computedPhases,
    },
    source: "computed",
  };
}
