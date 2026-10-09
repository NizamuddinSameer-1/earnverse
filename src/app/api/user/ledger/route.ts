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
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!user || !user.wallet) {
      return NextResponse.json({ success: false, error: "User or wallet not found" }, { status: 404 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let todayCoins = 0;
    let todayCount = 0;
    let weekCoins = 0;

    const formattedEntries = user.ledgerEntries.map((entry) => {
      const entryDate = new Date(entry.createdAt);

      if (entryDate >= todayStart) {
        todayCount++;
        if (entry.amount > 0) todayCoins += entry.amount;
      }
      if (entryDate >= weekStart && entry.amount > 0) {
        weekCoins += entry.amount;
      }

      // Grouping
      let dateGroup: "TODAY" | "YESTERDAY" | "OLDER" = "OLDER";
      const diffDays = Math.floor((todayStart.getTime() - new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate()).getTime()) / (24 * 60 * 60 * 1000));
      if (diffDays === 0) dateGroup = "TODAY";
      else if (diffDays === 1) dateGroup = "YESTERDAY";

      // Meta parse
      let metaObj: Record<string, unknown> = {};
      try {
        if (entry.meta) metaObj = JSON.parse(entry.meta);
      } catch (_) {}

      // Category / Type
      let type: "offer" | "bounty" | "referral" | "cashout" = "offer";
      if (entry.refType === "withdrawal" || entry.amount < 0 || entry.reasonCode.includes("CASHOUT")) {
        type = "cashout";
      } else if (entry.refType === "submission" || entry.reasonCode.includes("BOUNTY")) {
        type = "bounty";
      } else if (entry.reasonCode.includes("REFERRAL")) {
        type = "referral";
      }

      // Source label
      let source = "EARNVERSE";
      if (metaObj.network) {
        source = String(metaObj.network).toUpperCase();
      } else if (type === "cashout") {
        source = metaObj.rail ? `CASHOUT (${metaObj.rail})` : "CASHOUT";
      } else if (type === "bounty") {
        source = metaObj.platform ? `${String(metaObj.platform).toUpperCase()} BOUNTY` : "CREATOR BOUNTY";
      } else if (type === "referral") {
        source = "AFFILIATE";
      }

      // Title & descriptions
      let title = `Transaction event: ${entry.reasonCode}`;
      if (metaObj.rewardName) {
        title = String(metaObj.rewardName);
      } else if (metaObj.reason) {
        title = String(metaObj.reason);
      } else if (type === "cashout") {
        title = `Disbursement Output via ${metaObj.rail || "Payment Rail"} (${Math.abs(entry.amount)} Coins)`;
      } else if (type === "bounty") {
        title = `${metaObj.platform || "Social"} content submission and engagement bounty`;
      }

      // Status
      let status: "CREDITED" | "ESCROW" | "WITHDRAWN" | "PENDING" = "CREDITED";
      if (entry.bucket === "ESCROW") status = "ESCROW";
      else if (entry.bucket === "PENDING") status = "PENDING";
      else if (entry.amount < 0) status = "WITHDRAWN";

      const timeStr = entryDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) + " UTC";

      return {
        id: entry.id,
        time: timeStr,
        dateGroup,
        source,
        title,
        ref: entry.refId || entry.idempotencyKey.substring(0, 16),
        coins: entry.amount,
        usd: `${entry.amount < 0 ? "-" : "+"}$${(Math.abs(entry.amount) / 1000).toFixed(2)}`,
        status,
        type,
        createdAt: entry.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        entries: formattedEntries,
        stats: {
          todayCoins,
          todayCount,
          weekCoins,
          weekUsd: (weekCoins / 1000).toFixed(2),
          lifetimeCoins: user.wallet.lifetimeEarned,
          lifetimeUsd: (user.wallet.lifetimeEarned / 1000).toFixed(2),
        },
      },
    });
  } catch (error: unknown) {
    console.error("GET /api/user/ledger error:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}
