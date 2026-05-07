"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Bot, User, Sparkles, RotateCcw, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Guided discovery sequence — sent automatically when user clicks "Start guided discovery"
const GUIDED_DISCOVERY_PROMPT =
  `I'm not sure what career I want. Can you guide me through some questions to help me figure out what might suit me? Start by asking me what kinds of activities or subjects I enjoy, then take it from there.`;

// Segmented starter prompts
const STARTER_PROMPTS_EXPLORER = [
  "I have no idea what career to choose — where do I even start?",
  "What careers are good for someone who enjoys helping people?",
  "I enjoy creative work but also like structure. What careers would suit me?",
  "Can you explain what a data analyst actually does day-to-day?",
];

const STARTER_PROMPTS_FOCUSED = [
  "I'm interested in technology but not sure whether to go into software, data, or cybersecurity.",
  "What's the difference between a product manager and a project manager?",
  "How do I get into UX design with no formal experience?",
  "Which careers in healthcare don't require a medical degree?",
];

const STARTER_PROMPTS_PROFESSIONAL = [
  "I'm a software engineer — what are the best paths to move into leadership?",
  "How do I pivot from marketing into product management?",
  "What certifications would most improve my data analyst salary?",
  "I've been in finance for 5 years. What adjacent careers could I move into?",
];

function MessageBubble({
  message,
}: {
  message: Message;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group flex gap-3 mb-6",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
          isUser
            ? "bg-brand-600"
            : "bg-white border border-slate-200 shadow-sm"
        )}
      >
        {isUser ? (
          <User size={14} className="text-white" />
        ) : (
          <Bot size={14} className="text-brand-600" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "relative max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-brand-600 text-white rounded-tr-sm"
            : "bg-white border border-slate-100 shadow-card text-slate-800 rounded-tl-sm"
        )}
      >
        {/* Content with basic markdown-ish rendering */}
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {/* Timestamp + copy */}
        <div
          className={cn(
            "flex items-center gap-2 mt-2",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          <span
            className={cn(
              "text-2xs",
              isUser ? "text-white/60" : "text-slate-400"
            )}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {!isUser && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
              title="Copy"
            >
              {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-6">
      <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0">
        <Bot size={14} className="text-brand-600" />
      </div>
      <div className="bg-white border border-slate-100 shadow-card rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Prompt group component
// ─────────────────────────────────────────────
function PromptGroup({
  title,
  prompts,
  onSend,
  color,
}: {
  title: string;
  prompts: string[];
  onSend: (p: string) => void;
  color: "brand" | "emerald" | "violet";
}) {
  const dotColors = {
    brand:   "bg-brand-400",
    emerald: "bg-emerald-400",
    violet:  "bg-violet-400",
  };

  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[color]}`} />
        <span dangerouslySetInnerHTML={{ __html: title }} />
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSend(prompt)}
            className="text-left text-xs text-slate-600 bg-white border border-slate-200 rounded-xl px-3.5 py-3 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 transition-all duration-150 shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

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
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          throw new Error(`Server error ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  accumulated += parsed.text;
                  setStreamingContent(accumulated);
                }
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch {
                // skip malformed SSE lines
              }
            }
          }
        }

        // Commit final streamed message
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: accumulated,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, I couldn't process that request. Please check that your API key is configured and try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsStreaming(false);
        setStreamingContent("");
        abortRef.current = null;
        inputRef.current?.focus();
      }
    },
    [messages, isStreaming]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
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
    <div className="flex flex-col -mx-4 sm:-mx-6 lg:-mx-8 -my-8 h-[calc(100vh-3.5rem)] lg:h-screen bg-surface-subtle">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900">
              PathWise Advisor
            </h1>
            <p className="text-xs text-slate-500">
              Career guidance, at your pace
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <RotateCcw size={13} />
            New chat
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-16 xl:px-32 py-6">
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center mb-5 shadow-lg shadow-brand-600/25">
              <Sparkles size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Ask me anything about your career
            </h2>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Get personalised guidance across every career sector — technology, healthcare, law, finance, creative arts, trades, and more.
            </p>

            {/* Guided discovery CTA */}
            <button
              onClick={() => sendMessage(GUIDED_DISCOVERY_PROMPT)}
              className="w-full max-w-sm mb-6 flex items-center gap-3 px-4 py-3.5 bg-brand-600 text-white rounded-2xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/20 text-sm font-medium"
            >
              <Sparkles size={18} className="flex-shrink-0" />
              <span className="text-left">Not sure where to start? Try guided discovery →</span>
            </button>

            {/* Segmented starter prompts */}
            <div className="w-full space-y-4 text-left">
              <PromptGroup
                title="If you&apos;re exploring"
                prompts={STARTER_PROMPTS_EXPLORER}
                onSend={sendMessage}
                color="brand"
              />
              <PromptGroup
                title="If you have ideas"
                prompts={STARTER_PROMPTS_FOCUSED}
                onSend={sendMessage}
                color="emerald"
              />
              <PromptGroup
                title="If you&apos;re already working"
                prompts={STARTER_PROMPTS_PROFESSIONAL}
                onSend={sendMessage}
                color="violet"
              />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* Streaming message */}
            {isStreaming && streamingContent && (
              <div className="flex gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={14} className="text-brand-600" />
                </div>
                <div className="max-w-[75%] bg-white border border-slate-100 shadow-card rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-800 leading-relaxed">
                  <span className="whitespace-pre-wrap break-words">
                    {streamingContent}
                  </span>
                  <span className="inline-block w-0.5 h-4 bg-brand-500 ml-0.5 animate-pulse align-text-bottom" />
                </div>
              </div>
            )}

            {/* Typing indicator when not yet streaming */}
            {isStreaming && !streamingContent && <TypingIndicator />}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-slate-100 px-4 md:px-8 lg:px-16 xl:px-32 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 160) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about careers, skills, study paths…"
              rows={1}
              disabled={isStreaming}
              className={cn(
                "w-full resize-none rounded-2xl border border-slate-200 bg-white",
                "px-4 py-3.5 pr-14 text-sm text-slate-900",
                "placeholder:text-slate-400 shadow-sm",
                "focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                "transition-all duration-150 leading-relaxed",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                "max-h-40 overflow-y-auto"
              )}
            />
            <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
              {isStreaming ? (
                <button
                  type="button"
                  onClick={handleStop}
                  className="w-9 h-9 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors"
                  title="Stop generating"
                >
                  <span className="w-3 h-3 rounded-sm bg-red-600" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-150",
                    input.trim()
                      ? "bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/25"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  )}
                >
                  <Send size={15} />
                </button>
              )}
            </div>
          </form>
          <p className="text-center text-2xs text-slate-400 mt-2">
            Shift+Enter for new line · Guidance is a starting point, not a final answer
          </p>
        </div>
      </div>
    </div>
  );
}
