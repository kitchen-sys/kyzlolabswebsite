import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/bots - Get all bots for current user
export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const bots = await prisma.bot.findMany({
      where: {
        userId: currentUser.id,
        ...(type && { type }),
        ...(status && { status }),
      },
      include: {
        _count: {
          select: { trades: true },
        },
        trades: {
          select: { pnl: true },
          orderBy: { executedAt: "desc" },
          take: 100,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate PnL for each bot
    const botsWithPnl = bots.map((bot) => {
      const totalPnl = bot.trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
      return {
        id: bot.id,
        name: bot.name,
        type: bot.type,
        market: bot.market,
        status: bot.status,
        strategy: bot.strategy,
        createdAt: bot.createdAt,
        updatedAt: bot.updatedAt,
        tradesCount: bot._count.trades,
        pnl: totalPnl,
        pnlPercent: 0, // TODO: Calculate based on initial investment
      };
    });

    return NextResponse.json(botsWithPnl);
  } catch (error) {
    console.error("Error fetching bots:", error);
    return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 });
  }
}

// POST /api/bots - Create a new bot
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, market, strategy } = body;

    if (!name || !type || !market) {
      return NextResponse.json(
        { error: "Name, type, and market are required" },
        { status: 400 }
      );
    }

    const bot = await prisma.bot.create({
      data: {
        userId: currentUser.id,
        name,
        type,
        market,
        strategy: strategy || "custom",
        status: "inactive",
      },
    });

    return NextResponse.json(bot, { status: 201 });
  } catch (error) {
    console.error("Error creating bot:", error);
    return NextResponse.json({ error: "Failed to create bot" }, { status: 500 });
  }
}

// PATCH /api/bots - Update bot status (batch operation)
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, name, market, strategy } = body;

    if (!id) {
      return NextResponse.json({ error: "Bot ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existingBot = await prisma.bot.findFirst({
      where: {
        id,
        userId: currentUser.id,
      },
    });

    if (!existingBot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    const bot = await prisma.bot.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(name && { name }),
        ...(market && { market }),
        ...(strategy && { strategy }),
      },
    });

    return NextResponse.json(bot);
  } catch (error) {
    console.error("Error updating bot:", error);
    return NextResponse.json({ error: "Failed to update bot" }, { status: 500 });
  }
}
