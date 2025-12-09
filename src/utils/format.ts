/**
 * Formatting Utilities
 *
 * Common formatting functions for displaying data consistently
 * across the Kyzlo platform.
 */

/**
 * Format a number as currency (USD by default)
 *
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(1234.56, 'EUR') // "€1,234.56"
 */
export function formatCurrency(
  value: number,
  currency: string = "USD",
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

/**
 * Format a number as a percentage
 *
 * @example
 * formatPercent(0.1234) // "12.34%"
 * formatPercent(0.1234, { showSign: true }) // "+12.34%"
 */
export function formatPercent(
  value: number,
  options?: { decimals?: number; showSign?: boolean }
): string {
  const decimals = options?.decimals ?? 2;
  const percent = value * 100;
  const formatted = percent.toFixed(decimals);

  if (options?.showSign && percent > 0) {
    return `+${formatted}%`;
  }

  return `${formatted}%`;
}

/**
 * Format a percentage value that's already in percent form (not decimal)
 *
 * @example
 * formatPercentValue(12.34) // "12.34%"
 * formatPercentValue(12.34, { showSign: true }) // "+12.34%"
 */
export function formatPercentValue(
  value: number,
  options?: { decimals?: number; showSign?: boolean }
): string {
  const decimals = options?.decimals ?? 2;
  const formatted = value.toFixed(decimals);

  if (options?.showSign && value > 0) {
    return `+${formatted}%`;
  }

  return `${formatted}%`;
}

/**
 * Format a number in compact notation (1K, 1M, 1B, etc.)
 *
 * @example
 * formatCompactNumber(1234) // "1.2K"
 * formatCompactNumber(1234567) // "1.2M"
 * formatCompactNumber(1234567890) // "1.2B"
 */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format a number with thousands separators
 *
 * @example
 * formatNumber(1234567.89) // "1,234,567.89"
 * formatNumber(1234567.89, { decimals: 0 }) // "1,234,568"
 */
export function formatNumber(
  value: number,
  options?: { decimals?: number; minDecimals?: number }
): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: options?.minDecimals ?? 0,
    maximumFractionDigits: options?.decimals ?? 2,
  }).format(value);
}

/**
 * Format a cryptocurrency amount with appropriate decimals
 *
 * @example
 * formatCryptoAmount(1.23456789, 'BTC') // "1.23456789"
 * formatCryptoAmount(1234.56, 'USDC') // "1,234.56"
 */
export function formatCryptoAmount(amount: number, symbol: string): string {
  // Define precision based on asset type
  const precision: Record<string, number> = {
    BTC: 8,
    ETH: 6,
    SOL: 4,
    USDC: 2,
    USDT: 2,
    default: 4,
  };

  const decimals = precision[symbol] ?? precision.default;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format a date relative to now (e.g., "2 hours ago")
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 60000)) // "1 minute ago"
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = typeof date === "string" ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return "just now";
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? "hour" : "hours"} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} ${diffDay === 1 ? "day" : "days"} ago`;
  } else {
    return then.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: then.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}

/**
 * Format a date/time
 *
 * @example
 * formatDateTime(new Date()) // "Dec 9, 2024, 12:34 PM"
 */
export function formatDateTime(date: Date | string, includeTime: boolean = true): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (includeTime) {
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Truncate a wallet address for display
 *
 * @example
 * truncateAddress("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU") // "7xKX...gAsU"
 */
export function truncateAddress(address: string, startChars: number = 4, endChars: number = 4): string {
  if (address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Format PnL with sign and color class
 *
 * @returns Object with formatted value and color class
 */
export function formatPnL(value: number): { formatted: string; colorClass: string } {
  const formatted = formatCurrency(Math.abs(value));
  const sign = value >= 0 ? "+" : "-";

  return {
    formatted: `${sign}${formatted}`,
    colorClass: value >= 0 ? "text-green-400" : "text-red-400",
  };
}
