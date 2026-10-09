import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      include: {
        wallet: true,
        ledgerEntries: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        withdrawals: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user || !user.wallet) {
      return NextResponse.json({ success: false, error: "User or wallet not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        availableCoins: user.wallet.availableCoins,
        pendingCoins: user.wallet.pendingCoins,
        escrowCoins: user.wallet.escrowCoins,
        usdValue: (user.wallet.availableCoins / 1000).toFixed(2),
        lifetimeEarned: user.wallet.lifetimeEarned,
        lifetimeCashed: user.wallet.lifetimeCashed,
        ledgerEntries: user.ledgerEntries,
        withdrawals: user.withdrawals,
      },
    });
  } catch (error: unknown) {
    console.error("GET /api/user/wallet error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { coins, rail, destination } = body;

    // System-level gate: operator can freeze all cashouts (fail closed).
    const config = await prisma.systemConfig.findUnique({ where: { id: "singleton" } });
    if (config?.emergencyFreeze) {
      return NextResponse.json(
        { success: false, error: "Cashouts are temporarily frozen by the operator." },
        { status: 503 }
      );
    }

    const numCoins = parseInt(coins, 10);
    if (!numCoins || numCoins <= 0) {
      return NextResponse.json({ success: false, error: "Invalid coin amount" }, { status: 400 });
    }

    if (!destination || typeof destination !== "string" || !destination.trim()) {
      return NextResponse.json({ success: false, error: "Receiving account / address is required" }, { status: 400 });
    }

    // Map rail identifier to normalized schema rail
    const railMap: Record<string, { schemaRail: string; minCoins: number }> = {
      upi: { schemaRail: "UPI", minCoins: 500 },
      usdt: { schemaRail: "USDT_TRC20", minCoins: 5000 },
      ltc: { schemaRail: "LTC", minCoins: 1000 },
      paypal: { schemaRail: "PAYPAL", minCoins: 5000 },
      UPI: { schemaRail: "UPI", minCoins: 500 },
      USDT_TRC20: { schemaRail: "USDT_TRC20", minCoins: 5000 },
      LTC: { schemaRail: "LTC", minCoins: 1000 },
      PAYPAL: { schemaRail: "PAYPAL", minCoins: 5000 },
    };

    const railConfig = railMap[rail] || { schemaRail: "UPI", minCoins: 500 };
    if (numCoins < railConfig.minCoins) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum withdrawal for ${railConfig.schemaRail} is ${railConfig.minCoins} Coins`,
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      include: { wallet: true },
    });

    if (!user || !user.wallet) {
      return NextResponse.json({ success: false, error: "User or wallet not found" }, { status: 404 });
    }

    if (user.wallet.availableCoins < numCoins) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient available coins. Balance: ${user.wallet.availableCoins.toLocaleString()} Coins`,
        },
        { status: 400 }
      );
    }

    const usdValue = parseFloat((numCoins / 1000).toFixed(2));
    const idempotencyKey = `WD_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Execute atomic debit and append-only ledger transaction (ADR-003)
    const result = await prisma.$transaction(async (tx) => {
      // 1. Debit available balance and add to lifetime cashed
      const updatedWallet = await tx.wallet.update({
        where: { userId: user.id },
        data: {
          availableCoins: { decrement: numCoins },
          lifetimeCashed: { increment: numCoins },
        },
      });

      // 2. Create pending withdrawal record
      const withdrawal = await tx.withdrawal.create({
        data: {
          userId: user.id,
          coins: numCoins,
          amountUsd: usdValue,
          rail: railConfig.schemaRail,
          destination: destination.trim(),
          status: "PENDING",
        },
      });

      // 3. Append immutable negative ledger entry (double-entry auditability)
      const ledgerEntry = await tx.ledgerEntry.create({
        data: {
          userId: user.id,
          amount: -numCoins,
          coinTag: "EARNED",
          bucket: "AVAILABLE",
          reasonCode: "CASHOUT_DEBIT",
          refType: "withdrawal",
          refId: withdrawal.id,
          idempotencyKey,
          meta: JSON.stringify({
            rail: railConfig.schemaRail,
            destination: destination.trim(),
            amountUsd: usdValue,
          }),
        },
      });

      // 4. Log audit event
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "CASHOUT_REQUEST",
          targetType: "withdrawal",
          targetId: withdrawal.id,
          reason: `Operator requested ${numCoins} coins payout via ${railConfig.schemaRail}`,
        },
      });

      return { updatedWallet, withdrawal, ledgerEntry };
    });

    return NextResponse.json({
      success: true,
      message: `Disbursement request for ${numCoins.toLocaleString()} coins ($${usdValue.toFixed(2)} USD) broadcasted to queue`,
      data: {
        withdrawal: result.withdrawal,
        availableCoins: result.updatedWallet.availableCoins,
        usdValue: (result.updatedWallet.availableCoins / 1000).toFixed(2),
      },
    });
  } catch (error: unknown) {
    console.error("POST /api/user/wallet error:", error);
    const msg = error instanceof Error ? error.message : "Failed to process withdrawal";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

