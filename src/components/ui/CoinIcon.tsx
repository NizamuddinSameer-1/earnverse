import React from "react";

interface CoinIconProps {
  className?: string;
  size?: number;
}

export function CoinIcon({ className = "text-gold-accent", size = 16 }: CoinIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`inline-block shrink-0 ${className}`}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" fill="none" />
      <path
        d="M12 7V17M9.5 9.5C9.5 8.67 10.62 8 12 8C13.38 8 14.5 8.67 14.5 9.5C14.5 11 9.5 11 9.5 12.5C9.5 13.33 10.62 14 12 14C13.38 14 14.5 13.33 14.5 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function EvLogo({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded bg-surface-elevated border border-lime-neon/40 flex items-center justify-center text-lime-neon shrink-0"
    >
      <svg
        className="w-4 h-4 fill-current"
        viewBox="0 0 24 24"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    </div>
  );
}
