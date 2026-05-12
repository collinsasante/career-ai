"use client";

import { motion } from "framer-motion";
import { Info, Lightbulb, AlertTriangle, AlertCircle, Quote } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";
import type { DocBlock, DocChapter } from "@/lib/docs/types";
import { ALL_CHAPTERS } from "@/lib/docs";

// ─── Individual block renderers ───────────────────────────────────────────────

function Paragraph({ text, lead }: { text: string; lead?: boolean }) {
  return (
    <p
      className={cn(
        "leading-relaxed text-slate-700 dark:text-slate-300",
        lead
          ? "text-lg text-slate-800 dark:text-slate-200 font-[450]"
          : "text-base"
      )}
    >
      {text}
    </p>
  );
}

function Heading2({ text, id }: { text: string; id: string }) {
  return (
    <h2
      id={id}
      className="text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 scroll-mt-20 group"
    >
      <a href={`#${id}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
        {text}
      </a>
    </h2>
  );
}

function Heading3({ text, id }: { text: string; id: string }) {
  return (
    <h3
      id={id}
      className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-8 mb-3 scroll-mt-20"
    >
      <a href={`#${id}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
        {text}
      </a>
    </h3>
  );
}

function Heading4({ text }: { text: string }) {
  return (
    <h4 className="text-base font-semibold text-slate-700 dark:text-slate-200 mt-6 mb-2">
      {text}
    </h4>
  );
}

function DocTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 my-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={cn(
                "border-b last:border-0 border-slate-100 dark:border-slate-800",
                i % 2 === 0
                  ? "bg-white dark:bg-slate-900"
                  : "bg-slate-50/50 dark:bg-slate-800/30"
              )}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={cn(
                    "px-4 py-2.5 text-slate-600 dark:text-slate-300 align-top",
                    j === 0 && "font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap"
                  )}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const CALLOUT_CONFIGS = {
  info:    { Icon: Info,          bg: "bg-blue-50 dark:bg-blue-950/40",    border: "border-blue-300 dark:border-blue-700",   text: "text-blue-700 dark:text-blue-300",   title: "text-blue-800 dark:text-blue-200"   },
  tip:     { Icon: Lightbulb,     bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-300 dark:border-emerald-700", text: "text-emerald-700 dark:text-emerald-300", title: "text-emerald-800 dark:text-emerald-200" },
  warning: { Icon: AlertTriangle, bg: "bg-amber-50 dark:bg-amber-950/40",  border: "border-amber-300 dark:border-amber-700",  text: "text-amber-700 dark:text-amber-300",  title: "text-amber-800 dark:text-amber-200"  },
  danger:  { Icon: AlertCircle,   bg: "bg-red-50 dark:bg-red-950/40",      border: "border-red-300 dark:border-red-700",      text: "text-red-700 dark:text-red-300",      title: "text-red-800 dark:text-red-200"      },
};

function Callout({ variant, title, text }: { variant: keyof typeof CALLOUT_CONFIGS; title?: string; text: string }) {
  const cfg = CALLOUT_CONFIGS[variant];
  return (
    <div className={cn("rounded-xl border-l-4 p-4 my-1", cfg.bg, cfg.border)}>
      <div className="flex items-start gap-3">
        <cfg.Icon size={16} className={cn("flex-shrink-0 mt-0.5", cfg.text)} />
        <div>
          {title && <p className={cn("text-sm font-semibold mb-1", cfg.title)}>{title}</p>}
          <p className={cn("text-sm leading-relaxed", cfg.text)}>{text}</p>
        </div>
      </div>
    </div>
  );
}

function StatCards({ items }: { items: { value: string; label: string; sub?: string }[] }) {
  return (
    <div className={cn("grid gap-4 my-1", items.length <= 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4")}>
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center"
        >
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">{item.label}</p>
          {item.sub && <p className="text-2xs text-slate-400 mt-0.5">{item.sub}</p>}
        </div>
      ))}
    </div>
  );
}

function DocList({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={cn("space-y-2 my-1 pl-0", ordered ? "list-none counter-reset-[item]" : "list-none")}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          <span className={cn(
            "flex-shrink-0 mt-0.5 font-medium",
            ordered
              ? "w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 text-xs flex items-center justify-center"
              : "w-1.5 h-1.5 rounded-full bg-brand-400 mt-2"
          )}>
            {ordered ? i + 1 : ""}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </Tag>
  );
}

function BlockQuote({ text, author, role }: { text: string; author?: string; role?: string }) {
  return (
    <blockquote className="relative border-l-4 border-brand-300 dark:border-brand-700 pl-5 py-2 my-1">
      <Quote size={20} className="text-brand-200 dark:text-brand-800 absolute -top-1 -left-1" />
      <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed text-base">{text}</p>
      {(author || role) && (
        <footer className="mt-2">
          {author && <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">— {author}</span>}
          {role && <span className="text-sm text-slate-400 dark:text-slate-500">, {role}</span>}
        </footer>
      )}
    </blockquote>
  );
}

// ─── Block dispatcher ─────────────────────────────────────────────────────────

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "paragraph":   return <Paragraph text={block.text} lead={block.lead} />;
    case "heading2":    return <Heading2 text={block.text} id={block.id} />;
    case "heading3":    return <Heading3 text={block.text} id={block.id} />;
    case "heading4":    return <Heading4 text={block.text} />;
    case "code":        return <CodeBlock code={block.code} language={block.language} filename={block.filename} />;
    case "table":       return <DocTable headers={block.headers} rows={block.rows} />;
    case "list":        return <DocList items={block.items} ordered={block.ordered} />;
    case "callout":     return <Callout variant={block.variant} title={block.title} text={block.text} />;
    case "stats":       return <StatCards items={block.items} />;
    case "quote":       return <BlockQuote text={block.text} author={block.author} role={block.role} />;
    case "divider":     return <hr className="border-slate-200 dark:border-slate-700 my-2" />;
    default:            return null;
  }
}

// ─── Main content component ───────────────────────────────────────────────────

interface DocContentProps {
  chapter: DocChapter;
  activeSectionId: string;
  onChapterChange: (chapterId: string, sectionId: string) => void;
}

export function DocContent({ chapter, activeSectionId, onChapterChange }: DocContentProps) {
  const idx = ALL_CHAPTERS.findIndex((c) => c.id === chapter.id);
  const prev = idx > 0 ? ALL_CHAPTERS[idx - 1] : null;
  const next = idx < ALL_CHAPTERS.length - 1 ? ALL_CHAPTERS[idx + 1] : null;

  return (
    <motion.article
      key={chapter.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      {/* Chapter header */}
      <div className="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
            Chapter {chapter.number}
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-xs text-slate-400">{chapter.readingMinutes} min read</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
          {chapter.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
          {chapter.description}
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {chapter.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-20">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
              {section.title}
            </h2>
            <div className="space-y-5">
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Chapter navigation */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4 print:hidden">
        {prev ? (
          <button
            onClick={() => onChapterChange(prev.id, prev.sections[0]?.id)}
            className="flex flex-col items-start p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-all group text-left"
          >
            <span className="text-xs text-slate-400 mb-1">← Previous</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors leading-tight">
              Ch {prev.number}: {prev.title}
            </span>
          </button>
        ) : (
          <div />
        )}

        {next ? (
          <button
            onClick={() => onChapterChange(next.id, next.sections[0]?.id)}
            className="flex flex-col items-end p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-all group text-right"
          >
            <span className="text-xs text-slate-400 mb-1">Next →</span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors leading-tight">
              {next.number === "R" || next.number === "A" ? "" : `Ch ${next.number}: `}
              {next.title}
            </span>
          </button>
        ) : (
          <div />
        )}
      </div>
    </motion.article>
  );
}
