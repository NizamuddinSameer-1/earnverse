"use client";

import React, { useRef, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconWallet, IconCheck, IconAlertTriangle } from "@/components/ui/Icons";
import { dispatchAdminOverviewChanged } from "@/hooks/useAdminOverview";

interface WithdrawalItem {
  id: string;
  user: string;
  country: string;
  rail: "UPI" | "USDT" | "LTC" | "PayPal";
  target: string;
  coins: number;
  usd: string;
  requestedAt: string;
  trustScore: number;
  strikes: number;
  status: "pending" | "approved" | "rejected";
  rejectReason?: string;
}

type Notice = { kind: "ok" | "error"; text: string };

export default function AdminWithdrawalsPage() {
  const [items, setItems] = useState<WithdrawalItem[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [railFilter, setRailFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [batchBusy, setBatchBusy] = useState<boolean>(false);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotice = (next: Notice) => {
    setNotice(next);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3500);
  };

  const fetchLiveWithdrawals = async () => {
    try {
      const res = await fetch("/api/admin/withdrawals");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        type DbWithdrawal = {
          id: string;
          coins: number;
          amountUsd: number;
          rail: string;
          destination: string;
          status: string;
          rejectionReason?: string;
          createdAt: string;
          user?: {
            username: string;
            trustScore: number;
            strikes: number;
            country: string;
          };
        };

        const mapped: WithdrawalItem[] = json.data.map((w: DbWithdrawal) => ({
          id: w.id,
          user: `@${w.user?.username || "operator"}`,
          country: w.user?.country ?? "GLOBAL",
          rail: (w.rail === "USDT_TRC20" ? "USDT" : w.rail) as "UPI" | "USDT" | "LTC" | "PayPal",
          target: w.destination,
          coins: w.coins,
          usd: `$${w.amountUsd.toFixed(2)}`,
          requestedAt: new Date(w.createdAt).toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          trustScore: w.user?.trustScore ?? 100,
          strikes: w.user?.strikes ?? 0,
          status: (w.status.toLowerCase() === "pending"
            ? "pending"
            : w.status.toLowerCase() === "approved"
            ? "approved"
            : "rejected") as "pending" | "approved" | "rejected",
          rejectReason: w.rejectionReason,
        }));
        setItems(mapped);
        setLoadError(false);
      } else {
        setLoadError(true);
      }
    } catch {
      setLoadError(true);
    } finally {
      setLoaded(true);
    }
  };

  const reload = async () => {
    setLoaded(false);
    setLoadError(false);
    await fetchLiveWithdrawals();
  };

  React.useEffect(() => {
    fetchLiveWithdrawals();
  }, []);

  const filteredItems = items.filter((item) => {
    if (railFilter !== "all" && item.rail !== railFilter) return false;
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (
      searchQuery &&
      !item.user.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.target.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const pendingCount = items.filter((i) => i.status === "pending").length;

  const handleApprove = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "APPROVE" }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: "approved" } : item))
        );
        showNotice({
          kind: "ok",
          text: `Approved ${id}. Marked for payout on the operator's chosen rail.`,
        });
        dispatchAdminOverviewChanged();
      } else {
        showNotice({ kind: "error", text: `Error: ${data.error}` });
      }
    } catch {
      showNotice({
        kind: "error",
        text: "Approve failed — could not reach the server. No changes were made.",
      });
    } finally {
      setBusyId(null);
    }
  };

  const confirmReject = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item || !rejectReason.trim()) return;
    setBusyId(id);
    const reason = rejectReason.trim();

    try {
      const res = await fetch("/api/admin/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "REJECT", reason }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, status: "rejected", rejectReason: reason } : i
          )
        );
        showNotice({
          kind: "ok",
          text: `Rejected ${id}. ${item.coins.toLocaleString()} Coins refunded to the operator's wallet; reason recorded on the audit log.`,
        });
        setRejectTarget(null);
        setRejectReason("");
        dispatchAdminOverviewChanged();
      } else {
        showNotice({ kind: "error", text: `Error: ${data.error}` });
      }
    } catch {
      showNotice({
        kind: "error",
        text: "Reject failed — could not reach the server. No changes were made and no coins were refunded.",
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleBatchApprove = async () => {
    const targets = items.filter(
      (i) => selectedIds.includes(i.id) && i.status === "pending"
    );
    if (targets.length === 0) return;
    setBatchBusy(true);

    const results = await Promise.all(
      targets.map(async (t) => {
        try {
          const res = await fetch("/api/admin/withdrawals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: t.id, action: "APPROVE" }),
          });
          const data = await res.json();
          return { id: t.id, ok: Boolean(data.success) };
        } catch {
          return { id: t.id, ok: false };
        }
      })
    );

    const okIds = results.filter((r) => r.ok).map((r) => r.id);
    const failedCount = results.length - okIds.length;

    if (okIds.length > 0) {
      setItems((prev) =>
        prev.map((item) =>
          okIds.includes(item.id) && item.status === "pending"
            ? { ...item, status: "approved" }
            : item
        )
      );
      dispatchAdminOverviewChanged();
    }

    if (failedCount === 0) {
      showNotice({
        kind: "ok",
        text: `Batch approved ${okIds.length} disbursement${okIds.length === 1 ? "" : "s"}.`,
      });
      setSelectedIds([]);
    } else if (okIds.length > 0) {
      showNotice({
        kind: "error",
        text: `Approved ${okIds.length} of ${results.length}. ${failedCount} failed — retry them from the queue.`,
      });
      setSelectedIds(results.filter((r) => !r.ok).map((r) => r.id));
    } else {
      showNotice({
        kind: "error",
        text: "Batch failed — no disbursements were approved. Check the server connection and retry.",
      });
    }
    setBatchBusy(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const queueBadge = loadError
    ? { variant: "slate" as const, dot: false, label: "UNAVAILABLE" }
    : loaded
    ? pendingCount > 0
      ? { variant: "crimson" as const, dot: true, label: `${pendingCount} PENDING` }
      : { variant: "lime" as const, dot: true, label: "QUEUE CLEAR" }
    : { variant: "slate" as const, dot: false, label: "SYNCING…" };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded bg-gradient-to-r from-surface-card via-surface to-canvas border border-crimson-accent/25 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-crimson-accent/15 border border-crimson-accent/30 flex items-center justify-center text-crimson-accent">
                <IconWallet size={24} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight uppercase">
                    CASHOUT REVIEW & DISBURSEMENT ENGINE
                  </h1>
                  <Badge variant={queueBadge.variant} dot={queueBadge.dot}>
                    {queueBadge.label}
                  </Badge>
                </div>
                <span className="font-mono text-xs text-text-muted mt-1">
                  Review and authorize operator cashout requests across UPI, USDT, LTC, and PayPal rails.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {selectedIds.length > 0 && (
                <Button
                  variant="neon"
                  size="sm"
                  isLoading={batchBusy}
                  onClick={handleBatchApprove}
                >
                  APPROVE SELECTED ({selectedIds.length})
                </Button>
              )}
            </div>
          </div>
        </div>

        {notice && (
          <div
            className={`p-4 border rounded font-mono text-xs flex items-center gap-2.5 ${
              notice.kind === "ok"
                ? "bg-lime-neon/12 border-lime-neon/40 text-lime-neon"
                : "bg-crimson-accent/10 border-crimson-accent/40 text-crimson-accent"
            }`}
          >
            {notice.kind === "ok" ? (
              <IconCheck size={18} strokeWidth={2.5} />
            ) : (
              <IconAlertTriangle size={18} strokeWidth={2.5} />
            )}
            <span>{notice.text}</span>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Rail Filters */}
            <div className="flex items-center gap-1 p-1 rounded bg-surface-card border border-border-dark font-mono text-xs">
              {["all", "UPI", "USDT", "LTC", "PayPal"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRailFilter(r)}
                  className={`px-3 py-1.5 rounded transition-all font-semibold cursor-pointer ${
                    railFilter === r
                      ? "bg-crimson-accent text-white"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 p-1 rounded bg-surface-card border border-border-dark font-mono text-xs">
              {["all", "pending", "approved", "rejected"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded transition-all font-semibold cursor-pointer ${
                    statusFilter === s
                      ? "bg-surface-elevated text-lime-neon border border-lime-neon/40"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search user, ID, or handle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search withdrawals"
              className="w-full bg-surface border border-border-dark focus:border-crimson-accent/60 rounded px-3.5 py-2 text-xs font-mono text-text-primary outline-none"
            />
          </div>
        </div>

        {/* Full Approvals Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <IconWallet size={18} className="text-crimson-accent" />
              <CardTitle>AUTHORIZATION TABLE ({filteredItems.length} ENTRIES)</CardTitle>
            </div>
            <span className="font-mono text-xs text-text-muted">
              Payouts are sent on the operator's chosen rail after approval
            </span>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border-dark bg-canvas text-text-muted text-[10px] uppercase">
                    <th className="p-3.5 pl-5">
                      <input
                        type="checkbox"
                        aria-label="Select all withdrawals"
                        checked={
                          filteredItems.length > 0 &&
                          selectedIds.length === filteredItems.length
                        }
                        onChange={(e) =>
                          setSelectedIds(
                            e.target.checked ? filteredItems.map((i) => i.id) : []
                          )
                        }
                      />
                    </th>
                    <th className="p-3.5">TRANSACTION</th>
                    <th className="p-3.5">OPERATOR</th>
                    <th className="p-3.5">RAIL & DESTINATION</th>
                    <th className="p-3.5">DISBURSEMENT</th>
                    <th className="p-3.5">TRUST METRICS</th>
                    <th className="p-3.5 pr-5 text-right">EXECUTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-text-muted">
                        {loadError ? (
                          <span className="flex items-center justify-center gap-3">
                            Queue unavailable — the database could not be reached.
                            <Button variant="secondary" size="sm" onClick={reload}>
                              RETRY
                            </Button>
                          </span>
                        ) : !loaded ? (
                          "Loading queue…"
                        ) : items.length === 0 ? (
                          "No cashout requests yet. Operator withdrawals appear here as soon as they are requested."
                        ) : (
                          "No entries match the active filters."
                        )}
                      </td>
                    </tr>
                  )}
                  {filteredItems.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr
                        className={`hover:bg-white/[0.02] transition-colors ${
                          selectedIds.includes(item.id) ? "bg-crimson-accent/[0.04]" : ""
                        }`}
                      >
                        <td className="p-3.5 pl-5">
                          <input
                            type="checkbox"
                            aria-label={`Select ${item.id}`}
                            checked={selectedIds.includes(item.id)}
                            onChange={() => toggleSelect(item.id)}
                          />
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-text-primary">{item.id}</span>
                          <span className="block text-[10px] text-text-dim">
                            {item.requestedAt}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <strong className="text-lime-neon">{item.user}</strong>
                          <span className="block text-[10px] text-text-muted">
                            {item.country}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-text-primary">{item.rail}</span>
                          <span className="block text-[10px] text-text-muted truncate max-w-[150px]">
                            {item.target}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-text-primary tabular-nums">
                            {item.coins.toLocaleString()} Coins
                          </span>
                          <span className="block text-[10px] text-gold-accent font-semibold">
                            {item.usd}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-bold ${
                                item.trustScore >= 90
                                  ? "text-lime-neon"
                                  : item.trustScore >= 70
                                  ? "text-gold-accent"
                                  : "text-crimson-accent"
                              }`}
                            >
                              Trust: {item.trustScore}%
                            </span>
                            <span className="text-text-dim">· {item.strikes} strikes</span>
                          </div>
                        </td>
                        <td className="p-3.5 pr-5 text-right">
                          {item.status === "pending" ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="neon"
                                size="sm"
                                isLoading={busyId === item.id}
                                onClick={() => handleApprove(item.id)}
                              >
                                APPROVE
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                disabled={busyId === item.id}
                                onClick={() => {
                                  setRejectTarget(
                                    rejectTarget === item.id ? null : item.id
                                  );
                                  setRejectReason("");
                                }}
                              >
                                REJECT
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end">
                              <Badge
                                variant={item.status === "approved" ? "lime" : "crimson"}
                                size="sm"
                              >
                                {item.status.toUpperCase()}
                              </Badge>
                              {item.rejectReason && (
                                <span className="text-[9px] text-text-dim max-w-[120px] truncate mt-0.5">
                                  {item.rejectReason}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                      {rejectTarget === item.id && item.status === "pending" && (
                        <tr className="bg-crimson-accent/[0.04]">
                          <td colSpan={7} className="p-4 pl-5">
                            <div className="flex flex-wrap items-end gap-3">
                              <div className="flex flex-col gap-1 flex-1 min-w-[240px]">
                                <label
                                  htmlFor={`reject-reason-${item.id}`}
                                  className="font-mono text-[10px] uppercase text-text-muted"
                                >
                                  REJECTION REASON (RECORDED ON THE AUDIT LOG)
                                </label>
                                <input
                                  id={`reject-reason-${item.id}`}
                                  type="text"
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  placeholder={`Why is ${item.user}'s request being rejected?`}
                                  className="w-full bg-surface border border-border-dark focus:border-crimson-accent/60 rounded px-3 py-2 text-xs font-mono text-text-primary outline-none"
                                />
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Button
                                  variant="danger"
                                  size="sm"
                                  disabled={!rejectReason.trim() || busyId === item.id}
                                  isLoading={busyId === item.id}
                                  onClick={() => confirmReject(item.id)}
                                >
                                  CONFIRM & REFUND{" "}
                                  {item.coins.toLocaleString()} COINS
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
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
