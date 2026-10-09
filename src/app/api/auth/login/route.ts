import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Username/Email and password are required" },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Find user by either email or username (case-insensitive)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier },
          { username: cleanIdentifier },
        ],
      },
      include: { wallet: true },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. Please verify your login details." },
        { status: 401 }
      );
    }

    if (user.status === "BANNED") {
      return NextResponse.json(
        { success: false, error: "Account suspended. Contact support for fraud review." },
        { status: 403 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. Please verify your login details." },
        { status: 401 }
      );
    }

    // Generate signed session token
    const token = await signSession({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role as "OPERATOR" | "ADMIN",
    });

    // Create JSON response and set httpOnly session cookie
    const response = NextResponse.json({
      success: true,
      message: `Welcome back, @${user.username}`,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        trustScore: user.trustScore,
        availableCoins: user.wallet?.availableCoins || 0,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 3600, // 7 days
    });

    return response;
  } catch (error: unknown) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
