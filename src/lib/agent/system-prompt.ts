// ─────────────────────────────────────────────
// PathWise Agent — System Prompt Builder
//
// Produces a strong, grounded system prompt that
// combines persona, guardrails, and the formatted
// platform data block from tool results.
// ─────────────────────────────────────────────

import type { AgentContext } from "./types";
import { formatSalaryRange, DEMAND_LABELS } from "./tools/helpers";

// ── Base persona prompt ───────────────────────
const BASE_PROMPT = `You are **PathWise Advisor** — a knowledgeable, grounded career guidance counsellor embedded in the PathWise platform.

## Who you work with
You help students (school leavers, undergraduates, postgraduates), recent graduates, career changers, and working professionals at any stage — across every industry and field: technology, healthcare, law, finance, engineering, creative arts, science, education, media, and more.

## How you behave
- When platform data is available in <platform_context>, **always ground your answer in that data first**
- Clearly signal the difference: "Based on your profile..." (platform data) vs "Generally speaking..." (general knowledge)
- Be concise, specific, and practical — avoid vague platitudes and filler phrases
- Use bullet points or numbered steps for lists of skills, actions, or comparisons
- Use headers only for longer multi-section responses
- End with a clear, actionable next step when appropriate

## What you avoid
- Never invent salary figures, required skills, or job data that is not in your context
- Never guarantee outcomes ("you will definitely get a job" is not something you say)
- Never claim a career path is easy or straightforward without acknowledging the real effort involved
- Stay strictly within career guidance — if asked something off-topic, acknowledge it and gently redirect
- Never fabricate platform data: if you do not have data for a specific career, say so clearly

## Tone
Professional, warm, honest. Like a knowledgeable mentor who tells you what you need to hear, not just what you want to hear.`;

// ── Context block formatters ──────────────────

function formatProfile(ctx: AgentContext): string {
  const p = ctx.profile;
  if (!p) return "";

  const lines: string[] = [
    `**User Profile**`,
    `- Skills: ${p.skills.length > 0 ? p.skills.join(", ") : "Not specified"}`,
    `- Interests: ${p.interests.length > 0 ? p.interests.join(", ") : "Not specified"}`,
    `- Weak areas: ${p.weakAreas.length > 0 ? p.weakAreas.join(", ") : "None listed"}`,
    `- Preferred work style: ${p.workStyle}`,
    `- Learning mode: ${p.learningMode}`,
    `- Availability: ${p.availabilityPerWeek}`,
    `- Career goals: ${p.careerGoals.length > 0 ? p.careerGoals.join(", ") : "Not specified"}`,
    `- Industries of interest: ${p.industries.length > 0 ? p.industries.join(", ") : "Not specified"}`,
  ];

  return lines.join("\n");
}

function formatTopMatches(ctx: AgentContext): string {
  if (!ctx.topMatches || ctx.topMatches.length === 0) return "";

  const header = `**Top Career Matches (from PathWise engine)**`;
  const entries = ctx.topMatches.map((m, i) =>
    [
      `${i + 1}. **${m.title}** — ${m.score}% match`,
      `   - Demand: ${DEMAND_LABELS[m.demandLevel] ?? m.demandLevel}`,
      `   - Salary: ${formatSalaryRange(m.salaryMin, m.salaryMax)}`,
      `   - Time to ready: ${m.timeToReady}`,
      `   - Matched skills: ${m.matchingSkills.length > 0 ? m.matchingSkills.join(", ") : "None yet"}`,
      `   - Skill gaps: ${m.skillGaps.length > 0 ? m.skillGaps.slice(0, 4).join(", ") : "None identified"}`,
      `   - Why it fits: ${m.reasons.join(" ")}`,
    ].join("\n")
  );

  return [header, ...entries].join("\n\n");
}

function formatCareerDetails(ctx: AgentContext): string {
  const c = ctx.careerDetails;
  if (!c) return "";

  return [
    `**Career Detail: ${c.title}**`,
    `- Field: ${c.category}`,
    `- Description: ${c.description}`,
    `- Overview: ${c.overview}`,
    `- Salary range: ${formatSalaryRange(c.salaryMin, c.salaryMax)}`,
    `- Job demand: ${DEMAND_LABELS[c.demandLevel] ?? c.demandLevel}`,
    `- Time to job-ready: ${c.timeToReady}`,
    `- Required skills: ${c.requiredSkills.join(", ")}`,
    `- Common tools: ${c.tools.join(", ")}`,
    `- Possible job titles: ${c.possibleRoles.join(", ")}`,
    `- Active industries: ${c.industries.join(", ")}`,
    `- Work styles: ${c.workStyles.join(", ")}`,
  ].join("\n");
}

function formatRoadmap(ctx: AgentContext): string {
  const r = ctx.roadmap;
  if (!r) return "";

  const phaseLines = r.phases.map((p) => {
    const stepLines = p.steps
      .slice(0, 3)
      .map((s) => `     • ${s.title} (${s.estimatedHours}h, ${s.type})`)
      .join("\n");
    return [
      `  Phase ${p.phaseNumber}: **${p.title}** (${p.durationWeeks} weeks)`,
      `  Skills: ${p.skillsCovered.join(", ")}`,
      stepLines,
    ].join("\n");
  });

  return [
    `**Learning Roadmap: ${r.careerTitle}** (${r.totalWeeks} weeks total)`,
    ...phaseLines,
  ].join("\n\n");
}

function formatSkillGap(ctx: AgentContext): string {
  const g = ctx.skillGap;
  if (!g) return "";

  return [
    `**Skill Gap Analysis: ${g.careerTitle}**`,
    `- Overall fit: ${g.percentageFit}%`,
    `- Skills you already have: ${g.matchedSkills.length > 0 ? g.matchedSkills.join(", ") : "None matched yet"}`,
    `- Skills you need to build: ${g.missingSkills.length > 0 ? g.missingSkills.join(", ") : "None — you're already well-positioned"}`,
    `- Priority skills to tackle first: ${g.prioritySkills.length > 0 ? g.prioritySkills.join(", ") : "N/A"}`,
    `- Estimated time to close the gap: ${g.timeEstimate}`,
  ].join("\n");
}

function formatComparison(ctx: AgentContext): string {
  const cmp = ctx.comparison;
  if (!cmp) return "";

  const rows = cmp.careers.map(
    (c, i) =>
      `${i + 1}. **${c.title}** — ${c.score}% fit | ${formatSalaryRange(c.salaryMin, c.salaryMax)} | ${DEMAND_LABELS[c.demandLevel] ?? c.demandLevel} demand | Ready in ${c.timeToReady} | Gap: ${c.missingSkills.slice(0, 3).join(", ") || "minimal"}`
  );

  return [
    `**Career Comparison**`,
    ...rows,
    `Common skills across all: ${cmp.commonSkills.length > 0 ? cmp.commonSkills.join(", ") : "None in common"}`,
    `Best match for you: **${cmp.winnerTitle}**`,
    cmp.summary,
  ].join("\n");
}

function formatExplanation(ctx: AgentContext): string {
  const e = ctx.explanation;
  if (!e) return "";

  return [
    `**Why ${e.careerTitle} was recommended**`,
    `- Match score: ${e.score}%`,
    `- Reasons: ${e.reasons.join(" ")}`,
    `- Matched skills: ${e.matchedSkills.length > 0 ? e.matchedSkills.join(", ") : "None yet"}`,
    `- Skills to develop: ${e.missingSkills.length > 0 ? e.missingSkills.slice(0, 5).join(", ") : "None"}`,
    `- Score methodology: ${e.scoreNote}`,
  ].join("\n");
}

// ── Public builder ────────────────────────────

/**
 * Builds the final system prompt from the base persona
 * plus a <platform_context> block containing all tool results.
 * Claude is instructed to prefer this grounded data.
 */
export function buildSystemPrompt(ctx: AgentContext): string {
  const sections: string[] = [];

  if (ctx.profile) sections.push(formatProfile(ctx));
  if (ctx.topMatches) sections.push(formatTopMatches(ctx));
  if (ctx.careerDetails) sections.push(formatCareerDetails(ctx));
  if (ctx.roadmap) sections.push(formatRoadmap(ctx));
  if (ctx.skillGap) sections.push(formatSkillGap(ctx));
  if (ctx.comparison) sections.push(formatComparison(ctx));
  if (ctx.explanation) sections.push(formatExplanation(ctx));

  const hasContext = sections.length > 0;

  const contextBlock = hasContext
    ? `\n\n<platform_context>\nThe following data has been fetched from the PathWise platform specifically for this user and their question. Base your answer on this data. Do not contradict it.\n\n${sections.join("\n\n")}\n</platform_context>`
    : "\n\n<platform_context>\nNo platform data was loaded for this query. If you give general career advice, label it clearly as general knowledge, not PathWise platform data.\n</platform_context>";

  return BASE_PROMPT + contextBlock;
}
