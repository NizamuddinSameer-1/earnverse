"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAdminOverview, dispatchAdminOverviewChanged } from "@/hooks/useAdminOverview";
import {
  IconWallet,
  IconShield,
  IconAlertTriangle,
  IconCheck,
  IconDownload,
  IconSensors,
} from "@/components/ui/Icons";

interface PendingWithdrawal {
  id: string;
  user: string;
  rail: string;
  target: string;
  amountCoins: number;
  usd: string;
  time: string;
  trustScore: string;
  risk: "low" | "medium" | "high";
  status: "pending" | "approved" | "rejected";
}

const samplePostbackStream = [
  { network: "BitLabs", user: "@karan_sharma", task: "Consumer Survey #941", coins: "+850", rev: "+$1.15", status: "VERIFIED", time: "1m ago" },
  { network: "Torox", user: "@alex_gamer", task: "War Strategy Level 10", coins: "+12,000", rev: "+$16.00", status: "VERIFIED", time: "3m ago" },
  { network: "CPX Research", user: "@sam_tech", task: "EV Sentiment Poll", coins: "+1,450", rev: "+$1.90", status: "VERIFIED", time: "5m ago" },
  { network: "BitLabs", user: "@bot_suspicious", task: "Survey #102", coins: "0", rev: "$0.00", status: "IP_BLOCKED", time: "8m ago" },
];

export default function AdminCommandHub() {
  const { loaded: overviewLoaded, error: overviewError, data: overviewData } = useAdminOverview();

  const [withdrawals, setWithdrawals] = useState<PendingWithdrawal[]>([]);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [freezeBusy, setFreezeBusy] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");

  const noticeTimer = React.useRef<number | null>(null);
  const showNotice = (kind: "ok" | "error", text: string) => {
    setActionNotice({ kind, text });
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setActionNotice(null), 3500);
  };

  // Mirror the pending queue from the single source of truth: /api/admin/overview
  React.useEffect(() => {
    if (!overviewData) return;
    setIsFrozen(overviewData.emergencyFreeze);
    const mapped: PendingWithdrawal[] = overviewData.withdrawals.map((w) => ({
      id: w.id,
      user: `@${w.user?.username || "operator"}`,
      rail: w.rail === "USDT_TRC20" ? "USDT TRC-20" : w.rail,
      target: w.destination,
      amountCoins: w.coins,
      usd: `$${w.amountUsd.toFixed(2)}`,
      time: new Date(w.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      trustScore: `${w.user?.trustScore ?? 100}%`,
      risk: (w.user?.trustScore ?? 100) < 60 ? "high" : (w.user?.trustScore ?? 100) < 85 ? "medium" : "low",
      status: "pending",
    }));
    setWithdrawals(mapped);
  }, [overviewData]);

  const pendingCount = withdrawals.filter((w) => w.status === "pending").length;
  const pendingUsdTotal = withdrawals
    .filter((w) => w.status === "pending")
    .reduce((sum, w) => sum + w.amountCoins / 1000, 0)
    .toFixed(2);
  const flaggedCount = withdrawals.filter((w) => w.status === "pending" && w.risk !== "low").length;

  const kpi = overviewData?.kpi;

  const handleToggleFreeze = async () => {
    if (freezeBusy || !overviewData) return;
    const next = !isFrozen;
    setFreezeBusy(true);
    try {
      const res = await fetch("/api/admin/overview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emergencyFreeze: next }),
      });
      const data = await res.json();
      if (data.success) {
        setIsFrozen(next);
        dispatchAdminOverviewChanged();
        showNotice(
          "ok",
          next
            ? "Disbursements frozen. New cashout requests from operators are rejected until you resume."
            : "Disbursements resumed. Operators can request cashouts again."
        );
      } else {
        showNotice("error", `Freeze toggle failed: ${data.error}`);
      }
    } catch {
      showNotice("error", "Freeze toggle failed — could not reach the server. State unchanged.");
    } finally {
      setFreezeBusy(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch("/api/admin/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "APPROVE" }),
      });
      const data = await res.json();
      if (data.success) {
        setWithdrawals((prev) =>
          prev.map((w) => (w.id === id ? { ...w, status: "approved" } : w))
        );
        dispatchAdminOverviewChanged();
        showNotice("ok", `Approved ${id}. Payout queued for release on the operator's rail.`);
      } else {
        showNotice("error", `Approve failed: ${data.error}`);
      }
    } catch {
      showNotice("error", "Approve failed — could not reach the server. No changes were made.");
    }
  };

  const confirmReject = async (id: string) => {
    const reason = rejectReason.trim();
    if (!reason) return;
    try {
      const res = await fetch("/api/admin/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "REJECT", reason }),
      });
      const data = await res.json();
      if (data.success) {
        setWithdrawals((prev) =>
          prev.map((w) => (w.id === id ? { ...w, status: "rejected" } : w))
        );
        dispatchAdminOverviewChanged();
        showNotice("ok", `Rejected ${id}. Coins refunded to the operator's wallet and the reason is on the audit log.`);
      } else {
        showNotice("error", `Reject failed: ${data.error}`);
      }
    } catch {
      showNotice("error", "Reject failed — could not reach the server. No changes were made.");
    }
    setRejectTarget(null);
    setRejectReason("");
  };

  const handleExportCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,User,Rail,Target,Coins,USD,TrustScore,Risk\n" +
      withdrawals
        .filter((w) => w.status === "pending")
        .map((w) => `${w.id},${w.user},${w.rail},${w.target},${w.amountCoins},${w.usd},${w.trustScore},${w.risk}`)
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `earnverse_batch_payout_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        {/* Header Notice Strip */}
        <div className="relative overflow-hidden rounded bg-gradient-to-r from-surface-card via-surface to-canvas border border-crimson-accent/40 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-crimson-accent/15 border border-crimson-accent/40 flex items-center justify-center text-crimson-accent">
                <IconShield size={24} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight uppercase">
                    ROOT COMMAND CENTER // OPERATIONAL LEDGER
                  </h1>
                  <Badge variant="crimson" dot>
                    RESTRICTED ACCESS
                  </Badge>
                </div>
                <span className="font-mono text-xs text-text-muted mt-1">
                  Founder console for reviewing cashout requests, managing operator accounts, and auditing the coin ledger.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={isFrozen ? "danger" : "outline"}
                size="sm"
                onClick={handleToggleFreeze}
                disabled={freezeBusy || !overviewData}
                isLoading={freezeBusy}
              >
                {isFrozen ? "RESUME DISBURSEMENTS" : "FREEZE DISBURSEMENTS"}
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportCsv}
                leftIcon={<IconDownload size={14} />}
              >
                EXPORT BATCH CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Action Notice Toast Banner */}
        {actionNotice && (
          <div
            className={`p-4 rounded font-mono text-xs flex items-center gap-2.5 ${
              actionNotice.kind === "ok"
                ? "bg-lime-neon/12 border border-lime-neon/40 text-lime-neon"
                : "bg-crimson-accent/10 border border-crimson-accent/40 text-crimson-accent"
            }`}
          >
            {actionNotice.kind === "ok" ? (
              <IconCheck size={18} strokeWidth={2.5} />
            ) : (
              <IconAlertTriangle size={18} strokeWidth={2.5} />
            )}
            <span>{actionNotice.text}</span>
          </div>
        )}

        {/* 4 Core Financial Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card emphasis="none">
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="font-mono text-[10px] uppercase text-text-muted">
                PENDING CASHOUT LIABILITIES
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`font-grotesk text-2xl font-bold tabular-nums ${
                    overviewError ? "text-text-dim" : "text-crimson-accent"
                  }`}
                >
                  {overviewError ? "—" : `$${pendingUsdTotal}`}
                </span>
                <span className="font-mono text-xs text-text-muted">USD</span>
              </div>
              <span className="font-mono text-xs text-text-muted mt-1">
                {overviewError ? "Database unavailable" : `${pendingCount} unreviewed withdrawals`}
              </span>
            </CardContent>
          </Card>

          <Card emphasis="none">
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="font-mono text-[10px] uppercase text-text-muted">
                COIN SUPPLY (MINTED / PAID OUT)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-grotesk text-2xl font-bold text-text-primary tabular-nums">
                  {kpi ? kpi.mintedCoins.toLocaleString() : "—"}
                </span>
                <span className="font-mono text-xs text-gold-accent">
                  / {kpi ? kpi.paidOutCoins.toLocaleString() : "—"} PAID OUT
                </span>
              </div>
              <span className="font-mono text-xs text-text-muted mt-1">
                Outstanding float:{" "}
                <strong className="text-gold-accent tabular-nums">
                  $
                  {kpi
                    ? ((kpi.mintedCoins - kpi.paidOutCoins) / 1000).toFixed(2)
                    : "—"}{" "}
                  USD
                </strong>
              </span>
            </CardContent>
          </Card>

          <Card emphasis="none">
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="font-mono text-[10px] uppercase text-text-muted">
                AUDIT LOG ENTRIES
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-grotesk text-2xl font-bold text-text-primary tabular-nums">
                  {kpi ? kpi.auditEvents.toLocaleString() : "—"}
                </span>
                <span className="font-mono text-xs text-text-dim">EVENTS</span>
              </div>
              <span className="font-mono text-xs text-text-muted mt-1">
                Every operator action recorded in the database
              </span>
            </CardContent>
          </Card>

          <Card emphasis="none">
            <CardContent className="flex flex-col gap-1 p-4">
              <span className="font-mono text-[10px] uppercase text-text-muted">
                REGISTERED OPERATORS
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-grotesk text-2xl font-bold text-text-primary tabular-nums">
                  {kpi ? kpi.activeOperators.toLocaleString() : "—"}
                </span>
                <span
                  className={`font-mono text-xs font-bold ${
                    flaggedCount > 0 ? "text-crimson-accent" : "text-text-dim"
                  }`}
                >
                  {flaggedCount} FLAGGED
                </span>
              </div>
              <span className="font-mono text-xs text-text-muted mt-1">
                Registered accounts in the database
              </span>
            </CardContent>
          </Card>
        </div>

        {/* 2-Column Split: Pending Cashout Approval Table + Postback Contract Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Cashout Review Queue */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2.5">
                  <IconWallet size={18} className="text-crimson-accent" />
                  <CardTitle>PENDING WITHDRAWAL APPROVAL QUEUE</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {overviewLoaded && !overviewError && (
                    <Badge variant={pendingCount > 0 ? "crimson" : "lime"} dot={pendingCount > 0}>
                      {pendingCount} AWAITING
                    </Badge>
                  )}
                  <Link href="/admin/withdrawals">
                    <Button variant="ghost" size="sm">
                      View All →
                    </Button>
                  </Link>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-border-dark bg-canvas text-text-muted text-[10px] uppercase">
                        <th className="p-3 pl-5">REQUEST</th>
                        <th className="p-3">OPERATOR</th>
                        <th className="p-3">RAIL / TARGET</th>
                        <th className="p-3">AMOUNT</th>
                        <th className="p-3">RISK</th>
                        <th className="p-3 pr-5 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {overviewError ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center font-mono text-xs text-crimson-accent">
                            Queue unavailable — the database could not be reached.
                          </td>
                        </tr>
                      ) : !overviewLoaded ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center font-mono text-xs text-text-muted">
                            Loading queue…
                          </td>
                        </tr>
                      ) : withdrawals.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center font-mono text-xs text-text-muted">
                            No pending cashout requests. New requests from operator wallets appear here automatically.
                          </td>
                        </tr>
                      ) : (
                        withdrawals.map((item) => (
                          <React.Fragment key={item.id}>
                            <tr className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-3 pl-5">
                                <span className="font-bold text-text-primary">{item.id}</span>
                                <span className="block text-[10px] text-text-dim">{item.time}</span>
                              </td>
                              <td className="p-3">
                                <strong className="text-lime-neon">{item.user}</strong>
                                <span className="block text-[10px] text-text-muted">
                                  Trust: {item.trustScore}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-text-primary">{item.rail}</span>
                                <span className="block text-[10px] text-text-muted truncate max-w-[140px]">
                                  {item.target}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-text-primary tabular-nums">
                                  {item.amountCoins.toLocaleString()}
                                </span>
                                <span className="block text-[10px] text-gold-accent font-semibold">
                                  {item.usd}
                                </span>
                              </td>
                              <td className="p-3">
                                <Badge
                                  variant={
                                    item.risk === "high"
                                      ? "crimson"
                                      : item.risk === "medium"
                                      ? "gold"
                                      : "slate"
                                  }
                                  size="sm"
                                >
                                  {item.risk.toUpperCase()}
                                </Badge>
                              </td>
                              <td className="p-3 pr-5 text-right">
                                {item.status === "pending" ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <Button
                                      variant="neon"
                                      size="sm"
                                      onClick={() => handleApprove(item.id)}
                                    >
                                      APPROVE
                                    </Button>
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => {
                                        setRejectTarget(item.id);
                                        setRejectReason("");
                                      }}
                                    >
                                      REJECT
                                    </Button>
                                  </div>
                                ) : (
                                  <Badge
                                    variant={item.status === "approved" ? "lime" : "crimson"}
                                    size="sm"
                                  >
                                    {item.status.toUpperCase()}
                                  </Badge>
                                )}
                              </td>
                            </tr>
                            {rejectTarget === item.id && (
                              <tr className="bg-crimson-accent/[0.04]">
                                <td colSpan={6} className="p-3 pl-5">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span className="font-mono text-[11px] text-crimson-accent font-bold shrink-0 uppercase">
                                      Reject {item.id} —
                                    </span>
                                    <input
                                      type="text"
                                      value={rejectReason}
                                      onChange={(e) => setRejectReason(e.target.value)}
                                      placeholder="Reason (recorded on the audit log and shown to the operator)"
                                      className="flex-1 bg-canvas border border-border-dark focus:border-crimson-accent/60 rounded px-3 py-1.5 text-xs font-mono text-text-primary outline-none"
                                    />
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => confirmReject(item.id)}
                                        disabled={!rejectReason.trim()}
                                      >
                                        CONFIRM & REFUND
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setRejectTarget(null);
                                          setRejectReason("");
                                        }}
                                      >
                                        CANCEL
                                      </Button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>

              <CardFooter className="justify-between">
                <span>Approvals queue a payout for release on the operator's chosen rail; rejections return the coins to their wallet.</span>
                <span className="text-text-dim font-bold">EVERY ACTION WRITES AN AUDIT LOG ENTRY</span>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column (4 cols): Postback Contract Preview */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <IconSensors size={16} className="text-lime-neon" />
                  <CardTitle>POSTBACK CONTRACT // SAMPLE EVENTS</CardTitle>
                </div>
                <Badge variant="slate" size="sm">
                  DEMO DATA
                </Badge>
              </CardHeader>

              <CardContent className="flex flex-col gap-3 p-4">
                {samplePostbackStream.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded bg-surface border border-border-dark flex flex-col gap-1 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text-primary">{item.network}</span>
                      <span className="text-[10px] text-text-dim">{item.time}</span>
                    </div>

                    <div className="flex items-center justify-between text-text-muted text-[11px]">
                      <span>{item.user}</span>
                      <span className="text-lime-neon font-bold">{item.coins} Coins ({item.rev})</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-border-subtle text-[10px]">
                      <span className="text-text-dim truncate">{item.task}</span>
                      <Badge
                        variant={item.status === "VERIFIED" ? "lime" : "crimson"}
                        size="sm"
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="justify-center">
                <Link
                  href="/admin/postbacks"
                  className="text-xs text-text-muted hover:text-lime-neon transition-colors"
                >
                  Inspect Postback Contract Preview →
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
