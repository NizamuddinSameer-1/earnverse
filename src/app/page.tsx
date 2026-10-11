"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CoinIcon, EvLogo } from "@/components/ui/CoinIcon";
import {
  RewardSticker,
  SocialHeartSticker,
  MediaPlaySticker,
  SparkleBadge,
} from "@/components/ui/Sticker";
import {
  IconBolt,
  IconVideo,
  IconCash,
  IconWallet,
  IconCheck,
  IconPlay,
  IconHeart,
  IconSparkles,
  IconArrowRight,
  IconShield,
  IconClock,
  IconCoins,
  IconFlame,
} from "@/components/ui/Icons";

const payoutRails = [
  {
    name: "UPI (India)",
    sub: "Direct bank transfer to GPay, PhonePe, Paytm",
    min: "500 Coins (₹50)",
    speed: "Instant",
    fee: "0% Free",
    icon: "🇮🇳",
  },
  {
    name: "USDT (Tether)",
    sub: "Global stablecoin payout (TRC-20 & BEP-20)",
    min: "5,000 Coins ($5.00)",
    speed: "5–15 Mins",
    fee: "0% Free",
    icon: "₮",
  },
  {
    name: "Litecoin (LTC)",
    sub: "Ultra-low fee blockchain settlement",
    min: "1,000 Coins ($1.00)",
    speed: "Instant",
    fee: "0% Free",
    icon: "Ł",
  },
  {
    name: "PayPal USD",
    sub: "Direct transfer to verified PayPal email",
    min: "5,000 Coins ($5.00)",
    speed: "12–24 Hours",
    fee: "2% Rail Fee",
    icon: "💳",
  },
  {
    name: "Digital Gift Cards",
    sub: "Amazon, Steam, and Google Play vouchers",
    min: "5,000 Coins ($5.00)",
    speed: "Instant Code",
    fee: "0% Free",
    icon: "🎁",
  },
];

export default function LandingPage() {
  const [visitedCount, setVisitedCount] = useState(2);
  const [bumpClaimed, setBumpClaimed] = useState(false);

  const handleVisit = () => {
    if (visitedCount < 3) {
      setVisitedCount(3);
    }
  };

  const handleBump = () => {
    if (visitedCount >= 3) {
      setBumpClaimed(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7FB] text-[#17152F] selection:bg-[#10A875]/20 selection:text-[#10A875] font-sans antialiased overflow-x-hidden">
      {/* =========================================================
          1. TOP NAVIGATION
          Compact, professional, sticky glass navbar
         ========================================================= */}
      <header className="sticky top-0 z-50 bg-[#F7F7FB]/90 backdrop-blur-xl border-b border-[#E4E2EE]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <EvLogo size={36} />
            <div className="flex flex-col">
              <span className="font-grotesk font-bold text-lg tracking-wider text-[#17152F] group-hover:text-[#10A875] transition-colors flex items-center gap-2">
                EARNVERSE
                <span className="font-mono text-[10px] text-[#10A875] uppercase px-2 py-0.5 rounded-full bg-[#10A875]/10 border border-[#10A875]/20 font-semibold tracking-normal">
                  CREATOR SAAS
                </span>
              </span>
              <span className="text-[11px] text-[#77758D] hidden sm:block">
                The Feed That Pays You Back
              </span>
            </div>
          </Link>

          {/* Navigation Anchors */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#77758D]">
            <Link href="#three-ways" className="hover:text-[#17152F] transition-colors">
              Three Ways
            </Link>
            <Link href="#how-it-works" className="hover:text-[#17152F] transition-colors">
              How It Works
            </Link>
            <Link href="#creator-growth" className="hover:text-[#17152F] transition-colors">
              Creator Growth
            </Link>
            <Link href="#cashout" className="hover:text-[#17152F] transition-colors">
              Cashout Rails
            </Link>
            <Link href="/proof" className="hover:text-[#17152F] transition-colors flex items-center gap-1.5">
              <span>Proof</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10A875]" />
            </Link>
          </nav>

          {/* Actions & Balance Preview */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 bg-white border border-[#E4E2EE] px-3 py-1.5 rounded-xl shadow-xs text-xs font-mono">
              <CoinIcon size={14} />
              <span className="font-bold text-[#17152F] tabular-nums">2,450</span>
              <span className="text-[#77758D]">($2.45)</span>
            </div>

            <Link
              href="/login"
              className="text-xs font-semibold text-[#17152F] hover:text-[#10A875] px-3.5 py-2 rounded-xl hover:bg-white border border-transparent hover:border-[#E4E2EE] transition-all"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#10A875] hover:bg-[#0E9769] active:scale-[0.98] px-4 py-2 rounded-xl shadow-[0_2px_8px_rgba(16,168,117,0.25)] transition-all"
            >
              <CoinIcon size={14} className="text-white drop-shadow-none" />
              <span>Start Earning</span>
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================
          2. HERO SECTION
          Two-column editorial headline on left, product composition on right
         ========================================================= */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Value Proposition */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E4E2EE] shadow-xs w-max text-xs font-mono text-[#17152F]">
              <span className="w-2 h-2 rounded-full bg-[#10A875] animate-pulse" />
              <span className="font-medium text-[#77758D]">CREATOR ECONOMY • REWARDS PROTOCOL</span>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="font-grotesk text-4xl sm:text-5xl lg:text-[54px] font-bold text-[#17152F] tracking-tight leading-[1.08]">
                The feed that <br className="hidden sm:inline" />
                <span className="text-[#10A875] relative inline-block">
                  pays you back.
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-2.5 text-[#10A875]/30"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="text-base sm:text-lg text-[#77758D] leading-relaxed max-w-lg mt-2">
                Surveys, app offers, and viral clipping bounties — cash out from{" "}
                <strong className="text-[#17152F] font-semibold">$1.00</strong> via UPI, Litecoin, USDT,
                PayPal, or gift cards with <strong className="text-[#10A875] font-semibold">zero processing fees</strong>.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#10A875] hover:bg-[#0E9769] text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-[0_4px_16px_rgba(16,168,117,0.3)] hover:shadow-[0_6px_20px_rgba(16,168,117,0.4)] active:scale-[0.98] transition-all"
              >
                <CoinIcon size={16} className="text-white drop-shadow-none" />
                <span>Start earning</span>
                <IconArrowRight size={16} />
              </Link>

              <Link
                href="#three-ways"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#F0F0F7] text-[#17152F] text-sm font-semibold px-5 py-3.5 rounded-xl border border-[#E4E2EE] shadow-xs active:scale-[0.98] transition-all"
              >
                <span>See how it works</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#E4E2EE] text-xs font-mono text-[#77758D]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10A875]" />
                <span className="font-semibold text-[#17152F]">Instant Payouts</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3F9F]" />
                <span className="font-semibold text-[#17152F]">0% Hidden Fees</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFC533]" />
                <span className="font-semibold text-[#17152F]">1,000🪙 = $1.00 USD</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Digital Product Composition */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Ambient backdrop glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#10A875]/10 via-[#FF3F9F]/5 to-[#FFC533]/10 rounded-3xl blur-2xl pointer-events-none" />

            <div className="relative w-full max-w-[480px]">
              {/* Floating Top Sticker: +340 coins earned */}
              <div className="absolute -top-5 -left-3 z-30 animate-bounce duration-1000">
                <RewardSticker coins="+340" subtext="coins credited" />
              </div>

              {/* Floating Social Sticker: 1.4k likes */}
              <div className="absolute top-24 -right-4 z-30">
                <SocialHeartSticker count="1.4k" />
              </div>

              {/* Main Product Card: Creator Campaign Card */}
              <div className="bg-white rounded-2xl border border-[#E4E2EE] shadow-[0_12px_36px_rgba(23,21,47,0.08)] p-5 relative z-10 flex flex-col gap-4">
                {/* Creator Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EEF8]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF3F9F] to-[#7B2CBF] p-0.5 shadow-sm">
                      <div className="w-full h-full bg-[#17152F] rounded-[10px] flex items-center justify-center text-white font-bold text-xs">
                        AP
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-grotesk font-bold text-sm text-[#17152F]">@ApexPulse</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10A875]" />
                      </div>
                      <span className="text-[11px] text-[#77758D] font-mono">
                        48.2K subs • Gaming & Clips
                      </span>
                    </div>
                  </div>
                  <SparkleBadge text="HOT BOUNTY" />
                </div>

                {/* Campaign Video Thumbnail Preview */}
                <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#17152F] via-[#2A264F] to-[#17152F] aspect-video flex flex-col justify-between p-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <MediaPlaySticker duration="0:30" />
                    <span className="text-[10px] font-mono uppercase bg-white/10 backdrop-blur-md text-white px-2 py-0.5 rounded font-medium">
                      1080p 60fps
                    </span>
                  </div>

                  <div className="flex items-center justify-center my-auto">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform cursor-pointer">
                      <IconPlay size={18} className="translate-x-0.5" />
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between text-white text-xs">
                    <span className="font-medium">Apex Legends Beat-Sync Reel</span>
                    <span className="font-mono text-[#FFC533] font-bold">12 spots left</span>
                  </div>
                </div>

                {/* Reward & Action Strip */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#77758D] block">
                      BOUNTY REWARD
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <CoinIcon size={16} />
                      <span className="font-grotesk font-bold text-lg text-[#17152F] tabular-nums">
                        25,000
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#10A875]">
                        ($25.00 USD)
                      </span>
                    </div>
                  </div>

                  <Link href="/earn">
                    <button className="px-4 py-2 bg-[#17152F] hover:bg-[#252249] text-white text-xs font-bold font-grotesk uppercase rounded-xl transition-all cursor-pointer">
                      Claim Bounty
                    </button>
                  </Link>
                </div>
              </div>

              {/* Layered Mini Wallet Card Behind / Below */}
              <div className="mt-3 bg-white/95 rounded-xl border border-[#E4E2EE] p-3.5 shadow-sm flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#10A875]/10 border border-[#10A875]/20 flex items-center justify-center text-[#10A875]">
                    <IconWallet size={16} />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#77758D] block">Wallet Balance</span>
                    <span className="font-mono font-bold text-[#17152F] tabular-nums">
                      4,850 Coins ($4.85)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#10A875] font-semibold bg-[#10A875]/10 px-2 py-0.5 rounded-full">
                    97% TO $5.00 CASHOUT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. "THREE WAYS TO PLAY" SECTION
          Refined product panels: Earn, Grow, Spend
         ========================================================= */}
      <section id="three-ways" className="py-20 px-4 sm:px-6 border-t border-[#E4E2EE] bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-xs text-[#10A875] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#10A875]/10 border border-[#10A875]/20">
              PLATFORM ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-grotesk font-bold text-[#17152F] mt-3 mb-3">
              Three ways to play. One balance that grows.
            </h2>
            <p className="text-[#77758D] text-sm sm:text-base leading-relaxed">
              Whether you are an everyday earner or an ambitious content creator, EarnVerse puts your screen time to work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {/* Panel 1: EARN */}
            <div className="bg-[#F7F7FB] border border-[#E4E2EE] rounded-2xl p-6 flex flex-col justify-between hover:border-[#10A875]/40 hover:shadow-md transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#10A875]/10 border border-[#10A875]/20 flex items-center justify-center text-[#10A875] group-hover:scale-105 transition-transform">
                    <IconBolt size={22} />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#10A875] bg-[#10A875]/10 px-2.5 py-1 rounded-full">
                    01 • EARN
                  </span>
                </div>

                <h3 className="text-xl font-grotesk font-bold text-[#17152F] mb-2">
                  Complete Tasks & Surveys
                </h3>
                <p className="text-xs text-[#77758D] leading-relaxed mb-6">
                  Answer verified market research surveys, test new mobile games, and verify app offers. Instant postback credit directly into your ledger.
                </p>

                {/* Mini Product UI: Task List */}
                <div className="bg-white rounded-xl border border-[#E4E2EE] p-3 flex flex-col gap-2.5 shadow-xs mb-4">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#F0EEF8]">
                    <span className="font-semibold text-[#17152F] truncate">BitLabs FinTech Poll</span>
                    <span className="font-mono text-[#10A875] font-bold shrink-0">+1,450🪙</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-[#F0EEF8]">
                    <span className="font-semibold text-[#17152F] truncate">Torox Strategy RPG</span>
                    <span className="font-mono text-[#10A875] font-bold shrink-0">+12,000🪙</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#17152F] truncate">Consumer Media Study</span>
                    <span className="font-mono text-[#10A875] font-bold shrink-0">+850🪙</span>
                  </div>
                </div>
              </div>

              <Link
                href="/earn"
                className="text-xs font-bold text-[#10A875] group-hover:underline flex items-center gap-1.5 pt-2"
              >
                <span>Browse task feed</span>
                <IconArrowRight size={14} />
              </Link>
            </div>

            {/* Panel 2: GROW */}
            <div className="bg-[#F7F7FB] border border-[#E4E2EE] rounded-2xl p-6 flex flex-col justify-between hover:border-[#FF3F9F]/40 hover:shadow-md transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FF3F9F]/10 border border-[#FF3F9F]/20 flex items-center justify-center text-[#FF3F9F] group-hover:scale-105 transition-transform">
                    <IconVideo size={22} />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#FF3F9F] bg-[#FF3F9F]/10 px-2.5 py-1 rounded-full">
                    02 • GROW
                  </span>
                </div>

                <h3 className="text-xl font-grotesk font-bold text-[#17152F] mb-2">
                  Promote Channels & Get Seen
                </h3>
                <p className="text-xs text-[#77758D] leading-relaxed mb-6">
                  Visit and support fellow creators to earn free visibility bumps. Complete 3 channel visits to automatically push your own content to the top.
                </p>

                {/* Mini Product UI: Bump Board */}
                <div className="bg-white rounded-xl border border-[#E4E2EE] p-3 flex flex-col gap-2.5 shadow-xs mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-[#77758D]">VISIT PROGRESS</span>
                    <span className="font-mono font-bold text-[#FF3F9F]">2 / 3 COMPLETE</span>
                  </div>
                  <div className="w-full bg-[#F0EEF8] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#FF3F9F] h-full w-[66%]" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-[#17152F]">
                    <span className="font-semibold truncate">@GamerRavi (2.1K subs)</span>
                    <span className="text-[#FF3F9F] font-bold">1 visit left → BUMP</span>
                  </div>
                </div>
              </div>

              <Link
                href="#creator-growth"
                className="text-xs font-bold text-[#FF3F9F] group-hover:underline flex items-center gap-1.5 pt-2"
              >
                <span>View Creator Board</span>
                <IconArrowRight size={14} />
              </Link>
            </div>

            {/* Panel 3: SPEND */}
            <div className="bg-[#F7F7FB] border border-[#E4E2EE] rounded-2xl p-6 flex flex-col justify-between hover:border-[#FFC533]/60 hover:shadow-md transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FFC533]/15 border border-[#FFC533]/30 flex items-center justify-center text-[#B45309] group-hover:scale-105 transition-transform">
                    <IconCash size={22} />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#B45309] bg-[#FFC533]/20 px-2.5 py-1 rounded-full">
                    03 • CASHOUT
                  </span>
                </div>

                <h3 className="text-xl font-grotesk font-bold text-[#17152F] mb-2">
                  Cash Out or Reinvest
                </h3>
                <p className="text-xs text-[#77758D] leading-relaxed mb-6">
                  Convert your balance to real cash from $1.00, or reinvest your coins to sponsor creator bounties and drive viral traffic to your channels.
                </p>

                {/* Mini Product UI: Cashout Options */}
                <div className="bg-white rounded-xl border border-[#E4E2EE] p-3 flex flex-col gap-2 shadow-xs mb-4">
                  <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#F0EEF8]">
                    <span className="text-[#77758D]">UPI (India)</span>
                    <span className="font-mono font-semibold text-[#17152F]">Min 500🪙 (₹50)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-1.5 border-b border-[#F0EEF8]">
                    <span className="text-[#77758D]">USDT Crypto</span>
                    <span className="font-mono font-semibold text-[#17152F]">Min 5,000🪙 ($5.00)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#77758D]">Creator Boost</span>
                    <span className="font-mono font-bold text-[#10A875]">Instant Reinvest</span>
                  </div>
                </div>
              </div>

              <Link
                href="/wallet"
                className="text-xs font-bold text-[#B45309] group-hover:underline flex items-center gap-1.5 pt-2"
              >
                <span>Explore cashout rails</span>
                <IconArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. CAMPAIGN INSTRUCTIONS SECTION
          "Know what to do before you start"
          Clean authentic application interface with subtle light pink tint
         ========================================================= */}
      <section className="py-20 px-4 sm:px-6 border-t border-[#E4E2EE] bg-[#FCF8FA]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="font-mono text-xs text-[#FF3F9F] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-[#FF3F9F]/10 border border-[#FF3F9F]/20">
              CAMPAIGN SPECIFICATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-grotesk font-bold text-[#17152F] mt-3 mb-2">
              Know what to do before you start.
            </h2>
            <p className="text-[#77758D] text-sm">
              Clear rules, authentic creator requirements, and transparent step-by-step review workflows.
            </p>
          </div>

          {/* Authentic Campaign Interface Card */}
          <div className="bg-white rounded-2xl border border-[#E4E2EE] shadow-[0_8px_30px_rgba(23,21,47,0.06)] p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Media Thumbnail & Summary */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="relative rounded-xl overflow-hidden bg-[#17152F] aspect-video flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white z-20">
                    <IconPlay size={18} className="translate-x-0.5" />
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold">Apex Beat-Sync Cut</span>
                    <span className="font-mono text-[#FFC533] font-bold">25,000 Coins ($25)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-[#F7F7FB] border border-[#E4E2EE]">
                  <span className="text-[#77758D]">Sponsoring Creator:</span>
                  <span className="font-bold text-[#17152F]">@ApexPulse</span>
                </div>
              </div>

              {/* Requirements & Checklist */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div>
                  <h3 className="font-grotesk font-bold text-lg text-[#17152F] mb-1">
                    Requirements Checklist
                  </h3>
                  <p className="text-xs text-[#77758D]">
                    Follow these guidelines to ensure rapid operator approval and instant wallet payout.
                  </p>
                </div>

                <div className="flex flex-col gap-3 font-sans text-xs">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F7FB] border border-[#E4E2EE]">
                    <div className="w-5 h-5 rounded-full bg-[#10A875]/10 text-[#10A875] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      ✓
                    </div>
                    <div>
                      <strong className="text-[#17152F] block">High Definition Quality</strong>
                      <span className="text-[#77758D]">Export in 1080p 60fps with clear audio balance and no watermarks.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F7FB] border border-[#E4E2EE]">
                    <div className="w-5 h-5 rounded-full bg-[#10A875]/10 text-[#10A875] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      ✓
                    </div>
                    <div>
                      <strong className="text-[#17152F] block">Audio Sync Hook</strong>
                      <span className="text-[#77758D]">Synchronize elimination beat drop at exactly 0:12 using provided audio stems.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F7F7FB] border border-[#E4E2EE]">
                    <div className="w-5 h-5 rounded-full bg-[#10A875]/10 text-[#10A875] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      ✓
                    </div>
                    <div>
                      <strong className="text-[#17152F] block">Public Attribution</strong>
                      <span className="text-[#77758D]">Include creator handle @ApexPulse and #EarnVerse in video caption upon posting.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Horizontal Submission Workflow Tracker */}
            <div className="mt-8 pt-6 border-t border-[#E4E2EE]">
              <span className="text-[11px] font-mono text-[#77758D] uppercase tracking-wider block mb-4">
                SUBMISSION WORKFLOW
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#F7F7FB] border border-[#E4E2EE] text-center">
                  <span className="text-[10px] font-mono text-[#10A875] font-bold block">STEP 01</span>
                  <span className="text-xs font-semibold text-[#17152F]">Claim Spot</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F7FB] border border-[#E4E2EE] text-center">
                  <span className="text-[10px] font-mono text-[#10A875] font-bold block">STEP 02</span>
                  <span className="text-xs font-semibold text-[#17152F]">Submit Link</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F7FB] border border-[#E4E2EE] text-center">
                  <span className="text-[10px] font-mono text-[#FF3F9F] font-bold block">STEP 03</span>
                  <span className="text-xs font-semibold text-[#17152F]">Review (&lt;24h)</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F7FB] border border-[#E4E2EE] text-center">
                  <span className="text-[10px] font-mono text-[#FFC533] font-bold block">STEP 04</span>
                  <span className="text-xs font-semibold text-[#17152F]">Instant Payout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. CREATOR GROWTH SECTION
          "Help three creators. Get seen by everyone."
          Distinct Dark Navy (#17152F) background
         ========================================================= */}
      <section id="creator-growth" className="py-22 px-4 sm:px-6 bg-[#17152F] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-xs text-[#FF3F9F] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full bg-[#FF3F9F]/15 border border-[#FF3F9F]/30">
              ORGANIC DISCOVERY LOOP
            </span>
            <h2 className="text-3xl sm:text-4xl font-grotesk font-bold text-white mt-3 mb-3">
              Help three creators. Get seen by everyone.
            </h2>
            <p className="text-[#A2A0B8] text-sm sm:text-base leading-relaxed">
              Our organic community loop rewards mutual support. Discover 3 fellow creators in your niche, and EarnVerse places your channel at the top of the community feed for free.
            </p>
          </div>

          {/* Interactive Progress Bar */}
          <div className="max-w-xl mx-auto mb-10 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#A2A0B8]">YOUR BUMP PROGRESS:</span>
              <span className="text-[#FF3F9F] font-bold">
                {visitedCount} OF 3 CHANNELS VISITED ({visitedCount === 3 ? "100%" : "66%"})
              </span>
            </div>
            <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#FF3F9F] to-[#10A875] h-full transition-all duration-300"
                style={{ width: `${(visitedCount / 3) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#A2A0B8] pt-1">
              <span>{visitedCount === 3 ? "Ready to bump channel!" : "Visit 1 more channel to unlock free top slot"}</span>
              <button
                onClick={handleBump}
                disabled={visitedCount < 3 || bumpClaimed}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  bumpClaimed
                    ? "bg-[#10A875] text-white"
                    : visitedCount >= 3
                    ? "bg-[#FF3F9F] hover:bg-[#E6358C] text-white cursor-pointer shadow-md"
                    : "bg-white/10 text-white/40 cursor-not-allowed"
                }`}
              >
                {bumpClaimed ? "✓ Post Bumped to Top!" : "Bump My Post"}
              </button>
            </div>
          </div>

          {/* Creator Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5 flex flex-col justify-between hover:border-white/[0.2] transition-all">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                    GR
                  </div>
                  <div>
                    <h3 className="font-grotesk font-bold text-sm text-white">@GamerRavi</h3>
                    <span className="text-[11px] text-[#A2A0B8] font-mono">Gaming • 2.1K subs</span>
                  </div>
                </div>
                <p className="text-xs text-[#A2A0B8] mb-4">
                  "Warzone tactical highlights & weapon loadout analysis."
                </p>
              </div>
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-[11px] text-[#10A875] font-mono">Visited ✓</span>
                <span className="text-xs text-white/60">Verified</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5 flex flex-col justify-between hover:border-white/[0.2] transition-all">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 font-bold text-sm">
                    EQ
                  </div>
                  <div>
                    <h3 className="font-grotesk font-bold text-sm text-white">@EditQueen</h3>
                    <span className="text-[11px] text-[#A2A0B8] font-mono">Editing • 890 subs</span>
                  </div>
                </div>
                <p className="text-xs text-[#A2A0B8] mb-4">
                  "CapCut velocity tutorials & viral TikTok transitions."
                </p>
              </div>
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-[11px] text-[#10A875] font-mono">Visited ✓</span>
                <span className="text-xs text-white/60">Verified</span>
              </div>
            </div>

            {/* Card 3 (Actionable target) */}
            <div className="bg-white/[0.05] border border-white/[0.1] rounded-2xl p-5 flex flex-col justify-between hover:border-[#FF3F9F]/40 transition-all">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm">
                    TU
                  </div>
                  <div>
                    <h3 className="font-grotesk font-bold text-sm text-white">@TechUncut</h3>
                    <span className="text-[11px] text-[#A2A0B8] font-mono">Tech • 5.4K subs</span>
                  </div>
                </div>
                <p className="text-xs text-[#A2A0B8] mb-4">
                  "Daily AI creator tool reviews and video equipment tests."
                </p>
              </div>
              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                {visitedCount >= 3 ? (
                  <span className="text-[11px] text-[#10A875] font-mono">Visited ✓</span>
                ) : (
                  <button
                    onClick={handleVisit}
                    className="px-3 py-1 bg-[#10A875] hover:bg-[#0E9769] text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Visit Channel
                  </button>
                )}
                <span className="text-xs text-[#FFC533] font-mono">+10 Coins</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. CASHOUT SECTION
          Supported payout methods with honest manual review disclosure
         ========================================================= */}
      <section id="cashout" className="py-20 px-4 sm:px-6 border-t border-[#E4E2EE] bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="font-mono text-xs text-[#10A875] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full bg-[#10A875]/10 border border-[#10A875]/20">
              FINTECH DISBURSEMENT RAILS
            </span>
            <h2 className="text-3xl sm:text-4xl font-grotesk font-bold text-[#17152F] mt-3 mb-2">
              Real cash. Real rails. From $1.00.
            </h2>
            <p className="text-[#77758D] text-sm">
              We connect directly to domestic fiat rails and global crypto networks. No point decay, no mystery tokens.
            </p>
          </div>

          {/* Payout Rail Chips Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {payoutRails.map((rail, idx) => (
              <div
                key={idx}
                className="bg-[#F7F7FB] border border-[#E4E2EE] rounded-2xl p-5 flex flex-col justify-between hover:border-[#10A875]/40 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="text-2xl mb-2">{rail.icon}</div>
                  <h3 className="font-grotesk font-bold text-sm text-[#17152F] mb-1">{rail.name}</h3>
                  <p className="text-[11px] text-[#77758D] leading-tight mb-4">{rail.sub}</p>
                </div>

                <div className="pt-3 border-t border-[#E4E2EE] flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-[#10A875]">{rail.fee}</span>
                  <span className="text-[#77758D]">{rail.min}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Honest Manual Review Disclosure Banner */}
          <div className="p-4 rounded-2xl bg-[#F7F7FB] border border-[#E4E2EE] flex items-center gap-3 text-xs text-[#77758D]">
            <IconShield size={18} className="text-[#10A875] shrink-0" />
            <span>
              <strong className="text-[#17152F]">Operator Fraud Review:</strong> To protect creator escrows and maintain bank-grade compliance, every cashout is verified before release. Typical processing time is 1 to 12 hours with zero deductions.
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. FINAL CONVERSION CTA PANEL
          "Start with your first task" with subtle coin sticker accent
         ========================================================= */}
      <section className="py-20 px-4 sm:px-6 bg-[#F7F7FB]">
        <div className="max-w-4xl mx-auto relative">
          {/* Playful Sticker Accent on Corner */}
          <div className="absolute -top-4 -right-2 z-20 hidden sm:block">
            <RewardSticker coins="100 FREE" subtext="welcome bonus" />
          </div>

          <div className="rounded-3xl bg-[#17152F] text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_12px_40px_rgba(23,21,47,0.15)] flex flex-col items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#10A875]/20 border border-[#10A875]/40 flex items-center justify-center text-[#10A875]">
              <IconBolt size={28} />
            </div>

            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-grotesk font-bold tracking-tight mb-3">
                Start with your first task.
              </h2>
              <p className="text-sm sm:text-base text-[#A2A0B8] leading-relaxed">
                Create your free account in 30 seconds. Earn your first coins right now and cash out when you reach $1.00.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#10A875] hover:bg-[#0E9769] text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-[0_4px_16px_rgba(16,168,117,0.4)] active:scale-[0.98] transition-all"
              >
                <CoinIcon size={16} className="text-white drop-shadow-none" />
                <span>Start earning now</span>
                <IconArrowRight size={16} />
              </Link>

              <Link
                href="/earn"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm px-6 py-3.5 rounded-xl border border-white/20 active:scale-[0.98] transition-all"
              >
                <span>Browse open tasks</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          8. FOOTER
          Clean, minimal, compliant
         ========================================================= */}
      <footer className="border-t border-[#E4E2EE] bg-white py-12 px-4 sm:px-6 text-xs text-[#77758D]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <EvLogo size={30} />
            <span className="font-grotesk font-bold text-[#17152F] tracking-wider text-sm">
              EARNVERSE
            </span>
            <span className="text-[#E4E2EE]">|</span>
            <span>© 2026 EarnVerse Global Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link href="/home" className="hover:text-[#17152F] transition-colors">
              Dashboard
            </Link>
            <Link href="/earn" className="hover:text-[#17152F] transition-colors">
              Task Feed
            </Link>
            <Link href="/wallet" className="hover:text-[#17152F] transition-colors">
              Cashout
            </Link>
            <Link href="/creator-studio" className="hover:text-[#17152F] transition-colors">
              Creator Studio
            </Link>
            <Link href="/proof" className="hover:text-[#17152F] transition-colors">
              Proof Ledger
            </Link>
            <Link href="/login" className="hover:text-[#17152F] transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
