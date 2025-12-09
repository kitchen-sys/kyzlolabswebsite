"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { WalletBalancesTable, WalletBalance } from "@/components/WalletBalancesTable";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Link2,
  ExternalLink,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

const walletBalances: WalletBalance[] = [
  { asset: "Solana", symbol: "SOL", chain: "Solana", balance: 125.45, value: 24505.89, change24h: 3.2, icon: "◎" },
  { asset: "USD Coin", symbol: "USDC", chain: "Solana", balance: 15420.0, value: 15420.0, change24h: 0.0, icon: "$" },
  { asset: "Bitcoin", symbol: "BTC", chain: "Ethereum", balance: 0.85, value: 82892.5, change24h: 1.8, icon: "₿" },
  { asset: "Ethereum", symbol: "ETH", chain: "Ethereum", balance: 4.2, value: 15750.0, change24h: -0.5, icon: "Ξ" },
  { asset: "Jupiter", symbol: "JUP", chain: "Solana", balance: 2500.0, value: 2875.0, change24h: 5.4, icon: "♃" },
  { asset: "Raydium", symbol: "RAY", chain: "Solana", balance: 450.0, value: 2169.0, change24h: -2.1, icon: "☀" },
  { asset: "Apple Inc.", symbol: "AAPL", chain: "Alpaca", balance: 50, value: 9425.0, change24h: 0.8, icon: "" },
  { asset: "NVIDIA Corp.", symbol: "NVDA", chain: "Alpaca", balance: 25, value: 32500.0, change24h: 2.3, icon: "◆" },
];

const connectedWallets = [
  {
    name: "Phantom",
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    chain: "Solana",
    status: "connected",
  },
  {
    name: "MetaMask",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8dE2b",
    chain: "Ethereum",
    status: "connected",
  },
  {
    name: "Alpaca",
    address: "PKXXXXX...XXX",
    chain: "TradFi",
    status: "connected",
  },
];

export default function WalletPage() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const totalValue = walletBalances.reduce((sum, b) => sum + b.value, 0);
  const solanaValue = walletBalances.filter((b) => b.chain === "Solana").reduce((sum, b) => sum + b.value, 0);
  const tradfiValue = walletBalances.filter((b) => b.chain === "Alpaca").reduce((sum, b) => sum + b.value, 0);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Wallet & Balances"
        description="Manage your connected accounts and view balances"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ArrowDownRight className="w-4 h-4 mr-2" />
            Deposit
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </SectionHeader>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Portfolio Value"
          value={`$${totalValue.toLocaleString()}`}
          icon={Wallet}
          trend={{ value: 2.4, isPositive: true }}
        />
        <StatCard
          title="Solana Assets"
          value={`$${solanaValue.toLocaleString()}`}
          description="DeFi holdings"
        />
        <StatCard
          title="TradFi Assets"
          value={`$${tradfiValue.toLocaleString()}`}
          description="Stocks via Alpaca"
        />
        <StatCard
          title="Connected Wallets"
          value={connectedWallets.length}
          description="Across all chains"
        />
      </div>

      {/* Connected Wallets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Link2 className="w-5 h-5 text-[var(--accent-neon)]" />
              Connected Accounts
            </CardTitle>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {connectedWallets.map((wallet) => (
              <Card key={wallet.address} className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{wallet.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        {wallet.chain}
                      </Badge>
                    </div>
                    <Badge variant="success">{wallet.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-muted-foreground flex-1 truncate">
                      {wallet.address}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopyAddress(wallet.address)}
                    >
                      {copiedAddress === wallet.address ? (
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Balances */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="solana">Solana</TabsTrigger>
          <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
          <TabsTrigger value="tradfi">TradFi</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <WalletBalancesTable balances={walletBalances} />
        </TabsContent>

        <TabsContent value="solana" className="mt-4">
          <WalletBalancesTable
            balances={walletBalances.filter((b) => b.chain === "Solana")}
          />
        </TabsContent>

        <TabsContent value="ethereum" className="mt-4">
          <WalletBalancesTable
            balances={walletBalances.filter((b) => b.chain === "Ethereum")}
          />
        </TabsContent>

        <TabsContent value="tradfi" className="mt-4">
          <WalletBalancesTable
            balances={walletBalances.filter((b) => b.chain === "Alpaca")}
          />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex-col gap-1">
              <span className="text-lg">🔗</span>
              <span className="text-xs">Connect Phantom</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-1">
              <span className="text-lg">🦊</span>
              <span className="text-xs">Connect MetaMask</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-1">
              <span className="text-lg">🦙</span>
              <span className="text-xs">Connect Alpaca</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-1">
              <span className="text-lg">🔐</span>
              <span className="text-xs">Connect Ledger</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
