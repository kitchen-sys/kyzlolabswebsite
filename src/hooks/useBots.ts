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

export function useBots(options?: UseBotsOptions): UseBotsReturn {
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBots = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options?.type) params.append("type", options.type);
      if (options?.status) params.append("status", options.status);

      const response = await fetch(`/api/bots?${params}`);

      if (response.status === 401) {
        setError("Unauthorized");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch bots");
      }

      const data = await response.json();
      setBots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bots");
    } finally {
      setIsLoading(false);
    }
  }, [options?.type, options?.status]);

  const createBot = async (payload: {
    name: string;
    type: string;
    market: string;
    strategy?: string;
  }): Promise<Bot> => {
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
    error,
    refetch: fetchBots,
    createBot,
    toggleBot,
    updateBot,
  };
}
