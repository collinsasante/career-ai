// ─────────────────────────────────────────────
// PathWise — Roadmap Generator (ML-powered)
//
// Calls the PathWise scikit-learn ML API to generate a
// personalised learning roadmap. The model predicts the
// user's level (starter/builder/advanced) and a duration
// multiplier based on their skills and availability, then
// filters and adjusts a curated career template accordingly.
// ─────────────────────────────────────────────

// ── Types (shared with roadmap page + API route) ──────────

export interface RoadmapResource {
  title: string;
  type: "course" | "book" | "video" | "practice" | "project";
  url?: string;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  resources: RoadmapResource[];
}

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  description: string;
  durationWeeks: number;
  skillsCovered: string[];
  steps: RoadmapStep[];
}

export interface PersonalizedRoadmap {
  careerId: string;
  careerTitle: string;
  totalWeeks: number;
  userLevel?: "starter" | "builder" | "advanced";
  phases: RoadmapPhase[];
  generatedAt: string;
}

interface GeneratorInput {
  careerId: string;
  careerTitle: string;
  matchingSkills: string[];
  skillGaps: string[];
  learningMode?: string;
  availability?: string;
}

// ── Generator ─────────────────────────────────

export async function generatePersonalizedRoadmap(
  input: GeneratorInput
): Promise<PersonalizedRoadmap> {
  const {
    careerId,
    careerTitle,
    matchingSkills,
    skillGaps,
    learningMode = "self_paced",
    availability = "part_time",
  } = input;

  const mlApiUrl = process.env.ML_API_URL ?? "http://localhost:8000";

  const response = await fetch(`${mlApiUrl}/roadmap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      career_id:       careerId,
      matching_skills: matchingSkills,
      skill_gaps:      skillGaps,
      availability:    availability,
      learning_mode:   learningMode,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `ML roadmap API error ${response.status}: ${(err as { detail?: string }).detail ?? "unknown"}`
    );
  }

  // The ML API returns snake_case keys — normalise to camelCase
  const raw = await response.json() as {
    careerId?: string;
    career_id?: string;
    careerTitle?: string;
    career_title?: string;
    totalWeeks?: number;
    total_weeks?: number;
    userLevel?: string;
    user_level?: string;
    generatedAt?: string;
    generated_at?: string;
    phases: Array<{
      id: string;
      phase_number: number;
      title: string;
      description: string;
      duration_weeks: number;
      skills_covered: string[];
      steps: Array<{
        id: string;
        title: string;
        description: string;
        resources: RoadmapResource[];
      }>;
    }>;
  };

  const phases: RoadmapPhase[] = raw.phases.map((p) => ({
    id:            p.id,
    phaseNumber:   p.phase_number,
    title:         p.title,
    description:   p.description,
    durationWeeks: p.duration_weeks,
    skillsCovered: p.skills_covered ?? [],
    steps:         p.steps.map((s) => ({
      id:          s.id,
      title:       s.title,
      description: s.description,
      resources:   (s.resources ?? []).map((r) => ({
        ...r,
        url: (r.type === "video" || r.type === "course")
          ? `https://www.youtube.com/results?search_query=${encodeURIComponent(r.title)}`
          : r.url,
      })),
    })),
  }));

  return {
    careerId:    raw.career_id    ?? raw.careerId    ?? careerId,
    careerTitle: raw.career_title ?? raw.careerTitle ?? careerTitle,
    totalWeeks:  raw.total_weeks  ?? raw.totalWeeks  ?? 0,
    userLevel:   (raw.user_level  ?? raw.userLevel)  as PersonalizedRoadmap["userLevel"],
    phases,
    generatedAt: raw.generated_at ?? raw.generatedAt ?? new Date().toISOString(),
  };
}
