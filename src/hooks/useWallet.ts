"use client";

import { useState, useEffect, useCallback } from "react";

export interface WalletBalance {
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
  balances: WalletBalance[];
  connectedAccounts: ConnectedAccount[];
  totalValue: number;
  isLoading: boolean;
  error: Error | null;
  isConnected: boolean;
  refetch: () => void;
  connectWallet: (walletType: string) => Promise<void>;
  disconnectWallet: (accountId: string) => Promise<void>;
}

/**
 * Hook to manage wallet connections and balances
 *
 * TODO: Implement real wallet integration
 * - Use @solana/wallet-adapter for Solana wallets
 * - Use wagmi for Ethereum wallets
 * - Call GET /api/wallet for balance data
 * - Implement real-time balance updates via WebSocket
 * - Handle wallet connection/disconnection
 */
export function useWallet(): UseWalletReturn {
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWalletData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Call actual API
      // const response = await fetch('/api/wallet');
      // const data = await response.json();

      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 700));

      const mockBalances: WalletBalance[] = [
        { asset: "Solana", symbol: "SOL", chain: "Solana", balance: 125.45, value: 24505.89, change24h: 3.2 },
        { asset: "USD Coin", symbol: "USDC", chain: "Solana", balance: 15420.0, value: 15420.0, change24h: 0.0 },
        { asset: "Bitcoin", symbol: "BTC", chain: "Binance", balance: 0.85, value: 82892.5, change24h: 1.8 },
        { asset: "Ethereum", symbol: "ETH", chain: "Ethereum", balance: 4.2, value: 15750.0, change24h: -0.5 },
        { asset: "Jupiter", symbol: "JUP", chain: "Solana", balance: 2500.0, value: 2875.0, change24h: 5.4 },
        { asset: "Apple Inc.", symbol: "AAPL", chain: "Alpaca", balance: 50, value: 9425.0, change24h: 0.8 },
      ];

      const mockAccounts: ConnectedAccount[] = [
        { id: "acc_1", type: "exchange", name: "Binance", status: "connected" },
        { id: "acc_2", type: "exchange", name: "Alpaca", status: "connected" },
        {
          id: "acc_3",
          type: "wallet",
          name: "Phantom",
          address: "7xKX...8dY2",
          chain: "Solana",
          status: "connected",
        },
      ];

      setBalances(mockBalances);
      setConnectedAccounts(mockAccounts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch wallet data"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectWallet = async (walletType: string) => {
    // TODO: Implement actual wallet connection
    // For Phantom: use @solana/wallet-adapter
    // For MetaMask: use wagmi or ethers.js

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newAccount: ConnectedAccount = {
      id: "acc_" + Date.now(),
      type: "wallet",
      name: walletType,
      address: "0x..." + Math.random().toString(36).substring(7),
      status: "connected",
    };

    setConnectedAccounts((prev) => [...prev, newAccount]);
  };

  const disconnectWallet = async (accountId: string) => {
    // TODO: Implement actual wallet disconnection
    setConnectedAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
  };

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const totalValue = balances.reduce((sum, b) => sum + b.value, 0);
  const isConnected = connectedAccounts.some((acc) => acc.status === "connected");

  return {
    balances,
    connectedAccounts,
    totalValue,
    isLoading,
    error,
    isConnected,
    refetch: fetchWalletData,
    connectWallet,
    disconnectWallet,
  };
}
