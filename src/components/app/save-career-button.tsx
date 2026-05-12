"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveCareerButtonProps {
  careerId: string;
  careerTitle: string;
}

export function SaveCareerButton({ careerId, careerTitle }: SaveCareerButtonProps) {
  const [saved, setSaved] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("pathwise-saved-careers") ?? "[]");
      setSaved(Array.isArray(stored) && stored.includes(careerId));
    } catch {
      // ignore
    }
  }, [careerId]);

  const toggle = () => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem("pathwise-saved-careers") ?? "[]");
      let next: string[];
      if (saved) {
        next = stored.filter((id) => id !== careerId);
      } else {
        next = [...stored, careerId];
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
      }
      localStorage.setItem("pathwise-saved-careers", JSON.stringify(next));
      setSaved(!saved);
    } catch {
      // ignore
    }
  };

  return (
    <Button
      fullWidth
      variant={saved ? "secondary" : "outline"}
      leftIcon={<Star size={15} className={saved ? "fill-amber-400 text-amber-400" : ""} />}
      onClick={toggle}
    >
      {justSaved ? "Saved!" : saved ? "Saved" : "Save Career"}
    </Button>
  );
}
