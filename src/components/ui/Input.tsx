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
          className="text-xs text-slate-300 font-medium tracking-wide flex items-center justify-between"
        >
          <span>{label}</span>
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          className={`w-full bg-[#0B0E14]/90 border ${
            error
              ? "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-white/[0.1] focus:border-amber-400/80 focus:ring-amber-400/15"
          } text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-all duration-150 placeholder:text-slate-500 focus:ring-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] ${
            leftIcon ? "pl-10" : ""
          } ${rightSlot ? "pr-16" : ""} ${className}`}
          {...props}
        />

        {rightSlot && (
          <div className="absolute right-3.5 flex items-center text-xs font-mono text-slate-400">
            {rightSlot}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 mt-0.5">
          <span className="w-1 h-1 rounded-full bg-rose-400" />
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
}
