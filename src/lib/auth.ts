import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export * from "@/lib/session";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session";

/**
 * Server-side password hashing using Node scryptSync (NIST-compliant).
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

/**
 * Constant-time password verification to prevent timing side-channel attacks.
 */
export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, key] = combinedHash.split(":");
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(derivedKey, "hex"), Buffer.from(key, "hex"));
  } catch (_) {
    return false;
  }
}

/**
 * Server-side helper to read the authenticated session user from request cookies.
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const session = await verifySession(token);
    if (!session) return null;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { wallet: true },
    });

    if (!user || user.status === "BANNED") return null;
    return user;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}
