/**
 * PathWise — Airtable Client
 * ===========================
 * Thin wrapper around the Airtable REST API using fetch (edge-compatible).
 * We do NOT use the `airtable` npm SDK because it requires Node.js globals.
 * Instead we call the Airtable REST API directly — works on Cloudflare Workers.
 *
 * Tables required in your Airtable base:
 *
 *   Profiles
 *     - userId        (Single line text) ← unique identifier, indexed
 *     - name          (Single line text)
 *     - email         (Email)
 *     - interests     (Long text — JSON array)
 *     - skills        (Long text — JSON array)
 *     - weakAreas     (Long text — JSON array)
 *     - workStyle     (Single line text)
 *     - learningMode  (Single line text)
 *     - availability  (Single line text)
 *     - careerGoals   (Long text — JSON array)
 *     - industries    (Long text — JSON array)
 *     - createdAt     (Date)
 *     - updatedAt     (Date)
 *
 *   Recommendations
 *     - userId        (Single line text)
 *     - careerId      (Single line text)
 *     - careerTitle   (Single line text)
 *     - matchScore    (Number)
 *     - matchReasons  (Long text — JSON array)
 *     - matchingSkills(Long text — JSON array)
 *     - skillGaps     (Long text — JSON array)
 *     - source        (Single line text — "ml" | "claude")
 *     - generatedAt   (Date)
 *
 *   Roadmaps
 *     - userId        (Single line text)
 *     - careerId      (Single line text)
 *     - roadmapJson   (Long text — full JSON of personalized roadmap)
 *     - generatedAt   (Date)
 *
 *   RoadmapProgress
 *     - userId        (Single line text)
 *     - careerId      (Single line text)
 *     - completedSteps(Long text — JSON array of step IDs)
 *     - updatedAt     (Date)
 *
 *   Feedback
 *     - userId        (Single line text)
 *     - careerId      (Single line text)
 *     - rating        (Single line text — "helpful" | "not_helpful")
 *     - context       (Single line text — e.g. "recommendation")
 *     - createdAt     (Date)
 */

const BASE_URL = "https://api.airtable.com/v0";

function getHeaders() {
  const token = process.env.AIRTABLE_API_KEY;
  if (!token) throw new Error("AIRTABLE_API_KEY is not set.");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function getBaseId() {
  const id = process.env.AIRTABLE_BASE_ID;
  if (!id) throw new Error("AIRTABLE_BASE_ID is not set.");
  return id;
}

// ─────────────────────────────────────────────
// Core fetch helpers
// ─────────────────────────────────────────────

async function airtableFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE_URL}/${getBaseId()}${path}`, {
    ...init,
    headers: { ...getHeaders(), ...(init?.headers ?? {}) },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Airtable error ${res.status}: ${JSON.stringify(err)}`);
  }

  return res.json();
}

// List records with an optional filter formula
async function listRecords<T>(
  table: string,
  formula?: string
): Promise<{ id: string; fields: T }[]> {
  const params = new URLSearchParams();
  if (formula) params.set("filterByFormula", formula);
  const data = await airtableFetch(`/${encodeURIComponent(table)}?${params}`);
  return data.records ?? [];
}

// Create a new record
async function createRecord<T>(
  table: string,
  fields: T
): Promise<{ id: string; fields: T }> {
  return airtableFetch(`/${encodeURIComponent(table)}`, {
    method: "POST",
    body: JSON.stringify({ fields }),
  });
}

// Update an existing record (PATCH — only specified fields)
async function updateRecord<T>(
  table: string,
  recordId: string,
  fields: Partial<T>
): Promise<{ id: string; fields: T }> {
  return airtableFetch(`/${encodeURIComponent(table)}/${recordId}`, {
    method: "PATCH",
    body: JSON.stringify({ fields }),
  });
}

// Delete a record
async function deleteRecord(table: string, recordId: string): Promise<void> {
  await airtableFetch(`/${encodeURIComponent(table)}/${recordId}`, {
    method: "DELETE",
  });
}

// ─────────────────────────────────────────────
// Profile helpers
// ─────────────────────────────────────────────

export interface AirtableProfile {
  userId: string;
  name: string;
  email: string;
  interests: string;    // JSON string
  skills: string;       // JSON string
  weakAreas: string;    // JSON string
  workStyle: string;
  learningMode: string;
  availability: string;
  careerGoals: string;  // JSON string
  industries: string;   // JSON string
  createdAt: string;
  updatedAt: string;
}

export interface ProfileData {
  userId: string;
  name: string;
  email: string;
  interests: string[];
  skills: string[];
  weakAreas: string[];
  workStyle: string;
  learningMode: string;
  availability: string;
  careerGoals: string[];
  industries: string[];
  createdAt?: string;
  updatedAt?: string;
}

function deserializeProfile(fields: AirtableProfile): ProfileData {
  return {
    userId:      fields.userId,
    name:        fields.name ?? "",
    email:       fields.email ?? "",
    interests:   JSON.parse(fields.interests   || "[]"),
    skills:      JSON.parse(fields.skills      || "[]"),
    weakAreas:   JSON.parse(fields.weakAreas   || "[]"),
    workStyle:   fields.workStyle   ?? "hybrid",
    learningMode: fields.learningMode ?? "self_paced",
    availability: fields.availability ?? "part_time",
    careerGoals: JSON.parse(fields.careerGoals || "[]"),
    industries:  JSON.parse(fields.industries  || "[]"),
    createdAt:   fields.createdAt,
    updatedAt:   fields.updatedAt,
  };
}

/** Get a user's profile by Firebase UID. Returns null if not found. */
export async function getProfile(userId: string): Promise<ProfileData | null> {
  const records = await listRecords<AirtableProfile>(
    "Profiles",
    `{userId} = "${userId}"`
  );
  if (records.length === 0) return null;
  return deserializeProfile(records[0].fields);
}

/** Upsert (create or update) a user's profile. */
export async function upsertProfile(data: ProfileData): Promise<void> {
  const records = await listRecords<AirtableProfile>(
    "Profiles",
    `{userId} = "${data.userId}"`
  );

  const fields: AirtableProfile = {
    userId:      data.userId,
    name:        data.name,
    email:       data.email,
    interests:   JSON.stringify(data.interests),
    skills:      JSON.stringify(data.skills),
    weakAreas:   JSON.stringify(data.weakAreas),
    workStyle:   data.workStyle,
    learningMode: data.learningMode,
    availability: data.availability,
    careerGoals: JSON.stringify(data.careerGoals),
    industries:  JSON.stringify(data.industries),
    createdAt:   records[0]?.fields.createdAt ?? new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  };

  if (records.length > 0) {
    await updateRecord("Profiles", records[0].id, fields);
  } else {
    await createRecord("Profiles", fields);
  }
}

// ─────────────────────────────────────────────
// Recommendations helpers
// ─────────────────────────────────────────────

export interface AirtableRecommendation {
  userId: string;
  careerId: string;
  careerTitle: string;
  matchScore: number;
  matchReasons: string;   // JSON string
  matchingSkills: string; // JSON string
  skillGaps: string;      // JSON string
  source: string;
  generatedAt: string;
}

export interface RecommendationData {
  userId: string;
  careerId: string;
  careerTitle: string;
  matchScore: number;
  matchReasons: string[];
  matchingSkills: string[];
  skillGaps: string[];
  source: "ml" | "claude";
  generatedAt: string;
}

function deserializeRec(fields: AirtableRecommendation): RecommendationData {
  return {
    userId:         fields.userId,
    careerId:       fields.careerId,
    careerTitle:    fields.careerTitle,
    matchScore:     fields.matchScore,
    matchReasons:   JSON.parse(fields.matchReasons   || "[]"),
    matchingSkills: JSON.parse(fields.matchingSkills || "[]"),
    skillGaps:      JSON.parse(fields.skillGaps      || "[]"),
    source:         (fields.source ?? "ml") as "ml" | "claude",
    generatedAt:    fields.generatedAt,
  };
}

/** Get all stored recommendations for a user. */
export async function getRecommendations(userId: string): Promise<RecommendationData[]> {
  const records = await listRecords<AirtableRecommendation>(
    "Recommendations",
    `{userId} = "${userId}"`
  );
  return records
    .map((r) => deserializeRec(r.fields))
    .sort((a, b) => b.matchScore - a.matchScore);
}

/** Replace all recommendations for a user (delete old, insert new). */
export async function saveRecommendations(
  userId: string,
  recommendations: Omit<RecommendationData, "userId">[],
  source: "ml" | "claude"
): Promise<void> {
  // Delete existing recommendations for this user
  const existing = await listRecords<AirtableRecommendation>(
    "Recommendations",
    `{userId} = "${userId}"`
  );
  await Promise.all(existing.map((r) => deleteRecord("Recommendations", r.id)));

  // Insert new ones
  const now = new Date().toISOString();
  await Promise.all(
    recommendations.map((rec) =>
      createRecord<AirtableRecommendation>("Recommendations", {
        userId,
        careerId:       rec.careerId,
        careerTitle:    rec.careerTitle,
        matchScore:     rec.matchScore,
        matchReasons:   JSON.stringify(rec.matchReasons),
        matchingSkills: JSON.stringify(rec.matchingSkills),
        skillGaps:      JSON.stringify(rec.skillGaps),
        source,
        generatedAt:    now,
      })
    )
  );
}

// ─────────────────────────────────────────────
// Roadmap helpers
// ─────────────────────────────────────────────

export interface AirtableRoadmap {
  userId: string;
  careerId: string;
  roadmapJson: string;  // full JSON string of PersonalizedRoadmap
  generatedAt: string;
}

/** Get a stored personalized roadmap for a user+career. Returns null if not found. */
export async function getRoadmap(userId: string, careerId: string): Promise<object | null> {
  const records = await listRecords<AirtableRoadmap>(
    "Roadmaps",
    `AND({userId} = "${userId}", {careerId} = "${careerId}")`
  );
  if (records.length === 0) return null;
  try {
    return JSON.parse(records[0].fields.roadmapJson);
  } catch {
    return null;
  }
}

/** Save a personalized roadmap for a user+career (upsert). */
export async function saveRoadmap(
  userId: string,
  careerId: string,
  roadmap: object
): Promise<void> {
  const existing = await listRecords<AirtableRoadmap>(
    "Roadmaps",
    `AND({userId} = "${userId}", {careerId} = "${careerId}")`
  );

  const fields: AirtableRoadmap = {
    userId,
    careerId,
    roadmapJson: JSON.stringify(roadmap),
    generatedAt: new Date().toISOString(),
  };

  if (existing.length > 0) {
    await updateRecord("Roadmaps", existing[0].id, fields);
  } else {
    await createRecord("Roadmaps", fields);
  }
}

// ─────────────────────────────────────────────
// Roadmap progress helpers
// ─────────────────────────────────────────────

export interface AirtableRoadmapProgress {
  userId: string;
  careerId: string;
  completedSteps: string;  // JSON array of step IDs
  updatedAt: string;
}

/** Get completed step IDs for a user+career. Returns empty array if none. */
export async function getProgress(userId: string, careerId: string): Promise<string[]> {
  const records = await listRecords<AirtableRoadmapProgress>(
    "RoadmapProgress",
    `AND({userId} = "${userId}", {careerId} = "${careerId}")`
  );
  if (records.length === 0) return [];
  try {
    return JSON.parse(records[0].fields.completedSteps || "[]");
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────
// Feedback helpers
// ─────────────────────────────────────────────

/** Save a thumbs up/down feedback entry for a recommendation. */
export async function saveFeedback(
  userId: string,
  careerId: string,
  rating: "helpful" | "not_helpful",
  context: string = "recommendation"
): Promise<void> {
  await createRecord("Feedback", {
    userId,
    careerId,
    rating,
    context,
    createdAt: new Date().toISOString(),
  });
}

/** Save/update completed steps for a user+career (upsert). */
export async function saveProgress(
  userId: string,
  careerId: string,
  completedSteps: string[]
): Promise<void> {
  const existing = await listRecords<AirtableRoadmapProgress>(
    "RoadmapProgress",
    `AND({userId} = "${userId}", {careerId} = "${careerId}")`
  );

  const fields: AirtableRoadmapProgress = {
    userId,
    careerId,
    completedSteps: JSON.stringify(completedSteps),
    updatedAt: new Date().toISOString(),
  };

  if (existing.length > 0) {
    await updateRecord("RoadmapProgress", existing[0].id, fields);
  } else {
    await createRecord("RoadmapProgress", fields);
  }
}
