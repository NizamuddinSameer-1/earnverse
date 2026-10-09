import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export function Input({
  label,
  helperText,
  error,
  leftIcon,
  rightSlot,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="font-mono text-[11px] uppercase tracking-wider text-text-muted font-medium"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-text-dim pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={`w-full bg-canvas border ${
            error
              ? "border-crimson-accent/60 focus:border-crimson-accent focus:ring-crimson-accent/20"
              : "border-border-dark focus:border-lime-neon/80 focus:ring-lime-neon/20"
          } text-text-primary font-mono text-xs rounded px-3.5 py-2.5 outline-none transition-all duration-150 placeholder:text-text-dim focus:ring-2 ${
            leftIcon ? "pl-9" : ""
          } ${rightSlot ? "pr-16" : ""} ${className}`}
          {...props}
        />

        {rightSlot && (
          <div className="absolute right-3 flex items-center pointer-events-none text-xs font-mono">
            {rightSlot}
          </div>
        )}
      </div>

      {error ? (
        <span className="font-mono text-[10px] text-crimson-accent">{error}</span>
      ) : helperText ? (
        <span className="font-mono text-[10px] text-text-dim">{helperText}</span>
      ) : null}
    </div>
  );
}
