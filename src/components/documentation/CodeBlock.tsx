"use client";

import { useState } from "react";
import { Check, Copy, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  dark?: boolean;
}

// Very lightweight syntax colouring via regex substitution
function highlight(code: string, lang: string): string {
  if (lang === "bash" || lang === "text") {
    return code
      .replace(/^(#.*)$/gm, '<span class="text-slate-500">$1</span>')
      .replace(/("([^"\\]|\\.)*")/g, '<span class="text-emerald-400">$1</span>');
  }
  if (lang === "python") {
    return code
      .replace(
        /\b(import|from|def|class|return|if|else|elif|for|in|while|True|False|None|as|with|print|pass|and|or|not)\b/g,
        '<span class="text-violet-400">$1</span>'
      )
      .replace(/(#.*)$/gm, '<span class="text-slate-500">$1</span>')
      .replace(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/g, '<span class="text-emerald-400">$1</span>');
  }
  // TypeScript / JavaScript / JSON
  return code
    .replace(
      /\b(const|let|var|function|return|async|await|export|import|from|type|interface|extends|implements|class|new|if|else|for|while|switch|case|default|try|catch|throw|typeof|keyof|Record|Promise|null|undefined|true|false|void)\b/g,
      '<span class="text-violet-400">$1</span>'
    )
    .replace(/(\/\/.*)$/gm, '<span class="text-slate-500">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-slate-500">$1</span>')
    .replace(/(`[^`]*`)/g, '<span class="text-amber-400">$1</span>')
    .replace(/("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/g, '<span class="text-emerald-400">$1</span>');
}

export function CodeBlock({ code, language, filename, dark = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlighted = highlight(code, language);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/60 my-1 group">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          </div>
          {filename && (
            <div className="flex items-center gap-1.5 ml-2">
              <FileCode2 size={12} className="text-slate-400" />
              <span className="text-xs text-slate-400 font-mono">{filename}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {language !== "text" && (
            <span className="text-2xs text-slate-500 uppercase tracking-wider font-mono">
              {language}
            </span>
          )}
          <button
            onClick={copy}
            className={cn(
              "flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-all",
              "text-slate-400 hover:text-white hover:bg-slate-700"
            )}
          >
            {copied ? (
              <>
                <Check size={12} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code body */}
      <div className="bg-slate-950 overflow-x-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed text-slate-200">
          <code
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  );
}
