"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "slide-in";
  delay?: number;
  threshold?: number;
}

export function AnimateOnScroll({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  threshold = 0.12,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: visible ? undefined : 0,
        transform: visible
          ? undefined
          : animation === "fade-up"
          ? "translateY(24px)"
          : animation === "slide-in"
          ? "translateX(-16px)"
          : "none",
        transition: visible
          ? `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`
          : "none",
        ...(visible
          ? { opacity: 1, transform: "none" }
          : {}),
      }}
    >
      {children}
    </div>
  );
}
