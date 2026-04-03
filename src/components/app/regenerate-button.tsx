"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RegenerateButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      // 1. Fetch current profile
      const profileRes = await fetch("/api/profile");
      const { data: profileData } = await profileRes.json();

      if (!profileData) {
        alert("Please complete your profile before generating recommendations.");
        return;
      }

      // 2. Generate new recommendations
      await fetch("/api/recommendations", {
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

      // 3. Refresh the page to show new results
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      loading={loading}
      leftIcon={!loading ? <RefreshCw size={14} /> : undefined}
      onClick={handleRegenerate}
    >
      Regenerate
    </Button>
  );
}
