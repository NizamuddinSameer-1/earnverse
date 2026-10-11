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
  short: string;
}

const navItems: NavItem[] = [
  { name: "Home", href: "/home", icon: IconGrid, short: "Home" },
  { name: "Earn Lounge", href: "/earn", icon: IconBolt, short: "Earn" },
  { name: "Community", href: "/community", icon: IconCommunity, short: "Feed" },
  { name: "Wallet", href: "/wallet", icon: IconWallet, short: "Wallet" },
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
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [pathname]);

  return (
    <>
      {/* Floating Balance Strip */}
      <div className="lg:hidden fixed bottom-[72px] left-0 right-0 z-40 flex items-center justify-center pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D111A]/90 backdrop-blur-xl border border-white/[0.12] shadow-[0_4px_16px_rgba(0,0,0,0.5)] pointer-events-auto">
          <CoinIcon size={14} />
          <span className="font-mono text-xs font-bold text-white tabular-nums">
            {mounted ? balance.toLocaleString() : "0"}
          </span>
          <span className="text-[10px] uppercase text-amber-400 font-bold">Coins</span>
          <span className="text-[10px] text-slate-400 font-mono">(${(balance / 1000).toFixed(2)})</span>
        </div>
      </div>

      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#07080B]/90 backdrop-blur-2xl border-t border-white/[0.08]"
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
                  className={`flex flex-col items-center justify-center gap-1 min-h-[66px] px-1 py-1.5 transition-colors ${
                    isActive ? "text-amber-400" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-12 h-7 rounded-xl transition-all ${
                      isActive ? "bg-amber-400/15 border border-amber-400/30 text-amber-400" : ""
                    }`}
                  >
                    <IconComponent size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                  </span>
                  <span className={`text-[10px] tracking-wide ${isActive ? "font-bold text-amber-400" : "font-normal"}`}>
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