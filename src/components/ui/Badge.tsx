import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "lime" | "gold" | "crimson" | "slate";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  children,
  className = "",
  variant = "lime",
  size = "md",
  dot = false,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[9px] gap-1",
    md: "px-2 py-0.5 text-[10px] gap-1.5",
  }[size];

  const variantStyles = {
    lime: "bg-lime-neon/12 text-lime-neon border border-lime-neon/30",
    gold: "bg-gold-accent/12 text-gold-accent border border-gold-accent/30",
    crimson: "bg-crimson-accent/12 text-crimson-accent border border-crimson-accent/30",
    slate: "bg-surface-item text-text-muted border border-border-hover",
  }[variant];

  const dotColors = {
    lime: "bg-lime-neon",
    gold: "bg-gold-accent",
    crimson: "bg-crimson-accent",
    slate: "bg-text-muted",
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-mono font-semibold uppercase tracking-wider rounded ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors} shrink-0`} />}
      <span>{children}</span>
    </span>
  );
}
