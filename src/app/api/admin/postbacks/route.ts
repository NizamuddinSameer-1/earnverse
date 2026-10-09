import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (sessionUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const events = await prisma.offerwallEvent.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            trustScore: true,
            status: true,
          },
        },
      },
    });

    const totalEvents = await prisma.offerwallEvent.count();
    const creditedEvents = await prisma.offerwallEvent.findMany({
      where: { status: "CREDITED" },
      select: { coinsCredited: true, payoutUsd: true },
    });

    const totalCoins = creditedEvents.reduce((acc, e) => acc + e.coinsCredited, 0);
    const totalUsd = creditedEvents.reduce((acc, e) => acc + e.payoutUsd, 0);
    const chargebackCount = await prisma.offerwallEvent.count({
      where: { status: "REVERSED" },
    });

    return NextResponse.json({
      success: true,
      data: {
        events: events.map((ev) => ({
          id: ev.id,
          network: ev.network,
          user: `@${ev.user.username}`,
          userId: ev.userId,
          txId: ev.transactionId,
          payoutCoins: ev.coinsCredited,
          usdRevenue: `$${ev.payoutUsd.toFixed(2)}`,
          status: ev.status,
          signatureValid: ev.signatureValid,
          createdAt: ev.createdAt,
        })),
        stats: {
          totalEvents,
          totalCoins,
          totalUsd: `$${totalUsd.toFixed(2)}`,
          chargebackCount,
        },
      },
    });
  } catch (error: unknown) {
    console.error("GET /api/admin/postbacks error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
