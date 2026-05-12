"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { ALL_CHAPTERS, getTocEntries, searchDocs } from "@/lib/docs";
import type { DocChapter } from "@/lib/docs/types";

import { DocNavbar } from "@/components/documentation/DocNavbar";
import { DocSidebar } from "@/components/documentation/DocSidebar";
import { DocContent } from "@/components/documentation/DocContent";
import { TableOfContents } from "@/components/documentation/TableOfContents";
import { SearchModal } from "@/components/documentation/SearchModal";
import { ReadingProgress } from "@/components/documentation/ReadingProgress";

export default function DocumentationPage() {
  const [dark, setDark] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState(ALL_CHAPTERS[0].id);
  const [activeSectionId, setActiveSectionId] = useState(ALL_CHAPTERS[0].sections[0]?.id ?? "");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load dark preference
  useEffect(() => {
    const saved = localStorage.getItem("pathwise-doc-dark");
    if (saved === "true") setDark(true);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Scroll-to-top button
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver to update active section from scroll
  useEffect(() => {
    const activeChapter = ALL_CHAPTERS.find((c) => c.id === activeChapterId);
    if (!activeChapter) return;

    const sectionIds = activeChapter.sections.map((s) => s.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSectionId(id);
        },
        { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [activeChapterId]);

  const toggleDark = () => {
    setDark((d) => {
      localStorage.setItem("pathwise-doc-dark", String(!d));
      return !d;
    });
  };

  const navigate = useCallback((chapterId: string, sectionId: string) => {
    const chapterChanged = chapterId !== activeChapterId;
    setActiveChapterId(chapterId);
    setActiveSectionId(sectionId);

    if (chapterChanged) {
      // Scroll to top of page, then section will be at top
      window.scrollTo({ top: 0 });
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeChapterId]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const activeChapter = ALL_CHAPTERS.find((c) => c.id === activeChapterId) ?? ALL_CHAPTERS[0];
  const activeSection = activeChapter.sections.find((s) => s.id === activeSectionId);
  const tocEntries = getTocEntries(activeChapter);

  return (
    <div className={cn("min-h-screen", dark && "dark")}>
      <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen transition-colors duration-200">
        <ReadingProgress />

        {/* Top navbar */}
        <DocNavbar
          dark={dark}
          onToggleDark={toggleDark}
          onSearchOpen={() => setSearchOpen(true)}
          activeChapterId={activeChapterId}
          activeSectionId={activeSectionId}
          activeChapterTitle={`Chapter ${activeChapter.number}: ${activeChapter.title}`}
          activeSectionTitle={activeSection?.title ?? ""}
          onNavigate={navigate}
        />

        {/* Three-column layout */}
        <div className="flex">
          {/* Left sidebar */}
          <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 sticky top-14 h-[calc(100vh-56px)] border-r border-slate-200 dark:border-slate-800 overflow-hidden print:hidden">
            <DocSidebar
              activeChapterId={activeChapterId}
              activeSectionId={activeSectionId}
              onNavigate={navigate}
            />
          </aside>

          {/* Main content */}
          <main id="doc-content" ref={contentRef} className="flex-1 min-w-0">
            <DocContent
              chapter={activeChapter}
              activeSectionId={activeSectionId}
              onChapterChange={navigate}
            />
          </main>

          {/* Right ToC panel */}
          <aside className="hidden xl:block w-56 flex-shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto px-4 py-6 print:hidden">
            <TableOfContents
              entries={tocEntries}
              activeSectionId={activeSectionId}
              onNavigate={(id) => {
                setActiveSectionId(id);
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
          </aside>
        </div>

        {/* Search modal */}
        <SearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onNavigate={navigate}
        />

        {/* Scroll to top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg flex items-center justify-center transition-colors print:hidden"
            >
              <ArrowUp size={16} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Print-only styles */}
        <style>{`
          @media print {
            * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            body { font-size: 11pt; line-height: 1.6; }
            h1 { font-size: 20pt; margin-bottom: 12pt; }
            h2 { font-size: 16pt; margin-top: 20pt; margin-bottom: 8pt; page-break-after: avoid; }
            h3 { font-size: 13pt; margin-top: 14pt; margin-bottom: 6pt; page-break-after: avoid; }
            p { margin-bottom: 8pt; orphans: 3; widows: 3; }
            pre { font-size: 8pt; background: #1e293b !important; color: #e2e8f0 !important; padding: 12pt; border-radius: 4pt; page-break-inside: avoid; }
            table { font-size: 9pt; width: 100%; border-collapse: collapse; page-break-inside: avoid; }
            th, td { border: 0.5pt solid #cbd5e1; padding: 5pt 8pt; text-align: left; }
            th { background: #f1f5f9 !important; font-weight: 600; }
            section { page-break-inside: avoid; }
            article { max-width: 100% !important; padding: 0 !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
