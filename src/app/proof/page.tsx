"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CoinIcon } from "@/components/ui/CoinIcon";
import { IconVerified, IconVideo, IconLink, IconCloudUpload, IconShield, IconSend } from "@/components/ui/Icons";

export default function ProofSubmissionPage() {
  const [selectedTask, setSelectedTask] = useState("apex-clip");
  const [proofUrl, setProofUrl] = useState("https://youtube.com/shorts/k9_apex_moments");
  const [notes, setNotes] = useState("Beat sync cut delivered at 1440p 60fps. Music attribution in caption.");
  const [fileName, setFileName] = useState<string | null>("apex_shorts_proof_render.png");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-4xl">
        {/* Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-elevated border border-border-dark p-4 rounded">
          <div className="flex items-center gap-3">
            <IconVerified size={24} className="text-lime-neon" />
            <div className="flex flex-col">
              <h1 className="font-grotesk text-xl font-bold text-text-primary uppercase tracking-tight">
                TASK PROOF SUBMISSION // VERIFICATION GATE
              </h1>
              <span className="font-mono text-xs text-text-muted">
                Submit raw media links or completion telemetry to claim escrow bounties.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-lime-neon" />
            <span className="text-lime-neon font-bold">OPERATOR-REVIEWED</span>
          </div>
        </div>

        {/* Selected Task Summary Banner */}
        <div className="bg-surface-elevated border border-gold-accent/40 p-5 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-surface border border-gold-accent/40 flex items-center justify-center text-gold-accent shrink-0">
              <IconVideo size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-gold-accent uppercase font-bold text-[10px]">
                TARGET CONTRACT SELECTED
              </span>
              <span className="font-grotesk text-base font-bold text-text-primary">
                Twitch Raid: Apex Elimination Clip Sync
              </span>
              <span className="text-text-muted text-[11px]">
                Creator: @apex_pulse · Escrow Ref: #CR-90412-AP
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end">
            <span className="text-text-muted text-[10px] uppercase">BOUNTY REWARD</span>
            <div className="flex items-center gap-1.5 text-gold-accent font-bold text-base">
              <CoinIcon size={18} />
              <span>25,000 COINS ($25.00 USD)</span>
            </div>
          </div>
        </div>

        {isSubmitted && (
          <div className="p-4 bg-lime-neon/10 border border-lime-neon/40 rounded flex items-center gap-3 font-mono text-xs text-lime-neon">
            <IconVerified size={22} />
            <div>
              <div className="font-bold">PROOF SUBMISSION RECEIVED</div>
              <div className="text-[11px] text-text-muted">Queued for operator review. Your escrow stays locked until the bounty is approved.</div>
            </div>
          </div>
        )}

        {/* Proof Submission Form */}
        <form onSubmit={handleSubmit} className="bg-surface-elevated border border-border-dark p-6 rounded flex flex-col gap-5 font-mono text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-text-muted uppercase">Select Claimed Task / Bounty</label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full bg-surface border border-border-dark focus:border-lime-neon rounded p-2.5 text-text-primary outline-none"
            >
              <option value="apex-clip">Twitch Raid: Apex Elimination Clip Sync (25,000 Coins)</option>
              <option value="podcast-hook">TikTok Viral Sound Cut: Crypto Podcast (15,000 Coins)</option>
              <option value="survey-bitlabs">BitLabs Consumer Sentiment Survey (850 Coins)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-text-muted uppercase">Live Published URL / Link Proof</label>
            <div className="relative">
              <IconLink size={18} className="absolute left-3 top-2.5 text-text-muted" />
              <input
                type="url"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://tiktok.com/@youraccount/video/... or YouTube Shorts link"
                className="w-full bg-surface border border-border-dark focus:border-lime-neon rounded pl-10 pr-4 py-2.5 text-text-primary outline-none"
                required
              />
            </div>
          </div>

          {/* Screenshot Upload Dropzone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-text-muted uppercase">Verification Screenshot / Analytics Proof</label>
            <div className="border-2 border-dashed border-border-dark hover:border-lime-neon/50 rounded p-6 flex flex-col items-center justify-center gap-2 bg-surface cursor-pointer transition-colors">
              <IconCloudUpload size={32} className="text-lime-neon" />
              <div className="text-center">
                <span className="text-text-primary font-bold">
                  {fileName ? fileName : "Drag and drop analytics screenshot"}
                </span>
                <p className="text-[11px] text-text-muted mt-0.5">
                  PNG, JPG, or WEBP up to 25MB. Must show view counter and timestamp.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-text-muted uppercase">Additional Execution Notes & Timestamps</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Detail cut timestamps, licensed track names, or any relevant instructions..."
              className="w-full bg-surface border border-border-dark focus:border-lime-neon rounded p-2.5 text-text-primary outline-none"
            />
          </div>

          {/* Anti-Fraud Warning Box */}
          <div className="p-3 bg-surface border border-border-dark rounded flex items-start gap-2 text-[11px] text-text-muted">
            <IconShield size={16} className="text-crimson-accent shrink-0 mt-0.5" />
            <span>
              <strong className="text-text-primary">Anti-Fraud Telemetry:</strong> Submitting stolen clips, mock screenshots, or bot-manipulated links incurs an immediate 1-strike penalty and freezes vault withdrawals.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-lime-neon text-text-inverted font-grotesk font-bold text-sm uppercase rounded hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:shadow-[2px_2px_0_rgba(198,255,62,0.5)] active:shadow-none"
          >
            <span>DISPATCH PROOF TO ESCROW</span>
            <IconSend size={18} />
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
