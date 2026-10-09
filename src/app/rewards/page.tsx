"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { IconTrophy, SvgIcon } from "@/components/ui/Icons";

const badges = [
  { id: "b1", title: "FIRST SETTLEMENT", desc: "Completed and withdrew your first verified payout", state: "unlocked", icon: "verified" },
  { id: "b2", title: "100 TASKS CLEARED", desc: "Successfully resolved 100 micro-contracts on ledger", state: "unlocked", icon: "military_tech" },
  { id: "b3", title: "APEX CLIP MASTER", desc: "Submitted verified shorts clip with 99%+ approval", state: "unlocked", icon: "movie" },
  { id: "b4", title: "$100 CASHOUT CLUB", desc: "Crossed $100 in cumulative net disbursements", state: "unlocked", icon: "payments" },
  { id: "b5", title: "SURVEY VIRTUOSO", desc: "Complete 100 BitLabs/CPX research studies", state: "progress", current: "84/100", icon: "poll" },
  { id: "b6", title: "WHALE REFERRER", desc: "Bring 50 active earning operators onto the platform", state: "progress", current: "23/50", icon: "groups" },
];

export default function RewardsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-elevated border border-border-dark p-4 rounded">
          <div className="flex items-center gap-3">
            <IconTrophy size={24} className="text-gold-accent" />
            <div className="flex flex-col">
              <h1 className="font-grotesk text-xl font-bold text-text-primary uppercase tracking-tight">
                REWARDS & GAMIFICATION // MULTIPLIER PROTOCOL
              </h1>
              <span className="font-mono text-xs text-text-muted">
                Boost your contract payouts up to 1.55x by maintaining streaks and unlocking milestone badges.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-lime-neon bg-lime-neon/10 border border-lime-neon/30 px-3 py-1 rounded font-bold">
            MAX MULTIPLIER: 1.55x
          </div>
        </div>

        {/* Multiplier Breakdown Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-surface-elevated border border-border-dark p-4 rounded flex flex-col gap-1">
            <span className="text-text-muted text-[10px] uppercase">BASE PAYOUT</span>
            <span className="font-grotesk text-2xl font-bold text-text-primary mt-1">1.00x</span>
            <span className="text-[11px] text-text-muted">Standard network peg</span>
          </div>

          <div className="bg-surface-elevated border border-border-dark p-4 rounded flex flex-col gap-1">
            <span className="text-text-muted text-[10px] uppercase">STREAK MULTIPLIER</span>
            <span className="font-grotesk text-2xl font-bold text-lime-neon mt-1">+0.45x</span>
            <span className="text-[11px] text-text-muted">5-Day active run</span>
          </div>

          <div className="bg-surface-elevated border border-border-dark p-4 rounded flex flex-col gap-1">
            <span className="text-text-muted text-[10px] uppercase">PRO TIER BONUS</span>
            <span className="font-grotesk text-2xl font-bold text-gold-accent mt-1">+0.10x</span>
            <span className="text-[11px] text-text-muted">Pro tier operator perk</span>
          </div>

          <div className="bg-surface-elevated border border-lime-neon/40 p-4 rounded flex flex-col gap-1 bg-lime-neon/5">
            <span className="text-lime-neon text-[10px] uppercase font-bold">COMBINED CAP</span>
            <span className="font-grotesk text-2xl font-bold text-lime-neon mt-1">1.55x</span>
            <span className="text-[11px] text-lime-neon font-bold">Base rate + streak + Pro tier bonus</span>
          </div>
        </div>

        {/* Badges and Milestones Grid */}
        <div className="bg-surface-elevated border border-border-dark rounded p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border-dark pb-3">
            <h2 className="font-grotesk text-lg font-bold text-text-primary">
              OPERATOR ACHIEVEMENTS & BADGES
            </h2>
            <span className="font-mono text-xs text-text-muted">4 of 6 Unlocked</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-4 rounded border flex items-start gap-3.5 transition-all ${
                  b.state === "unlocked"
                    ? "bg-surface border-border-dark hover:border-lime-neon/50"
                    : "bg-surface border-border-dark opacity-60"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded flex items-center justify-center shrink-0 border ${
                    b.state === "unlocked"
                      ? "bg-lime-neon/15 border-lime-neon/40 text-lime-neon"
                      : "bg-surface-elevated border-border-dark text-text-muted"
                  }`}
                >
                  <SvgIcon name={b.icon} size={20} />
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-grotesk text-xs font-bold text-text-primary truncate">
                      {b.title}
                    </span>
                    <span
                      className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded font-bold shrink-0 ${
                        b.state === "unlocked"
                          ? "bg-lime-neon/15 text-lime-neon"
                          : "bg-surface-high text-text-muted"
                      }`}
                    >
                      {b.state === "unlocked" ? "CLAIMED" : b.current}
                    </span>
                  </div>
                  <p className="font-body text-[11px] text-text-muted mt-1 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
