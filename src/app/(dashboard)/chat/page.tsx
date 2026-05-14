"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Sparkles, RotateCcw, Copy, Check,
  Plus, Compass, Map, TrendingUp, Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const GUIDED_DISCOVERY_PROMPT =
  `I'm not sure what career I want. Can you guide me through some questions to help me figure out what might suit me? Start by asking me what kinds of activities or subjects I enjoy, then take it from there.`;

// Action pills (like ChatGPT's "Create an image / Write or edit / Look something up")
const ACTION_PILLS = [
  { label: "Explore careers",    icon: Compass,     prompt: "What are the most in-demand careers in Ghana right now, and what qualifications do they need?" },
  { label: "Plan my path",       icon: Map,          prompt: "Can you help me build a step-by-step plan to reach my career goal?" },
  { label: "Skill gap advice",   icon: TrendingUp,   prompt: "What skills should I be developing to stay competitive in today's job market?" },
  { label: "Not sure? Start here", icon: Lightbulb,  prompt: GUIDED_DISCOVERY_PROMPT },
];

// Suggestion prompts shown below the pills
const SUGGESTIONS = [
  "What careers are good for someone who enjoys helping people?",
  "I enjoy creative work but also like structure — what suits me?",
  "How do I get into tech with no formal experience?",
  "Which healthcare careers don't require a medical degree?",
  "I'm a software engineer — what are my paths to leadership?",
  "How do I pivot from marketing into product management?",
];

// ─── Message row ─────────────────────────────────────────────────────────────

function MessageRow({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-[70%] bg-slate-100 text-slate-900 rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-6 group">
      {/* AI avatar */}
      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles size={13} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-400 mb-1.5">PathWise</p>
        <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>
        <button
          onClick={handleCopy}
          className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function StreamingRow({ content }: { content: string }) {
  return (
    <div className="flex gap-3 mb-6">
      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles size={13} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-400 mb-1.5">PathWise</p>
        {content ? (
          <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
            {content}
            <span className="inline-block w-0.5 h-4 bg-indigo-500 ml-0.5 animate-pulse align-text-bottom" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 py-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setIsStreaming(true);
      setStreamingContent("");

      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.error ?? `Server error ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) { accumulated += parsed.text; setStreamingContent(accumulated); }
                if (parsed.error) throw new Error(parsed.error);
              } catch { /* skip malformed SSE */ }
            }
          }
        }

        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", content: accumulated, timestamp: new Date() },
        ]);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        const detail = err instanceof Error ? err.message : "Unknown error";
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "assistant", content: `Sorry, I couldn't process that. ${detail}`, timestamp: new Date() },
        ]);
      } finally {
        setIsStreaming(false);
        setStreamingContent("");
        abortRef.current = null;
        inputRef.current?.focus();
      }
    },
    [messages, isStreaming]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const handleReset = () => {
    if (isStreaming) abortRef.current?.abort();
    setMessages([]);
    setStreamingContent("");
    setIsStreaming(false);
    inputRef.current?.focus();
  };

  const isEmpty = messages.length === 0 && !isStreaming;

  return (
    <div className="flex flex-col -mx-4 sm:-mx-6 lg:-mx-8 -my-8 h-[calc(100vh-3.5rem)] lg:h-screen bg-white">

      {/* Minimal top bar — only visible when chatting */}
      {!isEmpty && (
        <div className="border-b border-slate-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">PathWise Advisor</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <RotateCcw size={12} />
            New chat
          </button>
        </div>
      )}

      {/* Messages / Empty state */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          /* ── Empty state (ChatGPT-style) ── */
          <div className="flex flex-col items-center justify-center h-full px-4 pb-8">
            <div className="w-full max-w-2xl">
              <h1 className="text-3xl font-semibold text-slate-900 text-center mb-8">
                What are you working on?
              </h1>

              {/* Input box */}
              <div className="relative mb-4">
                <div className="flex items-start gap-3 border border-slate-200 rounded-2xl bg-white shadow-sm px-4 py-3.5 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/15 transition-all">
                  <button className="mt-0.5 w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 flex-shrink-0 transition-colors">
                    <Plus size={14} />
                  </button>
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about your career…"
                    rows={1}
                    className="flex-1 resize-none text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none leading-relaxed bg-transparent max-h-40 overflow-y-auto"
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim()}
                    className={cn(
                      "mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                      input.trim()
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>

              {/* Action pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {ACTION_PILLS.map(({ label, icon: Icon, prompt }) => (
                  <button
                    key={label}
                    onClick={() => sendMessage(prompt)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-700 transition-all shadow-sm"
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Suggestion grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-800 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Conversation ── */
          <div className="max-w-3xl mx-auto px-4 py-8">
            {messages.map((m) => (
              <MessageRow key={m.id} message={m} />
            ))}
            {isStreaming && <StreamingRow content={streamingContent} />}
            <div ref={bottomRef} />
          </div>
        )}
        {!isEmpty && <div ref={bottomRef} />}
      </div>

      {/* Sticky input — only shown when chatting */}
      {!isEmpty && (
        <div className="border-t border-slate-100 px-4 py-4 bg-white flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-3 border border-slate-200 rounded-2xl bg-white shadow-sm px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/15 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask a follow-up…"
                rows={1}
                disabled={isStreaming}
                className="flex-1 resize-none text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none leading-relaxed bg-transparent max-h-40 overflow-y-auto disabled:opacity-50"
              />
              {isStreaming ? (
                <button
                  type="button"
                  onClick={() => abortRef.current?.abort()}
                  className="w-8 h-8 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors flex-shrink-0"
                  title="Stop"
                >
                  <span className="w-3 h-3 rounded-sm bg-red-600" />
                </button>
              ) : (
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                    input.trim()
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  <Send size={14} />
                </button>
              )}
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">
              Shift+Enter for new line · Guidance is a starting point, not a final answer
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
