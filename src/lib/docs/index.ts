import { chapter1 } from "./chapters/chapter1";
import { chapter2 } from "./chapters/chapter2";
import { chapter3 } from "./chapters/chapter3";
import { chapter4 } from "./chapters/chapter4";
import { chapter5 } from "./chapters/chapter5";
import { referencesChapter } from "./chapters/references";
import { appendicesChapter } from "./chapters/appendices";
import type { DocChapter, SearchResult, TocEntry } from "./types";

export { chapter1, chapter2, chapter3, chapter4, chapter5, referencesChapter, appendicesChapter };
export * from "./types";

export const ALL_CHAPTERS: DocChapter[] = [
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  referencesChapter,
  appendicesChapter,
];

export function getTocEntries(chapter: DocChapter): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const section of chapter.sections) {
    entries.push({ id: section.id, text: section.title, level: 2 });
    for (const block of section.blocks) {
      if (block.type === "heading2") {
        entries.push({ id: block.id, text: block.text, level: 2 });
      } else if (block.type === "heading3") {
        entries.push({ id: block.id, text: block.text, level: 3 });
      }
    }
  }
  return entries;
}

export function searchDocs(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const chapter of ALL_CHAPTERS) {
    for (const section of chapter.sections) {
      let matchFound = false;
      let excerpt = "";

      if (section.title.toLowerCase().includes(q)) {
        matchFound = true;
        excerpt = section.title;
      }

      for (const block of section.blocks) {
        if (matchFound) break;
        if (block.type === "paragraph" && block.text.toLowerCase().includes(q)) {
          matchFound = true;
          const idx = block.text.toLowerCase().indexOf(q);
          excerpt = "..." + block.text.slice(Math.max(0, idx - 60), idx + 100) + "...";
        }
        if (
          (block.type === "heading2" || block.type === "heading3") &&
          block.text.toLowerCase().includes(q)
        ) {
          matchFound = true;
          excerpt = block.text;
        }
      }

      if (matchFound) {
        results.push({
          chapterId: chapter.id,
          chapterTitle: `Chapter ${chapter.number}: ${chapter.title}`,
          sectionId: section.id,
          sectionTitle: section.title,
          excerpt,
        });
      }
    }
  }

  return results.slice(0, 12);
}
