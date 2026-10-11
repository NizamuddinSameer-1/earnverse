import React from "react";

interface CoinIconProps {
  className?: string;
  size?: number;
}

export function CoinIcon({ className = "text-amber-400", size = 18 }: CoinIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`inline-block shrink-0 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] ${className}`}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="url(#goldGradient)" stroke="#FDE68A" strokeWidth="1" />
      <circle cx="12" cy="12" r="7.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="2 2" />
      <path
        d="M12 7.5V16.5M9.5 9.5C9.5 8.7 10.6 8 12 8C13.4 8 14.5 8.7 14.5 9.5C14.5 11 9.5 11 9.5 12.5C9.5 13.3 10.6 14 12 14C13.4 14 14.5 13.3 14.5 12.5"
        stroke="#78350F"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="goldGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function EvLogo({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative rounded-xl bg-gradient-to-br from-amber-400/20 via-white/[0.05] to-indigo-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.25)] shrink-0 overflow-hidden group-hover:scale-105 transition-transform"
    >
      <div className="absolute inset-0 bg-radial from-amber-400/20 to-transparent pointer-events-none" />
      <svg
        className="w-5 h-5 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
        viewBox="0 0 24 24"
      >
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    </div>
  );
}
