"use client";

import { useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar: string | null;
  subscription: {
    plan: "explorer" | "trader" | "institution";
    status: "active" | "canceled" | "past_due";
  };
}

interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook to fetch and manage user data
 *
 * TODO: Implement real user fetching
 * - Call GET /api/users with auth token
 * - Handle token refresh on 401
 * - Cache user data in local state or SWR/React Query
 * - Subscribe to real-time user updates via WebSocket
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Call actual API
      // const response = await fetch('/api/users', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();

      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockUser: User = {
        id: "user_1",
        email: "trader@kyzlo.io",
        name: "Marcus Aurelius",
        username: "@stoic_trader",
        avatar: null,
        subscription: {
          plan: "trader",
          status: "active",
        },
      };

      setUser(mockUser);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch user"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
}
