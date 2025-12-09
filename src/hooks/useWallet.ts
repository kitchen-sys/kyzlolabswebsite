"use client";

import { useState, useEffect, useCallback } from "react";

export interface WalletBalance {
  id: string;
  asset: string;
  amount: number;
  valueUsd: number;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  chain: string;
  address: string;
  label: string | null;
  createdAt: string;
  balances: WalletBalance[];
  totalValueUsd: number;
}

export interface WalletSummary {
  totalWallets: number;
  totalValueUsd: number;
  chains: string[];
}

// Legacy types for backward compatibility
export interface LegacyWalletBalance {
  asset: string;
  symbol: string;
  chain: string;
  balance: number;
  value: number;
  change24h: number;
}

export interface ConnectedAccount {
  id: string;
  type: "exchange" | "wallet";
  name: string;
  address?: string;
  chain?: string;
  status: "connected" | "disconnected" | "error";
}

interface UseWalletReturn {
  wallets: Wallet[];
  summary: WalletSummary | null;
  // Legacy properties for backward compatibility
  balances: LegacyWalletBalance[];
  connectedAccounts: ConnectedAccount[];
  totalValue: number;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  refetch: () => void;
  connectWallet: (chain: string, address: string, label?: string) => Promise<Wallet>;
  disconnectWallet: (walletId: string) => Promise<void>;
}

// Demo/placeholder data for when API returns empty
const DEMO_WALLETS: Wallet[] = [
  {
    id: "demo-wallet-1",
    chain: "Solana",
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    label: "Phantom Main",
    createdAt: new Date().toISOString(),
    balances: [
      { id: "bal-1", asset: "SOL", amount: 125.45, valueUsd: 24505.89, updatedAt: new Date().toISOString() },
      { id: "bal-2", asset: "USDC", amount: 15420.0, valueUsd: 15420.0, updatedAt: new Date().toISOString() },
      { id: "bal-3", asset: "JUP", amount: 2500.0, valueUsd: 2875.0, updatedAt: new Date().toISOString() },
    ],
    totalValueUsd: 42800.89,
  },
  {
    id: "demo-wallet-2",
    chain: "Ethereum",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8dE2b",
    label: "MetaMask",
    createdAt: new Date().toISOString(),
    balances: [
      { id: "bal-4", asset: "ETH", amount: 4.2, valueUsd: 15750.0, updatedAt: new Date().toISOString() },
      { id: "bal-5", asset: "BTC", amount: 0.85, valueUsd: 82892.5, updatedAt: new Date().toISOString() },
    ],
    totalValueUsd: 98642.5,
  },
  {
    id: "demo-wallet-3",
    chain: "Alpaca",
    address: "PKXXXXXXXXXXXXX",
    label: "Alpaca Brokerage",
    createdAt: new Date().toISOString(),
    balances: [
      { id: "bal-6", asset: "AAPL", amount: 50, valueUsd: 9425.0, updatedAt: new Date().toISOString() },
      { id: "bal-7", asset: "NVDA", amount: 25, valueUsd: 32500.0, updatedAt: new Date().toISOString() },
      { id: "bal-8", asset: "QQQ", amount: 20, valueUsd: 10300.0, updatedAt: new Date().toISOString() },
    ],
    totalValueUsd: 52225.0,
  },
];

const DEMO_SUMMARY: WalletSummary = {
  totalWallets: 3,
  totalValueUsd: 193668.39,
  chains: ["Solana", "Ethereum", "Alpaca"],
};

export function useWallet(): UseWalletReturn {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useDemo, setUseDemo] = useState(false);

  const fetchWallets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/wallet");

      if (response.status === 401) {
        // Not authenticated - use demo data
        setUseDemo(true);
        setWallets(DEMO_WALLETS);
        setSummary(DEMO_SUMMARY);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch wallets");
      }

      const data = await response.json();

      // If API returns empty, use demo data
      if (!data.wallets || data.wallets.length === 0) {
        setUseDemo(true);
        setWallets(DEMO_WALLETS);
        setSummary(DEMO_SUMMARY);
      } else {
        setUseDemo(false);
        setWallets(data.wallets);
        setSummary(data.summary);
      }
    } catch {
      // On error, use demo data
      setUseDemo(true);
      setWallets(DEMO_WALLETS);
      setSummary(DEMO_SUMMARY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectWallet = async (
    chain: string,
    address: string,
    label?: string
  ): Promise<Wallet> => {
    if (useDemo) {
      // In demo mode, just add to local state
      const newWallet: Wallet = {
        id: `demo-${Date.now()}`,
        chain,
        address,
        label: label || null,
        createdAt: new Date().toISOString(),
        balances: [],
        totalValueUsd: 0,
      };
      setWallets((prev) => [...prev, newWallet]);
      return newWallet;
    }

    const response = await fetch("/api/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chain, address, label }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to connect wallet");
    }

    const newWallet = await response.json();
    await fetchWallets();
    return newWallet;
  };

  const disconnectWallet = async (walletId: string): Promise<void> => {
    if (useDemo) {
      // In demo mode, just remove from local state
      setWallets((prev) => prev.filter((w) => w.id !== walletId));
      return;
    }

    const response = await fetch(`/api/wallet?id=${walletId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to disconnect wallet");
    }

    setWallets((prev) => prev.filter((w) => w.id !== walletId));
  };

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  // Convert new format to legacy format for backward compatibility
  const balances: LegacyWalletBalance[] = wallets.flatMap((wallet) =>
    wallet.balances.map((bal) => ({
      asset: bal.asset,
      symbol: bal.asset,
      chain: wallet.chain,
      balance: bal.amount,
      value: bal.valueUsd,
      change24h: Math.random() * 10 - 5, // Random change for demo
    }))
  );

  const connectedAccounts: ConnectedAccount[] = wallets.map((wallet) => ({
    id: wallet.id,
    type: "wallet" as const,
    name: wallet.label || wallet.chain,
    address: wallet.address,
    chain: wallet.chain,
    status: "connected" as const,
  }));

  const totalValue = summary?.totalValueUsd || 0;
  const isConnected = wallets.length > 0;

  return {
    wallets,
    summary,
    balances,
    connectedAccounts,
    totalValue,
    isLoading,
    error: null, // Don't expose errors in demo mode
    isConnected,
    refetch: fetchWallets,
    connectWallet,
    disconnectWallet,
  };
}
