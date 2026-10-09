"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { IconCommunity, IconPlusCircle, IconArrowRight, IconUpload, IconShield, IconX } from "@/components/ui/Icons";

interface CommunityPost {
  id: string;
  type: "hire" | "collab" | "discussion" | "bump";
  tag: string;
  author: string;
  role: string;
  title: string;
  desc: string;
  payout: string;
  coins: number;
  replies: number;
  time: string;
}

const initialPosts: CommunityPost[] = [
  {
    id: "post-1",
    type: "hire",
    tag: "EDITOR NEEDED",
    author: "@apex_pulse",
    role: "Creator",
    title: "Seeking Apex Legends Clip Sync Editor — 50,000 Coins ($50.00) or Direct UPI",
    desc: "Fast turnaround for 4 YouTube Shorts. Need dynamic camera shake, beat sync, and SFX riser placement. Raw 1440p footage provided via shared cloud drive.",
    payout: "$50.00 USD",
    coins: 50000,
    replies: 14,
    time: "18m ago",
  },
  {
    id: "post-2",
    type: "collab",
    tag: "CROSS-PROMO",
    author: "@tech_bytes",
    role: "Verified Channel",
    title: "Looking for Gaming Creator with 10k+ Subs for Discord Raid & Mutual Shoutout",
    desc: "Target audience is PC hardware / esports enthusiasts. Willing to match view-for-view and co-host Sunday night stream tournament.",
    payout: "Mutual Collab",
    coins: 0,
    replies: 8,
    time: "1h ago",
  },
  {
    id: "post-3",
    type: "hire",
    tag: "THUMBNAIL GIG",
    author: "@crypto_sam",
    role: "Active Creator",
    title: "Need High-CTR Thumbnail Designer: 3 Variants for Bitcoin Bull Run Breakdown",
    desc: "Looking for 3 punchy A/B/C testing variants in Figma / Photoshop. Clean neon typography with bold face cutout. Payment released via escrow upon PSD delivery.",
    payout: "$15.00 USD",
    coins: 15000,
    replies: 22,
    time: "2h ago",
  },
  {
    id: "post-4",
    type: "bump",
    tag: "BUMP BOARD",
    author: "@vfx_kiran",
    role: "Freelance Motion Artist",
    title: "[PORTFOLIO BUMP] After Effects Animation & 3D Logo Intros for Streamers",
    desc: "Check out my new reel! Offering 20% discount if booked via EarnVerse coin escrow today. Bumped 3 times.",
    payout: "Available for Hire",
    coins: 0,
    replies: 31,
    time: "3h ago",
  },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newBudget, setNewBudget] = useState("5000");

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      type: "hire",
      tag: "COMMUNITY LISTING",
      author: "@cryptoking",
      role: "Gold Tier Lv 12",
      title: newTitle,
      desc: newDesc || "Looking for reliable creator collaboration or peer review.",
      payout: `$${(parseInt(newBudget || "0", 10) / 1000).toFixed(2)} USD`,
      coins: parseInt(newBudget || "0", 10),
      replies: 0,
      time: "Just now",
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    setNewTitle("");
    setNewDesc("");
  };

  const filteredPosts = posts.filter((p) => {
    if (activeTab === "all") return true;
    return p.type === activeTab;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-elevated border border-border-dark p-4 rounded">
          <div className="flex items-center gap-3">
            <IconCommunity size={24} className="text-lime-neon" />
            <div className="flex flex-col">
              <h1 className="font-grotesk text-xl font-bold text-text-primary uppercase tracking-tight">
                COMMUNITY HUB // CREATOR BOUNTIES & COLLABS
              </h1>
              <span className="font-mono text-xs text-text-muted">
                Peer-to-peer micro-gigs, thumbnail audits, and escrow-guaranteed hires.
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-lime-neon text-text-inverted font-grotesk text-xs uppercase font-bold rounded hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 hover:shadow-[2px_2px_0_rgba(198,255,62,0.5)] active:shadow-none"
          >
            <IconPlusCircle size={16} />
            <span>POST GIG / HIRE</span>
          </button>
        </div>

        {/* Spotlight Apex Legends Hero Bounty Card */}
        <div className="relative bg-surface-elevated border border-gold-accent/40 rounded p-6 overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-crimson-accent/10 text-crimson-accent border border-crimson-accent/30 font-mono text-[10px] uppercase font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-crimson-accent" />
                ENDING IN 18H
              </span>
              <span className="font-mono text-[10px] text-text-muted bg-surface border border-border-dark px-2 py-0.5 rounded">
                BOUNTY #8821
              </span>
              <span className="px-2 py-0.5 rounded bg-gold-accent/15 text-gold-accent font-mono text-[10px] uppercase font-bold">
                APEX VERIFIED
              </span>
            </div>

            <div className="font-mono text-xs text-gold-accent font-bold">
              50,000 COINS ($50.00 USD)
            </div>
          </div>

          <h2 className="font-grotesk text-xl font-bold text-text-primary mb-2">
            Seeking Apex Legends Clip Sync Editor — 50,000 Coins ($50.00) or Direct UPI
          </h2>
          <p className="font-body text-xs text-text-muted mb-4 max-w-2xl leading-relaxed">
            Fast turnaround for 4 YouTube Shorts. Need dynamic camera shake, beat sync, and SFX riser placement. Raw 1440p footage provided via shared cloud drive. Must submit 1 demo hook cutoff before final tranche release.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-border-dark">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-surface border border-lime-neon/40 flex items-center justify-center text-lime-neon font-mono font-bold text-xs">
                AP
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-grotesk text-xs font-bold text-text-primary">@apex_pulse</span>
                  <span className="font-mono text-[9px] bg-gold-accent/15 text-gold-accent px-1.5 py-0.5 rounded uppercase">
                    CREATOR
                  </span>
                </div>
                <span className="font-mono text-[10px] text-text-muted">
                  VERIFIED BOUNTY COMPLETIONS
                </span>
              </div>
            </div>

            <Link
              href="/proof"
              className="px-4 py-2 bg-lime-neon text-text-inverted font-grotesk text-xs uppercase font-bold rounded hover:brightness-110 hover:shadow-[2px_2px_0_rgba(198,255,62,0.5)] active:shadow-none active:scale-95 transition-all flex items-center gap-1"
            >
              <span>ACCEPT & SUBMIT DEMO</span>
              <IconArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 font-mono text-xs border-b border-border-dark pb-2 overflow-x-auto">
          {[
            { id: "all", label: "ALL DISCUSSIONS" },
            { id: "hire", label: "CREATOR HIRES" },
            { id: "collab", label: "COLLABS" },
            { id: "bump", label: "BUMP BOARD" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded transition-all font-semibold whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? "bg-surface-high text-lime-neon border-b-2 border-lime-neon font-bold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Feed Column with Right Context Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Post Feed (col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-surface-elevated border border-border-dark hover:border-lime-neon/40 p-5 rounded flex flex-col gap-3 transition-all"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-surface border border-border-dark text-lime-neon font-bold text-[10px] uppercase">
                      {post.tag}
                    </span>
                    <span className="text-text-primary font-bold">{post.author}</span>
                    <span className="text-text-muted text-[10px]">· {post.role}</span>
                  </div>
                  <span className="text-text-muted text-[11px]">{post.time}</span>
                </div>

                <h3 className="font-grotesk text-base font-bold text-text-primary">
                  {post.title}
                </h3>

                <p className="font-body text-xs text-text-muted leading-relaxed">
                  {post.desc}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-border-dark font-mono text-xs">
                  <div className="flex items-center gap-2">
                    {post.coins > 0 ? (
                      <div className="flex items-center gap-1.5 text-gold-accent font-bold">
                        <CoinIcon size={16} />
                        <span>{post.coins.toLocaleString()} COINS ({post.payout})</span>
                      </div>
                    ) : (
                      <span className="text-text-primary font-bold">{post.payout}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-text-muted text-[11px]">
                      {post.replies} responses
                    </span>
                    <button className="px-3 py-1 bg-surface border border-border-dark hover:border-lime-neon text-lime-neon rounded text-xs font-bold transition-colors">
                      RESPOND
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Rail (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Bump Board Promo Box */}
            <div className="bg-surface-elevated border border-border-dark p-4 rounded flex flex-col gap-3">
              <span className="font-mono text-xs uppercase text-lime-neon font-bold flex items-center gap-1.5">
                <IconUpload size={18} />
                BUMP BOARD MECHANISM
              </span>
              <p className="font-body text-xs text-text-muted leading-relaxed">
                Visit 3 creator listings or channel reviews to earn 1 free thread bump, pushing your gig back to the top of the feed without spending coins.
              </p>
              <div className="p-3 bg-surface border border-border-dark rounded flex items-center justify-between font-mono text-xs">
                <span>Your Bump Balance:</span>
                <span className="text-lime-neon font-bold">2 Free Bumps</span>
              </div>
            </div>

            {/* Escrow Guarantee Box */}
            <div className="bg-surface-elevated border border-border-dark p-4 rounded flex flex-col gap-2 font-mono text-xs">
              <span className="text-text-primary font-bold uppercase flex items-center gap-1.5">
                <IconShield size={16} className="text-lime-neon" />
                ESCROW PROTECTION RULE
              </span>
              <p className="text-[11px] text-text-muted leading-relaxed">
                All coins for creator bounties are locked in platform smart escrow until work is delivered and approved. 100% dispute resolution guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal to Create Post */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-elevated border border-border-dark rounded max-w-lg w-full p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border-dark pb-3">
              <h2 className="font-grotesk text-lg font-bold text-text-primary">
                CREATE CREATOR GIG / LISTING
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <IconX size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-text-muted uppercase">Listing Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Need Thumbnail Artist for YouTube Tech Review"
                  className="bg-surface border border-border-dark focus:border-lime-neon rounded p-2.5 text-text-primary outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-text-muted uppercase">Description & Requirements</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="Provide scope, turnaround time, format requirements..."
                  className="bg-surface border border-border-dark focus:border-lime-neon rounded p-2.5 text-text-primary outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-text-muted uppercase">Bounty Reward (Coins)</label>
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  placeholder="5000"
                  className="bg-surface border border-border-dark focus:border-lime-neon rounded p-2.5 text-text-primary outline-none"
                />
                <span className="text-[10px] text-gold-accent">
                  ≈ ${(parseInt(newBudget || "0", 10) / 1000).toFixed(2)} USD locked from your vault balance
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-dark">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-surface border border-border-dark text-text-muted rounded hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-lime-neon text-text-inverted font-grotesk font-bold uppercase rounded hover:brightness-110"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
