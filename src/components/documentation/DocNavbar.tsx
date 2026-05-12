"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Sun, Moon, Download, Loader2, Menu, X, BookOpen, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_CHAPTERS } from "@/lib/docs";
import type { DocBlock } from "@/lib/docs";
import { DocSidebar } from "./DocSidebar";

function blockToHtml(block: DocBlock): string {
  switch (block.type) {
    case "paragraph":
      return `<p style="margin:0 0 12pt 0;line-height:1.6;${block.lead ? "font-size:13pt;font-weight:600;" : ""}">${block.text}</p>`;
    case "heading2":
      return `<h2 style="margin:20pt 0 8pt 0;font-size:14pt;font-weight:700;color:#1e3a5f;border-bottom:1pt solid #cbd5e1;padding-bottom:4pt;">${block.text}</h2>`;
    case "heading3":
      return `<h3 style="margin:14pt 0 6pt 0;font-size:12pt;font-weight:700;color:#1e3a5f;">${block.text}</h3>`;
    case "heading4":
      return `<h4 style="margin:10pt 0 4pt 0;font-size:11pt;font-weight:700;">${block.text}</h4>`;
    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      const items = block.items.map((i) => `<li style="margin-bottom:4pt;">${i}</li>`).join("");
      return `<${tag} style="margin:0 0 12pt 0;padding-left:20pt;">${items}</${tag}>`;
    }
    case "table": {
      const thead = `<thead><tr>${block.headers.map((h) => `<th style="background:#f1f5f9;border:1pt solid #cbd5e1;padding:6pt 8pt;font-weight:700;text-align:left;">${h}</th>`).join("")}</tr></thead>`;
      const tbody = `<tbody>${block.rows.map((row) => `<tr>${row.map((cell) => `<td style="border:1pt solid #cbd5e1;padding:6pt 8pt;vertical-align:top;">${cell}</td>`).join("")}</tr>`).join("")}</tbody>`;
      return `<table style="width:100%;border-collapse:collapse;margin:0 0 16pt 0;">${thead}${tbody}</table>`;
    }
    case "code":
      return `<pre style="background:#1e293b;color:#e2e8f0;padding:12pt;border-radius:4pt;margin:0 0 16pt 0;font-family:'Courier New',monospace;font-size:9pt;white-space:pre-wrap;overflow-wrap:break-word;">${block.filename ? `<span style="color:#94a3b8;display:block;margin-bottom:6pt;">${block.filename}</span>` : ""}${block.code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`;
    case "callout": {
      const colors: Record<string, string> = { info: "#dbeafe", warning: "#fef3c7", tip: "#dcfce7", danger: "#fee2e2" };
      const border: Record<string, string> = { info: "#3b82f6", warning: "#f59e0b", tip: "#22c55e", danger: "#ef4444" };
      const bg = colors[block.variant] ?? "#f1f5f9";
      const bd = border[block.variant] ?? "#94a3b8";
      return `<div style="background:${bg};border-left:4pt solid ${bd};padding:10pt 14pt;margin:0 0 16pt 0;border-radius:2pt;">${block.title ? `<p style="font-weight:700;margin:0 0 4pt 0;">${block.title}</p>` : ""}<p style="margin:0;">${block.text}</p></div>`;
    }
    case "stats": {
      const items = block.items.map((s) => `<td style="text-align:center;padding:8pt 12pt;"><div style="font-size:18pt;font-weight:700;color:#1e3a5f;">${s.value}</div><div style="font-weight:600;font-size:10pt;">${s.label}</div>${s.sub ? `<div style="color:#64748b;font-size:9pt;">${s.sub}</div>` : ""}</td>`).join("");
      return `<table style="width:100%;margin:0 0 16pt 0;"><tbody><tr>${items}</tr></tbody></table>`;
    }
    case "quote":
      return `<blockquote style="border-left:4pt solid #6366f1;margin:0 0 16pt 20pt;padding:8pt 14pt;font-style:italic;color:#374151;">"${block.text}"${block.author ? `<footer style="font-style:normal;font-size:10pt;margin-top:6pt;color:#6b7280;">— ${block.author}${block.role ? `, ${block.role}` : ""}</footer>` : ""}</blockquote>`;
    case "divider":
      return `<hr style="border:none;border-top:1pt solid #e2e8f0;margin:16pt 0;" />`;
    case "image":
      return `<p style="color:#64748b;font-style:italic;">[Figure: ${block.alt}]${block.caption ? ` — ${block.caption}` : ""}</p>`;
    default:
      return "";
  }
}

function generateDocHtml(): string {
  const body = ALL_CHAPTERS.map((chapter) => {
    const sections = chapter.sections.map((section) => {
      const blocks = section.blocks.map(blockToHtml).join("\n");
      return `<h2 style="margin:24pt 0 10pt 0;font-size:15pt;font-weight:700;color:#1e3a5f;border-bottom:2pt solid #6366f1;padding-bottom:6pt;">${section.title}</h2>\n${blocks}`;
    }).join("\n");
    return `<div style="page-break-before:always;"></div>\n<h1 style="margin:0 0 6pt 0;font-size:20pt;font-weight:800;color:#1e3a5f;">Chapter ${chapter.number}: ${chapter.title}</h1>\n<p style="color:#64748b;margin:0 0 20pt 0;font-style:italic;">${chapter.description}</p>\n${sections}`;
  }).join("\n\n");

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>PathWise Documentation</title>
<!--[if gte mso 9]>
<xml><w:WordDocument><w:View>Print</w:View><w:Zoom>90</w:Zoom><w:DoNotOptimizeForBrowser/></w:WordDocument></xml>
<![endif]-->
<style>
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #111827; margin: 72pt; line-height: 1.5; }
  @page { margin: 2.5cm; }
</style>
</head>
<body>
<h1 style="font-size:26pt;font-weight:800;color:#1e3a5f;text-align:center;margin-bottom:8pt;">PathWise</h1>
<h2 style="font-size:16pt;font-weight:400;color:#6366f1;text-align:center;margin:0 0 4pt 0;">AI-Powered Career Guidance Platform</h2>
<p style="text-align:center;color:#64748b;margin:0 0 40pt 0;">Final Year Project Documentation — ${new Date().getFullYear()}</p>
${body}
</body>
</html>`;
}

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

  const handleDownload = () => {
    setDownloading(true);
    try {
      const html = generateDocHtml();
      const blob = new Blob([html], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "PathWise-Documentation.doc";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
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

          {/* Word Export */}
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
            <span className="hidden sm:block">{downloading ? "Preparing…" : "Export Word"}</span>
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
