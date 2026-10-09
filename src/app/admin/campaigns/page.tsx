"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  IconCampaign,
  IconCheck,
} from "@/components/ui/Icons";

interface CampaignItem {
  id: string;
  title: string;
  creator: string;
  platform: string;
  bountyCoins: number;
  poolCoins: number;
  approvedCount: number;
  maxSpots: number;
  status: "active" | "paused" | "completed";
}

const initialCampaigns: CampaignItem[] = [
  {
    id: "CMP-01",
    title: "Apex Legends 30s Beat-Sync Elimination Cut",
    creator: "@ApexPulse",
    platform: "TikTok / Shorts",
    bountyCoins: 25000,
    poolCoins: 250000,
    approvedCount: 3,
    maxSpots: 10,
    status: "active",
  },
  {
    id: "CMP-02",
    title: "Podcast 45s Debate Viral Hook with Subtitles",
    creator: "@Web3Uncut",
    platform: "YouTube Shorts",
    bountyCoins: 15000,
    poolCoins: 150000,
    approvedCount: 7,
    maxSpots: 10,
    status: "active",
  },
  {
    id: "CMP-03",
    title: "Funny Stream Fails 30s Reel Cut",
    creator: "@SpeedGaming",
    platform: "Instagram Reels",
    bountyCoins: 8000,
    poolCoins: 80000,
    approvedCount: 10,
    maxSpots: 10,
    status: "completed",
  },
];

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(initialCampaigns);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCreator, setNewCreator] = useState("@earnverse_partner");
  const [newPlatform, setNewPlatform] = useState("TikTok / YouTube Shorts");
  const [newBounty, setNewBounty] = useState("10000");
  const [newPool, setNewPool] = useState("100000");
  const [toast, setToast] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const item: CampaignItem = {
      id: `CMP-0${campaigns.length + 1}`,
      title: newTitle,
      creator: newCreator,
      platform: newPlatform,
      bountyCoins: parseInt(newBounty, 10) || 10000,
      poolCoins: parseInt(newPool, 10) || 100000,
      approvedCount: 0,
      maxSpots: Math.floor((parseInt(newPool, 10) || 100000) / (parseInt(newBounty, 10) || 10000)),
      status: "active",
    };

    setCampaigns([item, ...campaigns]);
    setShowCreate(false);
    setNewTitle("");
    setToast(`Created bounty campaign ${item.id} with ${item.poolCoins.toLocaleString()} Coins in escrow!`);
    setTimeout(() => setToast(null), 3500);
  };

  const toggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "paused" : "active" }
          : c
      )
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded bg-gradient-to-r from-surface-card via-surface to-canvas border border-gold-accent/25 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-gold-accent/15 border border-gold-accent/30 flex items-center justify-center text-gold-accent">
                <IconCampaign size={24} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight uppercase">
                    CAMPAIGN & BOUNTY MANAGER // CRUD TERMINAL
                  </h1>
                  <Badge variant="gold" dot>
                    CREATOR ENGINE
                  </Badge>
                </div>
                <span className="font-mono text-xs text-text-muted mt-1">
                  Deploy sponsored clipping campaigns, allocate escrow coin pools, and track submission completion rates.
                </span>
              </div>
            </div>

            <Button
              variant="neon"
              size="sm"
              onClick={() => setShowCreate(!showCreate)}
            >
              {showCreate ? "CANCEL" : "+ CREATE NEW BOUNTY"}
            </Button>
          </div>
        </div>

        {toast && (
          <div className="p-4 bg-lime-neon/12 border border-lime-neon/40 rounded font-mono text-xs text-lime-neon flex items-center gap-2.5">
            <IconCheck size={18} strokeWidth={2.5} />
            <span>{toast}</span>
          </div>
        )}

        {/* Modal / Inset Create Form */}
        {showCreate && (
          <Card emphasis="lime">
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconCampaign size={18} className="text-lime-neon" />
                <CardTitle>NEW SPONSORED BOUNTY CAMPAIGN</CardTitle>
              </div>
              <Badge variant="lime">CONFIG</Badge>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-text-muted uppercase text-[10px]">Campaign Title & Requirements</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Minecraft 60s Clutch Moment Beat Sync"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-canvas border border-border-dark focus:border-lime-neon text-text-primary rounded p-2.5 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-text-muted uppercase text-[10px]">Creator Sponsor Handle</label>
                  <input
                    type="text"
                    value={newCreator}
                    onChange={(e) => setNewCreator(e.target.value)}
                    className="bg-canvas border border-border-dark focus:border-lime-neon text-text-primary rounded p-2.5 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-text-muted uppercase text-[10px]">Target Social Channels</label>
                  <input
                    type="text"
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="bg-canvas border border-border-dark focus:border-lime-neon text-text-primary rounded p-2.5 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-text-muted uppercase text-[10px]">Bounty per Approved Clip (Coins)</label>
                  <input
                    type="number"
                    value={newBounty}
                    onChange={(e) => setNewBounty(e.target.value)}
                    className="bg-canvas border border-border-dark focus:border-lime-neon text-text-primary rounded p-2.5 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-text-muted uppercase text-[10px]">Total Escrow Pool (Coins)</label>
                  <input
                    type="number"
                    value={newPool}
                    onChange={(e) => setNewPool(e.target.value)}
                    className="bg-canvas border border-border-dark focus:border-lime-neon text-text-primary rounded p-2.5 outline-none"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <Button type="submit" variant="neon" size="md" className="w-full">
                    INITIALIZE & LOCK ESCROW BOUNTY
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Active Campaigns Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <IconCampaign size={18} className="text-gold-accent" />
              <CardTitle>ACTIVE & ARCHIVED CAMPAIGNS ({campaigns.length})</CardTitle>
            </div>
            <span className="font-mono text-xs text-text-muted">
              Real-time submission counters
            </span>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-border-dark bg-canvas text-text-muted text-[10px] uppercase">
                    <th className="p-3.5 pl-5">CAMPAIGN ID</th>
                    <th className="p-3.5">SPONSOR & OBJECTIVE</th>
                    <th className="p-3.5">PLATFORMS</th>
                    <th className="p-3.5">PAYOUT / CLIP</th>
                    <th className="p-3.5">ESCROW POOL</th>
                    <th className="p-3.5">PROGRESS</th>
                    <th className="p-3.5 pr-5 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3.5 pl-5 font-bold text-gold-accent">
                        {c.id}
                      </td>
                      <td className="p-3.5">
                        <strong className="text-text-primary block">{c.title}</strong>
                        <span className="text-[10px] text-text-dim">Sponsor: {c.creator}</span>
                      </td>
                      <td className="p-3.5 text-text-muted">
                        {c.platform}
                      </td>
                      <td className="p-3.5 font-bold text-lime-neon tabular-nums">
                        +{c.bountyCoins.toLocaleString()} Coins (${(c.bountyCoins / 1000).toFixed(2)})
                      </td>
                      <td className="p-3.5 font-bold text-text-primary tabular-nums">
                        {c.poolCoins.toLocaleString()} Coins
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-text-muted">
                            {c.approvedCount} / {c.maxSpots} spots filled
                          </span>
                          <div className="w-24 h-1.5 bg-surface-item rounded-full overflow-hidden">
                            <div
                              className="h-full bg-lime-neon rounded-full"
                              style={{ width: `${(c.approvedCount / c.maxSpots) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 pr-5 text-right">
                        <Button
                          variant={c.status === "active" ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => toggleStatus(c.id)}
                        >
                          {c.status.toUpperCase()}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
