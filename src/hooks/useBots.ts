"use client";

import { useState, useEffect, useCallback } from "react";

export interface Bot {
  id: string;
  name: string;
  type: string;
  market: string;
  status: "active" | "paused" | "inactive" | "error";
  strategy: string;
  createdAt: string;
  updatedAt: string;
  tradesCount: number;
  pnl: number;
  pnlPercent: number;
}

interface UseBotsOptions {
  type?: string;
  status?: string;
}

interface UseBotsReturn {
  bots: Bot[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  createBot: (payload: { name: string; type: string; market: string; strategy?: string }) => Promise<Bot>;
  toggleBot: (botId: string) => Promise<void>;
  updateBot: (botId: string, data: Partial<Bot>) => Promise<void>;
}

// Demo/placeholder bots data
const DEMO_BOTS: Bot[] = [
  {
    id: "demo-bot-1",
    name: "BTC Grid Pro",
    type: "crypto",
    market: "BTC/USDT",
    status: "active",
    strategy: "Grid Trading",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    tradesCount: 156,
    pnl: 2847.50,
    pnlPercent: 12.4,
  },
  {
    id: "demo-bot-2",
    name: "SOL DCA Strategy",
    type: "crypto",
    market: "SOL/USDT",
    status: "active",
    strategy: "DCA",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    tradesCount: 42,
    pnl: 1256.80,
    pnlPercent: 8.2,
  },
  {
    id: "demo-bot-3",
    name: "ETH Momentum",
    type: "crypto",
    market: "ETH/USDT",
    status: "paused",
    strategy: "Momentum",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    tradesCount: 28,
    pnl: -342.15,
    pnlPercent: -2.1,
  },
  {
    id: "demo-bot-4",
    name: "ARB Scalper",
    type: "crypto",
    market: "ARB/USDT",
    status: "active",
    strategy: "Scalping",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    tradesCount: 312,
    pnl: 567.25,
    pnlPercent: 5.6,
  },
  {
    id: "demo-bot-5",
    name: "Tech Sector Rotator",
    type: "stock",
    market: "QQQ/XLK",
    status: "active",
    strategy: "Sector Rotation",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    tradesCount: 18,
    pnl: 1890.00,
    pnlPercent: 6.8,
  },
];

export function useBots(options?: UseBotsOptions): UseBotsReturn {
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useDemo, setUseDemo] = useState(false);

  const fetchBots = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options?.type) params.append("type", options.type);
      if (options?.status) params.append("status", options.status);

      const response = await fetch(`/api/bots?${params}`);

      if (response.status === 401) {
        // Not authenticated - use demo data
        setUseDemo(true);
        const filteredBots = filterDemoBots(options);
        setBots(filteredBots);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch bots");
      }

      const data = await response.json();

      // If API returns empty, use demo data
      if (!data || data.length === 0) {
        setUseDemo(true);
        const filteredBots = filterDemoBots(options);
        setBots(filteredBots);
      } else {
        setUseDemo(false);
        setBots(data);
      }
    } catch {
      // On error, use demo data
      setUseDemo(true);
      const filteredBots = filterDemoBots(options);
      setBots(filteredBots);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  // Helper to filter demo bots by options
  const filterDemoBots = (opts?: UseBotsOptions): Bot[] => {
    let filtered = [...DEMO_BOTS];
    if (opts?.type) {
      filtered = filtered.filter((b) => b.type === opts.type);
    }
    if (opts?.status) {
      filtered = filtered.filter((b) => b.status === opts.status);
    }
    return filtered;
  };

  const createBot = async (payload: {
    name: string;
    type: string;
    market: string;
    strategy?: string;
  }): Promise<Bot> => {
    if (useDemo) {
      // In demo mode, just add to local state
      const newBot: Bot = {
        id: `demo-${Date.now()}`,
        name: payload.name,
        type: payload.type,
        market: payload.market,
        status: "inactive",
        strategy: payload.strategy || "custom",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tradesCount: 0,
        pnl: 0,
        pnlPercent: 0,
      };
      setBots((prev) => [newBot, ...prev]);
      return newBot;
    }

    const response = await fetch("/api/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to create bot");
    }

    const newBot = await response.json();
    setBots((prev) => [newBot, ...prev]);
    return newBot;
  };

  const toggleBot = async (botId: string): Promise<void> => {
    const bot = bots.find((b) => b.id === botId);
    if (!bot) return;

    const newStatus = bot.status === "active" ? "paused" : "active";

    if (useDemo) {
      // In demo mode, just update local state
      setBots((prev) =>
        prev.map((b) => (b.id === botId ? { ...b, status: newStatus } : b))
      );
      return;
    }

    const response = await fetch("/api/bots", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: botId, status: newStatus }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to toggle bot");
    }

    setBots((prev) =>
      prev.map((b) => (b.id === botId ? { ...b, status: newStatus } : b))
    );
  };

  const updateBot = async (botId: string, data: Partial<Bot>): Promise<void> => {
    if (useDemo) {
      // In demo mode, just update local state
      setBots((prev) =>
        prev.map((b) => (b.id === botId ? { ...b, ...data } : b))
      );
      return;
    }

    const response = await fetch("/api/bots", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: botId, ...data }),
    });

    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(responseData.error || "Failed to update bot");
    }

    const updatedBot = await response.json();
    setBots((prev) =>
      prev.map((b) => (b.id === botId ? { ...b, ...updatedBot } : b))
    );
  };

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  return {
    bots,
    isLoading,
    error: null, // Don't expose errors in demo mode
    refetch: fetchBots,
    createBot,
    toggleBot,
    updateBot,
  };
}
