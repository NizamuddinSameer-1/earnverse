"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CoinIcon } from "@/components/ui/CoinIcon";
import {
  IconBolt,
  IconClock,
  IconTrophy,
  IconFlame,
  IconCheck,
  IconShield,
  IconArrowUpRight,
  IconX,
  IconLock,
} from "@/components/ui/Icons";

interface TaskItem {
  id: string;
  provider: string;
  title: string;
  category: "survey" | "install" | "bounty" | "high-yield";
  time: string;
  coins: number;
  usd: string;
  tag: string;
  platforms: string[];
  networkSlug?: "bitlabs" | "cpx" | "torox";
  spots?: string;
}

const allTasks: TaskItem[] = [
  {
    id: "task-1",
    provider: "BitLabs",
    networkSlug: "bitlabs",
    category: "survey",
    title: "Consumer Sentiment: Global FinTech & Mobile Banking Study",
    time: "12 min",
    coins: 1450,
    usd: "$1.45",
    tag: "High Match Rate",
    platforms: ["iOS", "Android", "Web"],
  },
  {
    id: "task-2",
    provider: "Torox Arcade",
    networkSlug: "torox",
    category: "high-yield",
    title: "Reach Castle Tier 10 in Clash of Legends: War Strategy",
    time: "Milestone",
    coins: 18000,
    usd: "$18.00",
    tag: "Tiered Cash Milestone",
    platforms: ["Android", "iOS"],
  },
  {
    id: "task-3",
    provider: "Creator Bounty",
    category: "bounty",
    title: "Twitch Raid: Apex Legends Elimination Beat Sync (15s)",
    time: "15 min",
    coins: 25000,
    usd: "$25.00",
    tag: "Coming Soon",
    platforms: ["Desktop", "Cloud Drive"],
    spots: "VIP Access",
  },
  {
    id: "task-4",
    provider: "CPX Research",
    networkSlug: "cpx",
    category: "survey",
    title: "Automotive Buying Behavior & EV Infrastructure Poll",
    time: "8 min",
    coins: 2200,
    usd: "$2.20",
    tag: "Instant Credit",
    platforms: ["Web", "Mobile"],
  },
  {
    id: "task-5",
    provider: "Torox Arcade",
    networkSlug: "torox",
    category: "install",
    title: "Install & Level 5 Unlock: Raid Tactics RPG",
    time: "5 min setup",
    coins: 3500,
    usd: "$3.50",
    tag: "Quick Install",
    platforms: ["iOS", "Android"],
  },
  {
    id: "task-6",
    provider: "Creator Bounty",
    category: "bounty",
    title: "TikTok Viral Sound Cut: Crypto Podcast 30s Hook",
    time: "10 min",
    coins: 15000,
    usd: "$15.00",
    tag: "Coming Soon",
    platforms: ["CapCut", "Premiere"],
    spots: "VIP Access",
  },
];

interface OfferwallModalState {
  isOpen: boolean;
  network: "bitlabs" | "cpx" | "torox" | null;
  networkName: string;
  taskTitle?: string;
  loading: boolean;
  launchUrl: string | null;
  error: string | null;
  username?: string;
  missingConfigNotice?: string;
}

export default function EarnFeedPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [launchingTaskId, setLaunchingTaskId] = useState<string | null>(null);
  const [startedTasks, setStartedTasks] = useState<string[]>([]);

  const [offerwall, setOfferwall] = useState<OfferwallModalState>({
    isOpen: false,
    network: null,
    networkName: "",
    loading: false,
    launchUrl: null,
    error: null,
  });

  const openOfferwall = async (
    network: "bitlabs" | "cpx" | "torox",
    taskTitle?: string,
    taskId?: string
  ) => {
    if (taskId) {
      setLaunchingTaskId(taskId);
    }

    setOfferwall({
      isOpen: true,
      network,
      networkName:
        network === "bitlabs"
          ? "BitLabs Surveys & Offers"
          : network === "cpx"
          ? "CPX Research Survey Lounge"
          : "Torox Arcade",
      taskTitle,
      loading: true,
      launchUrl: null,
      error: null,
    });

    try {
      const res = await fetch(`/api/offers/launch/${network}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setOfferwall((prev) => ({
          ...prev,
          loading: false,
          error:
            data.error ||
            "Please log in to your EarnVerse account to launch offerwalls.",
        }));
        if (taskId) setLaunchingTaskId(null);
        return;
      }

      setOfferwall((prev) => ({
        ...prev,
        loading: false,
        launchUrl: data.launchUrl,
        username: data.username,
        missingConfigNotice: data.missingConfigNotice,
      }));

      if (taskId) {
        setStartedTasks((prev) => (prev.includes(taskId) ? prev : [...prev, taskId]));
        setLaunchingTaskId(null);
      }
    } catch {
      setOfferwall((prev) => ({
        ...prev,
        loading: false,
        error: "Network error connecting to EarnVerse offerwall gateway.",
      }));
      if (taskId) setLaunchingTaskId(null);
    }
  };

  const closeOfferwall = () => {
    setOfferwall({
      isOpen: false,
      network: null,
      networkName: "",
      loading: false,
      launchUrl: null,
      error: null,
    });
  };

  const handleStartTask = (task: TaskItem) => {
    if (task.networkSlug) {
      openOfferwall(task.networkSlug, task.title, task.id);
    } else {
      setLaunchingTaskId(task.id);
      window.setTimeout(() => {
        setStartedTasks((prev) => (prev.includes(task.id) ? prev : [...prev, task.id]));
        setLaunchingTaskId(null);
      }, 1000);
    }
  };

  const filteredTasks = allTasks.filter((task) => {
    if (activeTab !== "all" && task.category !== activeTab) return false;
    if (
      selectedProvider !== "all" &&
      task.provider.toLowerCase() !== selectedProvider.toLowerCase()
    )
      return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#0E131E] to-indigo-500/10 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                <IconBolt size={28} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-grotesk text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Earn Lounge & Offerwalls
                  </h1>
                  <Badge variant="emerald" dot>
                    ACTIVE REWARDS
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  Complete surveys and tasks from verified ad networks. Coins credit to your wallet automatically.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-slate-400">Pegged Rate:</span>
              <span className="font-mono text-xs text-amber-400 font-bold bg-amber-400/10 border border-amber-400/25 px-3 py-1.5 rounded-xl">
                1,000 Coins = $1.00 USD
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Navigation Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-[#0B0E14] border border-white/[0.08] rounded-xl text-xs flex-wrap">
            {[
              { id: "all", label: "All Offers" },
              { id: "high-yield", label: "High Paying ($5+)" },
              { id: "survey", label: "Surveys" },
              { id: "install", label: "Mobile Games" },
              { id: "bounty", label: "Creator Studio (Soon)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg transition-all font-semibold cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.3)] font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Network Selector */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-slate-400">Network:</span>
            {["all", "BitLabs", "CPX Research", "Torox Arcade"].map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvider(prov)}
                className={`px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                  selectedProvider === prov
                    ? "bg-amber-400/15 border-amber-400/50 text-amber-400 font-bold"
                    : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white"
                }`}
              >
                {prov === "all" ? "All Networks" : prov}
              </button>
            ))}
          </div>
        </div>

        {/* Main Feed Grid with Right Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} interactive className="p-5 hover:border-amber-400/40 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Left Info */}
                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.1] text-white font-semibold">
                        {task.provider}
                      </span>
                      <span className="text-amber-400 text-xs font-semibold">{task.tag}</span>
                      {task.spots && (
                        <span className="text-violet-400 text-xs font-semibold bg-violet-500/10 px-2 py-0.5 rounded-md">
                          {task.spots}
                        </span>
                      )}
                    </div>

                    <h3 className="font-grotesk text-base font-bold text-white hover:text-amber-400 transition-colors">
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <IconClock size={13} className="text-slate-500" />
                        {task.time}
                      </span>
                      <span>•</span>
                      <span>{task.platforms.join(" / ")}</span>
                    </div>
                  </div>

                  {/* Right Rewards & Action */}
                  <div className="flex items-center gap-5 shrink-0 sm:self-center w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/[0.06] pt-3 sm:pt-0">
                    <div className="flex flex-col items-start sm:items-end">
                      <div className="flex items-center gap-1.5">
                        <CoinIcon size={18} />
                        <span className="font-mono text-amber-400 font-bold text-lg tabular-nums">
                          +{task.coins.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-mono text-xs font-semibold">≈ {task.usd} USD</span>
                    </div>

                    {task.category === "bounty" ? (
                      <Link href="/creator-studio">
                        <Button variant="secondary" size="sm">
                          Preview Studio
                        </Button>
                      </Link>
                    ) : startedTasks.includes(task.id) ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        isLoading={launchingTaskId === task.id}
                        leftIcon={<IconCheck size={14} className="text-emerald-400" />}
                        onClick={() => handleStartTask(task)}
                      >
                        Re-Open
                      </Button>
                    ) : (
                      <Button
                        variant="gold"
                        size="sm"
                        isLoading={launchingTaskId === task.id}
                        onClick={() => handleStartTask(task)}
                      >
                        {launchingTaskId === task.id ? "Connecting..." : "Start Offer"}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Right Rail: Direct Network Launchers */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="p-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <IconBolt size={18} className="text-amber-400" />
                  <span className="font-grotesk font-bold text-sm text-white">DIRECT OFFERWALLS</span>
                </div>
                <Badge variant="emerald" size="sm" dot>
                  LIVE
                </Badge>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {/* BitLabs Direct */}
                <div className="p-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-sm font-bold text-white">BitLabs Surveys</span>
                    </div>
                    <span className="text-[11px] text-slate-400">High Match Token Verified</span>
                  </div>
                  <Button variant="gold" size="sm" onClick={() => openOfferwall("bitlabs")}>
                    Launch
                  </Button>
                </div>

                {/* CPX Research Direct */}
                <div className="p-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-sm font-bold text-white">CPX Research</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Adaptive Survey Router</span>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => openOfferwall("cpx")}>
                    Launch
                  </Button>
                </div>
              </div>
            </Card>

            {/* Creator Studio Teaser */}
            <Card className="p-5 bg-gradient-to-br from-violet-500/10 via-transparent to-amber-500/5 border-violet-500/20">
              <Badge variant="violet" size="sm" className="mb-2">
                COMING SOON
              </Badge>
              <h3 className="font-grotesk font-bold text-base text-white mb-1">
                EarnVerse Creator Studio
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Clip viral stream moments and podcasts to earn up to $100 per bounty.
              </p>
              <Link href="/creator-studio">
                <Button variant="secondary" size="sm" className="w-full">
                  Explore Studio Roadmap →
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>

      {/* Interactive Offerwall Overlay Modal */}
      {offerwall.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl h-[88vh] bg-[#0E131E] border border-white/[0.12] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#0A0D14] border-b border-white/[0.08] shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                  <IconBolt size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-grotesk font-bold text-base text-white truncate">
                      {offerwall.networkName}
                    </h2>
                    <Badge variant="emerald" size="sm">
                      VERIFIED
                    </Badge>
                  </div>
                  {offerwall.username && (
                    <span className="text-xs text-slate-400 font-mono">
                      Connected user: <strong className="text-white">@{offerwall.username}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {offerwall.launchUrl && (
                  <a
                    href={offerwall.launchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex"
                  >
                    <Button variant="secondary" size="sm" rightIcon={<IconArrowUpRight size={14} />}>
                      Open Tab
                    </Button>
                  </a>
                )}
                <button
                  onClick={closeOfferwall}
                  className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <IconX size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 bg-[#07080B] flex flex-col relative overflow-hidden">
              {offerwall.loading && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center">
                  <div className="w-12 h-12 rounded-full border-3 border-amber-400 border-t-transparent animate-spin" />
                  <div className="text-white font-bold text-sm tracking-wide">
                    Connecting to {offerwall.networkName}...
                  </div>
                </div>
              )}

              {offerwall.error && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center max-w-md mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <IconLock size={26} />
                  </div>
                  <h3 className="font-grotesk text-lg font-bold text-white">
                    Sign In Required
                  </h3>
                  <p className="text-xs text-slate-400">
                    {offerwall.error}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Link href="/login">
                      <Button variant="gold">Sign In</Button>
                    </Link>
                    <Button variant="secondary" onClick={closeOfferwall}>
                      Close
                    </Button>
                  </div>
                </div>
              )}

              {offerwall.launchUrl && !offerwall.loading && (
                <div className="flex-1 flex flex-col h-full w-full relative">
                  {offerwall.missingConfigNotice && (
                    <div className="px-4 py-2 bg-amber-400/10 border-b border-amber-400/20 text-xs text-amber-400 shrink-0">
                      <span>{offerwall.missingConfigNotice}</span>
                    </div>
                  )}

                  <iframe
                    src={offerwall.launchUrl}
                    className="w-full flex-1 border-0 bg-[#07080B]"
                    title={offerwall.networkName}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                    allow="clipboard-write; camera; microphone; geolocation"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
