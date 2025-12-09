import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bot,
  TrendingUp,
  Wallet,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Trading Bots",
    description:
      "Deploy sophisticated algorithms across crypto, stocks, and commodities markets with one-click strategies.",
  },
  {
    icon: TrendingUp,
    title: "Multi-Asset Support",
    description:
      "Trade BTC, ETH, SOL, equities, ETFs, gold, oil, and more from a unified dashboard.",
  },
  {
    icon: Wallet,
    title: "DeFi Integration",
    description:
      "Native Solana DEX access. Swap, stake, and provide liquidity directly within the platform.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Track PnL, win rates, drawdowns, and performance metrics with institutional-grade dashboards.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Non-custodial wallet connections, encrypted API keys, and SOC 2 compliant infrastructure.",
  },
  {
    icon: Zap,
    title: "Lightning Execution",
    description:
      "Sub-millisecond order routing to major exchanges including Binance, Alpaca, and Jupiter.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Connect Your Accounts",
    description: "Link your exchange APIs or connect your Phantom wallet for DeFi trading.",
  },
  {
    step: "02",
    title: "Choose Your Strategies",
    description: "Select from pre-built bots or customize your own quant strategies.",
  },
  {
    step: "03",
    title: "Monitor & Optimize",
    description: "Track performance in real-time and let AI optimize your portfolio allocation.",
  },
];

const pricingPlans = [
  {
    name: "Explorer",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with automated trading.",
    features: ["2 Active Bots", "Basic Analytics", "DEX Swaps", "Community Support"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Trader",
    price: "$49",
    period: "/month",
    description: "For serious traders who want more power.",
    features: [
      "Unlimited Bots",
      "Advanced Analytics",
      "Priority Execution",
      "API Access",
      "Email Support",
    ],
    cta: "Start Trial",
    highlighted: true,
  },
  {
    name: "Institution",
    price: "Custom",
    period: "",
    description: "Enterprise-grade solutions for funds and institutions.",
    features: [
      "White-Glove Onboarding",
      "Custom Strategies",
      "Dedicated Infrastructure",
      "24/7 Support",
      "SLA Guarantee",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-neon)] to-[var(--accent-gold)] flex items-center justify-center">
                <span className="text-black font-bold text-sm">K</span>
              </div>
              <span className="text-xl font-bold text-gradient-gold">KYZLO</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">
                How It Works
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
                Pricing
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard/overview">
                <Button size="sm">Launch App</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--accent-gold)]/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-neon)] animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Now supporting Solana DeFi & Jupiter aggregator
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-gradient-neon">Automated Quant Trading</span>
            <br />
            <span className="text-foreground">Across Crypto, DeFi & TradFi</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Deploy institutional-grade trading strategies in minutes. Connect your exchanges,
            choose your bots, and let Kyzlo optimize your portfolio 24/7.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/overview">
              <Button size="lg" className="gap-2">
                Launch Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            {[
              { value: "$2.4B+", label: "Trading Volume" },
              { value: "12,000+", label: "Active Traders" },
              { value: "99.9%", label: "Uptime SLA" },
              { value: "48ms", label: "Avg. Latency" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient-gold">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="text-gradient-neon">Trade Smarter</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From algorithmic bots to DeFi integrations, Kyzlo provides the complete toolkit for
              modern quantitative trading.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:border-[var(--accent-neon)]/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-[var(--accent-neon)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--accent-neon)]/20 transition">
                    <feature.icon className="w-6 h-6 text-[var(--accent-neon)]" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Started in <span className="text-gradient-gold">3 Simple Steps</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From zero to automated trading in under 5 minutes. No coding required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[var(--accent-gold)]/50 to-transparent" />
                )}
                <Card className="relative greek-border">
                  <CardHeader>
                    <div className="text-5xl font-bold text-[var(--accent-gold)]/20 mb-2">
                      {item.step}
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{item.description}</CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, <span className="text-gradient-neon">Transparent Pricing</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.highlighted
                    ? "border-[var(--accent-neon)] neon-glow"
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--accent-neon)] text-black text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[var(--accent-neon)]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-8 md:p-12 border-gradient">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to <span className="text-gradient-gold">Elevate Your Trading</span>?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of traders using Kyzlo to automate their strategies and maximize
              returns across all markets.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Create Free Account
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/auth/wallet-connect">
                <Button variant="gold" size="lg">
                  Connect Wallet
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-[var(--accent-neon)] to-[var(--accent-gold)] flex items-center justify-center">
                <span className="text-black font-bold text-xs">K</span>
              </div>
              <span className="font-semibold text-gradient-gold">KYZLO</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                Docs
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                Support
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 Kyzlo Labs. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
