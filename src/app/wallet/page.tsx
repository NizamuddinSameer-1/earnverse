"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
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
  IconArrowRight,
} from "@/components/ui/Icons";

interface PayoutRail {
  id: string;
  name: string;
  sub: string;
  min: string;
  minCoins: number;
  fee: string;
  placeholder: string;
  icon: string;
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
    name: "UPI (India)",
    sub: "Direct bank transfer via PhonePe, GPay, Paytm",
    min: "500 Coins (₹50)",
    minCoins: 500,
    fee: "0% Free",
    placeholder: "yourname@oksbi / 9876543210@paytm",
    icon: "🇮🇳",
  },
  {
    id: "usdt",
    name: "USDT (Tether)",
    sub: "TRC-20 & BEP-20 stablecoin settlement",
    min: "5,000 Coins ($5.00)",
    minCoins: 5000,
    fee: "0% Free",
    placeholder: "T... (TRC-20 Tron Address)",
    icon: "₮",
  },
  {
    id: "ltc",
    name: "Litecoin (LTC)",
    sub: "Ultra-low network transfer fees",
    min: "1,000 Coins ($1.00)",
    minCoins: 1000,
    fee: "0% Free",
    placeholder: "L... or ltc1... address",
    icon: "Ł",
  },
  {
    id: "paypal",
    name: "PayPal USD",
    sub: "Global verified account balance transfer",
    min: "5,000 Coins ($5.00)",
    minCoins: 5000,
    fee: "2% Rail Fee",
    placeholder: "account@paypal.com",
    icon: "💳",
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
    availableCoins: 0,
    pendingCoins: 0,
    escrowCoins: 0,
    usdValue: "0.00",
    lifetimeEarned: 0,
    lifetimeCashed: 0,
    withdrawals: [],
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchWallet = async () => {
    try {
      const res = await fetch("/api/user/wallet");
      if (res.status === 401 || !res.ok) {
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
        {/* Header Hero Strip */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/15 via-[#0E131E] to-amber-500/10 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                <IconWallet size={28} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="font-grotesk text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Wallet & Cashout Vault
                  </h1>
                  <Badge variant="emerald" dot>
                    INSTANT RAILS
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  1,000 Coins = $1.00 USD guaranteed flat peg. Zero deductions on crypto and UPI transfers.
                </p>
              </div>
            </div>

            <Link href="/ledger">
              <Button variant="secondary" size="sm" leftIcon={<IconLedger size={14} />}>
                Audit Ledger
              </Button>
            </Link>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 text-xs text-amber-300">
            <div className="flex items-center gap-3">
              <IconShield size={18} className="text-amber-400 shrink-0" />
              <span>
                <strong>GUEST PREVIEW:</strong> Please sign in to your EarnVerse account to unlock live cashout requests and wallet settlement.
              </span>
            </div>
            <Link href="/login">
              <Button variant="gold" size="sm">
                Sign In Now
              </Button>
            </Link>
          </div>
        )}

        {/* 4-Stat Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card emphasis="gold">
            <CardContent className="flex flex-col gap-1 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                AVAILABLE BALANCE
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <CoinIcon size={24} />
                <span className="font-grotesk text-3xl font-bold text-white tabular-nums">
                  {wallet.availableCoins.toLocaleString()}
                </span>
                <span className="text-xs text-amber-400 font-bold">Coins</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono mt-1 font-semibold">
                ≈ ${wallet.usdValue} USD Cleared
              </span>
            </CardContent>
          </Card>

          <Card emphasis="emerald">
            <CardContent className="flex flex-col gap-1 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                LIFETIME CASHED OUT
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-grotesk text-3xl font-bold text-emerald-400 tabular-nums">
                  ${(wallet.lifetimeCashed / 1000).toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-mono">USD</span>
              </div>
              <span className="text-xs text-slate-400 mt-1">
                {wallet.withdrawals?.filter((w) => w.status === "APPROVED").length || 0} verified settlements
              </span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-1 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                ESCROW HOLDINGS
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <CoinIcon size={24} />
                <span className="font-grotesk text-3xl font-bold text-amber-300 tabular-nums">
                  {wallet.escrowCoins.toLocaleString()}
                </span>
                <span className="text-xs text-amber-400 font-bold">Coins</span>
              </div>
              <span className="text-xs text-slate-400 mt-1">Protected in escrow lock</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-1 p-5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                SECURITY LEVEL
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-grotesk text-2xl font-bold text-white">PRO VERIFIED</span>
              </div>
              <span className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                <IconShield size={13} /> Operator-audited settlement
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Withdrawal Form & Payout Rails */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Rails Selector */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card className="p-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <span className="font-grotesk font-bold text-sm text-white">SELECT PAYOUT METHOD</span>
                <Badge variant="gold" size="sm">0% GAS FEES</Badge>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {rails.map((rail) => {
                  const isSelected = selectedRail === rail.id;
                  return (
                    <button
                      key={rail.id}
                      type="button"
                      onClick={() => setSelectedRail(rail.id)}
                      className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "bg-amber-400/10 border-amber-400/50 shadow-[0_0_16px_rgba(245,158,11,0.15)]"
                          : "bg-white/[0.03] border-white/[0.08] hover:border-white/[0.18]"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-xl shrink-0">
                          {rail.icon}
                        </div>
                        <div>
                          <div className={`font-grotesk text-sm font-bold ${isSelected ? "text-amber-400" : "text-white"}`}>
                            {rail.name}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{rail.sub}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-emerald-400">{rail.fee}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Min: {rail.min}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Cashout Execution Form */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Card emphasis={successMsg ? "emerald" : "none"} className="p-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-grotesk font-bold text-base text-white">
                    REQUEST DISBURSEMENT VIA {currentRail.name.toUpperCase()}
                  </span>
                </div>
                <Badge variant="emerald">VERIFIED</Badge>
              </div>

              <div className="pt-5 flex flex-col gap-5">
                {successMsg && (
                  <div className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
                    <IconCheck size={20} strokeWidth={2.5} className="shrink-0 text-emerald-400" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-4 bg-rose-500/15 border border-rose-500/40 rounded-xl flex items-center gap-3 text-xs text-rose-300">
                    <IconBolt size={20} strokeWidth={2.5} className="shrink-0 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleWithdraw} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <label className="text-slate-300 font-medium">Coins to Withdraw</label>
                      <span className="text-amber-400 font-semibold font-mono">
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
                        className="w-full bg-[#0B0E14] border border-white/[0.1] focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl p-3 text-white font-mono text-sm outline-none"
                        required
                      />
                      <span className="absolute right-4 top-3 text-emerald-400 font-bold font-mono text-sm">
                        ≈ ${usdValue} USD
                      </span>
                    </div>

                    {/* Quick Amount Chips */}
                    <div className="flex items-center gap-2 pt-1">
                      {[1000, 2500, 5000, wallet.availableCoins].map((amt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setWithdrawCoins(amt.toString())}
                          className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-amber-400/40 text-xs text-slate-300 hover:text-white font-mono transition-colors cursor-pointer"
                        >
                          {amt === wallet.availableCoins ? "Max Available" : `${amt.toLocaleString()} Coins`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label={`Receiving ${currentRail.name} Target Address / ID`}
                    type="text"
                    value={targetAccount}
                    onChange={(e) => setTargetAccount(e.target.value)}
                    placeholder={currentRail.placeholder}
                    required
                  />

                  {/* Summary Breakdown */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Method:</span>
                      <strong className="text-white">{currentRail.name}</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Transfer Fee:</span>
                      <strong className="text-emerald-400">{currentRail.fee}</strong>
                    </div>
                    <div className="flex items-center justify-between text-white font-bold pt-2 border-t border-white/[0.06]">
                      <span>Net Settlement Amount:</span>
                      <span className="text-emerald-400 text-sm font-mono">${usdValue} USD</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="emerald"
                    size="lg"
                    disabled={isSubmitting || wallet.availableCoins < currentRail.minCoins}
                    rightIcon={<IconArrowRight size={16} />}
                    className="w-full mt-1"
                  >
                    {isSubmitting ? "Processing Request..." : "Confirm & Withdraw Funds"}
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Disbursements Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
            <div className="flex items-center gap-2">
              <IconLedger size={18} className="text-amber-400" />
              <h2 className="font-grotesk font-bold text-base text-white">RECENT CASHOUT HISTORY</h2>
            </div>
            <Badge variant="emerald" dot>REAL-TIME</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/[0.06] text-slate-400 text-[11px] uppercase">
                  <th className="py-3 px-4">TX ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Rail</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {wallet.withdrawals && wallet.withdrawals.length > 0 ? (
                  wallet.withdrawals.map((tx) => (
                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-amber-400">
                        {tx.txRef || `#WD-${tx.id.slice(-6).toUpperCase()}`}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-white">{tx.rail}</td>
                      <td className="py-3.5 px-4 text-slate-400 truncate max-w-[180px]">
                        {tx.destination}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white tabular-nums">
                        -{tx.coins.toLocaleString()}{" "}
                        <span className="text-amber-400 font-normal">
                          (${(tx.coins / 1000).toFixed(2)})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge
                          variant={
                            tx.status === "APPROVED"
                              ? "emerald"
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
                    <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                      No cashouts requested yet. Complete offers to build your balance and withdraw here!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
