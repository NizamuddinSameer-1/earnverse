import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "neon" | "secondary" | "outline" | "ghost" | "danger" | "emerald";
  size?: "sm" | "md" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export function Button({
  children,
  className = "",
  variant = "gold",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg",
    md: "px-4 py-2 text-xs font-semibold gap-2 rounded-xl",
    lg: "px-6 py-2.5 text-sm font-semibold gap-2.5 rounded-xl",
  }[size];

  const variantStyles = {
    gold: "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_28px_rgba(245,158,11,0.4)] hover:brightness-105 active:scale-[0.98] border border-amber-300/30",
    neon: "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_28px_rgba(245,158,11,0.4)] hover:brightness-105 active:scale-[0.98] border border-amber-300/30",
    emerald: "bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_28px_rgba(16,185,129,0.4)] hover:brightness-105 active:scale-[0.98] border border-emerald-300/30",
    secondary:
      "bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] shadow-sm hover:border-white/[0.2] active:scale-[0.98]",
    outline:
      "bg-transparent text-white border border-white/[0.15] hover:border-amber-400/50 hover:text-amber-400 hover:bg-amber-400/[0.05] active:scale-[0.98]",
    ghost:
      "bg-transparent text-slate-400 hover:text-white hover:bg-white/[0.06] active:bg-white/[0.1]",
    danger:
      "bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 active:bg-rose-500/35",
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-grotesk tracking-wide select-none transition-all duration-150 active:scale-[0.98] active:translate-y-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40 disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${sizeStyles} ${variantStyles} ${className}`}
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
