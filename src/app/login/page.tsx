"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  IconLock,
  IconUser,
  IconBolt,
  IconShield,
  IconCheck,
  IconArrowRight,
} from "@/components/ui/Icons";
import { EvLogo } from "@/components/ui/CoinIcon";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";
  const reason = searchParams.get("reason");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    reason === "admin_required"
      ? "SuperAdmin privileges required. Please sign in with an administrator account."
      : null
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.user.role === "ADMIN") {
          router.push(callbackUrl.startsWith("/admin") ? callbackUrl : "/admin");
        } else {
          router.push(callbackUrl.startsWith("/admin") ? "/home" : callbackUrl);
        }
        router.refresh();
      } else {
        setErrorMsg(data.error || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login request error", err);
      setErrorMsg("Network error connecting to EarnVerse Auth gateway");
    } finally {
      setIsLoading(false);
    }
  };

  const autofillAdmin = () => {
    setIdentifier("admin");
    setPassword("AdminPassword123!");
    setErrorMsg(null);
  };

  const autofillEarner = () => {
    setIdentifier("cryptoking");
    setPassword("Password123!");
    setErrorMsg(null);
  };

  return (
    <main className="min-h-screen bg-surface-lowest flex items-center justify-center p-4 relative select-none">
      <div className="w-full max-w-md flex flex-col gap-6 relative z-10">
        {/* Brand Banner */}
        <div className="flex flex-col items-center text-center gap-2">
          <Link href="/home" className="flex items-center gap-2.5 group">
            <EvLogo size={36} />
            <span className="font-grotesk text-2xl font-bold tracking-tight text-text-primary">
              EARN<span className="text-lime-neon">VERSE</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="lime" dot>
              GATEWAY SECURE
            </Badge>
            <span className="font-mono text-xs text-text-muted">
              ARCADE IDENTITY TERMINAL
            </span>
          </div>
        </div>

        <Card emphasis="lime">
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconLock size={16} className="text-lime-neon" />
              <CardTitle as="h1">OPERATOR AUTHENTICATION</CardTitle>
            </div>
            <Badge variant="gold">RBAC V2</Badge>
          </CardHeader>

          <CardContent className="flex flex-col gap-5 p-6">
            {errorMsg && (
              <div className="p-3.5 bg-crimson-accent/12 border border-crimson-accent/40 rounded flex items-center gap-3 font-mono text-xs text-crimson-accent">
                <IconBolt size={18} strokeWidth={2.5} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4 font-mono text-xs">
              <Input
                label="Username or Operator Email"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin / cryptoking@earnverse.io"
                required
              />

              <Input
                label="Passphrase"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />

              <Button
                type="submit"
                variant="neon"
                size="lg"
                disabled={isLoading}
                rightIcon={<IconArrowRight size={16} strokeWidth={2.5} />}
                className="w-full mt-2 font-bold"
              >
                {isLoading ? "AUTHENTICATING TELEMETRY..." : "ACCESS TERMINAL"}
              </Button>
            </form>

            {/* Quick Demo Autofill Switcher */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
              <span className="font-mono text-[10px] uppercase text-text-dim tracking-wider text-center">
                Instant 1-Click Demo Credentials
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={autofillAdmin}
                  className="p-2 rounded bg-surface-card border border-border-dark hover:border-crimson-accent/60 text-text-primary font-mono text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
                >
                  <IconShield size={13} className="text-crimson-accent group-hover:scale-110 transition-transform" />
                  <span>Admin (@admin)</span>
                </button>

                <button
                  type="button"
                  onClick={autofillEarner}
                  className="p-2 rounded bg-surface-card border border-border-dark hover:border-lime-neon/60 text-text-primary font-mono text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer group"
                >
                  <IconBolt size={13} className="text-lime-neon group-hover:scale-110 transition-transform" />
                  <span>Earner (@cryptoking)</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between font-mono text-xs text-text-muted pt-1 border-t border-border-subtle">
              <span>New to EarnVerse?</span>
              <Link
                href="/register"
                className="text-lime-neon font-bold hover:underline"
              >
                Create Account (+100 Coins) →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-lowest flex items-center justify-center font-mono text-lime-neon">Loading Terminal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
