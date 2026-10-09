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
  IconProps,
} from "@/components/ui/Icons";

interface NavItem {
  name: string;
  href: string;
  icon: React.FC<IconProps>;
  badge?: string;
  badgeType?: "lime" | "gold" | "slate" | "crimson";
}

const navItems: NavItem[] = [
  { name: "Home HUD", href: "/home", icon: IconGrid },
  { name: "Task Matrix", href: "/earn", icon: IconBolt, badge: "HOT", badgeType: "lime" },
  { name: "Creator Studio", href: "/creator-studio", icon: IconCampaign, badge: "SOON", badgeType: "slate" },
  { name: "Cashout Terminal", href: "/wallet", icon: IconWallet },
  { name: "Earnings Ledger", href: "/ledger", icon: IconLedger },
  { name: "Community", href: "/community", icon: IconCommunity },
  { name: "Referral Hub", href: "/referrals", icon: IconReferral, badge: "10%", badgeType: "slate" },
  { name: "Rewards & Streak", href: "/rewards", icon: IconTrophy },
  { name: "Submit Proof", href: "/proof", icon: IconVerified },
  { name: "Operator Profile", href: "/profile", icon: IconUser },
  { name: "Admin Terminal", href: "/admin", icon: IconShield, badge: "ROOT", badgeType: "crimson" },
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
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[240px] bg-surface border-r border-border-dark z-50 flex-col justify-between p-3 select-none">
      {/* Top brand header & navigation links */}
      <div className="flex flex-col gap-4">
        {/* Brand identity */}
        <Link
          href="/"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded hover:bg-white/[0.04] transition-all group border border-transparent hover:border-border-hover"
        >
          <EvLogo size={32} />
          <div className="flex flex-col">
            <span className="font-grotesk text-sm font-bold tracking-wider text-text-primary uppercase group-hover:text-lime-neon transition-colors">
              EARNVERSE
            </span>
            <span className="font-mono text-[9px] uppercase tracking-wider text-text-dim">
              TERMINAL v2.4
            </span>
          </div>
        </Link>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1 font-grotesk text-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded transition-all duration-150 group ${
                  isActive
                    ? "bg-surface-elevated text-lime-neon font-bold border border-lime-neon/25"
                    : "text-text-muted hover:text-text-primary hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <IconComponent
                    size={17}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-lime-neon" : "text-text-dim group-hover:text-text-primary"
                    }`}
                  />
                  <span className="truncate tracking-wide">{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      item.badgeType === "lime"
                        ? "bg-lime-neon/15 text-lime-neon border border-lime-neon/30"
                        : item.badgeType === "gold"
                        ? "bg-gold-accent/15 text-gold-accent border border-gold-accent/30"
                        : item.badgeType === "crimson"
                        ? "bg-crimson-accent/15 text-crimson-accent border border-crimson-accent/30"
                        : "bg-surface-item text-text-muted"
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

      {/* Pinned Bottom Vault Widget */}
      <div className="rounded bg-surface-card border border-border-dark p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
            Vault Balance
          </span>
          <span className={`font-mono text-[9px] uppercase px-1.5 py-0.5 rounded font-semibold ${
            isLoggedIn 
              ? "bg-gold-accent/10 text-gold-accent border border-gold-accent/25" 
              : "bg-surface text-text-muted border border-border-dark"
          }`}>
            {isLoggedIn ? "PRO · LV 12" : "GUEST MODE"}
          </span>
        </div>

        <div className="flex items-baseline gap-1.5">
          <CoinIcon size={16} />
          <span className="font-mono text-lg font-bold text-text-primary tabular-nums tracking-tight">
            {balance.toLocaleString()}
          </span>
          <span className="font-mono text-[10px] text-gold-accent font-bold uppercase">
            COINS
          </span>
        </div>

        <div className="flex items-center justify-between font-mono text-[11px] text-text-muted border-t border-border-subtle pt-2">
          <span className="text-gold-accent font-medium">≈ ${(balance / 1000).toFixed(2)} USD</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isLoggedIn ? "bg-lime-neon" : "bg-text-dim"}`} />
            <span className="text-[9px] uppercase text-text-dim font-bold">
              {isLoggedIn ? "SETTLED" : "SANDBOX"}
            </span>
          </div>
        </div>

        {isLoggedIn ? (
          <Link
            href="/wallet"
            className="w-full text-center py-2 mt-1 bg-lime-neon text-text-inverted font-grotesk text-xs uppercase font-bold rounded hover:brightness-110 hover:shadow-[2px_2px_0_rgba(198,255,62,0.5)] active:scale-[0.98] active:shadow-none transition-all flex items-center justify-center gap-1.5"
          >
            <span>Quick Cashout</span>
            <IconBolt size={14} strokeWidth={2.5} />
          </Link>
        ) : (
          <Link
            href="/login"
            className="w-full text-center py-2 mt-1 bg-surface-card border border-border-dark hover:border-lime-neon/50 text-text-primary font-grotesk text-xs uppercase font-bold rounded hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
          >
            <span>Sign In to Cashout</span>
            <IconBolt size={14} strokeWidth={2.5} className="text-lime-neon" />
          </Link>
        )}
      </div>
    </aside>
  );
}
