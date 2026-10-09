"use client";

import { useCallback, useEffect, useState } from "react";

export interface AdminOverviewWithdrawal {
  id: string;
  coins: number;
  amountUsd: number;
  rail: string;
  destination: string;
  status: string;
  createdAt: string;
  user?: {
    username: string;
    trustScore: number;
    strikes: number;
  };
}

export interface AdminOverviewData {
  emergencyFreeze: boolean;
  kpi: {
    totalEscrowCoins: number;
    totalEscrowUsd: string;
    pendingLiabilitiesCoins: number;
    pendingLiabilitiesUsd: string;
    activeOperators: number;
    mintedCoins: number;
    paidOutCoins: number;
    auditEvents: number;
  };
  withdrawals: AdminOverviewWithdrawal[];
  recentEvents: unknown[];
}

interface UseAdminOverviewResult {
  loaded: boolean;
  error: boolean;
  data: AdminOverviewData | null;
  refresh: () => void;
}

export const ADMIN_OVERVIEW_CHANGED_EVENT = "earnverse:overview-changed";

export function dispatchAdminOverviewChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(ADMIN_OVERVIEW_CHANGED_EVENT));
}

export function useAdminOverview(): UseAdminOverviewResult {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/overview");
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data as AdminOverviewData);
        setError(false);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
    window.addEventListener(ADMIN_OVERVIEW_CHANGED_EVENT, refresh);
    return () => {
      window.removeEventListener(ADMIN_OVERVIEW_CHANGED_EVENT, refresh);
    };
  }, [refresh]);

  return { loaded, error, data, refresh };
}
