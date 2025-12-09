import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.walletBalance.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.user.deleteMany();

  // Create test user
  const passwordHash = await bcrypt.hash("password123", 12);
  const testUser = await prisma.user.create({
    data: {
      email: "test@kyzlo.xyz",
      passwordHash,
      name: "Marcus Aurelius",
      role: "user",
    },
  });

  console.log(`Created user: ${testUser.email}`);

  // Create bots
  const bots = await Promise.all([
    prisma.bot.create({
      data: {
        userId: testUser.id,
        name: "BTC Grid Pro",
        type: "crypto",
        market: "BTC/USDT",
        status: "active",
        strategy: "Grid Trading",
      },
    }),
    prisma.bot.create({
      data: {
        userId: testUser.id,
        name: "SOL DCA Strategy",
        type: "crypto",
        market: "SOL/USDT",
        status: "active",
        strategy: "DCA",
      },
    }),
    prisma.bot.create({
      data: {
        userId: testUser.id,
        name: "Tech Sector Rotator",
        type: "stock",
        market: "QQQ/XLK",
        status: "paused",
        strategy: "Sector Rotation",
      },
    }),
  ]);

  console.log(`Created ${bots.length} bots`);

  // Create trades
  const trades = await Promise.all([
    // BTC trades
    prisma.trade.create({
      data: {
        userId: testUser.id,
        botId: bots[0].id,
        symbol: "BTC/USDT",
        side: "buy",
        quantity: 0.025,
        price: 97500,
        venue: "binance",
        pnl: 125.5,
      },
    }),
    prisma.trade.create({
      data: {
        userId: testUser.id,
        botId: bots[0].id,
        symbol: "BTC/USDT",
        side: "sell",
        quantity: 0.025,
        price: 98200,
        venue: "binance",
        pnl: 17.5,
      },
    }),
    prisma.trade.create({
      data: {
        userId: testUser.id,
        botId: bots[0].id,
        symbol: "BTC/USDT",
        side: "buy",
        quantity: 0.05,
        price: 96800,
        venue: "binance",
        pnl: -45.0,
      },
    }),
    // SOL trades
    prisma.trade.create({
      data: {
        userId: testUser.id,
        botId: bots[1].id,
        symbol: "SOL/USDT",
        side: "buy",
        quantity: 10,
        price: 195,
        venue: "binance",
        pnl: 50.0,
      },
    }),
    prisma.trade.create({
      data: {
        userId: testUser.id,
        botId: bots[1].id,
        symbol: "SOL/USDT",
        side: "buy",
        quantity: 5,
        price: 192,
        venue: "binance",
        pnl: 30.0,
      },
    }),
    // Stock trades
    prisma.trade.create({
      data: {
        userId: testUser.id,
        botId: bots[2].id,
        symbol: "QQQ",
        side: "buy",
        quantity: 10,
        price: 515,
        venue: "alpaca",
        pnl: 120.0,
      },
    }),
    prisma.trade.create({
      data: {
        userId: testUser.id,
        botId: bots[2].id,
        symbol: "XLK",
        side: "buy",
        quantity: 20,
        price: 220,
        venue: "alpaca",
        pnl: 80.0,
      },
    }),
    // Manual trades
    prisma.trade.create({
      data: {
        userId: testUser.id,
        symbol: "ETH/USDT",
        side: "buy",
        quantity: 1.5,
        price: 3750,
        venue: "binance",
        pnl: 225.0,
      },
    }),
    prisma.trade.create({
      data: {
        userId: testUser.id,
        symbol: "AAPL",
        side: "buy",
        quantity: 50,
        price: 188.5,
        venue: "alpaca",
        pnl: 150.0,
      },
    }),
    prisma.trade.create({
      data: {
        userId: testUser.id,
        symbol: "JUP",
        side: "buy",
        quantity: 2500,
        price: 1.15,
        venue: "solana",
        pnl: 287.5,
      },
    }),
  ]);

  console.log(`Created ${trades.length} trades`);

  // Create wallets
  const solanaWallet = await prisma.wallet.create({
    data: {
      userId: testUser.id,
      chain: "solana",
      address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      label: "Phantom Main",
    },
  });

  const ethereumWallet = await prisma.wallet.create({
    data: {
      userId: testUser.id,
      chain: "ethereum",
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8dE2b",
      label: "MetaMask",
    },
  });

  const alpacaWallet = await prisma.wallet.create({
    data: {
      userId: testUser.id,
      chain: "alpaca",
      address: "PKXXXXXXXXXXXXX",
      label: "Alpaca Brokerage",
    },
  });

  console.log("Created wallets");

  // Create wallet balances
  await Promise.all([
    // Solana wallet balances
    prisma.walletBalance.create({
      data: {
        walletId: solanaWallet.id,
        asset: "SOL",
        amount: 125.45,
        valueUsd: 24505.89,
      },
    }),
    prisma.walletBalance.create({
      data: {
        walletId: solanaWallet.id,
        asset: "USDC",
        amount: 15420.0,
        valueUsd: 15420.0,
      },
    }),
    prisma.walletBalance.create({
      data: {
        walletId: solanaWallet.id,
        asset: "JUP",
        amount: 2500.0,
        valueUsd: 2875.0,
      },
    }),
    prisma.walletBalance.create({
      data: {
        walletId: solanaWallet.id,
        asset: "RAY",
        amount: 450.0,
        valueUsd: 2169.0,
      },
    }),
    // Ethereum wallet balances
    prisma.walletBalance.create({
      data: {
        walletId: ethereumWallet.id,
        asset: "ETH",
        amount: 4.2,
        valueUsd: 15750.0,
      },
    }),
    prisma.walletBalance.create({
      data: {
        walletId: ethereumWallet.id,
        asset: "BTC",
        amount: 0.85,
        valueUsd: 82892.5,
      },
    }),
    // Alpaca wallet balances (stocks)
    prisma.walletBalance.create({
      data: {
        walletId: alpacaWallet.id,
        asset: "AAPL",
        amount: 50,
        valueUsd: 9425.0,
      },
    }),
    prisma.walletBalance.create({
      data: {
        walletId: alpacaWallet.id,
        asset: "NVDA",
        amount: 25,
        valueUsd: 32500.0,
      },
    }),
    prisma.walletBalance.create({
      data: {
        walletId: alpacaWallet.id,
        asset: "QQQ",
        amount: 20,
        valueUsd: 10300.0,
      },
    }),
  ]);

  console.log("Created wallet balances");
  console.log("Seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
