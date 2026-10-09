"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  IconCampaign,
  IconVideo,
  IconClip,
  IconBolt,
  IconVault,
  IconShield,
  IconSparkles,
  IconCheck,
  IconEye,
  IconClock,
  IconLock,
  IconArrowRight,
} from "@/components/ui/Icons";

const activeBountiesPreview = [
  {
    id: "cp-1",
    creator: "@ApexPulse",
    platform: "YouTube & TikTok",
    objective: "Apex Legends 30s Elimination Beat-Sync",
    bounty: "10,000 Coins",
    usd: "$10.00",
    escrowPool: "100,000 Coins",
    status: "COMING IN PHASE 2",
  },
  {
    id: "cp-2",
    creator: "@Web3Uncut",
    platform: "Podcasts & Shorts",
    objective: "Extract 45s High-Energy Debate Hook",
    bounty: "15,000 Coins",
    usd: "$15.00",
    escrowPool: "150,000 Coins",
    status: "COMING IN PHASE 2",
  },
  {
    id: "cp-3",
    creator: "@SpeedGaming",
    platform: "TikTok & Reels",
    objective: "Funny Fail Moments with Subtitles",
    bounty: "8,000 Coins",
    usd: "$8.00",
    escrowPool: "80,000 Coins",
    status: "COMING IN PHASE 2",
  },
];

export default function CreatorStudioPage() {
  const [channelUrl, setChannelUrl] = useState("");
  const [email, setEmail] = useState("");
  const [audienceSize, setAudienceSize] = useState("Under 10k Subs / Followers");
  const [budgetCoins, setBudgetCoins] = useState<number>(100000);
  const [bountyPerClip, setBountyPerClip] = useState<number>(10000);
  const [isJoined, setIsJoined] = useState(false);

  const numClipsFunded = Math.max(1, Math.floor(budgetCoins / bountyPerClip));
  const estimatedEstViews = (numClipsFunded * 18500).toLocaleString();
  const totalUsdBudget = (budgetCoins / 1000).toFixed(2);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelUrl && !email) return;
    setIsJoined(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Hero Banner: Clear "COMING SOON" Status with Roadmap Focus */}
        <div className="relative overflow-hidden rounded bg-gradient-to-r from-surface-card via-surface to-canvas border border-border-dark p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4 max-w-2xl">
              <div className="w-14 h-14 rounded bg-gold-accent/10 border border-gold-accent/30 flex items-center justify-center text-gold-accent shrink-0">
                <IconCampaign size={28} strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-grotesk text-2xl sm:text-3xl font-bold text-text-primary tracking-tight uppercase">
                    CREATOR STUDIO & VIRAL CLIPPING
                  </h1>
                  <Badge variant="gold">
                    COMING SOON // PHASE 2
                  </Badge>
                </div>

                <p className="font-body text-xs sm:text-sm text-text-muted leading-relaxed">
                  EarnVerse is currently focusing on our core <strong>multi-network offerwalls (BitLabs & CPX Research)</strong>.
                  The Creator Bounties engine, automated video clipping escrow, and TikTok/Shorts view-tracking algorithms
                  are currently in architectural design and will launch in Phase 2.
                </p>

                <div className="flex items-center gap-2 font-mono text-xs text-text-dim pt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-gold-accent">
                    <IconClock size={13} />
                    Status: Architecture & Prototype Stage
                  </span>
                  <span>·</span>
                  <span>Target: Post-Offerwall Rollout</span>
                </div>
              </div>
            </div>

            {/* Quick Pivot to Active Earnings CTA */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link href="/earn">
                <Button variant="neon" size="md" className="w-full" leftIcon={<IconBolt size={16} />}>
                  LAUNCH LIVE TASKS (/earn)
                </Button>
              </Link>
              <Link href="/wallet">
                <Button variant="outline" size="md" className="w-full">
                  CASHOUT TERMINAL →
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Confirmation Banner When Waitlist Form Submitted */}
        {isJoined && (
          <div className="relative overflow-hidden rounded bg-lime-neon/10 border border-lime-neon/40 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded bg-lime-neon text-text-inverted flex items-center justify-center shrink-0">
                <IconCheck size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lime-neon text-sm tracking-wide">
                  SPOT RESERVED ON CREATOR WAITLIST
                </span>
                <span className="text-xs text-text-muted">
                  We recorded your application. You will be notified the moment the Phase 2 Creator Studio beta goes live!
                </span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsJoined(false)}
            >
              Modify Application
            </Button>
          </div>
        )}

        {/* 3 Pillars of Upcoming Creator & Clipping Feature */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconClip size={18} className="text-lime-neon" />
                <CardTitle>VIRAL CLIPPING BOUNTIES</CardTitle>
              </div>
              <Badge variant="slate" size="sm">IN DESIGN</Badge>
            </CardHeader>
            <CardContent className="font-body text-xs text-text-muted leading-relaxed">
              Streamers, podcast hosts, and YouTubers will post bounties for video editors to cut 15–45s viral highlights with captions and beat-sync music.
            </CardContent>
            <CardFooter className="font-mono text-[11px] text-text-dim">
              <span>Payouts: $5 – $50 / Clip</span>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconVault size={18} className="text-gold-accent" />
                <CardTitle>ZERO-CHARGEBACK ESCROW</CardTitle>
              </div>
              <Badge variant="slate" size="sm">IN DESIGN</Badge>
            </CardHeader>
            <CardContent className="font-body text-xs text-text-muted leading-relaxed">
              Creator bounty funds will be locked 100% in EarnVerse escrow vaults before tasks go live. Editors never work without guaranteed funds.
            </CardContent>
            <CardFooter className="font-mono text-[11px] text-text-dim">
              <span>Automated Escrow Release</span>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconEye size={18} className="text-text-primary" />
                <CardTitle>PERFORMANCE VIEW BONUSES</CardTitle>
              </div>
              <Badge variant="slate" size="sm">IN DESIGN</Badge>
            </CardHeader>
            <CardContent className="font-body text-xs text-text-muted leading-relaxed">
              Automated API tracking on TikTok and YouTube Shorts will credit bonus coin multipliers when an editor's clip crosses 50k, 100k, or 500k views.
            </CardContent>
            <CardFooter className="font-mono text-[11px] text-text-dim">
              <span>Tiered Virality Multipliers</span>
            </CardFooter>
          </Card>
        </div>

        {/* 2-Column Architecture: Interactive Prototype Simulator + Early Access Waitlist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Campaign Escrow Prototype Simulator */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <Card emphasis="none" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gold-accent/15 border-b border-l border-gold-accent/30 text-gold-accent font-mono text-[10px] font-bold px-3 py-1 z-10">
                PROTOTYPE SIMULATOR // COMING SOON
              </div>

              <CardHeader>
                <div className="flex items-center gap-2.5">
                  <IconClip size={18} className="text-lime-neon" />
                  <CardTitle>CAMPAIGN ESCROW SIMULATOR (PREVIEW)</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-5">
                {/* Campaign Template Objective */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
                    Sample Bounty Objective
                  </label>
                  <div className="p-3 bg-canvas border border-border-dark rounded text-xs font-mono text-text-primary flex items-center justify-between">
                    <span className="truncate">Apex Legends 30s Beat-Sync & TikTok Highlight Cut</span>
                    <span className="text-[10px] text-gold-accent uppercase font-bold bg-gold-accent/10 px-2 py-0.5 rounded border border-gold-accent/20 shrink-0">
                      PHASE 2 SPEC
                    </span>
                  </div>
                </div>

                {/* Escrow Coin Budget Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-text-muted uppercase">Total Escrow Budget</span>
                      <span className="text-gold-accent font-bold tabular-nums">
                        ${totalUsdBudget} USD
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        step={10000}
                        value={budgetCoins}
                        onChange={(e) => setBudgetCoins(Math.max(10000, parseInt(e.target.value) || 10000))}
                        className="w-full bg-canvas border border-border-dark focus:border-lime-neon/70 focus:ring-2 focus:ring-lime-neon/20 rounded p-2.5 text-xs font-mono text-text-primary outline-none"
                      />
                      <span className="absolute right-3 top-2.5 text-gold-accent font-mono font-bold text-xs">
                        COINS
                      </span>
                    </div>

                    {/* Quick Budget Chips */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {[50000, 100000, 250000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setBudgetCoins(preset)}
                          className={`font-mono text-[10px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                            budgetCoins === preset
                              ? "bg-lime-neon/15 border-lime-neon/40 text-lime-neon font-bold"
                              : "bg-surface-card border-border-dark text-text-muted hover:text-text-primary"
                          }`}
                        >
                          {(preset / 1000).toFixed(0)}k
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-text-muted uppercase">Bounty Per Approved Clip</span>
                      <span className="text-gold-accent font-bold tabular-nums">
                        ${(bountyPerClip / 1000).toFixed(2)} USD
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        step={2500}
                        value={bountyPerClip}
                        onChange={(e) => setBountyPerClip(Math.max(1000, parseInt(e.target.value) || 1000))}
                        className="w-full bg-canvas border border-border-dark focus:border-lime-neon/70 focus:ring-2 focus:ring-lime-neon/20 rounded p-2.5 text-xs font-mono text-text-primary outline-none"
                      />
                      <span className="absolute right-3 top-2.5 text-gold-accent font-mono font-bold text-xs">
                        COINS
                      </span>
                    </div>

                    {/* Quick Payout Chips */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {[5000, 10000, 20000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setBountyPerClip(preset)}
                          className={`font-mono text-[10px] px-2 py-0.5 rounded border transition-all cursor-pointer ${
                            bountyPerClip === preset
                              ? "bg-gold-accent/15 border-gold-accent/40 text-gold-accent font-bold"
                              : "bg-surface-card border-border-dark text-text-muted hover:text-text-primary"
                          }`}
                        >
                          ${(preset / 1000).toFixed(0)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Projected Impact Metrics Box */}
                <div className="p-4 rounded bg-gradient-to-b from-surface to-surface-lowest border border-border-dark flex flex-col gap-3 font-mono text-xs">
                  <span className="text-[10px] text-text-dim uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <IconSparkles size={12} className="text-lime-neon" />
                    PROJECTED CAMPAIGN IMPACT METRICS
                  </span>

                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <div className="flex flex-col gap-1 p-2.5 rounded bg-surface-card border border-border-dark">
                      <span className="text-[10px] text-text-muted uppercase">Shorts Funded</span>
                      <span className="text-lg font-bold text-text-primary tabular-nums">
                        {numClipsFunded} Clips
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 p-2.5 rounded bg-surface-card border border-border-dark">
                      <span className="text-[10px] text-text-muted uppercase flex items-center gap-1">
                        <IconEye size={11} className="text-lime-neon" /> Est. Views
                      </span>
                      <span className="text-lg font-bold text-lime-neon tabular-nums">
                        {estimatedEstViews}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 p-2.5 rounded bg-surface-card border border-border-dark">
                      <span className="text-[10px] text-text-muted uppercase">Escrow Fee</span>
                      <span className="text-lg font-bold text-gold-accent tabular-nums">
                        0% (Free)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <span>Interactive prototype for founder evaluation.</span>
                <span className="text-gold-accent font-bold">PHASE 2 SPECIFICATION</span>
              </CardFooter>
            </Card>

            {/* Sample Creator Bounties List */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-text-muted uppercase tracking-wider font-semibold">
                  Sample Creator Bounties in Design
                </span>
                <span className="font-mono text-[10px] text-gold-accent uppercase font-bold">
                  ROADMAP SPEC
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {activeBountiesPreview.map((bounty) => (
                  <div
                    key={bounty.id}
                    className="p-4 rounded bg-surface-card border border-border-dark flex items-center justify-between gap-4 font-mono text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded bg-surface-elevated border border-border-hover flex items-center justify-center text-gold-accent shrink-0">
                        <IconVideo size={16} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-grotesk font-bold text-text-primary text-xs">
                            {bounty.creator}
                          </span>
                          <span className="text-[10px] text-text-dim">· {bounty.platform}</span>
                        </div>
                        <span className="text-[11px] text-text-muted truncate mt-0.5">
                          {bounty.objective}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-gold-accent tabular-nums">
                        {bounty.bounty} ({bounty.usd})
                      </span>
                      <Badge variant="slate" size="sm">
                        {bounty.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Early Access / Creator Waitlist Form */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card emphasis="gold">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <IconVault size={18} className="text-gold-accent" />
                  <CardTitle>CREATOR & EDITOR WAITLIST</CardTitle>
                </div>
                <Badge variant="gold">REGISTER INTEREST</Badge>
              </CardHeader>

              <CardContent className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <span className="font-grotesk font-bold text-lg text-text-primary uppercase">
                    BE FIRST IN LINE FOR PHASE 2
                  </span>
                  <p className="font-body text-xs text-text-muted leading-relaxed">
                    Are you a streamer wanting viral clips, or an editor looking for high-dollar video bounties? Register to be notified when Creator Studio opens.
                  </p>
                </div>

                <form onSubmit={handleJoinWaitlist} className="flex flex-col gap-4">
                  <Input
                    label="Channel or Portfolio URL (Optional)"
                    type="url"
                    value={channelUrl}
                    onChange={(e) => setChannelUrl(e.target.value)}
                    placeholder="https://youtube.com/@yourchannel"
                    leftIcon={<IconVideo size={14} />}
                  />

                  <Input
                    label="Email Address for Early Access Notification"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    required
                  />

                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="font-mono text-[11px] uppercase tracking-wider text-text-muted font-medium">
                      I Am Interested As
                    </label>
                    <select
                      value={audienceSize}
                      onChange={(e) => setAudienceSize(e.target.value)}
                      className="w-full bg-canvas border border-border-dark focus:border-lime-neon/80 focus:ring-2 focus:ring-lime-neon/20 text-text-primary font-mono text-xs rounded p-2.5 outline-none transition-all"
                    >
                      <option>Video Editor / Clipper (Looking for Bounties)</option>
                      <option>YouTuber / Streamer (Looking for Clips)</option>
                      <option>Brand / Web3 Community Sponsor</option>
                    </select>
                  </div>

                  <div className="p-3.5 rounded bg-canvas border border-border-dark flex flex-col gap-2 font-mono text-[11px] text-text-muted">
                    <div className="flex items-center gap-2 text-gold-accent font-semibold">
                      <IconShield size={14} />
                      <span>Zero Spam Guarantee</span>
                    </div>
                    <span>
                      We will only email you with the official Phase 2 testnet launch link and early creator passes.
                    </span>
                  </div>

                  <Button
                    type="submit"
                    variant="neon"
                    size="lg"
                    rightIcon={<IconBolt size={16} strokeWidth={2.5} />}
                    className="w-full mt-2"
                  >
                    JOIN CREATOR WAITLIST
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="justify-center text-center">
                <span className="text-[10px] text-text-dim">
                  In the meantime, start earning coins today via our active survey offerwalls!
                </span>
              </CardFooter>
            </Card>

            {/* Quick Redirect Card */}
            <Card>
              <CardContent className="p-5 flex flex-col gap-3 font-mono text-xs">
                <span className="font-bold text-text-primary flex items-center gap-2">
                  <IconBolt size={14} className="text-lime-neon" />
                  CURRENT PLATFORM PRIORITY:
                </span>
                <p className="text-text-muted leading-relaxed">
                  EarnVerse has active offerwall contracts with <strong>BitLabs</strong> and <strong>CPX Research</strong> with instant double-entry ledger crediting.
                </p>
                <Link href="/earn">
                  <Button variant="outline" size="sm" className="w-full mt-1">
                    VIEW ACTIVE TASK MATRIX →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
