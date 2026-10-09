"use client";

import React, { useRef, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  IconVerified,
  IconCheck,
  IconAlertTriangle,
  IconArrowUpRight,
} from "@/components/ui/Icons";

interface ProofSubmission {
  id: string;
  user: string;
  bountyTitle: string;
  creator: string;
  proofUrl: string;
  notes: string;
  rewardCoins: number;
  usd: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

const sampleProofs: ProofSubmission[] = [
  {
    id: "PRF-1042",
    user: "@clip_god_99",
    bountyTitle: "Apex Legends 30s Beat-Sync Elimination Cut",
    creator: "@ApexPulse",
    proofUrl: "https://tiktok.com/@clip_god_99/video/72918841",
    notes: "Beat-sync done with watermark removed, uploaded with #ApexLegends #EarnVerse",
    rewardCoins: 25000,
    usd: "$25.00",
    submittedAt: "12m ago",
    status: "pending",
  },
  {
    id: "PRF-1041",
    user: "@sam_edits",
    bountyTitle: "Podcast 45s Debate Viral Hook",
    creator: "@Web3Uncut",
    proofUrl: "https://youtube.com/shorts/v_98492019",
    notes: "Captions animated using Submagic template. Reached 1.2k views in first hour.",
    rewardCoins: 15000,
    usd: "$15.00",
    submittedAt: "34m ago",
    status: "pending",
  },
  {
    id: "PRF-1040",
    user: "@speed_reacts",
    bountyTitle: "Funny Stream Fails 30s Reel",
    creator: "@SpeedGaming",
    proofUrl: "https://instagram.com/reel/C89218_x",
    notes: "Included intro hook with audio sound effect.",
    rewardCoins: 8000,
    usd: "$8.00",
    submittedAt: "1h ago",
    status: "pending",
  },
];

type Notice = { kind: "ok" | "error"; text: string };

export default function AdminProofsPage() {
  const [proofs, setProofs] = useState<ProofSubmission[]>(sampleProofs);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotice = (next: Notice) => {
    setNotice(next);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3500);
  };

  const handleApprove = (id: string) => {
    setProofs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "approved" } : p))
    );
    showNotice({
      kind: "ok",
      text: `Approved ${id} (demo queue). No ledger entry was written — the submission pipeline is not connected yet.`,
    });
  };

  const confirmReject = (id: string, user: string) => {
    if (!rejectReason.trim()) return;
    const reason = rejectReason.trim();
    setProofs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "rejected" } : p))
    );
    showNotice({
      kind: "ok",
      text: `Rejected ${id} for ${user} (demo queue). Reason kept for this session only: ${reason}`,
    });
    setRejectTarget(null);
    setRejectReason("");
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded bg-gradient-to-r from-surface-card via-surface to-canvas border border-gold-accent/25 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-gold-accent/15 border border-gold-accent/30 flex items-center justify-center text-gold-accent">
                <IconVerified size={24} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-grotesk text-2xl font-bold text-text-primary tracking-tight uppercase">
                    PROOF OF WORK // SUBMISSION REVIEW QUEUE
                  </h1>
                  <Badge variant="slate" size="sm">
                    DEMO DATA
                  </Badge>
                </div>
                <span className="font-mono text-xs text-text-muted mt-1">
                  Preview of the creator bounty review flow. Sample queue for layout review — not connected to the database yet.
                </span>
              </div>
            </div>
          </div>
        </div>

        {notice && (
          <div
            className={`p-4 border rounded font-mono text-xs flex items-center gap-2.5 ${
              notice.kind === "ok"
                ? "bg-lime-neon/12 border-lime-neon/40 text-lime-neon"
                : "bg-crimson-accent/10 border-crimson-accent/40 text-crimson-accent"
            }`}
          >
            {notice.kind === "ok" ? (
              <IconCheck size={18} strokeWidth={2.5} />
            ) : (
              <IconAlertTriangle size={18} strokeWidth={2.5} />
            )}
            <span>{notice.text}</span>
          </div>
        )}

        {/* Submissions List */}
        <div className="flex flex-col gap-4">
          {proofs.map((proof) => (
            <Card key={proof.id} emphasis={proof.status === "approved" ? "lime" : "none"}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6">
                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
                      <span className="font-bold text-text-primary">{proof.id}</span>
                      <span className="text-text-dim">· {proof.submittedAt}</span>
                      <strong className="text-lime-neon">{proof.user}</strong>
                      <span className="text-text-muted">for {proof.creator}</span>
                    </div>

                    <h3 className="font-grotesk text-base font-bold text-text-primary">
                      {proof.bountyTitle}
                    </h3>

                    <div className="p-3 bg-canvas border border-border-dark rounded font-mono text-xs text-text-muted">
                      <span className="text-text-dim block text-[10px] uppercase font-bold">
                        Submission Notes:
                      </span>
                      {proof.notes}
                    </div>

                    <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                      <span className="text-text-dim">Attached Proof Link:</span>
                      <a
                        href={proof.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lime-neon hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>{proof.proofUrl}</span>
                        <IconArrowUpRight size={13} />
                      </a>
                    </div>
                  </div>

                  {/* Right Action / Reward Box */}
                  <div className="flex flex-col items-end gap-3 shrink-0 self-end md:self-center border-t md:border-t-0 border-border-dark pt-4 md:pt-0 w-full md:w-auto">
                    <div className="flex flex-col items-end font-mono">
                      <span className="font-bold text-lg text-gold-accent tabular-nums">
                        +{proof.rewardCoins.toLocaleString()} COINS
                      </span>
                      <span className="text-xs text-text-muted">≈ {proof.usd} USD</span>
                    </div>

                    {proof.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="neon"
                          size="sm"
                          onClick={() => handleApprove(proof.id)}
                        >
                          APPROVE PROOF
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setRejectTarget(rejectTarget === proof.id ? null : proof.id);
                            setRejectReason("");
                          }}
                        >
                          REJECT
                        </Button>
                      </div>
                    ) : (
                      <Badge
                        variant={proof.status === "approved" ? "lime" : "crimson"}
                        size="md"
                      >
                        {proof.status.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>

                {rejectTarget === proof.id && proof.status === "pending" && (
                  <div className="border-t border-crimson-accent/25 bg-crimson-accent/[0.04] p-4 pl-6">
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="flex flex-col gap-1 flex-1 min-w-[240px]">
                        <label
                          htmlFor={`reject-reason-${proof.id}`}
                          className="font-mono text-[10px] uppercase text-text-muted"
                        >
                          REJECTION REASON (SESSION ONLY — NOT SAVED)
                        </label>
                        <input
                          id={`reject-reason-${proof.id}`}
                          type="text"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder={`Why is ${proof.user}'s proof being rejected?`}
                          className="w-full bg-surface border border-border-dark focus:border-crimson-accent/60 rounded px-3 py-2 text-xs font-mono text-text-primary outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={!rejectReason.trim()}
                          onClick={() => confirmReject(proof.id, proof.user)}
                        >
                          CONFIRM REJECTION
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRejectTarget(null);
                            setRejectReason("");
                          }}
                        >
                          CANCEL
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
