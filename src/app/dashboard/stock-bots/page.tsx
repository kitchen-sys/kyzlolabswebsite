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
import { Plus, Filter, Download, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

const stockBots: BotData[] = [
  {
    id: "s1",
    name: "AAPL Momentum",
    market: "Equities",
    pair: "AAPL",
    status: "running",
    pnl: 2341.5,
    pnlPercent: 8.7,
    tradesCount: 45,
    strategy: "Momentum",
  },
  {
    id: "s2",
    name: "SPY Hedge Bot",
    market: "ETF",
    pair: "SPY",
    status: "running",
    pnl: 1523.22,
    pnlPercent: 4.2,
    tradesCount: 23,
    strategy: "Hedging",
  },
  {
    id: "s3",
    name: "Tech Sector Rotator",
    market: "ETF",
    pair: "QQQ/XLK",
    status: "running",
    pnl: 3102.8,
    pnlPercent: 11.3,
    tradesCount: 67,
    strategy: "Sector Rotation",
  },
  {
    id: "s4",
    name: "NVDA Scalper",
    market: "Equities",
    pair: "NVDA",
    status: "paused",
    pnl: 892.44,
    pnlPercent: 3.1,
    tradesCount: 156,
    strategy: "Scalping",
  },
  {
    id: "s5",
    name: "Dividend Harvester",
    market: "Equities",
    pair: "Multi",
    status: "running",
    pnl: 567.89,
    pnlPercent: 2.4,
    tradesCount: 12,
    strategy: "Dividend Capture",
  },
  {
    id: "s6",
    name: "TSLA Mean Reversion",
    market: "Equities",
    pair: "TSLA",
    status: "stopped",
    pnl: -423.1,
    pnlPercent: -2.1,
    tradesCount: 34,
    strategy: "Mean Reversion",
  },
];

export default function StockBotsPage() {
  const [bots, setBots] = useState(stockBots);

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
        title="Stock & ETF Trading Bots"
        description="Automated strategies for equities and ETFs via Alpaca"
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

      {/* Market Hours Alert */}
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="flex items-center gap-3 py-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="font-medium text-yellow-500">Market Hours Notice</p>
            <p className="text-sm text-muted-foreground">
              US markets are currently closed. Bots will resume trading at 9:30 AM EST.
            </p>
          </div>
        </CardContent>
      </Card>

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
            <div className="text-2xl font-bold">Alpaca</div>
            <p className="text-sm text-muted-foreground">Connected Broker</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cards" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
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
                  <TableHead>Symbol</TableHead>
                  <TableHead>Market</TableHead>
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
                    <TableCell>
                      <Badge variant="outline">{bot.market}</Badge>
                    </TableCell>
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
      </Tabs>
    </div>
  );
}
