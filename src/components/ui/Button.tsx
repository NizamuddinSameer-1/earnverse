import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "neon" | "secondary" | "outline" | "ghost" | "gold" | "danger";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  children,
  className = "",
  variant = "neon",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5 rounded",
    md: "px-4 py-2 text-xs font-bold gap-2 rounded",
    lg: "px-6 py-3 text-sm font-bold gap-2.5 rounded",
  }[size];

  const variantStyles = {
    neon: "bg-lime-neon text-text-inverted hover:brightness-110 hover:shadow-[2px_2px_0_rgba(198,255,62,0.5)] active:shadow-none border border-lime-dim/60",
    gold: "bg-gold-accent text-text-inverted hover:brightness-110 hover:shadow-[2px_2px_0_rgba(255,176,32,0.5)] active:shadow-none border border-gold-dim/60",
    secondary:
      "bg-surface-card text-text-primary border border-border-dark hover:border-border-hover hover:bg-surface-elevated",
    outline:
      "bg-transparent text-text-primary border border-border-dark hover:border-lime-neon/50 hover:text-lime-neon hover:bg-lime-neon/[0.04]",
    ghost:
      "bg-transparent text-text-muted hover:text-text-primary hover:bg-white/[0.05] active:bg-white/[0.08]",
    danger:
      "bg-crimson-accent/15 text-crimson-accent border border-crimson-accent/30 hover:bg-crimson-accent/25 active:bg-crimson-accent/35",
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-grotesk tracking-wide uppercase select-none transition-all duration-150 active:scale-[0.98] active:translate-y-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-neon/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
