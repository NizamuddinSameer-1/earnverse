import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-lowest text-text-primary selection:bg-crimson-accent selection:text-white">
      <AdminSidebar />
      <div className="pl-[250px]">
        <AdminHeader />
        <main className="pt-20 pb-12 px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
