// ─── Documentation type system ───────────────────────────────────────────────

export type CalloutVariant = "info" | "warning" | "tip" | "danger";

export type DocBlock =
  | { type: "paragraph"; text: string; lead?: boolean }
  | { type: "heading2"; text: string; id: string }
  | { type: "heading3"; text: string; id: string }
  | { type: "heading4"; text: string }
  | { type: "code"; language: string; code: string; filename?: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "callout"; variant: CalloutVariant; title?: string; text: string }
  | { type: "stats"; items: { value: string; label: string; sub?: string }[] }
  | { type: "quote"; text: string; author?: string; role?: string }
  | { type: "divider" }
  | { type: "image"; src: string; alt: string; caption?: string };

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface DocSection {
  id: string;
  title: string;
  blocks: DocBlock[];
}

export interface DocChapter {
  id: string;
  number: string;
  title: string;
  description: string;
  readingMinutes: number;
  sections: DocSection[];
}

export interface SearchResult {
  chapterId: string;
  chapterTitle: string;
  sectionId: string;
  sectionTitle: string;
  excerpt: string;
}
