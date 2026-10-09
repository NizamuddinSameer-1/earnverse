import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [config, pendingWithdrawals, recentEvents, usersCount, campaigns, mintAgg, payoutAgg, auditCount] =
      await Promise.all([
        prisma.systemConfig.findUnique({ where: { id: "singleton" } }),
        prisma.withdrawal.findMany({
          where: { status: "PENDING" },
          include: { user: { select: { username: true, trustScore: true, strikes: true } } },
          orderBy: { createdAt: "desc" },
        }),
        prisma.offerwallEvent.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { username: true } } },
        }),
        prisma.user.count(),
        prisma.campaign.findMany({ select: { escrowRemaining: true } }),
        prisma.ledgerEntry.aggregate({ where: { amount: { gt: 0 } }, _sum: { amount: true } }),
        prisma.ledgerEntry.aggregate({ where: { amount: { lt: 0 } }, _sum: { amount: true } }),
        prisma.auditLog.count(),
      ]);

    const totalEscrowCoins = campaigns.reduce((acc, c) => acc + c.escrowRemaining, 0);
    const pendingCoinsTotal = pendingWithdrawals.reduce((acc, w) => acc + w.coins, 0);

    return NextResponse.json({
      success: true,
      data: {
        emergencyFreeze: config?.emergencyFreeze ?? false,
        kpi: {
          totalEscrowCoins,
          totalEscrowUsd: (totalEscrowCoins / 1000).toFixed(2),
          pendingLiabilitiesCoins: pendingCoinsTotal,
          pendingLiabilitiesUsd: (pendingCoinsTotal / 1000).toFixed(2),
          activeOperators: usersCount,
          mintedCoins: mintAgg._sum.amount ?? 0,
          paidOutCoins: Math.abs(payoutAgg._sum.amount ?? 0),
          auditEvents: auditCount,
        },
        withdrawals: pendingWithdrawals,
        recentEvents,
      },
    });
  } catch (error: unknown) {
    console.error("API /api/admin/overview error:", error);
    return NextResponse.json({ success: false, error: "Database query failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emergencyFreeze } = body;

    if (typeof emergencyFreeze !== "boolean") {
      return NextResponse.json(
        { success: false, error: "emergencyFreeze must be a boolean" },
        { status: 400 }
      );
    }

    const config = await prisma.systemConfig.upsert({
      where: { id: "singleton" },
      update: { emergencyFreeze },
      create: { id: "singleton", emergencyFreeze },
    });

    return NextResponse.json({
      success: true,
      data: { emergencyFreeze: config.emergencyFreeze },
    });
  } catch (error: unknown) {
    console.error("POST /api/admin/overview error:", error);
    return NextResponse.json({ success: false, error: "Failed to update system config" }, { status: 500 });
  }
}
