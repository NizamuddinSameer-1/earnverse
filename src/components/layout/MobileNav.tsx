"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CoinIcon } from "@/components/ui/CoinIcon";
import {
  IconGrid,
  IconBolt,
  IconCommunity,
  IconWallet,
  IconUser,
  IconProps,
} from "@/components/ui/Icons";

interface NavItem {
  name: string;
  href: string;
  icon: React.FC<IconProps>;
  /** Short label for the cramped mobile bar. */
  short: string;
}

/**
 * Mobile bottom bar — the 5 destinations specified in SYSTEM_MAP.md §1.
 * Deliberately NOT the full 11-item desktop sidebar: a bottom bar cannot hold
 * 11 items at a legible tap size, and burying earnings behind "more" would
 * hurt the primary loop (Earn -> Spend).
 */
const navItems: NavItem[] = [
  { name: "Home HUD", href: "/home", icon: IconGrid, short: "Home" },
  { name: "Task Matrix", href: "/earn", icon: IconBolt, short: "Earn" },
  { name: "Community", href: "/community", icon: IconCommunity, short: "Community" },
  { name: "Cashout", href: "/wallet", icon: IconWallet, short: "Wallet" },
  { name: "Profile", href: "/profile", icon: IconUser, short: "Profile" },
];

export function MobileNav() {
  const pathname = usePathname();
  const [balance, setBalance] = React.useState<number>(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    let active = true;

    fetch("/api/user/wallet")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        const coins = data?.data?.availableCoins;
        if (data?.success && typeof coins === "number") setBalance(coins);
      })
      .catch(() => {
        /* Guest state: show 0, never block the nav on a failed fetch. */
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  return (
    <>
      {/* Balance strip — coin balance must be visible from every screen. */}
      <div className="lg:hidden fixed bottom-[68px] left-0 right-0 z-40 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-card border border-border-dark pointer-events-auto">
          <CoinIcon size={13} />
          <span className="font-mono text-xs font-bold text-text-primary tabular-nums">
            {mounted ? balance.toLocaleString() : "0"}
          </span>
          <span className="font-mono text-[9px] uppercase text-gold-accent font-bold">coins</span>
        </div>
      </div>

      <nav
        aria-label="Primary"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border-dark"
      >
        <ul className="grid grid-cols-5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex flex-col items-center justify-center gap-1 min-h-[68px] px-1 py-2 transition-colors ${
                    isActive ? "text-lime-neon" : "text-text-dim"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-11 h-7 rounded transition-colors ${
                      isActive ? "bg-lime-neon/12" : ""
                    }`}
                  >
                    <IconComponent size={19} strokeWidth={isActive ? 2.2 : 1.8} />
                  </span>
                  <span
                    className={`font-mono text-[9px] uppercase tracking-wide ${
                      isActive ? "text-lime-neon font-bold" : ""
                    }`}
                  >
                    {item.short}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}