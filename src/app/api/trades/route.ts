import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/trades - Get all trades for current user
export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const botId = searchParams.get("botId");
    const symbol = searchParams.get("symbol");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const trades = await prisma.trade.findMany({
      where: {
        userId: currentUser.id,
        ...(botId && { botId }),
        ...(symbol && { symbol }),
      },
      include: {
        bot: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { executedAt: "desc" },
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.trade.count({
      where: {
        userId: currentUser.id,
        ...(botId && { botId }),
        ...(symbol && { symbol }),
      },
    });

    return NextResponse.json({
      trades,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + trades.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching trades:", error);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}

// POST /api/trades - Record a new trade (for manual trades or bot executions)
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { botId, symbol, side, quantity, price, venue, pnl } = body;

    if (!symbol || !side || !quantity || !price || !venue) {
      return NextResponse.json(
        { error: "Symbol, side, quantity, price, and venue are required" },
        { status: 400 }
      );
    }

    // If botId is provided, verify ownership
    if (botId) {
      const bot = await prisma.bot.findFirst({
        where: {
          id: botId,
          userId: currentUser.id,
        },
      });

      if (!bot) {
        return NextResponse.json({ error: "Bot not found" }, { status: 404 });
      }
    }

    const trade = await prisma.trade.create({
      data: {
        userId: currentUser.id,
        botId: botId || null,
        symbol,
        side,
        quantity,
        price,
        venue,
        pnl: pnl || null,
      },
    });

    return NextResponse.json(trade, { status: 201 });
  } catch (error) {
    console.error("Error creating trade:", error);
    return NextResponse.json({ error: "Failed to create trade" }, { status: 500 });
  }
}
