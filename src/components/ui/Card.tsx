import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  emphasis?: "gold" | "emerald" | "violet" | "crimson" | "lime" | "none";
  interactive?: boolean;
}

export function Card({
  children,
  className = "",
  emphasis = "none",
  interactive = false,
  ...props
}: CardProps) {
  const emphasisStyles = {
    gold: "border-amber-500/30 hover:border-amber-400/50 shadow-[0_0_24px_-4px_rgba(245,158,11,0.15)]",
    emerald: "border-emerald-500/30 hover:border-emerald-400/50 shadow-[0_0_24px_-4px_rgba(16,185,129,0.15)]",
    violet: "border-violet-500/30 hover:border-violet-400/50 shadow-[0_0_24px_-4px_rgba(139,92,246,0.15)]",
    crimson: "border-rose-500/30 hover:border-rose-400/50",
    lime: "border-emerald-500/30 hover:border-emerald-400/50",
    none: "border-white/[0.08] hover:border-white/[0.16]",
  }[emphasis];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#0E131E]/85 backdrop-blur-xl border ${emphasisStyles} shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_4px_24px_-2px_rgba(0,0,0,0.4)] transition-all duration-200 ${
        interactive ? "hover:-translate-y-0.5 cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-5 py-4 border-b border-white/[0.06] flex items-center justify-between gap-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
  as: Tag = "h3",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4";
}) {
  return (
    <Tag
      className={`font-grotesk font-bold text-base tracking-tight text-white ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardDescription({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-xs text-slate-400 font-normal leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-5 py-3.5 bg-black/30 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
