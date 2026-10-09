"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { CoinIcon } from "@/components/ui/CoinIcon";
import {
  IconWallet,
  IconLedger,
  IconBolt,
  IconCoins,
  IconCash,
  IconVault,
  IconCheck,
  IconShield,
  IconClock,
  IconSparkles,
} from "@/components/ui/Icons";

interface PayoutRail {
  id: string;
  name: string;
  sub: string;
  min: string;
  minCoins: number;
  fee: string;
  placeholder: string;
  icon: React.ReactNode;
}

interface WithdrawalRecord {
  id: string;
  coins: number;
  amountUsd: number;
  rail: string;
  destination: string;
  status: string;
  txRef?: string | null;
  createdAt: string;
}

const rails: PayoutRail[] = [
  {
    id: "upi",
    name: "UPI",
    sub: "India Domestic Payouts (0% Free)",
    min: "500 Coins (₹50)",
    minCoins: 500,
    fee: "0% Free",
    placeholder: "yourname@oksbi / 9876543210@paytm",
    icon: <IconBolt size={20} className="text-lime-neon" />,
  },
  {
    id: "usdt",
    name: "USDT (TRC-20 / BEP-20)",
    sub: "Direct Global Stablecoin Payout",
    min: "5,000 Coins ($5.00)",
    minCoins: 5000,
    fee: "0% Free",
    placeholder: "T... (TRC-20 Tron Address)",
    icon: <IconCoins size={20} className="text-gold-accent" />,
  },
  {
    id: "ltc",
    name: "Litecoin (LTC)",
    sub: "Low-Minimum Crypto Rail",
    min: "1,000 Coins ($1.00)",
    minCoins: 1000,
    fee: "0% Free",
    placeholder: "L... or ltc1... Litecoin Address",
    icon: <IconVault size={20} className="text-text-muted" />,
  },
  {
    id: "paypal",
    name: "PayPal Verified USD",
    sub: "Global Direct Bank Transfer",
    min: "5,000 Coins ($5.00)",
    minCoins: 5000,
    fee: "2% Rail Fee",
    placeholder: "account@paypal.com",
    icon: <IconCash size={20} className="text-text-muted" />,
  },
];

export default function WalletPage() {
  const [selectedRail, setSelectedRail] = useState<string>("upi");
  const [withdrawCoins, setWithdrawCoins] = useState<string>("1000");
  const [targetAccount, setTargetAccount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [wallet, setWallet] = useState<{
    availableCoins: number;
    pendingCoins: number;
    escrowCoins: number;
    usdValue: string;
    lifetimeEarned: number;
    lifetimeCashed: number;
    withdrawals: WithdrawalRecord[];
  }>({
    /* ERR-010: these MUST start at zero. A realistic demo figure here means any
       slow/failed/500 response leaves the page showing someone a fabricated
       balance as if it were theirs — exactly the ERR-008 split-brain bug. */
    availableCoins: 0,
    pendingCoins: 0,
    escrowCoins: 0,
    usdValue: "0.00",
    lifetimeEarned: 0,
    lifetimeCashed: 0,
    withdrawals: [],
  });

  /* ERR-010: honest default. Assume signed-OUT until the API proves otherwise. */
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchWallet = async () => {
    try {
      const res = await fetch("/api/user/wallet");
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      /* ERR-010: any non-OK or unrecognised payload must fall back to the honest
         signed-out state. Never leave the previous (or a demo) balance on screen. */
      if (!res.ok) {
        setIsAuthenticated(false);
        return;
      }
      const json = await res.json();
      if (json.success && json.data) {
        setWallet(json.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error("Failed to load live wallet data", e);
      setIsAuthenticated(false);
    }
  };

  React.useEffect(() => {
    fetchWallet();
  }, []);

  const currentRail = rails.find((r) => r.id === selectedRail) || rails[0];
  const numCoins = parseInt(withdrawCoins || "0", 10);
  const usdValue = (numCoins / 1000).toFixed(2);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAccount.trim()) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/user/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coins: numCoins,
          rail: selectedRail,
          destination: targetAccount.trim(),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message || `Disbursement queue dispatched for ${numCoins.toLocaleString()} coins.`);
        setTargetAccount("");
        fetchWallet();
        setTimeout(() => setSuccessMsg(null), 6000);
      } else {
        setErrorMsg(data.error || "Failed to process withdrawal");
      }
    } catch (err) {
      console.error("Withdraw error", err);
      setErrorMsg("Network error connecting to cashout engine");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Header Strip */}
        <div className="relative overflow-hidden rounded bg-gradient-to-r from-surface-card via-surface to-canvas border border-border-dark p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-lime-neon/10 border border-lime-neon/30 flex items-center justify-center text-lime-neon">
                <IconWallet size={24} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight uppercase">
                    CASHOUT TERMINAL // DISBURSEMENT RAILS
                  </h1>
                  <Badge variant="lime">
                    4 PAYOUT RAILS
                  </Badge>
                </div>
                <span className="font-mono text-xs text-text-muted mt-1">
                  1,000 Coins = $1.00 USD flat peg. Payouts release after operator review.
                </span>
              </div>
            </div>

            <Link href="/ledger">
              <Button variant="secondary" size="sm" leftIcon={<IconLedger size={14} />}>
                AUDIT LEDGER
              </Button>
            </Link>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded bg-gold-accent/10 border border-gold-accent/30 text-xs font-mono text-gold-accent">
            <div className="flex items-center gap-2.5">
              <IconShield size={16} className="text-gold-accent shrink-0" />
              <span>
                <strong>SANDBOX PREVIEW:</strong> You are browsing as a guest. The balances below are simulated. Please sign in to access your live account and request cashouts.
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

        {/* 4-Stat Balances Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card emphasis="lime">
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="font-mono text-[10px] uppercase text-text-muted">
                AVAILABLE TO WITHDRAW
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <CoinIcon size={22} />
                <span className="font-grotesk text-2xl font-bold text-text-primary tabular-nums">
                  {wallet.availableCoins.toLocaleString()}
                </span>
                <span className="font-mono text-xs text-gold-accent font-bold">COINS</span>
              </div>
              <span className="font-mono text-xs text-text-muted mt-1">
                ≈ ${wallet.usdValue} USD Cleared
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="font-mono text-[10px] uppercase text-text-muted">
                LIFETIME CASHOUTS
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-grotesk text-2xl font-bold text-lime-neon tabular-nums">
                  ${(wallet.lifetimeCashed / 1000).toFixed(2)}
                </span>
                <span className="font-mono text-xs text-text-dim">USD</span>
              </div>
              <span className="font-mono text-xs text-text-muted mt-1">
                {wallet.withdrawals?.filter((w) => w.status === "APPROVED").length || 0} settled disbursements
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="font-mono text-[10px] uppercase text-text-muted">
                PENDING ESCROW BOUNTIES
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <CoinIcon size={22} />
                <span className="font-grotesk text-2xl font-bold text-gold-accent tabular-nums">
                  {wallet.escrowCoins.toLocaleString()}
                </span>
                <span className="font-mono text-xs text-gold-accent font-bold">COINS</span>
              </div>
              <span className="font-mono text-xs text-text-muted mt-1">Held in escrow until review</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="font-mono text-[10px] uppercase text-text-muted">
                SECURITY & TRUST TIER
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-grotesk text-2xl font-bold text-text-primary">TIER 1 PRO</span>
              </div>
              <span className="font-mono text-xs text-lime-neon mt-1 flex items-center gap-1">
                <IconShield size={12} /> Operator-reviewed payouts
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Withdrawal Form & Payout Rails */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Rails Selector (col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <IconVault size={16} className="text-lime-neon" />
                  <CardTitle>SELECT DISBURSEMENT RAIL</CardTitle>
                </div>
                <Badge variant="lime" size="sm">OPERATOR-REVIEWED</Badge>
              </CardHeader>

              <CardContent className="flex flex-col gap-2.5 p-4">
                {rails.map((rail) => {
                  const isSelected = selectedRail === rail.id;
                  return (
                    <button
                      key={rail.id}
                      type="button"
                      onClick={() => setSelectedRail(rail.id)}
                      className={`p-3.5 rounded border text-left flex items-center justify-between transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-surface-elevated border-lime-neon/60"
                          : "bg-surface border-border-dark hover:border-border-hover text-text-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded flex items-center justify-center border shrink-0 ${
                            isSelected
                              ? "bg-lime-neon/15 border-lime-neon/30"
                              : "bg-surface-card border-border-dark"
                          }`}
                        >
                          {rail.icon}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className={`font-grotesk text-sm font-bold ${isSelected ? "text-text-primary" : "text-text-muted"}`}>
                            {rail.name}
                          </span>
                          <span className="font-mono text-[10px] text-text-dim truncate mt-0.5">{rail.sub}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end font-mono text-[11px] shrink-0">
                        <span className="text-lime-neon font-bold">{rail.fee}</span>
                        <span className="text-text-dim text-[10px]">Min: {rail.min}</span>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Cashout Execution Terminal (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Card emphasis={successMsg ? "lime" : "none"}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-lime-neon" />
                  <CardTitle>CASHOUT EXECUTION MATRIX // {currentRail.name.toUpperCase()}</CardTitle>
                </div>
                <Badge variant="gold">RELEASE AFTER REVIEW</Badge>
              </CardHeader>

              <CardContent className="flex flex-col gap-5 p-6">
                {successMsg && (
                  <div className="p-4 bg-lime-neon/12 border border-lime-neon/40 rounded flex items-center gap-3 font-mono text-xs text-lime-neon">
                    <IconCheck size={20} strokeWidth={2.5} className="shrink-0" />
                    <span>{successMsg} Funds release after operator review.</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-4 bg-crimson-accent/12 border border-crimson-accent/40 rounded flex items-center gap-3 font-mono text-xs text-crimson-accent">
                    <IconBolt size={20} strokeWidth={2.5} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleWithdraw} className="flex flex-col gap-4 font-mono text-xs">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-text-muted uppercase text-[11px]">Amount to Cashout (Coins)</label>
                      <span className="text-gold-accent font-bold">
                        Available: {wallet.availableCoins.toLocaleString()} Coins
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        min={currentRail.minCoins}
                        max={wallet.availableCoins}
                        value={withdrawCoins}
                        onChange={(e) => setWithdrawCoins(e.target.value)}
                        className="w-full bg-canvas border border-border-dark focus:border-lime-neon/80 focus:ring-2 focus:ring-lime-neon/20 rounded p-2.5 text-text-primary font-mono outline-none"
                        required
                      />
                      <span className="absolute right-3 top-2.5 text-gold-accent font-bold">
                        ≈ ${usdValue} USD
                      </span>
                    </div>

                    {/* Quick percentage chips */}
                    <div className="flex items-center gap-2 pt-1">
                      {[1000, 2000, wallet.availableCoins].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setWithdrawCoins(amt.toString())}
                          className="px-2 py-0.5 rounded bg-surface-card border border-border-dark text-[10px] text-text-muted hover:text-text-primary cursor-pointer"
                        >
                          {amt === wallet.availableCoins ? `Max (${wallet.availableCoins.toLocaleString()})` : `${amt.toLocaleString()} Coins`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label={`Receiving ${currentRail.name} Target Account`}
                    type="text"
                    value={targetAccount}
                    onChange={(e) => setTargetAccount(e.target.value)}
                    placeholder={currentRail.placeholder}
                    required
                  />

                  {/* Settlement Breakdown Box */}
                  <div className="p-4 rounded bg-surface border border-border-dark flex flex-col gap-2 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-text-muted">
                      <span>Disbursement Rail:</span>
                      <strong className="text-text-primary">{currentRail.name}</strong>
                    </div>
                    <div className="flex items-center justify-between text-text-muted">
                      <span>Platform Gas / Rail Fee:</span>
                      <strong className="text-lime-neon">{currentRail.fee}</strong>
                    </div>
                    <div className="flex items-center justify-between text-text-muted">
                      <span>Release:</span>
                      <strong className="text-text-primary">After operator review</strong>
                    </div>
                    <div className="flex items-center justify-between text-text-primary pt-2 border-t border-border-subtle font-bold text-xs">
                      <span>Net Cleared Output:</span>
                      <span className="text-lime-neon text-sm tabular-nums">
                        ${usdValue} USD
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="neon"
                    size="lg"
                    disabled={isSubmitting || wallet.availableCoins < currentRail.minCoins}
                    rightIcon={<IconBolt size={16} strokeWidth={2.5} />}
                    className="w-full mt-2"
                  >
                    {isSubmitting ? "TRANSMITTING TO PAYOUT ENGINE..." : "CONFIRM & DISBURSE PAYOUT"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payout History Ledger Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconLedger size={16} className="text-lime-neon" />
              <CardTitle>RECENT DISBURSEMENTS LEDGER</CardTitle>
            </div>
            <Badge variant="lime" dot>SYNCED</Badge>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border-dark bg-surface text-text-muted text-[10px] uppercase">
                    <th className="p-3.5 pl-5">TX HASH</th>
                    <th className="p-3.5">TIMESTAMP</th>
                    <th className="p-3.5">RAIL</th>
                    <th className="p-3.5">TARGET</th>
                    <th className="p-3.5">AMOUNT</th>
                    <th className="p-3.5 pr-5 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {wallet.withdrawals && wallet.withdrawals.length > 0 ? (
                    wallet.withdrawals.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3.5 pl-5 font-bold text-lime-neon">
                          {tx.txRef || `#WD-${tx.id.slice(-6).toUpperCase()}`}
                        </td>
                        <td className="p-3.5 text-text-muted">
                          {new Date(tx.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="p-3.5 text-text-primary">{tx.rail}</td>
                        <td className="p-3.5 text-text-muted truncate max-w-[180px]">
                          {tx.destination}
                        </td>
                        <td className="p-3.5 font-bold text-text-primary tabular-nums">
                          -{tx.coins.toLocaleString()}{" "}
                          <span className="text-gold-accent font-normal">
                            (${(tx.coins / 1000).toFixed(2)})
                          </span>
                        </td>
                        <td className="p-3.5 pr-5 text-right">
                          <Badge
                            variant={
                              tx.status === "APPROVED"
                                ? "lime"
                                : tx.status === "REJECTED"
                                ? "crimson"
                                : "gold"
                            }
                            size="sm"
                          >
                            {tx.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-text-dim font-mono">
                        No previous cashouts on record. Your cleared disbursements will settle here.
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

