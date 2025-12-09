"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useBots } from "@/hooks/useBots";
import { useWallet } from "@/hooks/useWallet";
import {
  DollarSign,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet,
  Activity,
  Link2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function OverviewPage() {
  const { user, isLoading: userLoading } = useUser();
  const { bots, isLoading: botsLoading } = useBots();
  const { wallets, summary, isLoading: walletLoading } = useWallet();

  const isLoading = userLoading || botsLoading || walletLoading;

  // Calculate stats from real data
  const activeBots = bots.filter((b) => b.status === "active").length;
  const totalPnl = bots.reduce((sum, b) => sum + b.pnl, 0);
  const totalTrades = bots.reduce((sum, b) => sum + b.tradesCount, 0);
  const totalValue = summary?.totalValueUsd || 0;

  // Get top performers
  const topPerformers = [...bots]
    .sort((a, b) => b.pnl - a.pnl)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard Overview"
        description={`Welcome back, ${user?.name || user?.email || "Trader"}`}
      >
        <Button variant="outline" className="gap-2">
          <ExternalLink className="w-4 h-4" />
          Export Report
        </Button>
      </SectionHeader>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Account Value"
          value={`$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend={totalValue > 0 ? { value: 2.4, isPositive: true } : undefined}
          description="Across all connected accounts"
        />
        <StatCard
          title="Total P&L"
          value={`${totalPnl >= 0 ? "+" : ""}$${totalPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingUp}
          trend={totalPnl !== 0 ? { value: Math.abs(totalPnl / 100), isPositive: totalPnl >= 0 } : undefined}
          description="Net profit from bots"
        />
        <StatCard
          title="Active Bots"
          value={activeBots}
          icon={Bot}
          description={`${bots.length} total bots`}
        />
        <StatCard
          title="Total Trades"
          value={totalTrades.toLocaleString()}
          icon={Activity}
          description="Executed by bots"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Wallets */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="w-5 h-5 text-[var(--accent-neon)]" />
              Connected Wallets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wallets.length === 0 ? (
              <p className="text-sm text-muted-foreground">No wallets connected yet.</p>
            ) : (
              wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-[var(--accent-gold)]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{wallet.label || wallet.chain}</p>
                      <Badge variant="success" className="mt-1">
                        connected
                      </Badge>
                    </div>
                  </div>
                  <p className="font-mono text-sm">
                    ${wallet.totalValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              ))
            )}
            <Link href="/dashboard/wallet">
              <Button variant="outline" className="w-full mt-2">
                + Connect Wallet
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No bots yet.</p>
            ) : (
              topPerformers.map((bot, index) => (
                <div
                  key={bot.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--accent-neon)]/10 flex items-center justify-center text-[var(--accent-neon)] font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="font-medium text-sm">{bot.name}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-mono text-sm ${bot.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {bot.pnl >= 0 ? "+" : ""}${bot.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">{bot.market}</p>
                  </div>
                </div>
              ))
            )}
            <Link href="/dashboard/crypto-bots">
              <Button variant="ghost" className="w-full mt-2 text-[var(--accent-neon)]">
                View All Bots →
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-[var(--accent-gold)]" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bots.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              bots.slice(0, 5).map((bot) => (
                <div
                  key={bot.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        bot.status === "active"
                          ? "bg-green-400/10 text-green-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {bot.status === "active" ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm">{bot.name}</p>
                      <p className="text-xs text-muted-foreground">{bot.strategy}</p>
                    </div>
                  </div>
                  <Badge variant={bot.status === "active" ? "success" : "outline"}>
                    {bot.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/crypto-bots">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <Bot className="w-5 h-5" />
                <span>Create Bot</span>
              </Button>
            </Link>
            <Link href="/dashboard/wallet">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <ArrowUpRight className="w-5 h-5" />
                <span>Deposit</span>
              </Button>
            </Link>
            <Link href="/dashboard/wallet">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <ArrowDownRight className="w-5 h-5" />
                <span>Withdraw</span>
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="outline" className="w-full h-20 flex-col gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>View Analytics</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
