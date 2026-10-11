"use client";

import React from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
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
  IconCheck,
  IconCoins,
} from "@/components/ui/Icons";

const featuredTasks = [
  {
    id: "ft-1",
    network: "BITLABS",
    title: "Global FinTech & Consumer Habits Survey",
    provider: "BitLabs Research",
    time: "8 min",
    coins: 1450,
    usd: "$1.45",
    badge: "HIGH MATCH",
    badgeType: "gold" as const,
    rating: "4.9 ★",
  },
  {
    id: "ft-2",
    network: "CPX",
    title: "Technology & Streaming Platform Preferences",
    provider: "CPX Research",
    time: "12 min",
    coins: 2200,
    usd: "$2.20",
    badge: "INSTANT CREDIT",
    badgeType: "cyan" as const,
    rating: "4.8 ★",
  },
  {
    id: "ft-3",
    network: "TOROX",
    title: "Rise of Kingdoms: Reach City Hall 10",
    provider: "Torox Arcade",
    time: "Milestone",
    coins: 18500,
    usd: "$18.50",
    badge: "HIGH PAYOUT",
    badgeType: "emerald" as const,
    rating: "4.9 ★",
  },
  {
    id: "ft-4",
    network: "CREATOR",
    title: "Clip 45s Podcast Debate for YouTube Shorts",
    provider: "Creator Studio",
    time: "15 min",
    coins: 12000,
    usd: "$12.00",
    badge: "BOUNTY",
    badgeType: "violet" as const,
    rating: "VIP ONLY",
  },
];

export default function HomeHudPage() {
  const [balance, setBalance] = React.useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>("Earner");

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

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && data.user && data.user.username) {
          setUsername(data.user.username);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <h1 className="sr-only">EarnVerse — Earnings Dashboard</h1>

      <div className="flex flex-col gap-8">
        {/* Top Banner: Greeting, Streak & Level Progression */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-white/[0.03] to-indigo-500/10 border border-white/[0.08] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.25)] text-xl font-bold font-grotesk">
              {username.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-grotesk font-bold text-white">
                  Welcome back, @{username}
                </span>
                <Badge variant="gold" size="sm">
                  PRO TIER
                </Badge>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Completed 34 tasks</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <IconShield size={12} /> 100% Trust Rating
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-semibold">
              <IconFlame size={16} className="text-amber-400 animate-pulse" />
              <span>5-Day Streak (1.2X XP)</span>
            </div>
            <Link href="/rewards">
              <Button variant="secondary" size="sm">
                View Perks
              </Button>
            </Link>
          </div>
        </div>

        {/* Wealth Vault Terminal Card */}
        <Reveal delay={1}>
          <Card emphasis="gold" className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span>AVAILABLE VAULT BALANCE</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </span>
                <div className="flex items-baseline gap-3 mt-2 flex-wrap">
                  <CoinIcon size={36} />
                  <span className="font-grotesk text-4xl sm:text-5xl font-bold text-white tracking-tight tabular-nums">
                    {balance.toLocaleString()}
                  </span>
                  <span className="text-base text-amber-400 font-bold uppercase">
                    Coins
                  </span>
                  <span className="text-xl sm:text-2xl font-mono text-emerald-400 font-semibold ml-2 tabular-nums">
                    ≈ ${(balance / 1000).toFixed(2)} USD
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link href="/wallet">
                  <Button variant="gold" size="lg" rightIcon={<IconArrowRight size={16} />}>
                    Cash Out Funds
                  </Button>
                </Link>
                <Link href="/earn">
                  <Button variant="secondary" size="lg" leftIcon={<IconBolt size={16} className="text-amber-400" />}>
                    Earn More Coins
                  </Button>
                </Link>
              </div>
            </div>

            {/* Sub-Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-xs text-slate-400">24h Today's Earnings</div>
                <div className="text-xl font-bold font-grotesk text-amber-400 mt-1 tabular-nums">
                  +1,850 Coins ($1.85)
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-xs text-slate-400">Cashout Threshold Status</div>
                <div className="text-xl font-bold font-grotesk text-emerald-400 mt-1">
                  {balance >= 5000 ? "Ready to Cash Out" : `$${(balance / 1000).toFixed(2)} / $5.00 Minimum`}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-xs text-slate-400">Reward Multiplier</div>
                <div className="text-xl font-bold font-grotesk text-cyan-400 mt-1">
                  1.25X Active Boost
                </div>
              </div>
            </div>
          </Card>
        </Reveal>

        {/* Hot Tasks & Offers Feed */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <IconBolt size={20} className="text-amber-400 shrink-0" />
              <h2 className="font-grotesk text-lg font-bold text-white tracking-wide">
                TOP HIGH-YIELD OFFERS TODAY
              </h2>
            </div>
            <Link
              href="/earn"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>Explore All Offers</span>
              <IconArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredTasks.map((task, i) => (
              <Reveal key={task.id} delay={2 + i}>
                <Card interactive className="p-5 h-full flex flex-col justify-between hover:border-amber-400/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={task.badgeType} size="sm">
                        {task.badge}
                      </Badge>
                      <span className="text-xs text-slate-400 font-mono">
                        {task.rating}
                      </span>
                    </div>

                    <h3 className="font-grotesk font-bold text-base text-white hover:text-amber-400 transition-colors line-clamp-1 mb-1">
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {task.provider} • {task.time}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.08]">
                    <div className="flex items-baseline gap-1.5">
                      <CoinIcon size={16} />
                      <span className="font-mono font-bold text-base text-white tabular-nums">
                        +{task.coins.toLocaleString()}
                      </span>
                      <span className="text-xs text-amber-400 font-semibold font-mono">
                        ({task.usd})
                      </span>
                    </div>
                    <Link href={`/earn?open=${task.network.toLowerCase()}`}>
                      <Button variant="secondary" size="sm" rightIcon={<IconArrowRight size={12} />}>
                        Start Task
                      </Button>
                    </Link>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 1-Click Launchpad for BitLabs and CPX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 relative overflow-hidden group hover:border-amber-400/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold font-mono">
                  BL
                </div>
                <div>
                  <h3 className="font-grotesk font-bold text-base text-white">BitLabs Offerwall</h3>
                  <div className="text-xs text-slate-400">High completion rate surveys</div>
                </div>
              </div>
              <Badge variant="gold">
                OFFICIAL
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Launch personalized market research studies with instant coin credit directly into your balance.
            </p>
            <Link href="/earn?open=bitlabs">
              <Button variant="gold" size="md" className="w-full" rightIcon={<IconArrowRight size={14} />}>
                Launch BitLabs Lounge
              </Button>
            </Link>
          </Card>

          <Card className="p-6 relative overflow-hidden group hover:border-cyan-400/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-bold font-mono">
                  CPX
                </div>
                <div>
                  <h3 className="font-grotesk font-bold text-base text-white">CPX Research</h3>
                  <div className="text-xs text-slate-400">Adaptive matching & consolation coins</div>
                </div>
              </div>
              <Badge variant="cyan">
                TOP MATCH
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Answer quick profile questions to unlock dozens of live surveys with automatic fraud verification.
            </p>
            <Link href="/earn?open=cpx">
              <Button variant="secondary" size="md" className="w-full hover:border-cyan-400/50" rightIcon={<IconArrowRight size={14} />}>
                Launch CPX Lounge
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
