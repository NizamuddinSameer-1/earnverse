import React from "react";
import Link from "next/link";
import { CoinIcon, EvLogo } from "@/components/ui/CoinIcon";
import { IconArrowRight, IconTerminal, IconBolt, IconVideo, IconCash } from "@/components/ui/Icons";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas text-text-primary selection:bg-lime-neon selection:text-black">
      {/* 1. Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border-dark bg-surface/95 backdrop-none">
        <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <EvLogo size={34} />
            <div className="flex items-baseline gap-2">
              <span className="font-grotesk font-bold text-xl tracking-wider text-text-primary group-hover:text-lime-neon transition-colors">
                EARNVERSE
              </span>
              <span className="hidden sm:inline-block font-mono text-[10px] text-lime-neon uppercase px-2 py-0.5 rounded bg-lime-neon/10 border border-lime-neon/20 font-bold">
                ESCROW-BACKED
              </span>
            </div>
          </Link>

          {/* Navigation Anchors */}
          <nav className="hidden md:flex items-center gap-7 font-mono text-xs text-text-muted">
            <Link href="#features" className="hover:text-text-primary transition-colors">
              Features
            </Link>
            <Link href="#offerwalls" className="hover:text-text-primary transition-colors">
              Offerwalls
            </Link>
            <Link href="#bounties" className="hover:text-text-primary transition-colors">
              Creator Bounties
            </Link>
            <Link href="#payouts" className="hover:text-text-primary transition-colors">
              Payout Rails
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/login"
              className="font-mono text-xs text-text-muted hover:text-text-primary px-3 py-1.5 rounded hover:bg-surface-card transition-colors whitespace-nowrap"
            >
              Terminal Log In
            </Link>
            <Link
              href="/register"
              className="font-grotesk font-bold tracking-wide uppercase text-xs bg-lime-neon text-text-inverted px-4 py-2 rounded hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap hover:shadow-[2px_2px_0_rgba(198,255,62,0.5)] active:shadow-none"
            >
              <span>ENTER APP</span>
              <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Live Telemetry Strip — a landmark (role=status) so its text is not orphaned
          outside header/main/footer (axe `region`). */}
      <div
        role="region"
        aria-label="Platform status"
        className="border-b border-border-dark bg-surface-card py-2 px-6"
      >
        <div className="max-w-[1240px] mx-auto flex items-center justify-between text-xs font-mono text-text-muted">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-lime-neon font-bold">
              <span className="w-2 h-2 rounded-full bg-lime-neon" />
              LEDGER: APPEND-ONLY
            </span>
            <span className="text-border-hover">|</span>
            <span>SETTLEMENT: OPERATOR-REVIEWED</span>
            <span className="text-border-hover">|</span>
            <span className="text-text-primary">TASK FEED: OFFERWALLS + BOUNTIES</span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-text-muted">SUPPORTED DISBURSEMENTS:</span>
            <span className="text-text-primary font-bold">UPI · USDT · LTC · PAYPAL</span>
          </div>
        </div>
      </div>

      {/* 3. Hero Section */}
      <section aria-label="Hero" className="relative pt-16 pb-20 px-6 border-b border-border-dark">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-elevated border border-border-dark w-max font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-lime-neon" />
              <span className="text-text-muted">NEXT-GEN ARCADE EARNING ENGINE</span>
            </div>

            <h1 className="font-grotesk text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.08]">
              GAMIFIED MICRO-TASK HUD. <br />
              <span className="text-lime-neon">MINT VALUE</span> FROM SCREEN TIME.
            </h1>

            <p className="font-body text-base text-text-muted max-w-xl leading-relaxed">
              Direct offerwalls, operator-verified creator bounties, and an append-only ledger behind every coin. Zero point inflation, 1,000 Coins = $1.00 USD flat peg.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/home"
                className="px-6 py-3 bg-lime-neon text-text-inverted font-grotesk font-bold text-sm uppercase rounded hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 hover:shadow-[2px_2px_0_rgba(198,255,62,0.5)] active:shadow-none"
              >
                <span>LAUNCH EARNER HUD</span>
                <IconTerminal size={18} />
              </Link>
              <Link
                href="/earn"
                className="px-6 py-3 bg-surface-elevated border border-border-dark hover:border-lime-neon/50 text-text-primary font-grotesk font-semibold text-sm uppercase rounded transition-all flex items-center gap-2"
              >
                <span>EXPLORE OFFERS</span>
                <IconBolt size={18} />
              </Link>
            </div>

            {/* Quick Guarantees Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border-dark font-mono text-xs">
              <div className="flex flex-col">
                <span className="text-text-muted text-[10px] uppercase">PEG RATIO</span>
                <span className="text-lime-neon font-bold text-sm">1,000 COINS = $1.00</span>
              </div>
              <div className="flex flex-col">
                <span className="text-text-muted text-[10px] uppercase">MIN WITHDRAWAL</span>
                <span className="text-gold-accent font-bold text-sm">500 COINS VIA UPI</span>
              </div>
              <div className="flex flex-col">
                <span className="text-text-muted text-[10px] uppercase">ESCROW PROTECTION</span>
                <span className="text-text-primary font-bold text-sm">ESCROW-BACKED</span>
              </div>
            </div>
          </div>

          {/* Right Hero Interactive HUD Card */}
          <div className="lg:col-span-5 bg-surface-elevated border border-border-dark rounded p-5 flex flex-col gap-4">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-border-dark pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-crimson-accent/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-gold-accent/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-lime-neon/80" />
                <span className="font-mono text-xs text-text-muted ml-2">HUD_PREVIEW.exe</span>
              </div>
              <span className="font-mono text-[10px] bg-lime-neon/10 text-lime-neon px-2 py-0.5 rounded border border-lime-neon/20 font-bold">
                INTERACTIVE PREVIEW
              </span>
            </div>

            {/* Preview panel — deliberately shows NO fabricated account balance.
                ERR-010 / DESIGN.md §8 / PRD.md risk #7: placeholder trust claims must
                not ship as if they were real. The peg rate below is a genuine economy
                constant (ADR-003), not invented performance data. */}
            <div className="bg-surface border border-border-dark p-4 rounded flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase text-text-muted">SANDBOX PREVIEW</span>
                <span className="font-mono text-[10px] text-text-dim border border-border-dark px-1.5 py-0.5 rounded">
                  NO LIVE ACCOUNT
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <CoinIcon size={22} />
                <span className="font-mono text-2xl font-bold text-text-muted tabular-nums">—</span>
                <span className="font-mono text-xs text-text-muted font-bold">COINS</span>
              </div>
              <p className="font-mono text-[10px] text-text-dim leading-relaxed">
                Sign in to load your real balance from the append-only ledger. Figures shown inside the
                preview below are illustrative only.
              </p>
              <div className="w-full bg-surface-item h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-border-hover h-full w-full" />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-text-dim">
                <span>XP PROGRESSION</span>
                <span>ILLUSTRATIVE</span>
              </div>
            </div>

            {/* Simulated Task Sample */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[11px] text-text-muted uppercase">SAMPLE CONTRACTS</span>
                <span className="font-mono text-[9px] text-text-dim border border-border-dark px-1.5 py-0.5 rounded">
                  ILLUSTRATIVE
                </span>
              </div>

              <div className="bg-surface border border-border-dark p-3 rounded flex items-center justify-between gap-3 hover:border-lime-neon/40 transition-colors">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-surface-elevated text-text-muted rounded">BitLabs</span>
                    <span className="font-mono text-[9px] text-lime-neon">OFFERWALL</span>
                  </div>
                  <span className="font-grotesk text-xs font-bold text-text-primary truncate mt-0.5">
                    FinTech Sentiment Survey 2026
                  </span>
                  <span className="font-mono text-[10px] text-text-muted">12 min · 340 claims</span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="font-mono text-xs font-bold text-gold-accent">+850 COINS</span>
                  <span className="font-mono text-[10px] text-text-muted">≈ $0.85</span>
                </div>
              </div>

              <div className="bg-surface border border-border-dark p-3 rounded flex items-center justify-between gap-3 hover:border-lime-neon/40 transition-colors">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-crimson-accent/10 text-crimson-accent rounded font-bold">CREATOR BOUNTY</span>
                    <span className="font-mono text-[9px] text-text-muted">12 SPOTS LEFT</span>
                  </div>
                  <span className="font-grotesk text-xs font-bold text-text-primary truncate mt-0.5">
                    Twitch Raid: Apex Elimination Clip Sync
                  </span>
                  <span className="font-mono text-[10px] text-text-muted">Fast turnaround · 1440p</span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="font-mono text-xs font-bold text-gold-accent">+25,000 COINS</span>
                  <span className="font-mono text-[10px] text-text-muted">≈ $25.00</span>
                </div>
              </div>
            </div>

            <Link
              href="/home"
              className="w-full py-2 bg-surface-high hover:bg-lime-neon hover:text-text-inverted text-text-primary font-grotesk font-bold text-xs uppercase rounded text-center transition-all"
            >
              ENTER DASHBOARD TO CLAIM
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Three Pillars Section */}
      <section id="features" aria-label="Features" className="py-20 px-6 border-b border-border-dark">
        <div className="max-w-[1240px] mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-2 max-w-xl">
            <span className="font-mono text-xs text-lime-neon uppercase font-bold tracking-wider">
              [ 01 // ARCHITECTURE ]
            </span>
            <h2 className="font-grotesk text-3xl sm:text-4xl font-bold text-text-primary">
              ENGINEERED FOR RAPID, VERIFIABLE LIQUIDITY
            </h2>
            <p className="font-body text-text-muted text-sm">
              We eliminated the sketchy middle-man cuts and multi-week approval queues common in legacy platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-surface-elevated border border-border-dark p-6 rounded flex flex-col gap-4">
              <div className="w-10 h-10 rounded bg-surface border border-border-dark flex items-center justify-center text-lime-neon">
                <IconBolt size={22} />
              </div>
              <h3 className="font-grotesk text-lg font-bold text-text-primary">
                Multi-Network Offerwalls
              </h3>
              <p className="font-body text-text-muted text-xs leading-relaxed">
                BitLabs, CPX Research, Torox, and Lootably — every survey or install credits straight into your append-only ledger.
              </p>
              <div className="mt-auto pt-3 border-t border-border-dark flex items-center justify-between font-mono text-[11px]">
                <span className="text-text-muted">TASK EVENTS</span>
                <span className="text-lime-neon font-bold">APPEND-ONLY LEDGER</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-elevated border border-border-dark p-6 rounded flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded bg-surface border border-border-dark flex items-center justify-center text-gold-accent">
                  <IconVideo size={22} />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-gold-accent/15 text-gold-accent border border-gold-accent/30">
                  COMING SOON
                </span>
              </div>
              <h3 className="font-grotesk text-lg font-bold text-text-primary">
                Viral Clipping & Creator Bounties
              </h3>
              <p className="font-body text-text-muted text-xs leading-relaxed">
                Streamers and YouTubers fund escrow bounties for clip cuts, beat syncs, and viral shorts. Currently scheduled for Phase 2 launch.
              </p>
              <div className="mt-auto pt-3 border-t border-border-dark flex items-center justify-between font-mono text-[11px]">
                <span className="text-text-muted">ROADMAP</span>
                <span className="text-gold-accent font-bold">PHASE 2 EXPANSION</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-elevated border border-border-dark p-6 rounded flex flex-col gap-4">
              <div className="w-10 h-10 rounded bg-surface border border-border-dark flex items-center justify-center text-text-primary">
                <IconCash size={22} />
              </div>
              <h3 className="font-grotesk text-lg font-bold text-text-primary">
                Micro-Disbursement Rails
              </h3>
              <p className="font-body text-text-muted text-xs leading-relaxed">
                Cash out via UPI (500 Coin min), USDT TRC-20, Litecoin (LTC), or PayPal. No fees on crypto and local rails. Payouts release after operator review.
              </p>
              <div className="mt-auto pt-3 border-t border-border-dark flex items-center justify-between font-mono text-[11px]">
                <span className="text-text-muted">DISBURSEMENT</span>
                <span className="text-lime-neon font-bold">0% HIDDEN FEES</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Direct Conversion Footer CTA */}
      <section aria-label="How it works" className="py-20 px-6 bg-surface-card">
        <div className="max-w-[800px] mx-auto text-center flex flex-col items-center gap-6">
          <EvLogo size={48} />
          <h2 className="font-grotesk text-3xl sm:text-4xl font-bold text-text-primary">
            READY TO POWER UP YOUR EARNING TERMINAL?
          </h2>
          <p className="font-body text-text-muted text-sm max-w-lg">
            Create an operator account and claim your 100-Coin welcome bonus. Start clearing contracts immediately.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-lime-neon text-text-inverted font-grotesk font-bold text-sm uppercase rounded hover:brightness-110 active:scale-95 transition-all hover:shadow-[2px_2px_0_rgba(198,255,62,0.5)] active:shadow-none"
            >
              CREATE FREE OPERATOR ACCOUNT
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 bg-surface-elevated border border-border-dark hover:border-lime-neon text-text-primary font-grotesk font-semibold text-sm uppercase rounded transition-all"
            >
              OPERATOR LOG IN
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-border-dark py-8 px-6 bg-surface">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <span className="text-text-primary font-bold">EARNVERSE TERMINAL</span>
            <span>© 2026. Built on an append-only ledger.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/home" className="hover:text-text-primary">Dashboard</Link>
            <Link href="/earn" className="hover:text-text-primary">Task Feed</Link>
            <Link href="/wallet" className="hover:text-text-primary">Cashout</Link>
            <Link href="/creator-studio" className="hover:text-text-primary">Creator Studio</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
