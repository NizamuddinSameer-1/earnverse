"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { CoinIcon, EvLogo } from "@/components/ui/CoinIcon";
import {
  IconUser,
  IconBolt,
  IconCheck,
  IconArrowRight,
  IconSparkles,
} from "@/components/ui/Icons";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/home");
        router.refresh();
      } else {
        setErrorMsg(data.error || "Failed to register");
      }
    } catch (err) {
      console.error("Registration request error", err);
      setErrorMsg("Network error connecting to registration gateway");
    } finally {
      setIsLoading(false);
    }
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
              OPERATOR ONBOARDING
            </Badge>
            <span className="font-mono text-xs text-text-muted">
              NEW OPERATORS WELCOME
            </span>
          </div>
        </div>

        <Card emphasis="lime">
          <CardHeader>
            <div className="flex items-center gap-2">
              <IconSparkles size={16} className="text-lime-neon" />
              <CardTitle as="h1">INITIALIZE OPERATOR ACCOUNT</CardTitle>
            </div>
            <Badge variant="gold">BONUS ACTIVE</Badge>
          </CardHeader>

          <CardContent className="flex flex-col gap-5 p-6">
            {/* 100 Coin Signup Incentive Callout */}
            <div className="p-3.5 bg-lime-neon/10 border border-lime-neon/30 rounded flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2.5">
                <CoinIcon size={22} />
                <div className="flex flex-col">
                  <span className="text-lime-neon font-bold">100 WELCOME COINS</span>
                  <span className="text-[10px] text-text-muted">Instant credit upon terminal access</span>
                </div>
              </div>
              <Badge variant="lime" size="sm">FREE</Badge>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-crimson-accent/12 border border-crimson-accent/40 rounded flex items-center gap-3 font-mono text-xs text-crimson-accent">
                <IconBolt size={18} strokeWidth={2.5} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-4 font-mono text-xs">
              <Input
                label="Operator Handle (Username)"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. cyber_earner"
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                required
              />

              <Input
                label="Passphrase (Min. 6 Characters)"
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
                {isLoading ? "PROVISIONING VAULT & LEDGER..." : "CLAIM 100 COINS & REGISTER"}
              </Button>
            </form>

            <div className="flex items-center justify-between font-mono text-xs text-text-muted pt-1 border-t border-border-subtle">
              <span>Already registered?</span>
              <Link href="/login" className="text-lime-neon font-bold hover:underline">
                Operator Sign In →
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
