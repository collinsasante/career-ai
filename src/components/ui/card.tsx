import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  as?: keyof React.JSX.IntrinsicElements;
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className,
  hover = false,
  padding = "md",
  as: Tag = "div",
}: CardProps) {
  const Component = Tag as React.ElementType;
  return (
    <Component
      className={cn(
        "bg-white rounded-2xl border border-slate-100 shadow-card",
        hover &&
          "cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </Component>
  );
}

// ── Card sub-components ──────────────────────

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>{children}</div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-base font-semibold text-slate-900", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-slate-500 leading-relaxed", className)}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("pt-4", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pt-4 mt-4 border-t border-slate-100 flex items-center gap-3",
        className
      )}
    >
      {children}
    </div>
  );
}
