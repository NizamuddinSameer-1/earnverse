"use client";

import React, { useState, useEffect } from "react";
import { useAdminOverview } from "@/hooks/useAdminOverview";
import { IconAlertTriangle } from "@/components/ui/Icons";

export function AdminHeader() {
  const [utcTime, setUtcTime] = useState("14:28:02");
  const { loaded, error, data } = useAdminOverview();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toTimeString().split(" ")[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const pendingCount = data?.withdrawals.length ?? 0;
  const pendingUsd = data
    ? (data.withdrawals.reduce((acc, w) => acc + w.coins, 0) / 1000).toFixed(2)
    : "0.00";
  const isFrozen = data?.emergencyFreeze ?? false;

  return (
    <header className="fixed top-0 left-[250px] right-0 h-16 bg-canvas border-b border-border-dark z-40 flex items-center justify-between px-6 select-none">
      {/* Left: Admin identity & clock */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 bg-surface-card border border-border-dark px-2.5 py-1 rounded">
          <span className="w-2 h-2 rounded-full bg-crimson-accent" />
          <span className="text-text-primary font-bold text-[11px] tracking-wide">
            ADMIN CORE // OPERATOR CONSOLE
          </span>
        </div>

        <span className="text-border-hover">|</span>

        <span className="text-text-muted text-[11px]">
          UTC <span className="text-text-primary font-bold tabular-nums">{utcTime}</span>
        </span>
      </div>

      {/* Center: Pending liabilities, derived from the live queue */}
      <div className="hidden lg:flex items-center gap-2.5 bg-crimson-accent/10 border border-crimson-accent/30 px-3.5 py-1.5 rounded font-mono text-xs">
        <IconAlertTriangle size={14} className="text-crimson-accent" />
        {error ? (
          <span className="text-text-muted font-semibold">UNAPPROVED LIABILITIES: UNAVAILABLE</span>
        ) : !loaded ? (
          <span className="text-text-muted font-semibold">UNAPPROVED LIABILITIES: SYNCING…</span>
        ) : (
          <span className="text-text-primary font-semibold">
            UNAPPROVED LIABILITIES:{" "}
            <strong
              className={`tabular-nums ${
                pendingCount > 0 ? "text-crimson-accent" : "text-lime-neon"
              }`}
            >
              ${pendingUsd} USD ({pendingCount} TX{pendingCount === 1 ? "" : "s"})
            </strong>
          </span>
        )}
      </div>

      {/* Right: Freeze state & operator profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-surface-card border border-border-dark font-mono text-xs text-text-muted">
          {error ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-text-dim" />
              <span>DISBURSEMENTS: UNAVAILABLE</span>
            </>
          ) : !loaded ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-text-dim" />
              <span>DISBURSEMENTS: SYNCING…</span>
            </>
          ) : isFrozen ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-crimson-accent" />
              <span>
                DISBURSEMENTS: <strong className="text-crimson-accent">FROZEN</strong>
              </span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-lime-neon" />
              <span>
                DISBURSEMENTS: <strong className="text-lime-neon">UNFROZEN</strong>
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-surface-card border border-border-dark font-mono text-xs">
          <div className="w-6 h-6 rounded bg-crimson-accent/20 border border-crimson-accent/40 flex items-center justify-center text-crimson-accent font-bold text-xs">
            A
          </div>
          <span className="font-bold text-text-primary">FOUNDER ROOT</span>
        </div>
      </div>
    </header>
  );
}
