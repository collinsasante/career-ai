"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Sparkles, RotateCcw, Copy, Check,
  Plus, Compass, Map, TrendingUp, Lightbulb,
  X, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachmentNames?: string[];
}

interface Attachment {
  id: string;
  file: File;
  preview?: string; // object URL for images
  kind: "image" | "file";
}

const GUIDED_DISCOVERY_PROMPT =
  `I'm not sure what career I want. Can you guide me through some questions to help me figure out what might suit me? Start by asking me what kinds of activities or subjects I enjoy, then take it from there.`;

const ACTION_PILLS = [
  { label: "Explore careers",      icon: Compass,    prompt: "What are the most in-demand careers in Ghana right now, and what qualifications do they need?" },
  { label: "Plan my path",         icon: Map,         prompt: "Can you help me build a step-by-step plan to reach my career goal?" },
  { label: "Skill gap advice",     icon: TrendingUp,  prompt: "What skills should I be developing to stay competitive in today's job market?" },
  { label: "Not sure? Start here", icon: Lightbulb,   prompt: GUIDED_DISCOVERY_PROMPT },
];

const SUGGESTIONS = [
  "What careers are good for someone who enjoys helping people?",
  "I enjoy creative work but also like structure — what suits me?",
  "How do I get into tech with no formal experience?",
  "Which healthcare careers don't require a medical degree?",
  "I'm a software engineer — what are my paths to leadership?",
  "How do I pivot from marketing into product management?",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// ─── Attachment chip ──────────────────────────────────────────────────────────

function AttachmentChip({
  attachment,
  onRemove,
}: {
  attachment: Attachment;
  onRemove: () => void;
}) {
  return (
    <div className="relative inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700">
      {attachment.kind === "image" && attachment.preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={attachment.preview}
          alt={attachment.file.name}
          className="w-6 h-6 rounded object-cover flex-shrink-0"
        />
      ) : (
        <FileText size={12} className="text-indigo-500 flex-shrink-0" />
      )}
      <span className="max-w-[120px] truncate">{attachment.file.name}</span>
      <button
        onClick={onRemove}
        className="ml-0.5 text-slate-400 hover:text-slate-700 transition-colors"
      >
        <X size={11} />
      </button>
    </div>
  );
}

// ─── Message row ──────────────────────────────────────────────────────────────

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
        <div className="max-w-[70%] space-y-1.5">
          {message.attachmentNames && message.attachmentNames.length > 0 && (
            <div className="flex flex-wrap gap-1.5 justify-end">
              {message.attachmentNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg px-2 py-1 text-xs"
                >
                  <FileText size={10} />
                  {name}
                </span>
              ))}
            </div>
          )}
          <div className="bg-slate-100 text-slate-900 rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-6 group">
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

// ─── Input box (shared between empty-state and chat-state) ───────────────────

function InputBox({
  inputRef,
  fileInputRef,
  value,
  onChange,
  onKeyDown,
  onFileChange,
  onSend,
  onStop,
  isStreaming,
  disabled,
  placeholder,
  attachments,
  onRemoveAttachment,
}: {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onFileChange: (files: FileList) => void;
  onSend: () => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
  placeholder: string;
  attachments: Attachment[];
  onRemoveAttachment: (id: string) => void;
}) {
  return (
    <div className="border border-slate-200 rounded-2xl bg-white shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/15 transition-all">
      {/* Attachment chips */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pt-3">
          {attachments.map((a) => (
            <AttachmentChip
              key={a.id}
              attachment={a}
              onRemove={() => onRemoveAttachment(a.id)}
            />
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 px-3 py-3">
        {/* + / attach button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mb-0.5 w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 flex-shrink-0 transition-colors"
          title="Attach image or file"
        >
          <Plus size={14} />
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && onFileChange(e.target.files)}
        />

        {/* Textarea */}
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none leading-relaxed bg-transparent max-h-40 overflow-y-auto disabled:opacity-50"
        />

        {/* Send / stop */}
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="mb-0.5 w-8 h-8 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors flex-shrink-0"
            title="Stop"
          >
            <span className="w-3 h-3 rounded-sm bg-red-600" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSend}
            disabled={!value.trim() && attachments.length === 0}
            className={cn(
              "mb-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
              value.trim() || attachments.length > 0
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <Send size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      attachments.forEach((a) => { if (a.preview) URL.revokeObjectURL(a.preview); });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = useCallback((files: FileList) => {
    const newAttachments: Attachment[] = Array.from(files).map((file) => {
      const isImage = file.type.startsWith("image/");
      return {
        id: crypto.randomUUID(),
        file,
        preview: isImage ? URL.createObjectURL(file) : undefined,
        kind: isImage ? "image" : "file",
      };
    });
    setAttachments((prev) => [...prev, ...newAttachments]);
    // Reset file input so the same file can be re-attached
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => {
      const a = prev.find((x) => x.id === id);
      if (a?.preview) URL.revokeObjectURL(a.preview);
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if ((!text.trim() && attachments.length === 0) || isStreaming) return;

      // Build image attachments payload
      const imageAttachments = await Promise.all(
        attachments
          .filter((a) => a.kind === "image")
          .map(async (a) => ({
            name: a.file.name,
            mediaType: a.file.type,
            data: await fileToBase64(a.file),
          }))
      );

      // For non-image files, prepend content as text context
      const textFileContexts = await Promise.all(
        attachments
          .filter((a) => a.kind === "file" && a.file.size < 200_000)
          .map(async (a) => {
            const content = await fileToText(a.file).catch(() => null);
            return content ? `[File: ${a.file.name}]\n${content}\n` : `[File attached: ${a.file.name}]`;
          })
      );

      const fullText = [
        ...textFileContexts,
        text.trim(),
      ].filter(Boolean).join("\n\n");

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: fullText || `[${attachments.map((a) => a.file.name).join(", ")}]`,
        timestamp: new Date(),
        attachmentNames: attachments.map((a) => a.file.name),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setAttachments([]);
      setIsStreaming(true);
      setStreamingContent("");

      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
            ...(imageAttachments.length > 0 && { imageAttachments }),
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
          for (const line of decoder.decode(value, { stream: true }).split("\n")) {
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
    [messages, attachments, isStreaming]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const handleReset = () => {
    if (isStreaming) abortRef.current?.abort();
    attachments.forEach((a) => { if (a.preview) URL.revokeObjectURL(a.preview); });
    setMessages([]);
    setAttachments([]);
    setStreamingContent("");
    setIsStreaming(false);
    inputRef.current?.focus();
  };

  const isEmpty = messages.length === 0 && !isStreaming;

  return (
    <div className="flex flex-col -mx-4 sm:-mx-6 lg:-mx-8 -my-8 h-[calc(100vh-3.5rem)] lg:h-screen bg-white">

      {/* Top bar — only when chatting */}
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

      {/* Messages / empty state — flex-1 flex flex-col so children can fill height */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
            <div className="w-full max-w-2xl">
              <h1 className="text-3xl font-semibold text-slate-900 text-center mb-8">
                What are you working on?
              </h1>

              {/* Input */}
              <div className="mb-4">
                <InputBox
                  inputRef={inputRef}
                  fileInputRef={fileInputRef}
                  value={input}
                  onChange={setInput}
                  onKeyDown={handleKeyDown}
                  onFileChange={handleFileChange}
                  onSend={() => sendMessage(input)}
                  onStop={() => abortRef.current?.abort()}
                  isStreaming={isStreaming}
                  placeholder="Ask anything about your career…"
                  attachments={attachments}
                  onRemoveAttachment={removeAttachment}
                />
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

              {/* Suggestions */}
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
          <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
            {messages.map((m) => (
              <MessageRow key={m.id} message={m} />
            ))}
            {isStreaming && <StreamingRow content={streamingContent} />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Sticky input — only when chatting */}
      {!isEmpty && (
        <div className="border-t border-slate-100 px-4 py-4 bg-white flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <InputBox
              inputRef={inputRef}
              fileInputRef={fileInputRef}
              value={input}
              onChange={setInput}
              onKeyDown={handleKeyDown}
              onFileChange={handleFileChange}
              onSend={() => sendMessage(input)}
              onStop={() => abortRef.current?.abort()}
              isStreaming={isStreaming}
              disabled={isStreaming}
              placeholder="Ask a follow-up…"
              attachments={attachments}
              onRemoveAttachment={removeAttachment}
            />
            <p className="text-center text-xs text-slate-400 mt-2">
              Shift+Enter for new line · Guidance is a starting point, not a final answer
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
