"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CoinIcon } from "@/components/ui/CoinIcon";
import {
  IconBolt,
  IconVideo,
  IconClock,
  IconTrophy,
  IconFlame,
  IconCheck,
  IconSparkles,
  IconShield,
  IconVault,
  IconArrowUpRight,
  IconX,
  IconLock,
  IconRefresh,
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
    coins: 850,
    usd: "$0.85",
    tag: "Offerwall Credit",
    platforms: ["iOS", "Android", "Web"],
  },
  {
    id: "task-2",
    provider: "Torox",
    networkSlug: "torox",
    category: "high-yield",
    title: "Reach Castle Tier 10 in Clash of Legends: War Strategy",
    time: "20 min",
    coins: 12000,
    usd: "$12.00",
    tag: "Multi-Tier Milestone",
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
    tag: "Coming Soon // Phase 2",
    platforms: ["Desktop", "Cloud Drive"],
    spots: "Phase 2 Preview",
  },
  {
    id: "task-4",
    provider: "CPX Research",
    networkSlug: "cpx",
    category: "survey",
    title: "Automotive Buying Behavior & EV Infrastructure Poll",
    time: "8 min",
    coins: 1450,
    usd: "$1.45",
    tag: "High Match Rate",
    platforms: ["Web", "Mobile"],
  },
  {
    id: "task-5",
    provider: "AdGate Media",
    category: "install",
    title: "Install & Level 5 Unlock: Raid Tactics Tactical RPG",
    time: "5 min setup",
    coins: 2500,
    usd: "$2.50",
    tag: "Install Milestone",
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
    tag: "Coming Soon // Phase 2",
    platforms: ["CapCut", "Premiere"],
    spots: "Phase 2 Preview",
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

  // Offerwall interactive modal state
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
          ? "CPX Research Survey Wall"
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
            "Unable to connect to offerwall service. Please ensure you are logged in.",
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
      // Generic mock simulator
      setLaunchingTaskId(task.id);
      window.setTimeout(() => {
        setStartedTasks((prev) => (prev.includes(task.id) ? prev : [...prev, task.id]));
        setLaunchingTaskId(null);
      }, 1200);
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
        {/* Header Strip */}
        <div className="relative overflow-hidden rounded bg-gradient-to-r from-surface-card via-surface to-canvas border border-border-dark p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 shrink-0 rounded bg-lime-neon/10 border border-lime-neon/30 flex items-center justify-center text-lime-neon">
                <IconBolt size={24} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-grotesk text-xl sm:text-2xl font-bold text-text-primary tracking-tight uppercase">
                    TASK MATRIX // ACTIVE CONTRACTS
                  </h1>
                  <Badge variant="lime">LIVE GATEWAY</Badge>
                </div>
                <span className="font-mono text-xs text-text-muted mt-1">
                  Connected live networks: BitLabs, CPX Research, Torox, and operator-verified creator escrows.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-text-muted flex-wrap min-w-0">
              <span>ACTIVE NETWORKS:</span>
              <strong className="text-text-primary">BITLABS · CPX · TOROX · CREATOR ESCROW</strong>
            </div>
          </div>
        </div>

        {/* Filters and Navigation Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-card border border-border-dark rounded font-mono text-xs flex-wrap">
            {[
              { id: "all", label: "ALL CONTRACTS" },
              { id: "high-yield", label: "HIGH YIELD" },
              { id: "survey", label: "SURVEYS" },
              { id: "install", label: "APP INSTALLS" },
              { id: "bounty", label: "CREATOR BOUNTIES (SOON)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded transition-all font-semibold cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-lime-neon text-text-inverted font-bold"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Network Selector */}
          <div className="flex items-center gap-1.5 font-mono text-xs flex-wrap">
            <span className="text-text-muted mr-1">Network:</span>
            {["all", "BitLabs", "CPX Research", "Torox", "Creator Bounty"].map((prov) => (
              <button
                key={prov}
                onClick={() => setSelectedProvider(prov)}
                className={`px-2.5 py-1 rounded border text-[11px] transition-all cursor-pointer ${
                  selectedProvider === prov
                    ? "bg-surface-item border-lime-neon/60 text-lime-neon font-bold"
                    : "bg-surface-card border-border-dark text-text-muted hover:text-text-primary"
                }`}
              >
                {prov === "all" ? "All Networks" : prov}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Layout with Right Context Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Feed Column (col-span-8) */}
          {/* h2 gives the repeated task-card h3s a valid parent (axe heading-order). */}
          <h2 className="sr-only">Available tasks</h2>
          <div className="lg:col-span-8 flex flex-col gap-3.5">
            {filteredTasks.map((task) => (
              <Card key={task.id} interactive className="group">
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
                  {/* Left Task Info */}
                  <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-mono text-[10px] flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-canvas border border-border-dark text-text-primary font-bold uppercase">
                        {task.provider}
                      </span>
                      <span className="text-lime-neon font-semibold">{task.tag}</span>
                      {task.spots && (
                        <span className="text-gold-accent font-semibold bg-gold-accent/10 px-1.5 py-0.5 rounded">
                          {task.spots}
                        </span>
                      )}
                    </div>

                    <h3 className="font-grotesk text-sm font-bold text-text-primary group-hover:text-lime-neon transition-colors">
                      {task.title}
                    </h3>

                    <div className="flex items-center gap-3 font-mono text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <IconClock size={13} className="text-text-dim" />
                        {task.time}
                      </span>
                      <span>·</span>
                      <span>{task.platforms.join(" / ")}</span>
                    </div>
                  </div>

                  {/* Right Rewards & Start Action */}
                  <div className="flex items-center gap-4 shrink-0 sm:self-center w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-border-subtle pt-3 sm:pt-0">
                    <div className="flex flex-col items-start sm:items-end font-mono">
                      <div className="flex items-center gap-1.5">
                        <CoinIcon size={18} />
                        <span className="text-gold-accent font-bold text-base tabular-nums">
                          +{task.coins.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-text-muted text-xs">≈ {task.usd} USD</span>
                    </div>

                    {task.category === "bounty" ? (
                      <Link href="/creator-studio">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="font-mono text-xs"
                        >
                          SOON // PREVIEW
                        </Button>
                      </Link>
                    ) : startedTasks.includes(task.id) ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        isLoading={launchingTaskId === task.id}
                        leftIcon={<IconCheck size={14} className="text-lime-neon" />}
                        onClick={() => handleStartTask(task)}
                      >
                        RE-OPEN WALL
                      </Button>
                    ) : (
                      <Button
                        variant="neon"
                        size="sm"
                        isLoading={launchingTaskId === task.id}
                        onClick={() => handleStartTask(task)}
                      >
                        {launchingTaskId === task.id ? "CONNECTING..." : "START TASK"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Context Rail (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Network Health Box */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <IconVault size={16} className="text-lime-neon" />
                  <CardTitle>OFFERWALL GATEWAYS</CardTitle>
                </div>
                <Badge variant="lime" size="sm">
                  LIVE
                </Badge>
              </CardHeader>

              <CardContent className="flex flex-col gap-2.5 font-mono text-xs p-4">
                {/* BitLabs */}
                <div className="p-3 bg-canvas border border-border-dark rounded flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lime-neon">●</span>
                      <span className="text-text-primary font-bold">BitLabs Surveys</span>
                    </div>
                    <span className="text-[11px] text-text-muted">Live Token Configured</span>
                  </div>
                  <Button
                    variant="neon"
                    size="sm"
                    className="text-xs h-7 px-2.5"
                    onClick={() => openOfferwall("bitlabs")}
                  >
                    LAUNCH
                  </Button>
                </div>

                {/* CPX Research */}
                <div className="p-3 bg-canvas border border-border-dark rounded flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lime-neon">●</span>
                      <span className="text-text-primary font-bold">CPX Research</span>
                    </div>
                    <span className="text-[11px] text-text-muted">Secure Hash Configured</span>
                  </div>
                  <Button
                    variant="neon"
                    size="sm"
                    className="text-xs h-7 px-2.5"
                    onClick={() => openOfferwall("cpx")}
                  >
                    LAUNCH
                  </Button>
                </div>

                {/* Torox */}
                <div className="p-3 bg-canvas border border-border-dark rounded flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-text-dim">○</span>
                      <span className="text-text-primary font-bold">Torox Arcade</span>
                    </div>
                    <span className="text-[11px] text-text-muted">Pending Publisher Keys</span>
                  </div>
                  <Badge variant="slate" size="sm">
                    STANDBY
                  </Badge>
                </div>

                {/* Creator Escrow Engine */}
                <div className="p-3 bg-canvas border border-border-dark rounded flex items-center justify-between gap-3">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-gold-accent">●</span>
                      <span className="text-text-primary font-bold">Creator Escrows</span>
                      <Badge variant="slate" size="sm">SOON</Badge>
                    </div>
                    <span className="text-[11px] text-text-muted">Phase 2 Clipping Engine</span>
                  </div>
                  <Link href="/creator-studio">
                    <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">
                      PREVIEW
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Creator Bounty Spotlight Box */}
            <Card emphasis="gold">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <IconVideo size={16} className="text-gold-accent" />
                  <CardTitle>CREATOR BOUNTY RADAR</CardTitle>
                </div>
                <Badge variant="slate">COMING SOON</Badge>
              </CardHeader>

              <CardContent className="flex flex-col gap-3 p-4">
                <div className="p-3 bg-canvas border border-border-dark rounded flex flex-col gap-2">
                  <span className="font-grotesk text-sm font-bold text-text-primary">
                    YouTube Shorts Clip Curator
                  </span>
                  <p className="font-mono text-xs text-text-muted">
                    Curate and render 3 high-energy clutch moments from @ApexPulse livestream archive.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-border-subtle font-mono text-xs">
                    <span className="text-text-muted font-bold">25,000 COINS ($25.00)</span>
                    <span className="text-gold-accent font-medium">Phase 2 Preview</span>
                  </div>
                </div>

                <Link href="/creator-studio">
                  <Button variant="outline" size="sm" className="w-full">
                    VIEW ROADMAP & PREVIEW →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Interactive Offerwall Overlay Modal */}
      {offerwall.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-canvas/85 backdrop-blur-md">
          <div className="relative w-full max-w-5xl h-[88vh] bg-surface-card border border-border-dark rounded shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-surface border-b border-border-dark shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded bg-lime-neon/10 border border-lime-neon/30 flex items-center justify-center text-lime-neon shrink-0">
                  <IconBolt size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-grotesk font-bold text-sm sm:text-base text-text-primary truncate">
                      {offerwall.networkName}
                    </h2>
                    <Badge variant="lime" size="sm">
                      VERIFIED GATEWAY
                    </Badge>
                  </div>
                  {offerwall.username && (
                    <span className="font-mono text-[11px] text-text-muted">
                      Wallet link: <strong className="text-text-primary">@{offerwall.username}</strong>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {offerwall.launchUrl && (
                  <a
                    href={offerwall.launchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline-flex"
                  >
                    <Button variant="outline" size="sm" leftIcon={<IconArrowUpRight size={14} />}>
                      OPEN NEW TAB
                    </Button>
                  </a>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeOfferwall}
                  className="text-text-muted hover:text-text-primary px-2"
                >
                  <IconX size={20} />
                </Button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 bg-canvas flex flex-col relative overflow-hidden">
              {offerwall.loading && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 font-mono text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-lime-neon border-t-transparent animate-spin" />
                  <div className="flex flex-col gap-1">
                    <span className="text-text-primary font-bold text-sm tracking-wide">
                      ESTABLISHING CRYPTOGRAPHIC SESSION...
                    </span>
                    <span className="text-xs text-text-muted">
                      Binding EarnVerse user ID with {offerwall.networkName}
                    </span>
                  </div>
                </div>
              )}

              {offerwall.error && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center max-w-md mx-auto">
                  <div className="w-14 h-14 rounded-full bg-red-accent/10 border border-red-accent/30 flex items-center justify-center text-red-accent">
                    <IconLock size={26} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-grotesk text-lg font-bold text-text-primary uppercase">
                      AUTHENTICATION REQUIRED
                    </h3>
                    <p className="font-mono text-xs text-text-muted">
                      {offerwall.error}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Link href="/login">
                      <Button variant="neon">LOG IN TO EARN</Button>
                    </Link>
                    <Button variant="outline" onClick={closeOfferwall}>
                      CLOSE
                    </Button>
                  </div>
                </div>
              )}

              {offerwall.launchUrl && !offerwall.loading && (
                <div className="flex-1 flex flex-col h-full w-full relative">
                  {offerwall.missingConfigNotice && (
                    <div className="px-4 py-2 bg-gold-accent/10 border-b border-gold-accent/20 flex items-center gap-2 font-mono text-xs text-gold-accent shrink-0">
                      <IconShield size={14} />
                      <span>{offerwall.missingConfigNotice}</span>
                    </div>
                  )}

                  <iframe
                    src={offerwall.launchUrl}
                    className="w-full flex-1 border-0 bg-canvas"
                    title={offerwall.networkName}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                    allow="clipboard-write; camera; microphone; geolocation"
                  />
                </div>
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div className="px-5 py-2.5 bg-surface border-t border-border-dark flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-text-muted shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="text-lime-neon">✓</span>
                <span>Webhook Postbacks enabled — rewards credit automatically upon completion</span>
              </span>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/postbacks"
                  className="text-text-dim hover:text-text-primary transition-colors"
                >
                  Postback Telemetry →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
