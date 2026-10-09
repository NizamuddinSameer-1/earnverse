export const SESSION_COOKIE_NAME = "earnverse_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "earnverse-default-super-secret-key-32chars";

export interface SessionPayload {
  userId: string;
  username: string;
  email: string;
  role: "OPERATOR" | "ADMIN";
  exp: number; // Expiration epoch in seconds
}

// Convert a base64url string to Uint8Array (Edge-safe)
function base64UrlToUint8Array(base64Url: string): Uint8Array<ArrayBuffer> {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
  const binary = atob(base64 + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Convert a Uint8Array or ArrayBuffer to base64url (Edge-safe)
function bufferToBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Signs a session payload into a compact, cryptographically verified token.
 * Token format: <base64url(payload)>.<base64url(hmacSignature)>
 */
export async function signSession(payload: Omit<SessionPayload, "exp">, expiresInSeconds = 7 * 24 * 3600): Promise<string> {
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const payloadString = JSON.stringify(fullPayload);
  const payloadBase64 = bufferToBase64Url(new TextEncoder().encode(payloadString));

  const key = await getHmacKey();
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadBase64));
  const signatureBase64 = bufferToBase64Url(signature);

  return `${payloadBase64}.${signatureBase64}`;
}

/**
 * Verifies a token's HMAC signature and expiration epoch.
 * Works uniformly in Edge runtime, middleware, and Node runtime without any dependencies.
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    if (!token || !token.includes(".")) return null;
    const [payloadBase64, signatureBase64] = token.split(".");
    if (!payloadBase64 || !signatureBase64) return null;

    const key = await getHmacKey();
    const signatureBytes = base64UrlToUint8Array(signatureBase64);
    const dataBytes = new TextEncoder().encode(payloadBase64);

    const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes, dataBytes);
    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(base64UrlToUint8Array(payloadBase64));
    const payload: SessionPayload = JSON.parse(payloadJson);

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error("Session verification error:", err);
    return null;
  }
}
