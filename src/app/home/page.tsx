"use client";

import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { Reveal } from "@/components/ui/Reveal";
import {
  IconBolt,
  IconWallet,
  IconFlame,
  IconTrophy,
  IconShield,
  IconArrowRight,
  IconVault,
} from "@/components/ui/Icons";

const featuredTasks = [
  {
    id: "ft-1",
    type: "bounty",
    title: "Apex Legends 30s Beat-Sync TikTok Cut",
    creator: "@ApexPulse",
    time: "15 min",
    coins: 25000,
    usd: "$25.00",
    badge: "CREATOR BOUNTY",
    badgeType: "gold" as const,
    spots: "7 left",
  },
  {
    id: "ft-2",
    type: "survey",
    title: "Global FinTech & Crypto Payment Habits Study",
    creator: "BitLabs Research",
    time: "8 min",
    coins: 1450,
    usd: "$1.45",
    badge: "OFFERWALL SURVEY",
    badgeType: "lime" as const,
    spots: "Open",
  },
  {
    id: "ft-3",
    type: "gaming",
    title: "Reach Castle Level 10 in War Strategy",
    creator: "Torox Arcade",
    time: "20 min",
    coins: 12000,
    usd: "$12.00",
    badge: "HIGH YIELD",
    badgeType: "lime" as const,
    spots: "Milestone",
  },
  {
    id: "ft-4",
    type: "bounty",
    title: "Extract 45s Podcast Debate Hook for Shorts",
    creator: "@Web3Uncut",
    time: "10 min",
    coins: 15000,
    usd: "$15.00",
    badge: "CREATOR BOUNTY",
    badgeType: "gold" as const,
    spots: "3 left",
  },
];

const settlementSteps = [
  { step: "01", label: "Task credited", detail: "Offerwall or bounty coins post to your vault" },
  { step: "02", label: "Cashout requested", detail: "Coins are held while the request is PENDING" },
  { step: "03", label: "Operator review", detail: "Each payout is checked before release" },
  { step: "04", label: "Rail disbursed", detail: "UPI · USDT TRC-20 · LTC · PayPal" },
];

export default function HomeHudPage() {
  // Single source of truth for the vault figure: same live endpoint the
  // sidebar widget uses, so the two numbers on this screen never disagree.
  const [balance, setBalance] = React.useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

  React.useEffect(() => {
    fetch("/api/user/wallet")
      .then((res) => {
        if (!res.ok) {
          setIsLoggedIn(false);
          setBalance(0);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.data && typeof data.data.availableCoins === "number") {
          setBalance(data.data.availableCoins);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setBalance(0);
        }
      })
      .catch((e) => {
        console.error("Vault balance fetch error", e);
        setIsLoggedIn(false);
        setBalance(0);
      });
  }, []);

  return (
    <DashboardLayout>
      {/* Screen-reader page title: the vault balance is the real focal point, so no
          visible H1 was used — this restores document structure without visual noise. */}
      <h1 className="sr-only">EarnVerse — Earnings Dashboard</h1>

      <div className="flex flex-col gap-8">
        {/* Top Status & Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded bg-surface-card border border-border-dark text-xs font-mono">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-canvas text-gold-accent border border-gold-accent/25 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-accent" />
              PEG: 1,000 COINS = $1.00
            </span>
            <span className="text-text-muted">
              SETTLEMENT: <strong className="text-text-primary">OPERATOR-REVIEWED</strong>
            </span>
            <span className="text-border-hover">|</span>
            <span className="text-text-muted">
              LEDGER: <strong className="text-lime-neon">APPEND-ONLY</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap min-w-0">
            <span className="text-text-muted">
              TASK FEED: <strong className="text-lime-neon">OFFERWALLS + BOUNTIES</strong>
            </span>
            <Badge variant="lime">
              ESCROW-PROTECTED
            </Badge>
          </div>
        </div>

        {/* Hero Section: Balance Terminal + Streak Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Vault Balance Card (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Reveal delay={1}>
            <Card emphasis="lime">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 shrink-0 rounded bg-lime-neon/15 border border-lime-neon/30 flex items-center justify-center text-lime-neon">
                    <IconWallet size={18} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <CardTitle as="h2">AVAILABLE VAULT TERMINAL</CardTitle>
                    <CardDescription>Append-only ledger · operator-reviewed cashouts</CardDescription>
                  </div>
                </div>

                {!isLoggedIn ? (
                  <Badge variant="slate">GUEST PREVIEW</Badge>
                ) : balance >= 500 ? (
                  <Badge variant="lime" dot>
                    READY TO CASHOUT
                  </Badge>
                ) : (
                  <Badge variant="slate">MIN 500 COINS VIA UPI</Badge>
                )}
              </CardHeader>

              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-mono uppercase text-text-muted tracking-wider">
                      Confirmed Balance
                    </span>
                    <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                      <CoinIcon size={40} />
                      <span
                        key={balance}
                        className="font-grotesk text-5xl sm:text-6xl font-bold text-text-primary tracking-tight tabular-nums leading-none coin-tick"
                      >
                        {balance.toLocaleString()}
                      </span>
                      <span className="font-mono text-sm text-gold-accent font-bold uppercase">
                        COINS
                      </span>
                      <span className="font-mono text-lg text-text-muted ml-2 tabular-nums">
                        ≈ ${(balance / 1000).toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                      <Link href="/wallet">
                        <Button
                          variant="neon"
                          size="md"
                          rightIcon={<IconBolt size={15} strokeWidth={2.5} />}
                        >
                          WITHDRAW COINS
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/login">
                        <Button
                          variant="neon"
                          size="md"
                          rightIcon={<IconBolt size={15} strokeWidth={2.5} />}
                        >
                          SIGN IN TO CASHOUT
                        </Button>
                      </Link>
                    )}
                    <Link href="/earn">
                      <Button variant="secondary" size="md">
                        BROWSE TASKS
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Sub-metrics Strip */}
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border-subtle">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[10px] text-text-dim uppercase">24h Earnings</span>
                    <span className="font-mono text-sm font-bold text-lime-neon tabular-nums">
                      +1,850 Coins ($1.85)
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[10px] text-text-dim uppercase">Completed Tasks</span>
                    <span className="font-mono text-sm font-bold text-text-primary tabular-nums">
                      34 Tasks
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[10px] text-text-dim uppercase">Trust Score</span>
                    <span className="font-mono text-sm font-bold text-gold-accent flex items-center gap-1">
                      <IconShield size={13} /> 100% · 0 Strikes
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            </Reveal>

            {/* Curated Task Matrix Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconFlame size={18} className="text-lime-neon shrink-0" />
                  <h2 className="font-grotesk text-base font-bold text-text-primary uppercase tracking-wide">
                    HIGH-YIELD & CREATOR BOUNTY FEED
                  </h2>
                </div>
                <Link
                  href="/earn"
                  className="font-mono text-xs text-lime-neon hover:underline flex items-center gap-1"
                >
                  <span>View All Tasks</span>
                  <IconArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredTasks.map((task, i) => (
                  <Reveal key={task.id} delay={2 + i}>
                  <Card interactive className="group h-full">
                    <CardContent className="flex flex-col gap-3 h-full">
                      <div className="flex items-center justify-between">
                        <Badge variant={task.badgeType} size="sm">
                          {task.badge}
                        </Badge>
                        <span className="font-mono text-[10px] text-text-dim">
                          {task.spots}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="font-grotesk font-bold text-sm text-text-primary group-hover:text-lime-neon transition-colors line-clamp-1">
                          {task.title}
                        </span>
                        <span className="font-mono text-[11px] text-text-muted">
                          By {task.creator} · {task.time}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                        <div className="flex items-baseline gap-1.5">
                          <CoinIcon size={14} />
                          <span className="font-mono font-bold text-sm text-text-primary tabular-nums">
                            +{task.coins.toLocaleString()}
                          </span>
                          <span className="font-mono text-[11px] text-gold-accent font-semibold">
                            ({task.usd})
                          </span>
                        </div>

                        <Link href="/earn">
                          <Button variant="outline" size="sm">
                            START
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Gamified Streak Tracker & Activity Stream */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Gamified Daily Streak Card */}
            <Card emphasis="gold">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <IconTrophy size={18} className="text-gold-accent" />
                  <CardTitle>DAILY LOGIN STREAK</CardTitle>
                </div>
                <Badge variant="gold">DAY 6 / 7</Badge>
              </CardHeader>

              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-grotesk text-2xl font-bold text-text-primary">
                      Up to 1.45x
                    </span>
                    <span className="font-mono text-[11px] text-text-muted">
                      On offerwall & clip payouts with an active streak
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded bg-gold-accent/15 border border-gold-accent/30 flex items-center justify-center text-gold-accent">
                    <IconFlame size={24} />
                  </div>
                </div>

                {/* 7-Day Pill Visualizer */}
                <div className="grid grid-cols-7 gap-1.5 pt-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                    const isCompleted = day < 6;
                    const isCurrent = day === 6;
                    return (
                      <div
                        key={day}
                        className={`flex flex-col items-center justify-center py-2 rounded font-mono text-[10px] border transition-all ${
                          isCompleted
                            ? "bg-lime-neon/15 border-lime-neon/30 text-lime-neon font-bold"
                            : isCurrent
                            ? "bg-gold-accent/20 border-gold-accent text-gold-accent font-bold ring-1 ring-gold-accent/30"
                            : "bg-surface border-border-dark text-text-dim"
                        }`}
                      >
                        <span>D{day}</span>
                        <span className="text-[8px] mt-0.5">
                          {day === 7 ? "★" : isCompleted ? "✓" : "+50"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded bg-surface border border-border-dark flex items-center justify-between font-mono text-[11px]">
                  <span className="text-text-muted">Day 7 Jackpot:</span>
                  <strong className="text-gold-accent">+500 COINS ($0.50)</strong>
                </div>
              </CardContent>
            </Card>

            {/* Settlement Pipeline Explainer */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <IconVault size={16} className="text-lime-neon" />
                  <CardTitle>SETTLEMENT PIPELINE</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">
                {settlementSteps.map((item) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-3 font-mono text-xs p-2 rounded bg-surface border border-border-subtle"
                  >
                    <span className="font-bold text-lime-neon shrink-0">{item.step}</span>
                    <div className="flex flex-col min-w-0 gap-0.5">
                      <strong className="text-text-primary">{item.label}</strong>
                      <span className="text-[10px] text-text-muted">
                        {item.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="justify-center">
                <Link
                  href="/ledger"
                  className="text-xs text-text-muted hover:text-lime-neon transition-colors"
                >
                  Open Full Audit Ledger →
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
