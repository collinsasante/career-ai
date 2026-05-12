"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Sun, Moon, Download, Loader2, Menu, X, BookOpen, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_CHAPTERS } from "@/lib/docs";
import { DocSidebar } from "./DocSidebar";

interface DocNavbarProps {
  dark: boolean;
  onToggleDark: () => void;
  onSearchOpen: () => void;
  activeChapterId: string;
  activeSectionId: string;
  activeChapterTitle: string;
  activeSectionTitle: string;
  onNavigate: (chapterId: string, sectionId: string) => void;
}

export function DocNavbar({
  dark,
  onToggleDark,
  onSearchOpen,
  activeChapterId,
  activeSectionId,
  activeChapterTitle,
  activeSectionTitle,
  onNavigate,
}: DocNavbarProps) {
  const [downloading, setDownloading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    // Brief delay for UX polish, then open print dialog
    await new Promise((r) => setTimeout(r, 800));
    window.print();
    setDownloading(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md print:hidden">
        <div className="flex items-center h-14 px-4 gap-3">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={18} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center">
              <BookOpen size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white hidden sm:block">
              PathWise
            </span>
            <ChevronRight size={14} className="text-slate-300 hidden sm:block" />
            <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
              Documentation
            </span>
          </div>

          {/* Breadcrumb — desktop */}
          <div className="hidden lg:flex items-center gap-1.5 text-sm text-slate-400 ml-2 truncate">
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-600 dark:text-slate-300 truncate max-w-[180px]">
              {activeChapterTitle}
            </span>
            {activeSectionTitle && (
              <>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                <span className="truncate max-w-[180px] text-slate-400 dark:text-slate-400">
                  {activeSectionTitle}
                </span>
              </>
            )}
          </div>

          <div className="flex-1" />

          {/* Search */}
          <button
            onClick={onSearchOpen}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-sm"
          >
            <Search size={13} />
            <span className="hidden sm:block text-xs">Search docs…</span>
            <kbd className="hidden sm:block text-2xs border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-slate-400 bg-white dark:bg-slate-900">
              ⌘K
            </kbd>
          </button>

          {/* Dark mode */}
          <button
            onClick={onToggleDark}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* PDF Download */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              "bg-brand-600 hover:bg-brand-700 text-white shadow-sm",
              "disabled:opacity-70"
            )}
          >
            {downloading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            <span className="hidden sm:block">{downloading ? "Preparing…" : "Export PDF"}</span>
          </button>
        </div>
      </header>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white text-sm">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="h-full overflow-y-auto pb-20">
                <DocSidebar
                  activeChapterId={activeChapterId}
                  activeSectionId={activeSectionId}
                  onNavigate={(c, s) => {
                    onNavigate(c, s);
                    setMobileMenuOpen(false);
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
