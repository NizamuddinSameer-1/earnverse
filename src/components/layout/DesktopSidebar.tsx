"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CoinIcon, EvLogo } from "@/components/ui/CoinIcon";
import {
  IconGrid,
  IconBolt,
  IconCommunity,
  IconWallet,
  IconLedger,
  IconReferral,
  IconTrophy,
  IconVerified,
  IconCampaign,
  IconUser,
  IconShield,
  IconArrowRight,
  IconProps,
} from "@/components/ui/Icons";

interface NavItem {
  name: string;
  href: string;
  icon: React.FC<IconProps>;
  badge?: string;
  badgeType?: "gold" | "emerald" | "violet" | "slate" | "crimson";
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/home", icon: IconGrid },
  { name: "Earn Lounge", href: "/earn", icon: IconBolt, badge: "HOT", badgeType: "gold" },
  { name: "Creator Studio", href: "/creator-studio", icon: IconCampaign, badge: "SOON", badgeType: "violet" },
  { name: "Wallet & Cashout", href: "/wallet", icon: IconWallet },
  { name: "Earnings History", href: "/ledger", icon: IconLedger },
  { name: "Community Feed", href: "/community", icon: IconCommunity },
  { name: "Referrals", href: "/referrals", icon: IconReferral, badge: "10%", badgeType: "emerald" },
  { name: "Rewards & Streak", href: "/rewards", icon: IconTrophy },
  { name: "Payment Proof", href: "/proof", icon: IconVerified },
  { name: "Profile & Settings", href: "/profile", icon: IconUser },
  { name: "Admin Hub", href: "/admin", icon: IconShield, badge: "ROOT", badgeType: "crimson" },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const [balance, setBalance] = React.useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

  React.useEffect(() => {
    fetch("/api/user/wallet")
      .then((res) => {
        if (!res.ok) {
          setIsLoggedIn(false);
          setBalance(0);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.success && data.data && typeof data.data.availableCoins === "number") {
          setBalance(data.data.availableCoins);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setBalance(0);
        }
      })
      .catch((e) => {
        console.error("Sidebar wallet fetch error", e);
        setIsLoggedIn(false);
        setBalance(0);
      });
  }, [pathname]);

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[260px] bg-[#0A0D14] border-r border-white/[0.08] z-50 flex-col justify-between p-4 select-none">
      {/* Top Brand & Navigation */}
      <div className="flex flex-col gap-5">
        {/* Brand Link */}
        <Link
          href="/"
          className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-white/[0.04] transition-all group"
        >
          <EvLogo size={36} />
          <div className="flex flex-col">
            <span className="font-grotesk text-base font-bold tracking-wider text-white group-hover:text-amber-400 transition-colors">
              EARNVERSE
            </span>
            <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">
              REWARD PLATFORM
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 font-grotesk text-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500/15 to-transparent text-amber-400 font-bold border border-amber-400/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <IconComponent
                    size={18}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "text-slate-500 group-hover:text-white"
                    }`}
                  />
                  <span className="truncate tracking-wide text-[13px]">{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`font-mono text-[10px] tracking-wider px-2 py-0.5 rounded-full font-bold shrink-0 ${
                      item.badgeType === "gold"
                        ? "bg-amber-400/15 text-amber-400 border border-amber-400/30"
                        : item.badgeType === "emerald"
                        ? "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30"
                        : item.badgeType === "violet"
                        ? "bg-violet-400/15 text-violet-400 border border-violet-400/30"
                        : item.badgeType === "crimson"
                        ? "bg-rose-400/15 text-rose-400 border border-rose-400/30"
                        : "bg-white/[0.06] text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Pinned Bottom Wallet Card */}
      <div className="rounded-2xl bg-[#0F1420] border border-white/[0.08] p-4 flex flex-col gap-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">Available Balance</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold font-mono ${
            isLoggedIn 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" 
              : "bg-white/[0.04] text-slate-400 border border-white/[0.08]"
          }`}>
            {isLoggedIn ? "LIVE WALLET" : "GUEST"}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <CoinIcon size={20} />
          <span className="font-mono text-xl font-bold text-white tabular-nums tracking-tight">
            {balance.toLocaleString()}
          </span>
          <span className="text-xs text-amber-400 font-bold uppercase">
            Coins
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/[0.06] pt-2">
          <span className="text-emerald-400 font-semibold font-mono">≈ ${(balance / 1000).toFixed(2)} USD</span>
          <span className="text-[11px] text-slate-500">1k = $1.00</span>
        </div>

        {isLoggedIn ? (
          <Link
            href="/wallet"
            className="w-full text-center py-2.5 mt-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-grotesk text-xs uppercase font-bold rounded-xl hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-[0_0_16px_rgba(245,158,11,0.25)]"
          >
            <span>Cash Out Funds</span>
            <IconArrowRight size={14} strokeWidth={2.5} />
          </Link>
        ) : (
          <Link
            href="/login"
            className="w-full text-center py-2.5 mt-1 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white font-grotesk text-xs uppercase font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span>Sign In to Earn</span>
            <IconBolt size={14} strokeWidth={2.5} className="text-amber-400" />
          </Link>
        )}
      </div>
    </aside>
  );
}
