import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

// Deterministic, hash-shaped settlement reference derived from the withdrawal id.
// Stable across retries (same withdrawal -> same ref) and free of raw timestamps.
function buildSettlementRef(rail: string, withdrawalId: string): string {
  const digest = createHash("sha256")
    .update(`SETTLED:${rail}:${withdrawalId}`)
    .digest("hex")
    .slice(0, 12)
    .toUpperCase();
  return `SETTLED_${rail}_${digest}`;
}

export async function GET() {
  try {
    const withdrawals = await prisma.withdrawal.findMany({
      include: {
        user: {
          select: {
            username: true,
            trustScore: true,
            strikes: true,
            country: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: withdrawals });
  } catch (error: unknown) {
    console.error("GET /api/admin/withdrawals error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch withdrawals" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, action, reason } = body;

    if (!id || !["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json({ success: false, error: "Invalid action or ID" }, { status: 400 });
    }

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id },
      include: { user: { include: { wallet: true } } },
    });

    if (!withdrawal) {
      return NextResponse.json({ success: false, error: "Withdrawal not found" }, { status: 404 });
    }

    if (withdrawal.status !== "PENDING") {
      return NextResponse.json({ success: false, error: "Withdrawal is already settled" }, { status: 400 });
    }

    if (action === "APPROVE") {
      const txRef = buildSettlementRef(withdrawal.rail, withdrawal.id);

      const claimed = await prisma.$transaction(async (tx) => {
        // Optimistic claim: only the first request to flip PENDING wins (no double settlement).
        const claim = await tx.withdrawal.updateMany({
          where: { id, status: "PENDING" },
          data: {
            status: "APPROVED",
            reviewedBy: "admin",
            txRef,
          },
        });
        if (claim.count === 0) return false;

        await tx.auditLog.create({
          data: {
            actorId: withdrawal.userId,
            action: "CASHOUT_APPROVE",
            targetType: "withdrawal",
            targetId: id,
            reason: `Approved payout of ${withdrawal.coins} coins ($${withdrawal.amountUsd.toFixed(2)} USD) via ${withdrawal.rail}`,
          },
        });
        return true;
      });

      if (!claimed) {
        return NextResponse.json({ success: false, error: "Withdrawal is already settled" }, { status: 409 });
      }

      return NextResponse.json({ success: true, message: "Withdrawal approved" });
    } else {
      // Rejection with Ledger Refund (Fail Closed, Append-Only Ledger)
      const auditReason = reason || "Operator failed verification checks";
      // Deterministic idempotency key: a retried rejection can never double-refund.
      const idempotencyKey = `REFUND_${id}`;

      const refunded = await prisma.$transaction(async (tx) => {
        // Optimistic claim: only the first request to flip PENDING wins (no double refund).
        const claim = await tx.withdrawal.updateMany({
          where: { id, status: "PENDING" },
          data: {
            status: "REJECTED",
            reviewedBy: "admin",
            rejectionReason: auditReason,
          },
        });
        if (claim.count === 0) return false;

        await tx.wallet.update({
          where: { userId: withdrawal.userId },
          data: {
            availableCoins: { increment: withdrawal.coins },
          },
        });

        await tx.ledgerEntry.create({
          data: {
            userId: withdrawal.userId,
            amount: withdrawal.coins,
            coinTag: "EARNED",
            bucket: "AVAILABLE",
            reasonCode: "CASHOUT_REFUND",
            refType: "withdrawal",
            refId: id,
            idempotencyKey,
            meta: JSON.stringify({ reason: auditReason, rail: withdrawal.rail }),
          },
        });

        await tx.auditLog.create({
          data: {
            actorId: withdrawal.userId,
            action: "CASHOUT_REJECT",
            targetType: "withdrawal",
            targetId: id,
            reason: auditReason,
          },
        });

        return true;
      });

      if (!refunded) {
        return NextResponse.json({ success: false, error: "Withdrawal is already settled" }, { status: 409 });
      }

      return NextResponse.json({ success: true, message: "Withdrawal rejected and coins refunded" });
    }
  } catch (error: unknown) {
    console.error("POST /api/admin/withdrawals error:", error);
    const msg = error instanceof Error ? error.message : "Internal processing error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
