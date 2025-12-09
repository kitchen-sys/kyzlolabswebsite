/**
 * Environment Configuration
 *
 * Centralized access to environment variables with type safety.
 * All environment variables should be accessed through this module.
 *
 * Usage:
 * import { env } from '@/config/env';
 * const apiKey = env.ALPACA_KEY;
 *
 * TODO: In production
 * - Use a secrets manager (AWS Secrets Manager, Vault, etc.)
 * - Encrypt sensitive values at rest
 * - Implement secret rotation
 */

interface EnvConfig {
  // Node environment
  NODE_ENV: "development" | "production" | "test";

  // App configuration
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_API_URL: string;

  // NextAuth Configuration
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;

  // Database
  DATABASE_URL: string;

  // Binance API
  BINANCE_API_KEY: string;
  BINANCE_API_SECRET: string;
  BINANCE_TESTNET: boolean;

  // Alpaca API (Stocks/ETFs)
  ALPACA_KEY: string;
  ALPACA_SECRET: string;
  ALPACA_PAPER: boolean;

  // Solana Configuration
  SOLANA_RPC_URL: string;
  SOLANA_NETWORK: "mainnet-beta" | "devnet" | "testnet";

  // Jupiter API (Solana DEX Aggregator)
  JUPITER_API_URL: string;

  // Redis (for caching and queues)
  REDIS_URL: string;

  // Analytics
  NEXT_PUBLIC_ANALYTICS_ID: string;
}

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value === undefined) {
    if (fallback !== undefined) {
      return fallback;
    }
    // In development, log warning but don't throw
    if (process.env.NODE_ENV === "development") {
      console.warn(`Environment variable ${key} is not set`);
      return "";
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Get boolean environment variable
 */
function getBoolEnvVar(key: string, fallback: boolean = false): boolean {
  const value = process.env[key];
  if (value === undefined) return fallback;
  return value.toLowerCase() === "true" || value === "1";
}

/**
 * Environment configuration object
 *
 * Note: In a real implementation, you would set these in .env.local:
 *
 * ```
 * # .env.local
 * NEXT_PUBLIC_APP_URL=http://localhost:3000
 * BINANCE_API_KEY=your_binance_api_key
 * BINANCE_API_SECRET=your_binance_api_secret
 * ALPACA_KEY=your_alpaca_key
 * ALPACA_SECRET=your_alpaca_secret
 * SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
 * DATABASE_URL=postgresql://...
 * ```
 */
export const env: EnvConfig = {
  // Node environment
  NODE_ENV: (getEnvVar("NODE_ENV", "development") as EnvConfig["NODE_ENV"]),

  // App configuration
  NEXT_PUBLIC_APP_URL: getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  NEXT_PUBLIC_API_URL: getEnvVar("NEXT_PUBLIC_API_URL", "/api"),

  // NextAuth Configuration
  NEXTAUTH_URL: getEnvVar("NEXTAUTH_URL", "http://localhost:3000"),
  NEXTAUTH_SECRET: getEnvVar("NEXTAUTH_SECRET", "development-secret-change-in-production"),

  // Database
  DATABASE_URL: getEnvVar("DATABASE_URL", "postgresql://localhost:5432/kyzlo"),

  // Binance API
  // TODO: Replace with real API keys from Binance
  BINANCE_API_KEY: getEnvVar("BINANCE_API_KEY", ""),
  BINANCE_API_SECRET: getEnvVar("BINANCE_API_SECRET", ""),
  BINANCE_TESTNET: getBoolEnvVar("BINANCE_TESTNET", true),

  // Alpaca API
  // TODO: Replace with real API keys from Alpaca
  ALPACA_KEY: getEnvVar("ALPACA_KEY", ""),
  ALPACA_SECRET: getEnvVar("ALPACA_SECRET", ""),
  ALPACA_PAPER: getBoolEnvVar("ALPACA_PAPER", true),

  // Solana Configuration
  // TODO: Consider using a private RPC for production (Helius, QuickNode, etc.)
  SOLANA_RPC_URL: getEnvVar("SOLANA_RPC_URL", "https://api.mainnet-beta.solana.com"),
  SOLANA_NETWORK: getEnvVar("SOLANA_NETWORK", "mainnet-beta") as EnvConfig["SOLANA_NETWORK"],

  // Jupiter API
  JUPITER_API_URL: getEnvVar("JUPITER_API_URL", "https://quote-api.jup.ag/v6"),

  // Redis
  REDIS_URL: getEnvVar("REDIS_URL", "redis://localhost:6379"),

  // Analytics
  NEXT_PUBLIC_ANALYTICS_ID: getEnvVar("NEXT_PUBLIC_ANALYTICS_ID", ""),
};

/**
 * Check if running in production
 */
export const isProduction = env.NODE_ENV === "production";

/**
 * Check if running in development
 */
export const isDevelopment = env.NODE_ENV === "development";

/**
 * Check if running in test
 */
export const isTest = env.NODE_ENV === "test";
