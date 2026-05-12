"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RegenerateButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const profileRes = await fetch("/api/profile");
      if (!profileRes.ok) throw new Error("Could not load your profile.");
      const { data: profileData } = await profileRes.json();

      if (!profileData) {
        setError("Complete your profile before regenerating recommendations.");
        return;
      }

      const recRes = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            interests:              profileData.interests ?? [],
            skills:                 profileData.skills ?? [],
            weak_areas:             profileData.weakAreas ?? [],
            preferred_work_style:   profileData.workStyle ?? "hybrid",
            learning_mode:          profileData.learningMode ?? "self_paced",
            availability:           profileData.availability ?? "part_time",
            career_goals:           profileData.careerGoals ?? [],
            industries_of_interest: profileData.industries ?? [],
          },
        }),
      });
      if (!recRes.ok) throw new Error("Failed to generate recommendations. Please try again.");

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        variant="outline"
        size="sm"
        loading={loading}
        leftIcon={!loading ? <RefreshCw size={14} /> : undefined}
        onClick={handleRegenerate}
      >
        Regenerate
      </Button>
      {error && (
        <p className="text-xs text-red-600 max-w-xs text-right">{error}</p>
      )}
    </div>
  );
}
