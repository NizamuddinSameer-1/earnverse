"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { Skeleton, SkeletonRows, SkeletonStat } from "@/components/ui/Skeleton";
import {
  IconLedger,
  IconSearch,
  IconRefresh,
  IconWallet,
  IconCheck,
  IconBolt,
  IconCoins,
  IconShield,
  IconAlertTriangle,
} from "@/components/ui/Icons";

interface FormattedLedgerEntry {
  id: string;
  time: string;
  dateGroup: "TODAY" | "YESTERDAY" | "OLDER";
  source: string;
  title: string;
  ref: string;
  coins: number;
  usd: string;
  status: "CREDITED" | "ESCROW" | "WITHDRAWN" | "PENDING";
  type: "offer" | "bounty" | "referral" | "cashout";
  createdAt: string;
}

interface LedgerStats {
  todayCoins: number;
  todayCount: number;
  weekCoins: number;
  weekUsd: string;
  lifetimeCoins: number;
  lifetimeUsd: string;
}

export default function LedgerPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [entries, setEntries] = useState<FormattedLedgerEntry[]>([]);
  const [stats, setStats] = useState<LedgerStats>({
    /* ERR-010: neutral defaults only — no fabricated lifetime totals. */
    todayCoins: 0,
    todayCount: 0,
    weekCoins: 0,
    weekUsd: "0.00",
    lifetimeCoins: 0,
    lifetimeUsd: "0.00",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  /* ERR-010: assume signed-out until the API proves otherwise. */
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchLedger = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetch("/api/user/ledger");
      if (res.status === 401) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      if (!res.ok) {
        setLoadError(`The ledger service responded with ${res.status}.`);
        setIsLoading(false);
        return;
      }
      const json = await res.json();
      if (json.success && json.data) {
        setEntries(json.data.entries || []);
        if (json.data.stats) {
          setStats(json.data.stats);
        }
        setIsAuthenticated(true);
      } else {
        setLoadError("The ledger came back in an unexpected format.");
      }
    } catch (err) {
      /* Previously this only console.error'd, so a network failure rendered a
         silent "no records" table — indistinguishable from a genuinely empty
         ledger. Now it surfaces a human-readable error with a Retry action. */
      console.error("Failed to load user ledger:", err);
      setLoadError("We could not reach the ledger. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const filteredEntries = entries.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.ref.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Header Strip */}
        <div className="relative overflow-hidden rounded bg-gradient-to-r from-surface-card via-surface to-canvas border border-border-dark p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-lime-neon/10 border border-lime-neon/30 flex items-center justify-center text-lime-neon">
                <IconLedger size={24} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight uppercase">
                    EARNINGS LEDGER // TRANSACTION AUDIT LOG
                  </h1>
                  <Badge variant="lime" dot>
                    IMMUTABLE & SYNCED
                  </Badge>
                </div>
                <span className="font-mono text-xs text-text-muted mt-1">
                  Granular append-only audit trail of every coin minted, claimed, or disbursed.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchLedger}
                leftIcon={<IconRefresh size={14} className={isLoading ? "animate-spin" : ""} />}
              >
                REFRESH
              </Button>
              <Link href="/wallet">
                <Button variant="secondary" size="sm" leftIcon={<IconWallet size={14} />}>
                  CASHOUT TERMINAL
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded bg-gold-accent/10 border border-gold-accent/30 text-xs font-mono text-gold-accent">
            <div className="flex items-center gap-2.5">
              <IconShield size={16} className="text-gold-accent shrink-0" />
              <span>
                <strong>SANDBOX PREVIEW:</strong> You are browsing as a guest. The transactions shown below are sandbox mock events. Sign in to inspect your live immutable cryptographic audit trail.
              </span>
            </div>
            <Link
              href="/login"
              className="px-3 py-1 bg-gold-accent text-text-inverted rounded font-bold uppercase hover:brightness-110 transition-all text-xs"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* 3-Cell Accumulated Metric Banner */}
        {isLoading ? (
          <SkeletonStat cols={3} className="[&>div]:p-4" />
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card emphasis="lime">
            <CardContent className="flex flex-col justify-between gap-1 p-4 font-mono">
              <span className="text-[10px] text-text-muted uppercase">CLEARED TODAY</span>
              <div className="flex items-baseline gap-2 mt-1">
                <CoinIcon size={20} />
                <span className="font-grotesk text-2xl font-bold text-lime-neon tabular-nums">
                  +{stats.todayCoins.toLocaleString()}
                </span>
                <span className="text-xs text-lime-neon font-bold">COINS</span>
              </div>
              <span className="text-xs text-text-muted mt-1">
                {stats.todayCount} transactions today
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col justify-between gap-1 p-4 font-mono">
              <span className="text-[10px] text-text-muted uppercase">CLEARED THIS WEEK</span>
              <div className="flex items-baseline gap-2 mt-1">
                <CoinIcon size={20} />
                <span className="font-grotesk text-2xl font-bold text-text-primary tabular-nums">
                  +{stats.weekCoins.toLocaleString()}
                </span>
                <span className="text-xs text-gold-accent font-bold">COINS</span>
              </div>
              <span className="text-xs text-text-muted mt-1">
                ≈ ${stats.weekUsd} USD verified
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col justify-between gap-1 p-4 font-mono">
              <span className="text-[10px] text-text-muted uppercase">LIFETIME ACCUMULATED</span>
              <div className="flex items-baseline gap-2 mt-1">
                <CoinIcon size={20} />
                <span className="font-grotesk text-2xl font-bold text-gold-accent tabular-nums">
                  {stats.lifetimeCoins.toLocaleString()}
                </span>
                <span className="text-xs text-gold-accent font-bold">COINS</span>
              </div>
              <span className="text-xs text-text-muted mt-1">
                ≈ ${stats.lifetimeUsd} USD cleared
              </span>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Filter Tabs and Search Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 p-1 bg-surface-card border border-border-dark rounded overflow-x-auto w-full sm:w-auto">
            {[
              { id: "all", label: "ALL TRANSACTIONS" },
              { id: "offer", label: "OFFERWALLS" },
              { id: "bounty", label: "BOUNTIES" },
              { id: "referral", label: "REFERRALS" },
              { id: "cashout", label: "CASHOUTS" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded transition-all font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                  filterType === tab.id
                    ? "bg-lime-neon text-text-inverted"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <div className="absolute left-3 top-2.5 text-text-dim pointer-events-none">
              <IconSearch size={15} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ref ID or task..."
              className="w-full bg-surface border border-border-dark focus:border-lime-neon/80 rounded pl-9 pr-3 py-2 text-text-primary outline-none text-xs font-mono transition-colors"
            />
          </div>
        </div>

        {/* Ledger Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconLedger size={16} className="text-lime-neon" />
              <CardTitle as="h2">VERIFIED DOUBLE-ENTRY LEDGER</CardTitle>
            </div>
            <Badge variant="lime" dot>
              {filteredEntries.length} RECORDS
            </Badge>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border-dark bg-surface text-text-muted text-[10px] uppercase">
                    <th className="p-3.5 pl-5 w-32">DATE / TIME</th>
                    <th className="p-3.5 w-40">SOURCE</th>
                    <th className="p-3.5">TASK & MILESTONE</th>
                    <th className="p-3.5 text-right w-36">AMOUNT</th>
                    <th className="p-3.5 pr-5 text-right w-36">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {loadError && !isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-crimson-accent/15 border border-crimson-accent/40 flex items-center justify-center text-crimson-accent">
                            <IconAlertTriangle size={20} />
                          </div>
                          <p className="text-text-primary font-bold text-sm">{loadError}</p>
                          <p className="text-text-dim text-xs font-mono max-w-sm">
                            Your balance is unchanged. This only affects the transaction list below.
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchLedger}
                            leftIcon={<IconRefresh size={14} />}
                          >
                            RETRY
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : isLoading ? (
                    /* Layout-matched skeleton rows: real <tr>/<td> so the table
                       keeps its geometry and the swap causes zero CLS. */
                    <SkeletonRows rows={6} cols={5} />
                  ) : filteredEntries.length > 0 ? (
                    filteredEntries.map((row) => (
                      <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3.5 pl-5 text-text-muted whitespace-nowrap">
                          {row.time}
                        </td>
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-surface-card border border-border-dark text-text-primary text-[10px] font-bold">
                            {row.source}
                          </span>
                        </td>
                        <td className="p-3.5 min-w-[280px]">
                          <div className="font-grotesk text-xs text-text-primary font-medium truncate">
                            {row.title}
                          </div>
                          <div className="text-[10px] text-text-dim uppercase mt-0.5">
                            REF: {row.ref}
                          </div>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div
                            className={`font-bold tabular-nums ${
                              row.coins < 0 ? "text-crimson-accent" : "text-lime-neon"
                            }`}
                          >
                            {row.coins > 0 ? `+${row.coins.toLocaleString()}` : row.coins.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-text-dim">
                            {row.usd}
                          </div>
                        </td>
                        <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                          <Badge
                            variant={
                              row.status === "CREDITED"
                                ? "lime"
                                : row.status === "ESCROW"
                                ? "gold"
                                : row.status === "WITHDRAWN"
                                ? "slate"
                                : "crimson"
                            }
                            size="sm"
                          >
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-text-dim font-mono">
                        No matching ledger records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
