// ─────────────────────────────────────────────
// PathWise AI Agent — Core Types
// ─────────────────────────────────────────────

// ── Tool result wrapper ───────────────────────
// Every tool returns this shape.
// source tells Claude (and the frontend) where the data came from.
export interface ToolResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  /** Where the data originated */
  source: "database" | "memory" | "computed";
}

// ── Tool names ────────────────────────────────
export type ToolName =
  | "getStudentProfile"
  | "getTopCareerMatches"
  | "getCareerDetails"
  | "getRoadmap"
  | "getSkillGapAnalysis"
  | "compareCareers"
  | "explainRecommendation";

// ── Tool input types ──────────────────────────

export interface GetStudentProfileInput {
  userId: string;
}

export interface GetTopCareerMatchesInput {
  userId: string;
  limit?: number;
}

export interface GetCareerDetailsInput {
  /** Can be an ID (frontend-developer), slug, or a name like "Data Analyst" */
  careerId: string;
}

export interface GetRoadmapInput {
  careerId: string;
}

export interface GetSkillGapAnalysisInput {
  userId: string;
  careerId: string;
}

export interface CompareCareersInput {
  userId: string;
  /** 2–4 career IDs or names */
  careerIds: string[];
}

export interface ExplainRecommendationInput {
  userId: string;
  careerId: string;
}

// ── Tool output types ─────────────────────────

export interface StudentProfileData {
  userId: string;
  interests: string[];
  skills: string[];
  weakAreas: string[];
  workStyle: string;
  learningMode: string;
  availabilityPerWeek: string | number;
  careerGoals: string[];
  industries: string[];
}

export interface CareerMatchData {
  careerId: string;
  title: string;
  category: string;
  score: number;
  matchingSkills: string[];
  skillGaps: string[];
  reasons: string[];
  demandLevel: string;
  salaryMin: number;
  salaryMax: number;
  timeToReady: string;
}

export interface CareerDetailsData {
  id: string;
  title: string;
  category: string;
  description: string;
  overview: string;
  salaryMin: number;
  salaryMax: number;
  demandLevel: string;
  requiredSkills: string[];
  tools: string[];
  possibleRoles: string[];
  industries: string[];
  workStyles: string[];
  timeToReady: string;
}

export interface RoadmapStepData {
  title: string;
  description: string;
  type: string;
  estimatedHours: number;
  resources: string[];
}

export interface RoadmapPhaseData {
  phaseNumber: number;
  title: string;
  description: string;
  durationWeeks: number;
  skillsCovered: string[];
  steps: RoadmapStepData[];
}

export interface RoadmapData {
  careerId: string;
  careerTitle: string;
  totalWeeks: number;
  phases: RoadmapPhaseData[];
}

export interface SkillGapData {
  careerId: string;
  careerTitle: string;
  matchedSkills: string[];
  missingSkills: string[];
  percentageFit: number;
  /** Top skills to learn first, sorted by career importance */
  prioritySkills: string[];
  /** Rough time estimate to close the gap */
  timeEstimate: string;
}

export interface CareerComparisonEntry {
  id: string;
  title: string;
  score: number;
  salaryMin: number;
  salaryMax: number;
  demandLevel: string;
  matchedSkills: string[];
  missingSkills: string[];
  timeToReady: string;
}

export interface CareerComparisonData {
  careers: CareerComparisonEntry[];
  commonSkills: string[];
  /** Career ID with the highest match score */
  winner: string;
  winnerTitle: string;
  summary: string;
}

export interface ExplainRecommendationData {
  careerId: string;
  careerTitle: string;
  score: number;
  reasons: string[];
  matchedSkills: string[];
  missingSkills: string[];
  scoreNote: string;
}

// ── Intent detection ──────────────────────────

export interface DetectedIntent {
  tools: ToolName[];
  params: {
    careerId?: string;
    careerIds?: string[];
    limit?: number;
  };
}

// ── Agent context ─────────────────────────────
// Built before calling Claude; holds all tool results and the formatted context block.

export interface AgentContext {
  userId: string;
  userMessage: string;
  intent: DetectedIntent;
  profile: StudentProfileData | null;
  topMatches: CareerMatchData[] | null;
  careerDetails: CareerDetailsData | null;
  roadmap: RoadmapData | null;
  skillGap: SkillGapData | null;
  comparison: CareerComparisonData | null;
  explanation: ExplainRecommendationData | null;
  /** Formatted string injected into the system prompt */
  contextBlock: string;
}

// ── Chat message ──────────────────────────────

export interface ChatApiMessage {
  role: "user" | "assistant";
  content: string;
}
