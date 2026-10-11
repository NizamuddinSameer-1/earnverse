import React from "react";
import Link from "next/link";
import { CoinIcon, EvLogo } from "@/components/ui/CoinIcon";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  IconArrowRight,
  IconBolt,
  IconShield,
  IconWallet,
  IconTrophy,
  IconCheck,
  IconCoins,
  IconCash,
} from "@/components/ui/Icons";

const livePayouts = [
  { user: "@alex_k", amount: "$15.00 USDT", network: "BitLabs", time: "Just now" },
  { user: "@rahul_p", amount: "₹850 via UPI", network: "CPX Research", time: "1m ago" },
  { user: "@sarah_m", amount: "$10.00 PayPal", network: "Torox Games", time: "2m ago" },
  { user: "@crypto_sam", amount: "0.14 LTC", network: "BitLabs", time: "3m ago" },
  { user: "@dev_neha", amount: "₹1,200 via UPI", network: "CPX Research", time: "4m ago" },
  { user: "@jordan_99", amount: "$25.00 Amazon", network: "Daily Streak", time: "5m ago" },
];

const partners = [
  {
    name: "BitLabs",
    badge: "TOP PAYOUTS",
    badgeVariant: "gold" as const,
    desc: "Global verified market research surveys with high completion rates and instant token postbacks.",
    avgRate: "Up to $15.00 / survey",
    rating: "4.9 ★",
  },
  {
    name: "CPX Research",
    badge: "INSTANT MATCH",
    badgeVariant: "cyan" as const,
    desc: "Personalized survey matching algorithm. Even partial completions grant compensation coins.",
    avgRate: "Up to $8.50 / survey",
    rating: "4.8 ★",
  },
  {
    name: "Torox Arcade",
    badge: "MOBILE GAMES",
    badgeVariant: "emerald" as const,
    desc: "Play top iOS and Android games. Earn massive tiered payouts for reaching milestone levels.",
    avgRate: "Up to $65.00 / game",
    rating: "4.9 ★",
  },
  {
    name: "Creator Studio",
    badge: "COMING SOON",
    badgeVariant: "violet" as const,
    desc: "Clip viral podcasts and gaming streams into shorts/reels. Get paid directly by sponsors.",
    avgRate: "Bounties up to $100.00",
    rating: "VIP ONLY",
  },
];

const paymentMethods = [
  { name: "UPI (India)", speed: "Instant", subtext: "GPay, PhonePe, Paytm, BHIM", icon: "🇮🇳" },
  { name: "USDT (Tether)", speed: "5 - 15 Mins", subtext: "TRC20 & BEP20 Networks", icon: "₮" },
  { name: "Litecoin (LTC)", speed: "Instant", subtext: "Ultra-low network transfer fees", icon: "Ł" },
  { name: "PayPal", speed: "12 - 24 Hours", subtext: "Direct USD bank transfer", icon: "💳" },
  { name: "Gift Cards", speed: "Instant Code", subtext: "Amazon, Steam, Google Play", icon: "🎁" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07080B] text-slate-100 selection:bg-amber-400 selection:text-black ambient-glow-bg">
      {/* 1. Glass Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#07080B]/85 backdrop-blur-xl">
        <div className="max-w-[1240px] mx-auto px-6 h-18 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <EvLogo size={36} />
            <div className="flex flex-col">
              <span className="font-grotesk font-bold text-xl tracking-wider text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                EARNVERSE
                <span className="font-mono text-[10px] text-amber-400 uppercase px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 font-semibold tracking-normal">
                  v2.0 LIVE
                </span>
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:block">Next-Gen Earning Hub</span>
            </div>
          </Link>

          {/* Navigation Anchors */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <Link href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="#offerwalls" className="hover:text-white transition-colors">
              Offerwalls
            </Link>
            <Link href="#payouts" className="hover:text-white transition-colors">
              Cashout Rails
            </Link>
            <Link href="/proof" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span>Payment Proof</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/login">
              <Button variant="secondary" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="gold" size="sm" rightIcon={<IconArrowRight size={14} />}>
                Start Earning Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Live Social Proof Marquee Ticker */}
      <div className="border-b border-white/[0.06] bg-black/40 overflow-hidden py-2.5">
        <div className="animate-marquee flex items-center gap-8 text-xs font-mono">
          {livePayouts.concat(livePayouts).map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 shrink-0 px-4 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-semibold">{item.user}</span>
              <span className="text-slate-400">cashed out</span>
              <span className="text-amber-400 font-bold">{item.amount}</span>
              <span className="text-slate-500">via {item.network}</span>
              <span className="text-slate-600">({item.time})</span>
            </div>
          ))}
        </div>
      </div>

      <main>
        {/* 3. Hero Section */}
        <section className="relative pt-18 pb-24 px-6 border-b border-white/[0.06]">
          <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 w-max text-xs text-amber-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <span>1,000 COINS = $1.00 USD • GUARANTEED FLAT PEG</span>
              </div>

              <h1 className="font-grotesk text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Turn Your Screen Time Into{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                  Real Cash & Crypto.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Complete verified market research surveys, play top-rated mobile games, and clip viral content. 
                Get credited in seconds and withdraw directly to <strong className="text-white">UPI, USDT, Litecoin, PayPal, or Gift Cards</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/register">
                  <Button variant="gold" size="lg" rightIcon={<IconArrowRight size={16} />}>
                    Claim 100 Free Coins & Start
                  </Button>
                </Link>
                <Link href="/earn">
                  <Button variant="secondary" size="lg" leftIcon={<IconBolt size={16} className="text-amber-400" />}>
                    Browse Live Offers
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/[0.08] max-w-lg">
                <div>
                  <div className="text-2xl font-grotesk font-bold text-white tabular-nums">$18,450+</div>
                  <div className="text-xs text-slate-400">Total Cash Distributed</div>
                </div>
                <div>
                  <div className="text-2xl font-grotesk font-bold text-emerald-400 tabular-nums">99.4%</div>
                  <div className="text-xs text-slate-400">Instant Settlement</div>
                </div>
                <div>
                  <div className="text-2xl font-grotesk font-bold text-amber-400 tabular-nums">$5.00</div>
                  <div className="text-xs text-slate-400">Minimum Cashout</div>
                </div>
              </div>
            </div>

            {/* Right Hero Column: Interactive 3D Vault Card */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-75" />
              <Card emphasis="gold" className="relative p-6 bg-[#0E131E]/90 border-white/[0.12] shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                      <CoinIcon size={22} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-mono">YOUR REWARD BALANCE</div>
                      <div className="text-2xl font-bold font-grotesk text-white tabular-nums flex items-baseline gap-2">
                        14,280 <span className="text-amber-400 text-sm font-semibold">Coins</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="emerald" dot>
                    $14.28 USD
                  </Badge>
                </div>

                {/* Instant Offer Preview */}
                <div className="py-4 flex flex-col gap-3">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>HOT OFFERS READY TODAY</span>
                    <span className="text-amber-400 font-mono text-[11px]">2.5X BOOST ACTIVE</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-amber-400/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs">
                        BL
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Global Fintech Study</div>
                        <div className="text-[11px] text-slate-400">BitLabs • 8 mins</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-amber-400 tabular-nums">+1,450 Coins</div>
                      <div className="text-[11px] text-slate-400">$1.45 USD</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-emerald-400/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        CPX
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Consumer Lifestyle Poll</div>
                        <div className="text-[11px] text-slate-400">CPX Research • 12 mins</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400 tabular-nums">+2,200 Coins</div>
                      <div className="text-[11px] text-slate-400">$2.20 USD</div>
                    </div>
                  </div>
                </div>

                {/* Cashout Ready Bar */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Threshold: <span className="text-white font-bold">$14.28 / $5.00</span> (Ready to Cashout)
                  </div>
                  <Link href="/register">
                    <Button variant="emerald" size="sm">
                      Withdraw Now
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. How It Works Section */}
        <section id="how-it-works" className="py-20 px-6 border-b border-white/[0.06] bg-[#090C12]/50">
          <div className="max-w-[1240px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <Badge variant="gold" className="mb-3">
                SIMPLE 3-STEP JOURNEY
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-grotesk font-bold text-white mb-4">
                How You Earn & Cash Out On EarnVerse
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Zero complicated crypto gas fees. No point devaluation. Every task directly pays coins pegged 1,000:1 to US Dollars.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 relative group hover:border-amber-400/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-xl mb-5 group-hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-xl font-bold font-grotesk text-white mb-2">Pick an Offer or Survey</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Choose from hundreds of market research surveys, viral clipping bounties, and top mobile games suited to your interests.
                </p>
              </Card>

              <Card className="p-6 relative group hover:border-cyan-400/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 font-bold text-xl mb-5 group-hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-xl font-bold font-grotesk text-white mb-2">Complete in 5–15 Minutes</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Finish survey questions or reach milestone levels. Our server-to-server postback system credits your wallet immediately upon completion.
                </p>
              </Card>

              <Card className="p-6 relative group hover:border-emerald-400/40 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold text-xl mb-5 group-hover:scale-110 transition-transform">
                  3
                </div>
                <h3 className="text-xl font-bold font-grotesk text-white mb-2">Instant Real-World Cashout</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Reach just $5.00 (5,000 coins) and withdraw your money to UPI, USDT, Litecoin, PayPal, or digital gift cards with zero hidden deductions.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* 5. Integrated Offerwalls Showcase */}
        <section id="offerwalls" className="py-20 px-6 border-b border-white/[0.06]">
          <div className="max-w-[1240px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <Badge variant="cyan" className="mb-3">
                  INTEGRATED NETWORKS
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-grotesk font-bold text-white">
                  World-Class Offerwall Providers
                </h2>
              </div>
              <p className="text-slate-400 text-sm max-w-md">
                Direct API partnerships with premier survey networks guaranteeing the highest publisher payout rates globally.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {partners.map((partner, idx) => (
                <Card key={idx} className="p-5 flex flex-col justify-between hover:border-white/[0.2] transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-lg text-white font-grotesk">{partner.name}</span>
                      <Badge variant={partner.badgeVariant} size="sm">
                        {partner.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">{partner.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-semibold">{partner.avgRate}</span>
                    <span className="text-slate-400">{partner.rating}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Payment & Cashout Rails */}
        <section id="payouts" className="py-20 px-6 border-b border-white/[0.06] bg-[#090C12]/50">
          <div className="max-w-[1240px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <Badge variant="emerald" className="mb-3">
                FAST CASHOUT RAILS
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-grotesk font-bold text-white mb-4">
                How You Get Paid
              </h2>
              <p className="text-slate-400 text-sm">
                We support direct local currency transfers and Web3 digital assets so you can cash out anywhere in the world.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {paymentMethods.map((pay, idx) => (
                <Card key={idx} className="p-5 text-center flex flex-col items-center justify-between hover:border-emerald-400/30 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl mb-3">
                    {pay.icon}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white mb-1 font-grotesk">{pay.name}</div>
                    <div className="text-[11px] text-slate-400 leading-tight mb-3">{pay.subtext}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold">
                    {pay.speed}
                  </span>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Bottom Final Conversion Call-to-Action */}
        <section className="py-24 px-6 text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <CoinIcon size={32} />
            </div>
            <h2 className="text-3xl sm:text-5xl font-grotesk font-bold text-white leading-tight">
              Ready to Start Earning Today?
            </h2>
            <p className="text-slate-400 text-base max-w-xl">
              Join thousands of active earners on EarnVerse. Sign up in 30 seconds and receive a 100 Coin welcome bonus immediately.
            </p>
            <Link href="/register">
              <Button variant="gold" size="lg" rightIcon={<IconArrowRight size={18} />}>
                Create Free Account & Claim 100 Coins
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* 8. Footer */}
      <footer className="border-t border-white/[0.08] bg-[#050608] py-12 px-6 text-xs text-slate-500">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <EvLogo size={28} />
            <span className="font-grotesk font-bold text-white tracking-wider">EARNVERSE</span>
            <span className="text-slate-600">|</span>
            <span>© 2026 EarnVerse Global Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/proof" className="hover:text-white transition-colors">
              Proof Ledger
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Member Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
