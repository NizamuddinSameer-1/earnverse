"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { IconUser, IconVerified, IconCheckCircle, IconVault, IconCoins, IconLogout } from "@/components/ui/Icons";

export default function ProfilePage() {
  const [upiId, setUpiId] = useState("cryptoking@oksbi");
  const [trc20, setTrc20] = useState("TJ98ak28X...88v19");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-4xl">
        {/* Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-elevated border border-border-dark p-4 rounded">
          <div className="flex items-center gap-3">
            <IconUser size={24} className="text-lime-neon" />
            <div className="flex flex-col">
              <h1 className="font-grotesk text-xl font-bold text-text-primary uppercase tracking-tight">
                OPERATOR PROFILE // SECURITY & PREFERENCES
              </h1>
              <span className="font-mono text-xs text-text-muted">
                Manage destination payout addresses, trust telemetry, and authentication keys.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-lime-neon font-bold">
            <span className="w-2 h-2 rounded-full bg-lime-neon" />
            <span>SESSION VALIDATED</span>
          </div>
        </div>

        {/* Profile Card Hero */}
        <div className="bg-surface-elevated border border-border-dark p-6 rounded flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded bg-surface border border-lime-neon/50 flex items-center justify-center text-lime-neon font-mono font-bold text-2xl">
                CK
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-grotesk text-xl font-bold text-text-primary">
                    @cryptoking
                  </span>
                  <span className="font-mono text-[10px] bg-gold-accent/15 text-gold-accent border border-gold-accent/30 px-2 py-0.5 rounded uppercase font-bold">
                    GOLD TIER LV 12
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-text-muted mt-1">
                  <span className="text-lime-neon font-bold flex items-center gap-1">
                    <IconVerified size={14} />
                    Trust Score 100/100
                  </span>
                  <span>·</span>
                  <span>0 Strikes</span>
                  <span>·</span>
                  <span>Member since Aug 2026</span>
                </div>
              </div>
            </div>

            <span className="px-3 py-1 bg-lime-neon/10 border border-lime-neon/30 text-lime-neon font-mono text-xs rounded font-bold">
              VERIFIED OPERATOR
            </span>
          </div>

          {/* 4-Column Stat Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-surface border border-border-dark rounded font-mono text-xs">
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] uppercase">TASKS COMPLETED</span>
              <span className="font-grotesk text-xl font-bold text-text-primary mt-1">1,284</span>
            </div>
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] uppercase">LIFETIME EARNED</span>
              <span className="font-grotesk text-xl font-bold text-gold-accent mt-1">$184.50</span>
            </div>
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] uppercase">REFERRALS</span>
              <span className="font-grotesk text-xl font-bold text-text-primary mt-1">23</span>
            </div>
            <div className="flex flex-col">
              <span className="text-text-muted text-[10px] uppercase">ACTIVE STREAK</span>
              <span className="font-grotesk text-xl font-bold text-lime-neon mt-1">6 DAYS</span>
            </div>
          </div>
        </div>

        {/* Linked Payout Methods Settings Form */}
        <form onSubmit={handleSave} className="bg-surface-elevated border border-border-dark p-6 rounded flex flex-col gap-5 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-border-dark pb-3">
            <h2 className="font-grotesk text-base font-bold text-text-primary">
              LINKED CASHOUT DESTINATIONS
            </h2>
            <span className="text-text-muted text-[11px]">Saved destinations for 1-click cashouts</span>
          </div>

          {isSaved && (
            <div className="p-3 bg-lime-neon/10 border border-lime-neon/40 text-lime-neon rounded flex items-center gap-2">
              <IconCheckCircle size={18} />
              <span>Updated payout configurations stored to private vault profile.</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-text-muted uppercase">Default UPI ID</label>
            <div className="relative">
              <IconVault size={18} className="absolute left-3 top-2.5 text-text-muted" />
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@bank"
                className="w-full bg-surface border border-border-dark focus:border-lime-neon rounded pl-10 pr-4 py-2.5 text-text-primary outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-text-muted uppercase">Default USDT (TRC-20) Tron Wallet</label>
            <div className="relative">
              <IconCoins size={18} className="absolute left-3 top-2.5 text-text-muted" />
              <input
                type="text"
                value={trc20}
                onChange={(e) => setTrc20(e.target.value)}
                placeholder="T..."
                className="w-full bg-surface border border-border-dark focus:border-lime-neon rounded pl-10 pr-4 py-2.5 text-text-primary outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border-dark">
            <Link
              href="/login"
              className="text-crimson-accent hover:underline flex items-center gap-1 font-bold"
            >
              <IconLogout size={16} />
              <span>TERMINATE SESSION</span>
            </Link>

            <button
              type="submit"
              className="px-5 py-2.5 bg-lime-neon text-text-inverted font-grotesk font-bold uppercase rounded hover:brightness-110 active:scale-95 transition-all"
            >
              SAVE CONFIGURATION
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
