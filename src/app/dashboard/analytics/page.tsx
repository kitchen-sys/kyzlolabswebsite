"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Calendar,
} from "lucide-react";

// Mock chart data - In production, use Recharts or similar
const pnlData = [
  { date: "Nov 1", value: 100000 },
  { date: "Nov 5", value: 102500 },
  { date: "Nov 10", value: 98000 },
  { date: "Nov 15", value: 105000 },
  { date: "Nov 20", value: 112000 },
  { date: "Nov 25", value: 108500 },
  { date: "Nov 30", value: 115000 },
  { date: "Dec 5", value: 127432 },
];

const volumeByVenue = [
  { venue: "Binance", volume: 45230, percentage: 35 },
  { venue: "Jupiter", volume: 32100, percentage: 25 },
  { venue: "Alpaca", volume: 28450, percentage: 22 },
  { venue: "Raydium", volume: 15670, percentage: 12 },
  { venue: "Other", volume: 7550, percentage: 6 },
];

const botPerformance = [
  { name: "BTC Grid Pro", trades: 342, winRate: 68, pnl: 4521.3, sharpe: 1.82 },
  { name: "SOL DCA Strategy", trades: 89, winRate: 72, pnl: 2103.45, sharpe: 2.14 },
  { name: "ETH Momentum", trades: 156, winRate: 58, pnl: 1892.11, sharpe: 1.45 },
  { name: "Tech Sector Rotator", trades: 67, winRate: 64, pnl: 3102.8, sharpe: 1.95 },
  { name: "NVDA Scalper", trades: 156, winRate: 52, pnl: 892.44, sharpe: 0.89 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analytics & Performance"
        description="Track your trading performance and bot metrics"
      >
        <div className="flex gap-2">
          <Select defaultValue="30d">
            <SelectTrigger className="w-32">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </SectionHeader>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Return"
          value="+$27,432"
          icon={TrendingUp}
          trend={{ value: 27.4, isPositive: true }}
          description="Since inception"
        />
        <StatCard
          title="Win Rate"
          value="64.2%"
          icon={Activity}
          description="Across all bots"
        />
        <StatCard
          title="Sharpe Ratio"
          value="1.78"
          icon={BarChart3}
          description="Risk-adjusted return"
        />
        <StatCard
          title="Max Drawdown"
          value="-8.4%"
          icon={TrendingDown}
          description="Peak to trough"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PnL Chart Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Portfolio Value Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Integrate Recharts LineChart */}
            <div className="h-64 flex items-end gap-1 p-4 bg-muted/30 rounded-lg">
              {pnlData.map((point, index) => {
                const maxValue = Math.max(...pnlData.map((p) => p.value));
                const minValue = Math.min(...pnlData.map((p) => p.value));
                const height = ((point.value - minValue) / (maxValue - minValue)) * 100 + 20;
                return (
                  <div key={point.date} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-[var(--accent-neon)] to-[var(--accent-neon)]/50 rounded-t transition-all hover:opacity-80"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground rotate-45 origin-left whitespace-nowrap">
                      {point.date}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 text-sm text-muted-foreground">
              <span>Starting: $100,000</span>
              <span className="text-green-400 font-medium">Current: $127,432 (+27.4%)</span>
            </div>
          </CardContent>
        </Card>

        {/* Volume by Venue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[var(--accent-gold)]" />
              Volume by Venue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {volumeByVenue.map((venue) => (
                <div key={venue.venue} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{venue.venue}</span>
                    <span className="text-muted-foreground">
                      ${venue.volume.toLocaleString()} ({venue.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[var(--accent-neon)] to-[var(--accent-gold)] rounded-full"
                      style={{ width: `${venue.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Win Rate by Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[var(--accent-neon)]" />
              Win Rate Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {botPerformance.map((bot) => (
                <div key={bot.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{bot.name}</span>
                    <span className={bot.winRate >= 60 ? "text-green-400" : "text-muted-foreground"}>
                      {bot.winRate}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        bot.winRate >= 60 ? "bg-green-400" : "bg-yellow-400"
                      }`}
                      style={{ width: `${bot.winRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bot Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bot Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Bots</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
              <TabsTrigger value="defi">DeFi</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Bot Name</th>
                      <th className="text-right py-3 px-4">Trades</th>
                      <th className="text-right py-3 px-4">Win Rate</th>
                      <th className="text-right py-3 px-4">P&L</th>
                      <th className="text-right py-3 px-4">Sharpe Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {botPerformance.map((bot) => (
                      <tr key={bot.name} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{bot.name}</td>
                        <td className="text-right py-3 px-4">{bot.trades}</td>
                        <td className="text-right py-3 px-4">
                          <span className={bot.winRate >= 60 ? "text-green-400" : ""}>
                            {bot.winRate}%
                          </span>
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className={bot.pnl >= 0 ? "text-green-400" : "text-red-400"}>
                            {bot.pnl >= 0 ? "+" : ""}${bot.pnl.toLocaleString()}
                          </span>
                        </td>
                        <td className="text-right py-3 px-4">
                          <span className={bot.sharpe >= 1.5 ? "text-green-400" : ""}>
                            {bot.sharpe}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="crypto" className="mt-4">
              <p className="text-muted-foreground text-center py-8">
                Filter to show crypto bots only
              </p>
            </TabsContent>

            <TabsContent value="stocks" className="mt-4">
              <p className="text-muted-foreground text-center py-8">
                Filter to show stock bots only
              </p>
            </TabsContent>

            <TabsContent value="defi" className="mt-4">
              <p className="text-muted-foreground text-center py-8">
                Filter to show DeFi bots only
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
