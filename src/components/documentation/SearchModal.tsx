"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FileText, ChevronRight } from "lucide-react";
import { searchDocs } from "@/lib/docs";
import type { SearchResult } from "@/lib/docs/types";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (chapterId: string, sectionId: string) => void;
}

export function SearchModal({ open, onClose, onNavigate }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setResults(searchDocs(query));
    setActive(0);
  }, [query]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
      if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
      if (e.key === "Enter" && results[active]) {
        onNavigate(results[active].chapterId, results[active].sectionId);
        onClose();
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [results, active, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed left-1/2 top-24 z-50 w-full max-w-xl -translate-x-1/2 px-4"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <Search size={16} className="text-slate-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search documentation…"
                  className="flex-1 text-sm bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
                />
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={16} />
                </button>
              </div>

              {/* Results */}
              {results.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto py-2">
                  {results.map((r, i) => (
                    <li key={`${r.chapterId}-${r.sectionId}`}>
                      <button
                        className={cn(
                          "w-full text-left px-4 py-3 flex items-start gap-3 transition-colors",
                          i === active
                            ? "bg-brand-50 dark:bg-brand-950"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                        onClick={() => {
                          onNavigate(r.chapterId, r.sectionId);
                          onClose();
                        }}
                        onMouseEnter={() => setActive(i)}
                      >
                        <FileText size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-400 mb-0.5">{r.chapterTitle}</p>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{r.sectionTitle}</p>
                          {r.excerpt && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                              {r.excerpt}
                            </p>
                          )}
                        </div>
                        <ChevronRight size={14} className="text-slate-300 flex-shrink-0 mt-0.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : query.length > 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-slate-500">No results for &ldquo;{query}&rdquo;</p>
                </div>
              ) : (
                <div className="py-6 px-4">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-3">Quick links</p>
                  <div className="space-y-1">
                    {["Introduction", "System Architecture", "Implementation", "API Reference"].map((label) => (
                      <button
                        key={label}
                        onClick={() => setQuery(label)}
                        className="w-full text-left text-sm text-slate-600 dark:text-slate-300 hover:text-brand-600 px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center gap-3 px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <kbd className="text-2xs text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5">↵</kbd>
                <span className="text-2xs text-slate-400">to select</span>
                <kbd className="text-2xs text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5">↑↓</kbd>
                <span className="text-2xs text-slate-400">to navigate</span>
                <kbd className="text-2xs text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5">Esc</kbd>
                <span className="text-2xs text-slate-400">to close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
