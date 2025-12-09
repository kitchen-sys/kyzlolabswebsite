"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

// Mock data for overview
const stats = {
  totalValue: 127432.56,
  totalPnl: 12543.21,
  pnlPercent: 10.92,
  activeBots: 7,
  connectedExchanges: 3,
  totalTrades: 1247,
};

const connectedExchanges = [
  { name: "Binance", status: "connected", balance: "$45,230.12" },
  { name: "Alpaca", status: "connected", balance: "$62,102.44" },
  { name: "Solana (Phantom)", status: "connected", balance: "$20,100.00" },
];

const recentActivity = [
  {
    type: "trade",
    description: "BTC Grid Bot executed buy",
    amount: "+0.025 BTC",
    time: "2 min ago",
    positive: true,
  },
  {
    type: "trade",
    description: "ETH DCA Bot purchased",
    amount: "+0.5 ETH",
    time: "15 min ago",
    positive: true,
  },
  {
    type: "alert",
    description: "SOL price alert triggered",
    amount: "$195.32",
    time: "1 hr ago",
    positive: false,
  },
  {
    type: "trade",
    description: "AAPL momentum bot sold",
    amount: "-10 shares",
    time: "2 hr ago",
    positive: false,
  },
  {
    type: "deposit",
    description: "USDC deposit confirmed",
    amount: "+$5,000.00",
    time: "3 hr ago",
    positive: true,
  },
];

const topPerformers = [
  { name: "BTC Grid Pro", pnl: "+$4,521.30", percent: "+15.2%" },
  { name: "SOL DCA Strategy", pnl: "+$2,103.45", percent: "+12.8%" },
  { name: "ETH Momentum", pnl: "+$1,892.11", percent: "+9.4%" },
];

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dashboard Overview"
        description="Your portfolio performance at a glance"
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
          value={`$${stats.totalValue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: stats.pnlPercent, isPositive: true }}
          description="Across all connected accounts"
        />
        <StatCard
          title="Total P&L (30d)"
          value={`$${stats.totalPnl.toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: stats.pnlPercent, isPositive: true }}
          description="Net profit this month"
        />
        <StatCard
          title="Active Bots"
          value={stats.activeBots}
          icon={Bot}
          description="Executing strategies 24/7"
        />
        <StatCard
          title="Total Trades"
          value={stats.totalTrades.toLocaleString()}
          icon={Activity}
          description="Executed this month"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Exchanges */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Link2 className="w-5 h-5 text-[var(--accent-neon)]" />
              Connected Exchanges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectedExchanges.map((exchange) => (
              <div
                key={exchange.name}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-[var(--accent-gold)]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{exchange.name}</p>
                    <Badge variant="success" className="mt-1">
                      {exchange.status}
                    </Badge>
                  </div>
                </div>
                <p className="font-mono text-sm">{exchange.balance}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">
              + Connect Exchange
            </Button>
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
            {topPerformers.map((bot, index) => (
              <div
                key={bot.name}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent-neon)]/10 flex items-center justify-center text-[var(--accent-neon)] font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="font-medium text-sm">{bot.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-green-400">{bot.pnl}</p>
                  <p className="text-xs text-muted-foreground">{bot.percent}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-2 text-[var(--accent-neon)]">
              View All Bots →
            </Button>
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
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      activity.positive
                        ? "bg-green-400/10 text-green-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {activity.positive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
                <span
                  className={`font-mono text-sm ${
                    activity.positive ? "text-green-400" : "text-muted-foreground"
                  }`}
                >
                  {activity.amount}
                </span>
              </div>
            ))}
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
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Bot className="w-5 h-5" />
              <span>Create Bot</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <ArrowUpRight className="w-5 h-5" />
              <span>Deposit</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <ArrowDownRight className="w-5 h-5" />
              <span>Withdraw</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
