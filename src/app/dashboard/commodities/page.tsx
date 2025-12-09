"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Coins, Droplets, Wheat, Diamond } from "lucide-react";

interface Commodity {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  icon: React.ReactNode;
  category: string;
}

const commodities: Commodity[] = [
  {
    name: "Gold",
    symbol: "GLD",
    price: 2024.5,
    change24h: 12.3,
    changePercent: 0.61,
    high24h: 2030.2,
    low24h: 2010.8,
    icon: <Coins className="w-5 h-5 text-yellow-400" />,
    category: "Precious Metals",
  },
  {
    name: "Silver",
    symbol: "SLV",
    price: 23.45,
    change24h: -0.32,
    changePercent: -1.35,
    high24h: 23.89,
    low24h: 23.21,
    icon: <Coins className="w-5 h-5 text-gray-400" />,
    category: "Precious Metals",
  },
  {
    name: "Crude Oil (WTI)",
    symbol: "USO",
    price: 78.23,
    change24h: 1.45,
    changePercent: 1.89,
    high24h: 79.1,
    low24h: 76.54,
    icon: <Droplets className="w-5 h-5 text-amber-600" />,
    category: "Energy",
  },
  {
    name: "Natural Gas",
    symbol: "UNG",
    price: 2.87,
    change24h: -0.08,
    changePercent: -2.71,
    high24h: 2.98,
    low24h: 2.83,
    icon: <Droplets className="w-5 h-5 text-blue-400" />,
    category: "Energy",
  },
  {
    name: "Corn",
    symbol: "CORN",
    price: 485.25,
    change24h: 3.5,
    changePercent: 0.73,
    high24h: 488.0,
    low24h: 481.0,
    icon: <Wheat className="w-5 h-5 text-yellow-500" />,
    category: "Agriculture",
  },
  {
    name: "Wheat",
    symbol: "WEAT",
    price: 612.75,
    change24h: -5.25,
    changePercent: -0.85,
    high24h: 620.0,
    low24h: 610.5,
    icon: <Wheat className="w-5 h-5 text-amber-400" />,
    category: "Agriculture",
  },
  {
    name: "Copper",
    symbol: "CPER",
    price: 3.82,
    change24h: 0.05,
    changePercent: 1.32,
    high24h: 3.85,
    low24h: 3.76,
    icon: <Diamond className="w-5 h-5 text-orange-400" />,
    category: "Industrial Metals",
  },
  {
    name: "Platinum",
    symbol: "PPLT",
    price: 912.4,
    change24h: 8.2,
    changePercent: 0.91,
    high24h: 918.0,
    low24h: 902.5,
    icon: <Coins className="w-5 h-5 text-slate-300" />,
    category: "Precious Metals",
  },
];

export default function CommoditiesPage() {
  const categories = Array.from(new Set(commodities.map((c) => c.category)));

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Commodities"
        description="Track and trade commodity ETFs and futures"
      >
        <Button variant="outline">View Watchlist</Button>
      </SectionHeader>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Gold (GLD)"
          value={`$${commodities[0].price.toLocaleString()}`}
          icon={Coins}
          trend={{ value: commodities[0].changePercent, isPositive: commodities[0].change24h >= 0 }}
        />
        <StatCard
          title="Crude Oil (USO)"
          value={`$${commodities[2].price.toFixed(2)}`}
          icon={Droplets}
          trend={{ value: commodities[2].changePercent, isPositive: commodities[2].change24h >= 0 }}
        />
        <StatCard
          title="Active Positions"
          value="3"
          description="GLD, USO, CORN"
        />
        <StatCard
          title="Portfolio Exposure"
          value="12.4%"
          description="Of total account value"
        />
      </div>

      {/* Commodities by Category */}
      {categories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {commodities
                .filter((c) => c.category === category)
                .map((commodity) => (
                  <Card
                    key={commodity.symbol}
                    className="hover:border-[var(--accent-gold)]/50 transition-colors cursor-pointer"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            {commodity.icon}
                          </div>
                          <div>
                            <p className="font-medium">{commodity.name}</p>
                            <p className="text-sm text-muted-foreground">{commodity.symbol}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-bold">${commodity.price.toLocaleString()}</span>
                          <div className="flex items-center gap-1">
                            {commodity.change24h >= 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-400" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-400" />
                            )}
                            <span
                              className={`text-sm font-medium ${
                                commodity.change24h >= 0 ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              {commodity.change24h >= 0 ? "+" : ""}
                              {commodity.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>24h Low: ${commodity.low24h.toLocaleString()}</span>
                          <span>24h High: ${commodity.high24h.toLocaleString()}</span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Buy
                          </Button>
                          <Button variant="ghost" size="sm" className="flex-1">
                            Sell
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Bot Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Commodity Bot Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="hover:border-[var(--accent-neon)]/50 transition-colors">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Gold Accumulator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  DCA into gold during market volatility
                </p>
                <Badge variant="neon">Coming Soon</Badge>
              </CardContent>
            </Card>
            <Card className="hover:border-[var(--accent-neon)]/50 transition-colors">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Oil Mean Reversion</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Trade crude oil range-bound patterns
                </p>
                <Badge variant="neon">Coming Soon</Badge>
              </CardContent>
            </Card>
            <Card className="hover:border-[var(--accent-neon)]/50 transition-colors">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Ag Seasonal Bot</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Trade agricultural commodities based on seasonal patterns
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
