"use client";

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
import { Plus, Filter, Download, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { useBots, Bot } from "@/hooks/useBots";

const strategies = [
  { name: "Grid Trading", description: "Buy low, sell high within a price range" },
  { name: "DCA", description: "Dollar cost average over time" },
  { name: "Momentum", description: "Follow price trends" },
  { name: "Arbitrage", description: "Exploit price differences across venues" },
  { name: "Scalping", description: "Quick trades for small profits" },
  { name: "Mean Reversion", description: "Trade back to average prices" },
];

// Map API bot status to BotCard status
function mapBotStatus(status: Bot["status"]): BotData["status"] {
  switch (status) {
    case "active":
      return "running";
    case "paused":
      return "paused";
    case "inactive":
      return "stopped";
    case "error":
      return "error";
    default:
      return "stopped";
  }
}

// Convert API Bot to BotCard format
function toBotData(bot: Bot): BotData {
  return {
    id: bot.id,
    name: bot.name,
    market: bot.market,
    pair: bot.type, // Using type as pair for display
    status: mapBotStatus(bot.status),
    pnl: bot.pnl,
    pnlPercent: bot.pnlPercent,
    tradesCount: bot.tradesCount,
    strategy: bot.strategy,
  };
}

export default function CryptoBotsPage() {
  const { bots, isLoading, error, toggleBot } = useBots({ type: "crypto" });

  const handleToggleBot = async (botId: string) => {
    try {
      await toggleBot(botId);
    } catch (err) {
      console.error("Failed to toggle bot:", err);
    }
  };

  const botDataList = bots.map(toBotData);
  const runningBots = bots.filter((b) => b.status === "active").length;
  const totalPnl = bots.reduce((sum, b) => sum + b.pnl, 0);
  const totalTrades = bots.reduce((sum, b) => sum + b.tradesCount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

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
              {totalTrades.toLocaleString()}
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
          {botDataList.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No crypto bots configured yet</p>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Bot
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {botDataList.map((bot) => (
                <BotCard key={bot.id} bot={bot} onToggle={handleToggleBot} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                  <TableHead className="text-right">Trades</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {botDataList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No crypto bots configured yet
                    </TableCell>
                  </TableRow>
                ) : (
                  botDataList.map((bot) => (
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
                  ))
                )}
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
