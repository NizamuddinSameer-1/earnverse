import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        wallet: true,
        _count: {
          select: {
            withdrawals: true,
            submissions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error: unknown) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, action, amount, reason } = body;

    if (!userId || !["BAN", "UNBAN", "ADJUST_BALANCE"].includes(action)) {
      return NextResponse.json({ success: false, error: "Invalid action or userId" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wallet: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (action === "BAN") {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { status: "BANNED" },
        }),
        prisma.auditLog.create({
          data: {
            actorId: userId,
            action: "USER_BAN",
            targetType: "user",
            targetId: userId,
            reason: reason || "Operator flagged for fraud or violation of TOS",
          },
        }),
      ]);

      return NextResponse.json({ success: true, message: "User suspended" });
    } else if (action === "UNBAN") {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { status: "ACTIVE" },
        }),
        prisma.auditLog.create({
          data: {
            actorId: userId,
            action: "USER_UNBAN",
            targetType: "user",
            targetId: userId,
            reason: reason || "User suspension lifted by admin review",
          },
        }),
      ]);

      return NextResponse.json({ success: true, message: "User reinstated" });
    } else if (action === "ADJUST_BALANCE") {
      const delta = parseInt(amount, 10);
      if (isNaN(delta) || delta === 0) {
        return NextResponse.json({ success: false, error: "Adjustment amount must be non-zero" }, { status: 400 });
      }

      const auditReason = reason || "Manual administrative balance correction";
      const idempotencyKey = `MANUAL_ADJUST_${userId}_${Date.now()}`;

      await prisma.$transaction([
        prisma.wallet.update({
          where: { userId },
          data: {
            availableCoins: { increment: delta },
          },
        }),
        prisma.ledgerEntry.create({
          data: {
            userId,
            amount: delta,
            coinTag: "ADMIN_ADJUSTMENT",
            bucket: "AVAILABLE",
            reasonCode: "ADMIN_CORRECTION",
            refType: "manual",
            idempotencyKey,
            meta: JSON.stringify({ reason: auditReason }),
          },
        }),
        prisma.auditLog.create({
          data: {
            actorId: userId,
            action: "BALANCE_ADJUST",
            targetType: "user",
            targetId: userId,
            reason: `${auditReason} (${delta > 0 ? "+" : ""}${delta} Coins)`,
          },
        }),
      ]);

      return NextResponse.json({ success: true, message: "User balance adjusted and logged in ledger" });
    }
  } catch (error: unknown) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json({ success: false, error: "Internal processing error" }, { status: 500 });
  }
}
