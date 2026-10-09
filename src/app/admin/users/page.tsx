"use client";

import React, { useRef, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { IconUsers, IconAlertTriangle, IconCheck } from "@/components/ui/Icons";
import { dispatchAdminOverviewChanged } from "@/hooks/useAdminOverview";

interface OperatorRow {
  id: string;
  username: string;
  email: string;
  country: string;
  joined: string;
  balanceCoins: number;
  lifetimeCashedCoins: number;
  trustScore: number;
  strikes: number;
  isBanned: boolean;
}

type Notice = { kind: "ok" | "error"; text: string };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<OperatorRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [banBusyId, setBanBusyId] = useState<string | null>(null);
  const [adjustTarget, setAdjustTarget] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjustBusy, setAdjustBusy] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotice = (next: Notice) => {
    setNotice(next);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3500);
  };

  const fetchLiveUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        type DbUser = {
          id: string;
          username: string;
          email: string;
          status: string;
          trustScore: number;
          strikes: number;
          country: string;
          createdAt: string;
          wallet?: {
            availableCoins: number;
            lifetimeCashed: number;
          };
        };

        const mapped: OperatorRow[] = json.data.map((u: DbUser) => ({
          id: u.id,
          username: `@${u.username}`,
          email: u.email,
          country: u.country ?? "GLOBAL",
          joined: new Date(u.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }),
          balanceCoins: u.wallet?.availableCoins ?? 0,
          lifetimeCashedCoins: u.wallet?.lifetimeCashed ?? 0,
          trustScore: u.trustScore ?? 100,
          strikes: u.strikes ?? 0,
          isBanned: u.status === "BANNED",
        }));
        setUsers(mapped);
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

  React.useEffect(() => {
    fetchLiveUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleBan = async (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const newState = !target.isBanned;
    setBanBusyId(id);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id, action: newState ? "BAN" : "UNBAN" }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, isBanned: newState } : u))
        );
        showNotice({
          kind: "ok",
          text: `${target.username} ${newState ? "suspended" : "reinstated"}. Recorded on the audit log.`,
        });
        dispatchAdminOverviewChanged();
      } else {
        showNotice({ kind: "error", text: `Error: ${data.error}` });
      }
    } catch {
      showNotice({
        kind: "error",
        text: "Ban toggle failed — could not reach the server. No changes were made.",
      });
    } finally {
      setBanBusyId(null);
    }
  };

  const openAdjust = (id: string) => {
    if (adjustTarget === id) {
      setAdjustTarget(null);
      return;
    }
    setAdjustTarget(id);
    setAdjustAmount("");
    setAdjustReason("");
  };

  const closeAdjust = () => {
    setAdjustTarget(null);
    setAdjustAmount("");
    setAdjustReason("");
  };

  const adjustDelta = parseInt(adjustAmount, 10);
  const adjustValid =
    !isNaN(adjustDelta) && adjustDelta !== 0 && adjustReason.trim().length > 0;

  const handleApplyAdjust = async (id: string, username: string) => {
    const target = users.find((u) => u.id === id);
    if (!target || !adjustValid) return;
    setAdjustBusy(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: id,
          action: "ADJUST_BALANCE",
          amount: adjustDelta,
          reason: adjustReason.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === id
              ? { ...u, balanceCoins: Math.max(0, u.balanceCoins + adjustDelta) }
              : u
          )
        );
        showNotice({
          kind: "ok",
          text: `Adjusted ${adjustDelta > 0 ? "+" : ""}${adjustDelta.toLocaleString()} Coins for ${username}. Ledger entry and audit row written.`,
        });
        closeAdjust();
        dispatchAdminOverviewChanged();
      } else {
        showNotice({ kind: "error", text: `Error: ${data.error}` });
      }
    } catch {
      showNotice({
        kind: "error",
        text: "Adjustment failed — could not reach the server. No changes were made.",
      });
    } finally {
      setAdjustBusy(false);
    }
  };

  const accountBadge = loadError
    ? { variant: "slate" as const, dot: false, label: "UNAVAILABLE" }
    : loaded
    ? { variant: "lime" as const, dot: true, label: `${users.length} ACCOUNTS` }
    : { variant: "slate" as const, dot: false, label: "SYNCING…" };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded bg-gradient-to-r from-surface-card via-surface to-canvas border border-border-dark p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-lime-neon/15 border border-lime-neon/30 flex items-center justify-center text-lime-neon">
                <IconUsers size={24} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight uppercase">
                    OPERATOR DIRECTORY & AUDIT LEDGER
                  </h1>
                  <Badge variant={accountBadge.variant} dot={accountBadge.dot}>
                    {accountBadge.label}
                  </Badge>
                </div>
                <span className="font-mono text-xs text-text-muted mt-1">
                  Inspect operator vaults, review trust metrics, adjust ledger balances, and enforce platform bans.
                </span>
              </div>
            </div>

            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder="Search username, ID, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search operators"
                className="w-full bg-surface border border-border-dark focus:border-lime-neon/60 rounded px-3.5 py-2 text-xs font-mono text-text-primary outline-none"
              />
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
            <IconCheck size={18} strokeWidth={2.5} />
            <span>{notice.text}</span>
          </div>
        )}

        {/* Directory Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <IconUsers size={18} className="text-lime-neon" />
              <CardTitle>REGISTERED OPERATORS ({filteredUsers.length})</CardTitle>
            </div>
            <span className="font-mono text-xs text-text-muted">
              Every adjustment writes a ledger entry and an audit log row
            </span>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border-dark bg-canvas text-text-muted text-[10px] uppercase">
                    <th className="p-3.5 pl-5">OPERATOR</th>
                    <th className="p-3.5">EMAIL / COUNTRY</th>
                    <th className="p-3.5">CONFIRMED BALANCE</th>
                    <th className="p-3.5">LIFETIME CASHED</th>
                    <th className="p-3.5">TRUST METRICS</th>
                    <th className="p-3.5">ACCOUNT STATUS</th>
                    <th className="p-3.5 pr-5 text-right">CONTROLS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-text-muted">
                        {loadError
                          ? "Directory unavailable — the database could not be reached."
                          : !loaded
                          ? "Loading operators…"
                          : users.length === 0
                          ? "No operators registered yet. Accounts appear here as soon as someone signs up."
                          : "No accounts match this search."}
                      </td>
                    </tr>
                  )}
                  {filteredUsers.map((u) => (
                    <React.Fragment key={u.id}>
                      <tr className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3.5 pl-5">
                          <strong className="text-lime-neon block">{u.username}</strong>
                          <span className="text-[10px] text-text-dim">
                            {u.id} · Joined {u.joined}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-text-primary">{u.email}</span>
                          <span className="block text-[10px] text-text-muted">{u.country}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-text-primary tabular-nums">
                            {u.balanceCoins.toLocaleString()} Coins
                          </span>
                          <span className="block text-[10px] text-gold-accent font-semibold">
                            ≈ ${(u.balanceCoins / 1000).toFixed(2)} USD
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold text-text-primary tabular-nums">
                            {u.lifetimeCashedCoins.toLocaleString()} Coins
                          </span>
                          <span className="block text-[10px] text-text-muted">
                            ≈ ${(u.lifetimeCashedCoins / 1000).toFixed(2)} USD
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`font-bold ${
                              u.trustScore >= 90
                                ? "text-lime-neon"
                                : u.trustScore >= 70
                                ? "text-gold-accent"
                                : "text-crimson-accent"
                            }`}
                          >
                            Trust: {u.trustScore}%
                          </span>
                          <span className="block text-[10px] text-text-muted">
                            {u.strikes} Fraud Strikes
                          </span>
                        </td>
                        <td className="p-3.5">
                          <Badge variant={u.isBanned ? "crimson" : "lime"} size="sm">
                            {u.isBanned ? "SUSPENDED" : "ACTIVE"}
                          </Badge>
                        </td>
                        <td className="p-3.5 pr-5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => openAdjust(u.id)}
                            >
                              ADJUST
                            </Button>
                            <Button
                              variant={u.isBanned ? "outline" : "danger"}
                              size="sm"
                              isLoading={banBusyId === u.id}
                              onClick={() => handleToggleBan(u.id)}
                            >
                              {u.isBanned ? "UNBAN" : "BAN"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {adjustTarget === u.id && (
                        <tr className="bg-lime-neon/[0.03]">
                          <td colSpan={7} className="p-4 pl-5">
                            <div className="flex flex-wrap items-end gap-3">
                              <div className="flex flex-col gap-1">
                                <label
                                  htmlFor={`adjust-amount-${u.id}`}
                                  className="font-mono text-[10px] uppercase text-text-muted"
                                >
                                  ADJUSTMENT (COINS, ±)
                                </label>
                                <input
                                  id={`adjust-amount-${u.id}`}
                                  type="text"
                                  inputMode="numeric"
                                  value={adjustAmount}
                                  onChange={(e) => setAdjustAmount(e.target.value)}
                                  placeholder="+500 or -500"
                                  className="w-40 bg-surface border border-border-dark focus:border-lime-neon/60 rounded px-3 py-2 text-xs font-mono text-text-primary outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
                                <label
                                  htmlFor={`adjust-reason-${u.id}`}
                                  className="font-mono text-[10px] uppercase text-text-muted"
                                >
                                  AUDIT REASON (REQUIRED)
                                </label>
                                <input
                                  id={`adjust-reason-${u.id}`}
                                  type="text"
                                  value={adjustReason}
                                  onChange={(e) => setAdjustReason(e.target.value)}
                                  placeholder="Recorded on the ledger entry and audit log"
                                  className="w-full bg-surface border border-border-dark focus:border-lime-neon/60 rounded px-3 py-2 text-xs font-mono text-text-primary outline-none"
                                />
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Button
                                  variant="neon"
                                  size="sm"
                                  disabled={!adjustValid || adjustBusy}
                                  isLoading={adjustBusy}
                                  onClick={() => handleApplyAdjust(u.id, u.username)}
                                >
                                  CONFIRM ADJUSTMENT
                                </Button>
                                <Button variant="ghost" size="sm" onClick={closeAdjust}>
                                  CANCEL
                                </Button>
                              </div>
                            </div>
                            {adjustValid && (
                              <span className="block font-mono text-[10px] text-text-dim mt-2">
                                Ledger: {adjustDelta > 0 ? "+" : ""}
                                {adjustDelta.toLocaleString()} Coins (≈ $
                                {(Math.abs(adjustDelta) / 1000).toFixed(2)}) · New balance:{" "}
                                {Math.max(0, u.balanceCoins + adjustDelta).toLocaleString()} Coins
                              </span>
                            )}
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
