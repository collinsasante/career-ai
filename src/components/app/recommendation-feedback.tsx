"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Props {
  careerId: string;
}

type Rating = "helpful" | "not_helpful";

const STORAGE_KEY = (careerId: string) => `pw_feedback_${careerId}`;

export function RecommendationFeedback({ careerId }: Props) {
  const [voted, setVoted] = useState<Rating | null>(null);
  const [saving, setSaving] = useState(false);

  // Restore from localStorage so the voted state persists across page loads
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY(careerId)) as Rating | null;
    if (stored) setVoted(stored);
  }, [careerId]);

  async function vote(rating: Rating) {
    if (voted || saving) return;
    setSaving(true);
    setVoted(rating); // optimistic

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerId, rating }),
      });
      localStorage.setItem(STORAGE_KEY(careerId), rating);
    } catch {
      // silent fail — feedback is non-critical
    } finally {
      setSaving(false);
    }
  }

  if (voted) {
    return (
      <span className="text-2xs text-slate-400 flex items-center gap-1">
        {voted === "helpful" ? (
          <ThumbsUp size={11} className="text-emerald-500" />
        ) : (
          <ThumbsDown size={11} className="text-slate-400" />
        )}
        Thanks
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-2xs text-slate-400 mr-0.5">Helpful?</span>
      <button
        onClick={(e) => { e.preventDefault(); vote("helpful"); }}
        disabled={saving}
        aria-label="Mark as helpful"
        className="p-1 rounded hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors disabled:opacity-40"
      >
        <ThumbsUp size={12} />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); vote("not_helpful"); }}
        disabled={saving}
        aria-label="Mark as not helpful"
        className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40"
      >
        <ThumbsDown size={12} />
      </button>
    </div>
  );
}
