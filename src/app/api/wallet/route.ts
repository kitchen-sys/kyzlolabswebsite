import { NextRequest, NextResponse } from "next/server";

// Mock wallet data
const mockWalletData = {
  totalValue: 185537.39,
  change24h: 2.4,
  connectedAccounts: [
    {
      id: "acc_1",
      type: "exchange",
      name: "Binance",
      status: "connected",
      lastSync: "2024-12-09T12:00:00Z",
    },
    {
      id: "acc_2",
      type: "exchange",
      name: "Alpaca",
      status: "connected",
      lastSync: "2024-12-09T12:00:00Z",
    },
    {
      id: "acc_3",
      type: "wallet",
      name: "Phantom",
      address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      chain: "solana",
      status: "connected",
      lastSync: "2024-12-09T12:30:00Z",
    },
    {
      id: "acc_4",
      type: "wallet",
      name: "MetaMask",
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8dE2b",
      chain: "ethereum",
      status: "connected",
      lastSync: "2024-12-09T12:30:00Z",
    },
  ],
  balances: [
    {
      asset: "Solana",
      symbol: "SOL",
      chain: "Solana",
      balance: 125.45,
      value: 24505.89,
      change24h: 3.2,
      source: "phantom",
    },
    {
      asset: "USD Coin",
      symbol: "USDC",
      chain: "Solana",
      balance: 15420.0,
      value: 15420.0,
      change24h: 0.0,
      source: "phantom",
    },
    {
      asset: "Bitcoin",
      symbol: "BTC",
      chain: "Binance",
      balance: 0.85,
      value: 82892.5,
      change24h: 1.8,
      source: "binance",
    },
    {
      asset: "Ethereum",
      symbol: "ETH",
      chain: "Ethereum",
      balance: 4.2,
      value: 15750.0,
      change24h: -0.5,
      source: "metamask",
    },
    {
      asset: "Jupiter",
      symbol: "JUP",
      chain: "Solana",
      balance: 2500.0,
      value: 2875.0,
      change24h: 5.4,
      source: "phantom",
    },
    {
      asset: "Apple Inc.",
      symbol: "AAPL",
      chain: "Alpaca",
      balance: 50,
      value: 9425.0,
      change24h: 0.8,
      source: "alpaca",
    },
    {
      asset: "NVIDIA Corp.",
      symbol: "NVDA",
      chain: "Alpaca",
      balance: 25,
      value: 32500.0,
      change24h: 2.3,
      source: "alpaca",
    },
  ],
  recentTransactions: [
    {
      id: "tx_1",
      type: "deposit",
      asset: "USDC",
      amount: 5000.0,
      status: "completed",
      timestamp: "2024-12-09T10:00:00Z",
    },
    {
      id: "tx_2",
      type: "swap",
      fromAsset: "SOL",
      toAsset: "USDC",
      fromAmount: 10.5,
      toAmount: 2051.12,
      status: "completed",
      timestamp: "2024-12-09T12:34:56Z",
    },
    {
      id: "tx_3",
      type: "trade",
      asset: "BTC",
      amount: 0.025,
      side: "buy",
      status: "completed",
      timestamp: "2024-12-09T12:34:56Z",
    },
  ],
};

/**
 * GET /api/wallet
 * Returns wallet summary and balances
 *
 * TODO: Implement actual wallet data retrieval
 * - Authenticate user
 * - Fetch balances from connected exchanges via API
 * - Fetch on-chain balances from RPC nodes
 * - Calculate total value in USD
 * - Cache results with TTL
 */
export async function GET(request: NextRequest) {
  // TODO: Authenticate request
  const searchParams = request.nextUrl.searchParams;
  const source = searchParams.get("source"); // Filter by source (binance, phantom, etc.)
  const chain = searchParams.get("chain"); // Filter by chain

  let balances = [...mockWalletData.balances];

  if (source) {
    balances = balances.filter((b) => b.source === source);
  }

  if (chain) {
    balances = balances.filter((b) => b.chain.toLowerCase() === chain.toLowerCase());
  }

  // Recalculate total if filtered
  const totalValue = balances.reduce((sum, b) => sum + b.value, 0);

  return NextResponse.json({
    summary: {
      totalValue,
      change24h: mockWalletData.change24h,
      lastUpdated: new Date().toISOString(),
    },
    connectedAccounts: mockWalletData.connectedAccounts,
    balances,
    recentTransactions: mockWalletData.recentTransactions,
  });
}

/**
 * POST /api/wallet
 * Connect a new wallet or exchange
 *
 * TODO: Implement wallet/exchange connection
 * - For exchanges: validate and store API keys (encrypted)
 * - For wallets: store public address and verify ownership via signature
 * - Initialize balance sync
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, address, apiKey, apiSecret, chain } = body;

    // TODO: Validate input based on type
    // TODO: For exchanges: encrypt and store API keys
    // TODO: For wallets: verify ownership via signature
    // TODO: Initialize balance sync

    if (type === "exchange") {
      // TODO: Validate API keys with exchange
      return NextResponse.json({
        success: true,
        account: {
          id: "acc_" + Date.now(),
          type: "exchange",
          name,
          status: "connected",
          lastSync: new Date().toISOString(),
        },
        message: `${name} connected successfully`,
      });
    }

    if (type === "wallet") {
      // TODO: Verify wallet ownership via signature
      return NextResponse.json({
        success: true,
        account: {
          id: "acc_" + Date.now(),
          type: "wallet",
          name,
          address,
          chain,
          status: "connected",
          lastSync: new Date().toISOString(),
        },
        message: `${name} wallet connected successfully`,
      });
    }

    return NextResponse.json(
      { error: "Invalid account type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Connect wallet error:", error);
    return NextResponse.json(
      { error: "Failed to connect account" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/wallet
 * Disconnect a wallet or exchange
 *
 * TODO: Implement disconnection
 * - Stop any bots using this account
 * - Delete stored credentials
 * - Clear cached balances
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId } = body;

    // TODO: Verify account ownership
    // TODO: Check for active bots using this account
    // TODO: Delete credentials and cached data

    return NextResponse.json({
      success: true,
      message: "Account disconnected successfully",
    });
  } catch (error) {
    console.error("Disconnect wallet error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect account" },
      { status: 500 }
    );
  }
}
