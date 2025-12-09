"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { BotCard, BotData } from "@/components/BotCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter, Download, TrendingUp, TrendingDown } from "lucide-react";

const cryptoBots: BotData[] = [
  {
    id: "1",
    name: "BTC Grid Pro",
    market: "Crypto",
    pair: "BTC/USDT",
    status: "running",
    pnl: 4521.3,
    pnlPercent: 15.2,
    tradesCount: 342,
    strategy: "Grid Trading",
  },
  {
    id: "2",
    name: "ETH Momentum Alpha",
    market: "Crypto",
    pair: "ETH/USDT",
    status: "running",
    pnl: 1892.11,
    pnlPercent: 9.4,
    tradesCount: 156,
    strategy: "Momentum",
  },
  {
    id: "3",
    name: "SOL DCA Strategy",
    market: "Crypto",
    pair: "SOL/USDT",
    status: "running",
    pnl: 2103.45,
    pnlPercent: 12.8,
    tradesCount: 89,
    strategy: "DCA",
  },
  {
    id: "4",
    name: "BONK Scalper",
    market: "Crypto",
    pair: "BONK/SOL",
    status: "paused",
    pnl: -234.12,
    pnlPercent: -3.2,
    tradesCount: 421,
    strategy: "Scalping",
  },
  {
    id: "5",
    name: "Jupiter Arb Bot",
    market: "DeFi",
    pair: "Multi-pair",
    status: "running",
    pnl: 876.54,
    pnlPercent: 5.6,
    tradesCount: 67,
    strategy: "Arbitrage",
  },
  {
    id: "6",
    name: "AVAX Mean Reversion",
    market: "Crypto",
    pair: "AVAX/USDT",
    status: "stopped",
    pnl: 0,
    pnlPercent: 0,
    tradesCount: 0,
    strategy: "Mean Reversion",
  },
];

const strategies = [
  { name: "Grid Trading", description: "Buy low, sell high within a price range" },
  { name: "DCA", description: "Dollar cost average over time" },
  { name: "Momentum", description: "Follow price trends" },
  { name: "Arbitrage", description: "Exploit price differences across venues" },
  { name: "Scalping", description: "Quick trades for small profits" },
  { name: "Mean Reversion", description: "Trade back to average prices" },
];

export default function CryptoBotsPage() {
  const [bots, setBots] = useState(cryptoBots);

  const handleToggleBot = (botId: string) => {
    setBots((prev) =>
      prev.map((bot) => {
        if (bot.id === botId) {
          return {
            ...bot,
            status: bot.status === "running" ? "paused" : "running",
          };
        }
        return bot;
      })
    );
  };

  const runningBots = bots.filter((b) => b.status === "running").length;
  const totalPnl = bots.reduce((sum, b) => sum + b.pnl, 0);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Crypto Trading Bots"
        description="Manage your automated cryptocurrency trading strategies"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Strategy
          </Button>
        </div>
      </SectionHeader>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{bots.length}</div>
            <p className="text-sm text-muted-foreground">Total Bots</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-400">{runningBots}</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className={`text-2xl font-bold ${totalPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
              {totalPnl >= 0 ? "+" : ""}${totalPnl.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total P&L</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {bots.reduce((sum, b) => sum + b.tradesCount, 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Trades</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="strategies">Strategy Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map((bot) => (
              <BotCard key={bot.id} bot={bot} onToggle={handleToggleBot} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Pair</TableHead>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-right">Trades</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bots.map((bot) => (
                  <TableRow key={bot.id}>
                    <TableCell className="font-medium">{bot.name}</TableCell>
                    <TableCell>{bot.pair}</TableCell>
                    <TableCell>{bot.strategy}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          bot.status === "running"
                            ? "success"
                            : bot.status === "paused"
                            ? "warning"
                            : "outline"
                        }
                      >
                        {bot.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {bot.pnl >= 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-400" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-400" />
                        )}
                        <span className={bot.pnl >= 0 ? "text-green-400" : "text-red-400"}>
                          {bot.pnl >= 0 ? "+" : ""}${bot.pnl.toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{bot.tradesCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleBot(bot.id)}
                      >
                        {bot.status === "running" ? "Pause" : "Start"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="strategies">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map((strategy) => (
              <Card key={strategy.name} className="hover:border-[var(--accent-neon)]/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{strategy.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{strategy.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
