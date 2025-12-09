"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { SwapBox } from "@/components/SwapBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, Droplets, Zap, ExternalLink } from "lucide-react";

const recentSwaps = [
  {
    id: "1",
    from: "SOL",
    to: "USDC",
    fromAmount: 10.5,
    toAmount: 2051.12,
    time: "2 min ago",
    status: "completed",
    txHash: "4xH2...7kYp",
  },
  {
    id: "2",
    from: "USDC",
    to: "JUP",
    fromAmount: 500,
    toAmount: 434.78,
    time: "15 min ago",
    status: "completed",
    txHash: "8bN3...2mWq",
  },
  {
    id: "3",
    from: "RAY",
    to: "SOL",
    fromAmount: 100,
    toAmount: 2.47,
    time: "1 hr ago",
    status: "completed",
    txHash: "9cP4...5nXr",
  },
  {
    id: "4",
    from: "BONK",
    to: "USDC",
    fromAmount: 10000000,
    toAmount: 300.0,
    time: "3 hr ago",
    status: "completed",
    txHash: "2dQ5...8oYs",
  },
];

const liquidityPools = [
  {
    pair: "SOL/USDC",
    tvl: "$45.2M",
    apr: "12.4%",
    volume24h: "$8.5M",
    yourPosition: "$2,450.00",
  },
  {
    pair: "RAY/SOL",
    tvl: "$12.8M",
    apr: "24.6%",
    volume24h: "$2.1M",
    yourPosition: "$0.00",
  },
  {
    pair: "JUP/USDC",
    tvl: "$28.4M",
    apr: "18.2%",
    volume24h: "$5.3M",
    yourPosition: "$850.00",
  },
  {
    pair: "BONK/SOL",
    tvl: "$5.6M",
    apr: "45.8%",
    volume24h: "$1.8M",
    yourPosition: "$0.00",
  },
];

export default function DexPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Solana DEX"
        description="Swap tokens and manage liquidity via Jupiter aggregator"
      >
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Connected to Mainnet
          </Badge>
        </div>
      </SectionHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Swap Box */}
        <div className="lg:col-span-1">
          <SwapBox />
        </div>

        {/* Stats and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-[var(--accent-neon)]">
                  <Zap className="w-4 h-4" />
                  <span className="text-lg font-bold">Jupiter</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Aggregator</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-lg font-bold">48ms</div>
                <p className="text-xs text-muted-foreground mt-1">Avg. Latency</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-lg font-bold">$12,450</div>
                <p className="text-xs text-muted-foreground mt-1">24h Volume</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-lg font-bold">23</div>
                <p className="text-xs text-muted-foreground mt-1">Swaps Today</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Activity and Pools */}
          <Tabs defaultValue="history">
            <TabsList>
              <TabsTrigger value="history">Swap History</TabsTrigger>
              <TabsTrigger value="pools">Liquidity Pools</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="mt-4">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Swap</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Tx</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSwaps.map((swap) => (
                      <TableRow key={swap.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{swap.from}</span>
                            <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                            <span className="font-medium">{swap.to}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          {swap.fromAmount.toLocaleString()} {swap.from}
                        </TableCell>
                        <TableCell className="font-mono">
                          {swap.toAmount.toLocaleString()} {swap.to}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{swap.time}</TableCell>
                        <TableCell>
                          <Badge variant="success">{swap.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="gap-1">
                            {swap.txHash}
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="pools" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-[var(--accent-neon)]" />
                      Liquidity Pools
                    </CardTitle>
                    <Button size="sm">Add Liquidity</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pool</TableHead>
                        <TableHead>TVL</TableHead>
                        <TableHead>APR</TableHead>
                        <TableHead>24h Volume</TableHead>
                        <TableHead>Your Position</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {liquidityPools.map((pool) => (
                        <TableRow key={pool.pair}>
                          <TableCell className="font-medium">{pool.pair}</TableCell>
                          <TableCell>{pool.tvl}</TableCell>
                          <TableCell className="text-green-400">{pool.apr}</TableCell>
                          <TableCell>{pool.volume24h}</TableCell>
                          <TableCell>{pool.yourPosition}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              {pool.yourPosition === "$0.00" ? "Add" : "Manage"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* DEX Bot Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">DEX Trading Bots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:border-[var(--accent-neon)]/50 transition-colors">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Jupiter Arbitrage</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Capture price differences across Solana DEXs
                </p>
                <Badge variant="success">Active</Badge>
              </CardContent>
            </Card>
            <Card className="hover:border-[var(--accent-neon)]/50 transition-colors">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">LP Auto-Compounder</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Auto-compound LP rewards for maximum yield
                </p>
                <Badge variant="neon">Coming Soon</Badge>
              </CardContent>
            </Card>
            <Card className="hover:border-[var(--accent-neon)]/50 transition-colors">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Token Sniper</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Early entry on new token launches
                </p>
                <Badge variant="neon">Coming Soon</Badge>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
