import React from "react";
import { DesktopSidebar } from "./DesktopSidebar";
import { DesktopHeader } from "./DesktopHeader";
import { MobileNav } from "./MobileNav";
import { MotionRoot } from "@/components/ui/Reveal";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#07080B] text-slate-100 selection:bg-amber-400 selection:text-black">
      <MotionRoot />
      {/* Desktop-only sidebar; the mobile equivalent is the bottom nav below. */}
      <DesktopSidebar />
      <div className="lg:pl-[260px]">
        <DesktopHeader />
        <main className="pt-20 pb-28 lg:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
