"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { IconReferral, IconCheck, IconCopy } from "@/components/ui/Icons";

const referralsList = [
  { handle: "@neon_4", date: "Today 10:14 UTC", tasks: 42, coins: "+1,420 Coins", status: "ACTIVE" },
  { handle: "@alex_99", date: "Yesterday 14:02 UTC", tasks: 18, coins: "+680 Coins", status: "ACTIVE" },
  { handle: "@karan_v", date: "03 Oct 19:40 UTC", tasks: 9, coins: "+310 Coins", status: "IDLE" },
  { handle: "@crypto_bro", date: "29 Sep 08:15 UTC", tasks: 88, coins: "+1,710 Coins", status: "ACTIVE" },
];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "CRYPTOKING";
  const referralLink = "https://earnverse.io/join/CRYPTOKING";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-elevated border border-border-dark p-4 rounded">
          <div className="flex items-center gap-3">
            <IconReferral size={24} className="text-lime-neon" />
            <div className="flex flex-col">
              <h1 className="font-grotesk text-xl font-bold text-text-primary uppercase tracking-tight">
                REFERRAL HUB // LIFETIME 10% AFFILIATE REVENUE
              </h1>
              <span className="font-mono text-xs text-text-muted">
                Invite fellow earners. Earn a permanent 10% split on every completed task with zero deduction from them.
              </span>
            </div>
          </div>

          <span className="font-mono text-xs text-lime-neon bg-lime-neon/10 border border-lime-neon/30 px-3 py-1 rounded font-bold">
            10% TIER 1 ACTIVE
          </span>
        </div>

        {/* Shareable Link Box */}
        <div className="bg-surface-elevated border border-border-dark p-6 rounded flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <span className="text-text-muted uppercase font-bold text-[10px]">
              YOUR UNIQUE INVOCATION LINK
            </span>
            <div className="bg-surface border border-border-dark p-3 rounded flex items-center justify-between gap-3 text-text-primary">
              <span className="truncate font-bold">{referralLink}</span>
              <span className="text-lime-neon text-[10px] shrink-0 font-bold bg-lime-neon/10 px-2 py-0.5 rounded">
                CODE: {referralCode}
              </span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="px-6 py-3 bg-lime-neon text-text-inverted font-grotesk font-bold text-xs uppercase rounded hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shrink-0 hover:shadow-[2px_2px_0_rgba(198,255,62,0.5)] active:shadow-none"
          >
            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
            <span>{copied ? "COPIED TO CLIPBOARD" : "COPY REFERRAL LINK"}</span>
          </button>
        </div>

        {/* 4-Stat Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-surface-elevated border border-border-dark p-4 rounded flex flex-col justify-between gap-1">
            <span className="text-text-muted uppercase text-[10px]">TOTAL REFERRALS</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-grotesk text-2xl font-bold text-text-primary">23</span>
              <span className="text-lime-neon font-bold text-xs">+4 this week</span>
            </div>
            <div className="w-full bg-surface h-1 rounded-full overflow-hidden mt-1">
              <div className="bg-lime-neon h-full w-[76%]" />
            </div>
          </div>

          <div className="bg-surface-elevated border border-border-dark p-4 rounded flex flex-col justify-between gap-1">
            <span className="text-text-muted uppercase text-[10px]">COMMISSIONS EARNED</span>
            <div className="flex items-baseline gap-2 mt-1">
              <CoinIcon size={20} />
              <span className="font-grotesk text-2xl font-bold text-gold-accent">4,120</span>
              <span className="text-gold-accent font-bold text-xs">COINS</span>
            </div>
            <span className="text-text-muted text-[11px]">$4.12 USD value total</span>
          </div>

          <div className="bg-surface-elevated border border-border-dark p-4 rounded flex flex-col justify-between gap-1">
            <span className="text-text-muted uppercase text-[10px]">REVENUE SHARE TIER</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-grotesk text-2xl font-bold text-lime-neon">10%</span>
              <span className="text-text-primary text-xs">LIFETIME</span>
            </div>
            <span className="text-text-muted text-[11px]">Lifetime share of referral earnings</span>
          </div>

          <div className="bg-surface-elevated border border-border-dark p-4 rounded flex flex-col justify-between gap-1">
            <span className="text-text-muted uppercase text-[10px]">SETTLEMENT</span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-lime-neon" />
              <span className="font-bold text-text-primary">LEDGER-TRACKED</span>
            </div>
            <span className="text-text-muted text-[11px]">Referral earnings post to your ledger</span>
          </div>
        </div>

        {/* Active Referrals Table */}
        <div className="bg-surface-elevated border border-border-dark rounded overflow-hidden font-mono text-xs">
          <div className="p-4 border-b border-border-dark bg-surface flex items-center justify-between">
            <span className="font-bold uppercase text-text-primary">
              INVITED EARNERS & PERFORMANCE
            </span>
            <span className="text-text-muted text-[11px]">Showing 4 recent active referrals</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border-dark text-text-muted uppercase text-[10px]">
                  <th className="py-2.5 px-4">OPERATOR HANDLE</th>
                  <th className="py-2.5 px-4">JOINED DATE</th>
                  <th className="py-2.5 px-4 text-center">TASKS COMPLETED</th>
                  <th className="py-2.5 px-4 text-right">TOTAL EARNED FOR YOU</th>
                  <th className="py-2.5 px-4 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {referralsList.map((row, i) => (
                  <tr key={i} className="hover:bg-surface-item transition-colors">
                    <td className="py-3 px-4 text-text-primary font-bold">{row.handle}</td>
                    <td className="py-3 px-4 text-text-muted">{row.date}</td>
                    <td className="py-3 px-4 text-center text-text-primary font-bold">{row.tasks}</td>
                    <td className="py-3 px-4 text-right text-gold-accent font-bold">{row.coins}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-lime-neon/15 text-lime-neon text-[10px] font-bold">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
