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

export function useWallet(): UseWalletReturn {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/wallet");

      if (response.status === 401) {
        setError("Unauthorized");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch wallets");
      }

      const data = await response.json();
      setWallets(data.wallets);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch wallets");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectWallet = async (
    chain: string,
    address: string,
    label?: string
  ): Promise<Wallet> => {
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
    await fetchWallets(); // Refetch to get full data
    return newWallet;
  };

  const disconnectWallet = async (walletId: string): Promise<void> => {
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
      change24h: 0, // Not available from DB
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
    error,
    isConnected,
    refetch: fetchWallets,
    connectWallet,
    disconnectWallet,
  };
}
