"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconBell, IconChevronRight, IconShield, IconUser } from "@/components/ui/Icons";
import { CoinIcon } from "@/components/ui/CoinIcon";

interface CurrentUser {
  id: string;
  username: string;
  email: string;
  role: "OPERATOR" | "ADMIN";
  trustScore: number;
}

export function DesktopHeader() {
  const router = useRouter();
  const [utcTime, setUtcTime] = useState("14:28:02");
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch((e) => console.error("Header auth check error", e));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toTimeString().split(" ")[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 lg:left-[240px] right-0 h-16 bg-surface border-b border-border-dark z-40 flex items-center justify-between gap-2 px-4 sm:px-6 select-none min-w-0">
      {/* Left: Terminal identity & real UTC clock */}
      <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono min-w-0">
        <div className="flex items-center gap-2 bg-surface-card border border-border-dark px-2 sm:px-2.5 py-1 rounded shrink-0">
          <span className="w-2 h-2 rounded-full bg-lime-neon shrink-0" />
          <span className="text-text-primary font-bold text-[11px] tracking-wide hidden sm:inline">TERMINAL 01</span>
          <span className="text-text-primary font-bold text-[11px] tracking-wide sm:hidden">T01</span>
        </div>

        <span className="text-border-hover hidden sm:inline">|</span>

        <span className="text-text-muted text-[11px] shrink-0">
          UTC <span className="text-text-primary font-bold tabular-nums">{utcTime}</span>
        </span>

        <span className="text-border-hover hidden md:inline">|</span>

        <div className="hidden md:flex items-center gap-1.5 text-lime-neon font-semibold text-[10px] uppercase tracking-wider shrink-0">
          <IconShield size={13} strokeWidth={2.2} />
          <span>CREATOR ESCROW</span>
        </div>
      </div>

      {/* Center: Static platform facts */}
      <div className="hidden xl:flex items-center gap-3 bg-surface-card border border-border-dark px-3.5 py-1.5 rounded">
        <span className="flex items-center gap-1.5 shrink-0 text-gold-accent font-mono text-[10px] font-bold uppercase tracking-wider">
          <CoinIcon size={14} />
          <span>PEG: 1,000 COINS = $1.00</span>
        </span>
        <span className="text-border-hover">|</span>
        <span className="font-mono text-[11px] text-text-muted">OPERATOR-REVIEWED PAYOUTS</span>
      </div>

      {/* Right: Notifications, Admin Ops Switch & Operator profile button */}
      <div className="flex items-center gap-3">
        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-crimson-accent/15 border border-crimson-accent/40 text-crimson-accent hover:bg-crimson-accent/25 transition-all font-mono text-[11px] font-bold uppercase tracking-wider"
            title="Switch to Restricted Admin Ops Console"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-crimson-accent" />
            <span>ADMIN OPS</span>
          </Link>
        )}

        <button
          type="button"
          aria-label="System notifications"
          className="relative w-9 h-9 rounded bg-surface-card border border-border-dark flex items-center justify-center text-text-muted hover:text-text-primary hover:border-border-hover transition-all cursor-pointer"
        >
          <IconBell size={16} strokeWidth={1.8} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-crimson-accent" />
        </button>

        {user ? (
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/profile"
              className="flex items-center gap-2.5 bg-surface-card border border-border-dark hover:border-lime-neon/40 px-2.5 py-1.5 rounded transition-all group"
            >
              <div className="w-7 h-7 rounded bg-lime-neon/15 border border-lime-neon/30 flex items-center justify-center text-lime-neon font-mono font-bold text-xs uppercase">
                {user.username.slice(0, 2)}
              </div>
              {/* Username is secondary on narrow screens — the avatar carries identity. */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-grotesk text-xs font-bold text-text-primary group-hover:text-lime-neon transition-colors">
                  @{user.username}
                </span>
                <span className="font-mono text-[9px] uppercase text-text-dim">
                  {user.role === "ADMIN" ? "SUPERADMIN" : `TRUST ${user.trustScore || 100}%`}
                </span>
              </div>
              <IconChevronRight
                size={14}
                className="hidden sm:block text-text-dim group-hover:text-lime-neon transition-colors"
              />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="px-2.5 py-1.5 bg-surface-card border border-border-dark hover:border-crimson-accent/50 text-text-muted hover:text-crimson-accent text-[11px] font-mono rounded transition-all cursor-pointer"
              title="Sign Out of Session"
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded bg-lime-neon text-text-inverted font-grotesk text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all shrink-0"
          >
            <IconUser size={14} strokeWidth={2.5} />
            <span className="hidden sm:inline">SIGN IN</span>
            <span className="sm:hidden">LOGIN</span>
          </Link>
        )}
      </div>
    </header>
  );
}
