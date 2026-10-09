import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    // Username format check: 3 to 20 alphanumeric characters or underscores
    if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
      return NextResponse.json(
        { success: false, error: "Username must be 3-20 characters long (letters, numbers, underscores only)" },
        { status: 400 }
      );
    }

    // Email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check existing username or email
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username: cleanUsername }, { email: cleanEmail }],
      },
    });

    if (existing) {
      const field = existing.username === cleanUsername ? "Username" : "Email";
      return NextResponse.json(
        { success: false, error: `${field} is already registered` },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const welcomeCoins = 100; // Starter sign-up welcome bonus (0.10 USD)

    // Execute atomic user and wallet creation with welcome bonus
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: cleanUsername,
          email: cleanEmail,
          passwordHash,
          role: "OPERATOR",
          status: "ACTIVE",
          trustScore: 100,
          wallet: {
            create: {
              availableCoins: welcomeCoins,
              pendingCoins: 0,
              escrowCoins: 0,
              lifetimeEarned: welcomeCoins,
              lifetimeCashed: 0,
            },
          },
        },
        include: { wallet: true },
      });

      // Append immutable starter ledger entry
      await tx.ledgerEntry.create({
        data: {
          userId: user.id,
          amount: welcomeCoins,
          coinTag: "EARNED",
          bucket: "AVAILABLE",
          reasonCode: "SIGNUP_BONUS",
          refType: "manual",
          idempotencyKey: `SIGNUP_${user.id}_${Date.now()}`,
          meta: JSON.stringify({ description: "Welcome bonus for joining EarnVerse" }),
        },
      });

      return user;
    });

    // Generate signed session token
    const token = await signSession({
      userId: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role as "OPERATOR" | "ADMIN",
    });

    const response = NextResponse.json({
      success: true,
      message: `Account created successfully! Welcome bonus of ${welcomeCoins} Coins credited.`,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        availableCoins: welcomeCoins,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 3600,
    });

    return response;
  } catch (error: unknown) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json({ success: false, error: "Failed to create account" }, { status: 500 });
  }
}
