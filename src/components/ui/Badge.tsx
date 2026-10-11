import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "lime" | "emerald" | "violet" | "cyan" | "crimson" | "slate";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  children,
  className = "",
  variant = "gold",
  size = "md",
  dot = false,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] gap-1 rounded-md",
    md: "px-2.5 py-1 text-xs gap-1.5 rounded-lg",
  }[size];

  const variantStyles = {
    gold: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
    emerald: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    lime: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    violet: "bg-violet-500/10 text-violet-400 border border-violet-500/30",
    cyan: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
    crimson: "bg-rose-500/10 text-rose-400 border border-rose-500/30",
    slate: "bg-white/[0.06] text-slate-300 border border-white/[0.12]",
  }[variant];

  const dotColors = {
    gold: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
    emerald: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    lime: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
    violet: "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]",
    cyan: "bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]",
    crimson: "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]",
    slate: "bg-slate-400",
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-mono font-medium tracking-wide ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors} shrink-0`} />}
      <span>{children}</span>
    </span>
  );
}
