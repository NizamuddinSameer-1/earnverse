"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconBell, IconChevronRight, IconShield, IconUser } from "@/components/ui/Icons";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { Badge } from "@/components/ui/Badge";

interface CurrentUser {
  id: string;
  username: string;
  email: string;
  role: "OPERATOR" | "ADMIN";
  trustScore: number;
}

export function DesktopHeader() {
  const router = useRouter();
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

  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-[#07080B]/85 backdrop-blur-xl border-b border-white/[0.08] z-40 flex items-center justify-between gap-3 px-4 sm:px-6 select-none min-w-0">
      {/* Left: Platform status & peg indicator */}
      <div className="flex items-center gap-3 sm:gap-4 text-xs min-w-0">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="text-white font-medium text-xs tracking-wide">
            Live Earning Network
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
          <span>•</span>
          <span className="flex items-center gap-1.5 font-mono text-amber-400 font-semibold">
            <CoinIcon size={14} />
            <span>1,000 Coins = $1.00 USD</span>
          </span>
        </div>
      </div>

      {/* Right: Notifications, Admin Ops Switch & User profile badge */}
      <div className="flex items-center gap-3">
        {user?.role === "ADMIN" && (
          <Link
            href="/admin"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all text-xs font-bold font-grotesk tracking-wide"
            title="Switch to Restricted Admin Console"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
            <span>ADMIN OPS</span>
          </Link>
        )}

        <button
          type="button"
          aria-label="System notifications"
          className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.18] flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <IconBell size={16} strokeWidth={1.8} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
        </button>

        {user ? (
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/profile"
              className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] hover:border-amber-400/40 px-3 py-1.5 rounded-xl transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400/20 to-indigo-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-xs uppercase">
                {user.username.slice(0, 2)}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-grotesk text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  @{user.username}
                </span>
                <span className="text-[10px] text-slate-400">
                  {user.role === "ADMIN" ? "SuperAdmin" : `Trust ${user.trustScore || 100}%`}
                </span>
              </div>
              <IconChevronRight
                size={14}
                className="hidden sm:block text-slate-500 group-hover:text-amber-400 transition-colors"
              />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] hover:border-rose-500/40 text-slate-400 hover:text-rose-400 text-xs font-medium rounded-xl transition-all cursor-pointer"
              title="Sign Out"
            >
              Log out
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-grotesk text-xs font-bold tracking-wide hover:brightness-105 transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)] shrink-0"
          >
            <IconUser size={14} strokeWidth={2.5} />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
}
