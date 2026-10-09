"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminOverview } from "@/hooks/useAdminOverview";
import { EvLogo } from "@/components/ui/CoinIcon";
import {
  IconGrid,
  IconWallet,
  IconVerified,
  IconUsers,
  IconSensors,
  IconCampaign,
  IconArrowRight,
  IconLock,
  IconProps,
} from "@/components/ui/Icons";

interface AdminNavItem {
  name: string;
  href: string;
  icon: React.FC<IconProps>;
  badge?: string;
  badgeType?: "crimson" | "gold" | "lime" | "slate";
}

const adminNavItems: AdminNavItem[] = [
  { name: "Command Hub", href: "/admin", icon: IconGrid },
  { name: "Payout Approvals", href: "/admin/withdrawals", icon: IconWallet, badgeType: "crimson" },
  { name: "Proof Review Queue", href: "/admin/proofs", icon: IconVerified },
  { name: "User Directory & Bans", href: "/admin/users", icon: IconUsers },
  { name: "Offerwall Webhooks", href: "/admin/postbacks", icon: IconSensors },
  { name: "Campaign & Bounties", href: "/admin/campaigns", icon: IconCampaign },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data } = useAdminOverview();

  const navItems = adminNavItems.map((item) => {
    if (item.href === "/admin/withdrawals" && data) {
      const pendingCount = data.withdrawals.length;
      return {
        ...item,
        badge: pendingCount > 0 ? `${pendingCount} PENDING` : undefined,
      };
    }
    return item;
  });

  return (
    <aside className="fixed left-0 top-0 h-screen w-[250px] bg-canvas border-r border-border-dark z-50 flex flex-col justify-between p-3 select-none">
      <div className="flex flex-col gap-4">
        {/* Brand identity */}
        <div className="flex items-center justify-between px-2.5 py-2 rounded bg-surface-card border border-border-dark">
          <div className="flex items-center gap-2.5">
            <EvLogo size={28} />
            <div className="flex flex-col">
              <span className="font-grotesk text-xs font-bold tracking-wider text-text-primary uppercase">
                EARNVERSE
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-crimson-accent font-bold">
                ROOT COMMAND // OPS
              </span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-crimson-accent" />
        </div>

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
                    ? "bg-surface-elevated text-text-primary font-bold border border-crimson-accent/40"
                    : "text-text-muted hover:text-text-primary hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <IconComponent
                    size={17}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={`shrink-0 transition-colors ${
                      isActive ? "text-crimson-accent" : "text-text-dim group-hover:text-text-primary"
                    }`}
                  />
                  <span className="truncate tracking-wide">{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      item.badgeType === "crimson"
                        ? "bg-crimson-accent/15 text-crimson-accent border border-crimson-accent/30"
                        : item.badgeType === "gold"
                        ? "bg-gold-accent/15 text-gold-accent border border-gold-accent/30"
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

      {/* Pinned Bottom Operator Security Card */}
      <div className="rounded bg-surface border border-border-dark p-3 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-crimson-accent font-mono text-[10px] font-bold">
            <IconLock size={12} />
            <span>ROOT PRIVILEGES</span>
          </div>
          <span className="font-mono text-[9px] bg-crimson-accent/10 text-crimson-accent border border-crimson-accent/25 px-1.5 py-0.5 rounded font-semibold">
            LOCAL OPERATOR
          </span>
        </div>

        <div className="flex flex-col font-mono text-[11px] text-text-muted border-t border-border-subtle pt-2">
          <span className="text-text-primary font-bold">@founder_ops</span>
          <span className="text-[10px] text-text-dim">Single-operator console</span>
        </div>

        <Link
          href="/home"
          className="w-full text-center py-2 bg-surface-elevated hover:bg-surface-item text-text-primary font-grotesk text-xs uppercase font-bold rounded border border-border-hover hover:border-lime-neon/40 hover:text-lime-neon transition-all flex items-center justify-center gap-1.5"
        >
          <span>Switch to User HUD</span>
          <IconArrowRight size={13} />
        </Link>
      </div>
    </aside>
  );
}
