"use client";

import { useState, useEffect, useCallback } from "react";

export interface PriceData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  lastUpdated: string;
}

interface UsePricesOptions {
  symbols?: string[];
  refreshInterval?: number; // in milliseconds
}

interface UsePricesReturn {
  prices: Record<string, PriceData>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  getPrice: (symbol: string) => PriceData | null;
}

// Mock price data generator
const generateMockPrice = (symbol: string, basePrice: number, volatility: number): PriceData => {
  const change = (Math.random() - 0.5) * volatility * basePrice;
  const price = basePrice + change;
  const changePercent = (change / basePrice) * 100;

  return {
    symbol,
    name: symbol,
    price,
    change24h: change,
    changePercent24h: changePercent,
    high24h: price * 1.02,
    low24h: price * 0.98,
    volume24h: Math.random() * 1000000000,
    lastUpdated: new Date().toISOString(),
  };
};

const basePrices: Record<string, { name: string; price: number; volatility: number }> = {
  BTC: { name: "Bitcoin", price: 97500, volatility: 0.03 },
  ETH: { name: "Ethereum", price: 3750, volatility: 0.04 },
  SOL: { name: "Solana", price: 195, volatility: 0.05 },
  JUP: { name: "Jupiter", price: 1.15, volatility: 0.08 },
  RAY: { name: "Raydium", price: 4.82, volatility: 0.07 },
  BONK: { name: "Bonk", price: 0.00003, volatility: 0.15 },
  GLD: { name: "Gold ETF", price: 2024, volatility: 0.01 },
  USO: { name: "Oil ETF", price: 78, volatility: 0.03 },
  AAPL: { name: "Apple Inc.", price: 188.5, volatility: 0.02 },
  NVDA: { name: "NVIDIA", price: 1300, volatility: 0.04 },
  SPY: { name: "S&P 500 ETF", price: 595, volatility: 0.01 },
  QQQ: { name: "Nasdaq 100 ETF", price: 515, volatility: 0.015 },
};

/**
 * Hook to fetch and subscribe to price data
 *
 * TODO: Implement real price feeds
 * - Connect to exchange WebSockets for real-time prices
 * - Use CoinGecko/CoinMarketCap API for crypto prices
 * - Use Alpaca API for stock prices
 * - Implement price caching and batching
 * - Handle reconnection on WebSocket disconnect
 */
export function usePrices(options?: UsePricesOptions): UsePricesReturn {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const symbols = options?.symbols || Object.keys(basePrices);
  const refreshInterval = options?.refreshInterval || 30000; // Default 30 seconds

  const fetchPrices = useCallback(async () => {
    try {
      // TODO: Call actual price API
      // const response = await fetch(`/api/prices?symbols=${symbols.join(',')}`);
      // const data = await response.json();

      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newPrices: Record<string, PriceData> = {};
      symbols.forEach((symbol) => {
        const base = basePrices[symbol];
        if (base) {
          const priceData = generateMockPrice(symbol, base.price, base.volatility);
          priceData.name = base.name;
          newPrices[symbol] = priceData;
        }
      });

      setPrices(newPrices);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch prices"));
    } finally {
      setIsLoading(false);
    }
  }, [symbols]);

  const getPrice = useCallback(
    (symbol: string): PriceData | null => {
      return prices[symbol] || null;
    },
    [prices]
  );

  // Initial fetch
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchPrices, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchPrices, refreshInterval]);

  return {
    prices,
    isLoading,
    error,
    refetch: fetchPrices,
    getPrice,
  };
}
