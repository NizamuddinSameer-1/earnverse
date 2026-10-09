import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        country: user.country,
        trustScore: user.trustScore,
        availableCoins: user.wallet?.availableCoins || 0,
        usdValue: ((user.wallet?.availableCoins || 0) / 1000).toFixed(2),
      },
    });
  } catch (error: unknown) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json({ success: false, authenticated: false, error: "Auth lookup failed" }, { status: 500 });
  }
}
