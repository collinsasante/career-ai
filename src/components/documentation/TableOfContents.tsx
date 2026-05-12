"use client";

import { cn } from "@/lib/utils";
import type { TocEntry } from "@/lib/docs/types";

interface TableOfContentsProps {
  entries: TocEntry[];
  activeSectionId: string;
  onNavigate: (id: string) => void;
}

export function TableOfContents({ entries, activeSectionId, onNavigate }: TableOfContentsProps) {
  if (entries.length === 0) return null;

  return (
    <nav className="print:hidden">
      <p className="text-2xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
        On this page
      </p>
      <ul className="space-y-1">
        {entries.map((entry) => (
          <li key={entry.id}>
            <button
              onClick={() => onNavigate(entry.id)}
              className={cn(
                "w-full text-left text-xs leading-relaxed py-1 transition-colors block",
                entry.level === 3 && "pl-3",
                entry.id === activeSectionId
                  ? "text-brand-600 dark:text-brand-400 font-medium"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              )}
            >
              {entry.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
