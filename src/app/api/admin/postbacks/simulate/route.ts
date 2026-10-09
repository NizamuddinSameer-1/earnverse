import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizePostbackData, processOfferwallPostback } from "@/lib/postbacks";

export async function POST(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (sessionUser.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { network, user, coins, isChargeback, txId } = body;

    const targetUser = (user || "cryptoking").replace(/^@/, "");
    const effectiveCoins = parseInt(coins || "1000", 10) || 1000;
    const effectiveTxId = txId || `sim_${network?.toLowerCase() || "bitlabs"}_${Date.now()}`;

    const normalized = normalizePostbackData(network || "BITLABS", {
      userId: targetUser,
      coins: effectiveCoins,
      transactionId: effectiveTxId,
      isChargeback: Boolean(isChargeback),
      signature: "sha256_simulated_ok",
      rewardName: `Simulator Test (${network || "BITLABS"})`,
    });

    const result = await processOfferwallPostback(normalized);

    // Fetch updated user wallet for immediate feedback
    const updatedUser = await prisma.user.findFirst({
      where: {
        OR: [{ id: targetUser }, { username: targetUser }],
      },
      include: { wallet: true },
    });

    return NextResponse.json({
      success: result.success,
      result,
      updatedBalance: updatedUser?.wallet?.availableCoins ?? 0,
      targetUser: updatedUser ? `@${updatedUser.username}` : targetUser,
    });
  } catch (error: unknown) {
    console.error("POST /api/admin/postbacks/simulate error:", error);
    const msg = error instanceof Error ? error.message : "Simulator execution failed";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
