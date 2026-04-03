import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0–100
  max?: number;
  size?: "xs" | "sm" | "md";
  variant?: "brand" | "emerald" | "amber" | "slate";
  showLabel?: boolean;
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2.5",
};

const variantClasses = {
  brand: "bg-brand-600",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  slate: "bg-slate-400",
};

export function Progress({
  value,
  max = 100,
  size = "sm",
  variant = "brand",
  showLabel = false,
  className,
  animated = true,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex-1 rounded-full bg-slate-100 overflow-hidden",
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            "h-full rounded-full",
            animated && "transition-all duration-700 ease-out",
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-600 w-8 text-right tabular-nums">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

// ── Match Score Ring ──────────────────────────

interface MatchScoreRingProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981"; // emerald
  if (score >= 65) return "#3b82f6"; // blue
  if (score >= 50) return "#4f46e5"; // brand
  if (score >= 35) return "#f59e0b"; // amber
  return "#94a3b8"; // slate
}

const sizeMap = {
  sm: { size: 48, stroke: 3.5, radius: 19 },
  md: { size: 64, stroke: 4, radius: 26 },
  lg: { size: 80, stroke: 5, radius: 32 },
};

export function MatchScoreRing({
  score,
  size = "md",
  className,
}: MatchScoreRingProps) {
  const { size: dim, stroke, radius } = sizeMap[size];
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);
  const fontSize = size === "sm" ? "10px" : size === "md" ? "13px" : "16px";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: dim, height: dim }}
    >
      <svg
        width={dim}
        height={dim}
        viewBox={`0 0 ${dim} ${dim}`}
        className="-rotate-90"
      >
        {/* Track */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={stroke}
        />
        {/* Fill */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <span
        className="absolute font-bold tabular-nums"
        style={{ fontSize, color, lineHeight: 1 }}
      >
        {score}
      </span>
    </div>
  );
}
