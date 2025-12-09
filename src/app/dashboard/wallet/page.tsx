"use client";

import { SectionHeader } from "@/components/SectionHeader";
import { WalletBalancesTable } from "@/components/WalletBalancesTable";
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
  Loader2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/hooks/useWallet";

export default function WalletPage() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const { wallets, summary, balances, isLoading, error, disconnectWallet } = useWallet();

  const totalValue = summary?.totalValueUsd || 0;
  const solanaValue = balances.filter((b) => b.chain === "Solana").reduce((sum, b) => sum + b.value, 0);
  const tradfiValue = balances.filter((b) => b.chain === "Alpaca").reduce((sum, b) => sum + b.value, 0);

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleDisconnect = async (walletId: string) => {
    try {
      await disconnectWallet(walletId);
    } catch (err) {
      console.error("Failed to disconnect wallet:", err);
    }
  };

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
          trend={{ value: 0, isPositive: true }}
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
          value={wallets.length}
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
          {wallets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No wallets connected yet</p>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Connect Your First Wallet
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {wallets.map((wallet) => (
                <Card key={wallet.id} className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{wallet.label || wallet.chain}</h3>
                        <Badge variant="outline" className="mt-1">
                          {wallet.chain}
                        </Badge>
                      </div>
                      <Badge variant="success">connected</Badge>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground">Value</p>
                      <p className="font-semibold">${wallet.totalValueUsd.toLocaleString()}</p>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-400 hover:text-red-500"
                        onClick={() => handleDisconnect(wallet.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
          {balances.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No balances to display. Connect a wallet to see your assets.</p>
              </CardContent>
            </Card>
          ) : (
            <WalletBalancesTable balances={balances} />
          )}
        </TabsContent>

        <TabsContent value="solana" className="mt-4">
          <WalletBalancesTable
            balances={balances.filter((b) => b.chain === "Solana")}
          />
        </TabsContent>

        <TabsContent value="ethereum" className="mt-4">
          <WalletBalancesTable
            balances={balances.filter((b) => b.chain === "Ethereum")}
          />
        </TabsContent>

        <TabsContent value="tradfi" className="mt-4">
          <WalletBalancesTable
            balances={balances.filter((b) => b.chain === "Alpaca")}
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
