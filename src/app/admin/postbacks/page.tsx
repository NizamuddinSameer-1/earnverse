"use client";

import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconSensors, IconCheck, IconBolt, IconRefresh } from "@/components/ui/Icons";

interface PostbackEntry {
  id: string;
  network: string;
  user: string;
  userId: string;
  txId: string;
  payoutCoins: number;
  usdRevenue: string;
  status: "CREDITED" | "REVERSED" | "FLAGGED";
  signatureValid: boolean;
  createdAt: string;
}

interface PostbackStats {
  totalEvents: number;
  totalCoins: number;
  totalUsd: string;
  chargebackCount: number;
}

export default function AdminPostbacksPage() {
  const [entries, setEntries] = useState<PostbackEntry[]>([]);
  const [stats, setStats] = useState<PostbackStats>({
    totalEvents: 0,
    totalCoins: 0,
    totalUsd: "$0.00",
    chargebackCount: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedNetwork, setSelectedNetwork] = useState<"BitLabs" | "CPX" | "Torox">("BitLabs");
  const [simUser, setSimUser] = useState("@cryptoking");
  const [simCoins, setSimCoins] = useState("1000");
  const [isChargeback, setIsChargeback] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const fetchLivePostbacks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/postbacks");
      const json = await res.json();
      if (json.success && json.data) {
        setEntries(json.data.events || []);
        if (json.data.stats) {
          setStats(json.data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to load live postbacks", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePostbacks();
  }, []);

  const handleSimulatePostback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToast(null);

    try {
      const res = await fetch("/api/admin/postbacks/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          network: selectedNetwork,
          user: simUser,
          coins: parseInt(simCoins, 10) || 1000,
          isChargeback,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setToast(
          `Postback Executed: ${data.result.message}. Balance for ${data.targetUser} is now ${data.updatedBalance.toLocaleString()} coins.`
        );
        fetchLivePostbacks();
      } else {
        setToast(`Error: ${data.error || data.result?.message || "Postback simulation failed"}`);
      }
    } catch (err) {
      console.error("Simulation error:", err);
      setToast("Network error executing postback simulation");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 6000);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded bg-gradient-to-r from-surface-card via-surface to-canvas border border-border-dark p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-lime-neon/15 border border-lime-neon/30 flex items-center justify-center text-lime-neon">
                <IconSensors size={24} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight uppercase">
                    OFFERWALL WEBHOOKS // LIVE POSTBACK ENGINE
                  </h1>
                  <Badge variant="lime" size="sm" dot>
                    PRODUCTION ENGINE ACTIVE
                  </Badge>
                </div>
                <span className="font-mono text-xs text-text-muted mt-1">
                  Real-time server-to-server webhook ingestion for BitLabs, CPX Research, and Torox. Atomic double-entry ledger settlement with SHA256 & MD5 signature validation.
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={fetchLivePostbacks}
              leftIcon={<IconRefresh size={14} className={isLoading ? "animate-spin" : ""} />}
            >
              REFRESH TELEMETRY
            </Button>
          </div>
        </div>

        {/* 4-Stat Metric Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="font-mono text-[10px] uppercase text-text-muted">Total Callbacks Ingested</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-grotesk text-2xl font-bold text-text-primary tabular-nums">
                  {stats.totalEvents.toLocaleString()}
                </span>
                <span className="font-mono text-xs text-lime-neon font-bold">EVENTS</span>
              </div>
            </CardContent>
          </Card>

          <Card emphasis="lime">
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="font-mono text-[10px] uppercase text-text-muted">Coins Minted to Users</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-grotesk text-2xl font-bold text-text-primary tabular-nums">
                  {stats.totalCoins.toLocaleString()}
                </span>
                <span className="font-mono text-xs text-gold-accent font-bold">COINS</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="font-mono text-[10px] uppercase text-text-muted">Offerwall Net Revenue</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-grotesk text-2xl font-bold text-gold-accent tabular-nums">
                  {stats.totalUsd}
                </span>
                <span className="font-mono text-xs text-text-muted font-bold">USD</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="font-mono text-[10px] uppercase text-text-muted">Chargebacks / Reversals</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`font-grotesk text-2xl font-bold tabular-nums ${stats.chargebackCount > 0 ? "text-crimson-accent" : "text-text-primary"}`}>
                  {stats.chargebackCount}
                </span>
                <span className="font-mono text-xs text-text-muted font-bold">CASES</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {toast && (
          <div className="p-4 bg-lime-neon/12 border border-lime-neon/40 rounded font-mono text-xs text-lime-neon flex items-center gap-2.5">
            <IconCheck size={18} strokeWidth={2.5} />
            <span>{toast}</span>
          </div>
        )}

        {/* 2-Column: Live Log Table + Interactive Webhook Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Webhook Logs Table */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <IconSensors size={16} className="text-lime-neon" />
                  <CardTitle>LIVE INGESTION LOGS ({entries.length})</CardTitle>
                </div>
                <span className="font-mono text-xs text-text-muted">
                  Cryptographically verified database records
                </span>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-border-dark bg-canvas text-text-muted text-[10px] uppercase">
                        <th className="p-3.5 pl-5">NETWORK / TX</th>
                        <th className="p-3.5">OPERATOR</th>
                        <th className="p-3.5">MINTED COINS</th>
                        <th className="p-3.5">EST. REVENUE</th>
                        <th className="p-3.5">TIME</th>
                        <th className="p-3.5 pr-5 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {entries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-text-muted font-mono">
                            No postback events recorded in database yet. Use the simulator on the right to test!
                          </td>
                        </tr>
                      ) : (
                        entries.map((item) => (
                          <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-3.5 pl-5">
                              <span className="font-bold text-text-primary">{item.network}</span>
                              <span className="block text-[10px] text-text-dim">{item.txId}</span>
                            </td>
                            <td className="p-3">
                              <strong className="text-lime-neon">{item.user}</strong>
                            </td>
                            <td className="p-3 font-bold text-text-primary tabular-nums">
                              {item.status === "REVERSED" ? "-" : "+"}
                              {item.payoutCoins.toLocaleString()} Coins
                            </td>
                            <td className="p-3 font-bold text-gold-accent tabular-nums">
                              {item.usdRevenue}
                            </td>
                            <td className="p-3 text-[10px] text-text-muted">
                              {new Date(item.createdAt).toLocaleTimeString()}
                            </td>
                            <td className="p-3 pr-5 text-right">
                              <Badge
                                variant={
                                  item.status === "CREDITED"
                                    ? "lime"
                                    : item.status === "REVERSED"
                                    ? "crimson"
                                    : "gold"
                                }
                                size="sm"
                              >
                                {item.status}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (4 cols): Interactive Webhook Simulator */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card emphasis="lime">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <IconBolt size={18} className="text-lime-neon" />
                  <CardTitle>LIVE WEBHOOK SIMULATOR</CardTitle>
                </div>
                <Badge variant="lime">TRANSACTIONAL</Badge>
              </CardHeader>

              <CardContent className="flex flex-col gap-4 p-5 font-mono text-xs">
                <p className="text-text-muted text-[11px] leading-relaxed">
                  Dispatches a verified synthetic postback through the live engine. Credits real user balances and appends double-entry ledger events.
                </p>

                <form onSubmit={handleSimulatePostback} className="flex flex-col gap-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-text-muted uppercase text-[10px]">Offerwall Provider</label>
                    <select
                      value={selectedNetwork}
                      onChange={(e) => setSelectedNetwork(e.target.value as any)}
                      className="bg-canvas border border-border-dark focus:border-lime-neon text-text-primary rounded p-2.5 outline-none"
                    >
                      <option value="BitLabs">BitLabs (Approved Partner)</option>
                      <option value="CPX">CPX Research (Approved Partner)</option>
                      <option value="Torox">Torox Arcade</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-text-muted uppercase text-[10px]">Target Operator Handle</label>
                    <input
                      type="text"
                      value={simUser}
                      onChange={(e) => setSimUser(e.target.value)}
                      className="bg-canvas border border-border-dark focus:border-lime-neon text-text-primary rounded p-2.5 outline-none"
                      placeholder="@cryptoking"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-text-muted uppercase text-[10px]">Coins Payout</label>
                    <input
                      type="number"
                      value={simCoins}
                      onChange={(e) => setSimCoins(e.target.value)}
                      className="bg-canvas border border-border-dark focus:border-lime-neon text-text-primary rounded p-2.5 outline-none"
                      min="1"
                      required
                    />
                  </div>

                  <label className="flex items-center gap-2 p-2 rounded bg-surface border border-border-dark text-[11px] cursor-pointer hover:border-crimson-accent/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isChargeback}
                      onChange={(e) => setIsChargeback(e.target.checked)}
                      className="rounded accent-crimson-accent"
                    />
                    <span className="text-text-muted">Simulate Chargeback / Reversal Debit</span>
                  </label>

                  <Button
                    type="submit"
                    variant={isChargeback ? "danger" : "neon"}
                    size="md"
                    className="w-full mt-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "PROCESSING..."
                      : isChargeback
                      ? "DISPATCH CHARGEBACK REVERSAL"
                      : "DISPATCH LIVE POSTBACK"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
