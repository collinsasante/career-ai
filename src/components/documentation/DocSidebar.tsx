"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_CHAPTERS } from "@/lib/docs";
import type { DocChapter } from "@/lib/docs/types";

interface DocSidebarProps {
  activeChapterId: string;
  activeSectionId: string;
  onNavigate: (chapterId: string, sectionId: string) => void;
  dark?: boolean;
}

function ChapterItem({
  chapter,
  isActive,
  activeSectionId,
  onNavigate,
}: {
  chapter: DocChapter;
  isActive: boolean;
  activeSectionId: string;
  onNavigate: (chapterId: string, sectionId: string) => void;
}) {
  const [open, setOpen] = useState(isActive);

  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  return (
    <div>
      {/* Chapter header button */}
      <button
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
          isActive
            ? "bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={cn(
              "flex-shrink-0 w-5 h-5 rounded text-2xs font-bold flex items-center justify-center",
              isActive
                ? "bg-brand-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
            )}
          >
            {chapter.number}
          </span>
          <span className="truncate text-left leading-tight">{chapter.title}</span>
        </div>
        <ChevronDown
          size={14}
          className={cn(
            "flex-shrink-0 transition-transform text-slate-400",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Section links */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-1 pb-2 pl-4 space-y-0.5 border-l border-slate-200 dark:border-slate-700 ml-4 mt-1">
              {chapter.sections.map((section) => {
                const isActiveSection = section.id === activeSectionId;
                return (
                  <li key={section.id}>
                    <button
                      onClick={() => onNavigate(chapter.id, section.id)}
                      className={cn(
                        "w-full text-left text-xs leading-relaxed px-2.5 py-1.5 rounded-md transition-all block",
                        isActiveSection
                          ? "text-brand-700 dark:text-brand-300 font-medium bg-brand-50 dark:bg-brand-950/40"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      )}
                    >
                      {section.title}
                    </button>
                  </li>
                );
              })}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DocSidebar({
  activeChapterId,
  activeSectionId,
  onNavigate,
}: DocSidebarProps) {
  return (
    <nav className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <BookOpen size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">PathWise</p>
            <p className="text-2xs text-slate-400 mt-0.5">Documentation v1.0</p>
          </div>
        </div>
      </div>

      {/* Chapter list */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        <p className="text-2xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
          Contents
        </p>
        {ALL_CHAPTERS.map((chapter) => (
          <ChapterItem
            key={chapter.id}
            chapter={chapter}
            isActive={chapter.id === activeChapterId}
            activeSectionId={activeSectionId}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-2xs text-slate-400">
          <Clock size={11} />
          <span>
            {ALL_CHAPTERS.reduce((sum, c) => sum + c.readingMinutes, 0)} min total read
          </span>
        </div>
      </div>
    </nav>
  );
}
