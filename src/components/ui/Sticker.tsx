import React from "react";
import { CoinIcon } from "./CoinIcon";
import { IconHeart, IconPlay, IconSparkles } from "./Icons";

interface StickerProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * 80% polished SaaS, 20% playful sticker accent.
 * Used beside hero CTAs, on reward cards, and for social proof.
 */
export function RewardSticker({
  coins = "+340",
  subtext = "coins earned",
  className = "",
}: {
  coins?: string;
  subtext?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 border border-[#E4E2EE] shadow-[0_4px_16px_rgba(23,21,47,0.08)] backdrop-blur-md text-xs font-mono select-none ${className}`}
      role="status"
      aria-label={`${coins} ${subtext}`}
    >
      <CoinIcon size={16} />
      <span className="font-bold text-[#17152F] tabular-nums tracking-tight">{coins}</span>
      <span className="text-[#77758D] text-[11px] font-sans font-medium">{subtext}</span>
    </div>
  );
}

export function SocialHeartSticker({
  count = "1.4k",
  className = "",
}: {
  count?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 border border-[#E4E2EE] shadow-[0_4px_14px_rgba(255,63,159,0.12)] text-xs font-mono text-[#FF3F9F] select-none ${className}`}
      aria-label={`${count} likes`}
    >
      <IconHeart size={13} className="text-[#FF3F9F]" />
      <span className="font-bold text-[#17152F] text-[11px] tabular-nums">{count}</span>
    </div>
  );
}

export function MediaPlaySticker({
  duration = "0:45",
  className = "",
}: {
  duration?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[11px] font-mono select-none ${className}`}
      aria-label={`Video duration ${duration}`}
    >
      <IconPlay size={10} className="text-white fill-current" />
      <span className="font-semibold tabular-nums">{duration}</span>
    </div>
  );
}

export function SparkleBadge({
  text = "VIP ACCESS",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8E6] border border-[#FFE28A] text-[#B45309] text-[10px] font-mono font-bold uppercase tracking-wider select-none ${className}`}
    >
      <IconSparkles size={12} className="text-[#D97706]" />
      <span>{text}</span>
    </div>
  );
}
