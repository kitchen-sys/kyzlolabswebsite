import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/wallet - Get all wallets and balances for current user
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wallets = await prisma.wallet.findMany({
      where: { userId: currentUser.id },
      include: {
        balances: {
          orderBy: { valueUsd: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate totals
    const totalValueUsd = wallets.reduce(
      (sum, wallet) =>
        sum + wallet.balances.reduce((balSum, bal) => balSum + bal.valueUsd, 0),
      0
    );

    return NextResponse.json({
      wallets: wallets.map((wallet) => ({
        id: wallet.id,
        chain: wallet.chain,
        address: wallet.address,
        label: wallet.label,
        createdAt: wallet.createdAt,
        balances: wallet.balances.map((balance) => ({
          id: balance.id,
          asset: balance.asset,
          amount: balance.amount,
          valueUsd: balance.valueUsd,
          updatedAt: balance.updatedAt,
        })),
        totalValueUsd: wallet.balances.reduce((sum, bal) => sum + bal.valueUsd, 0),
      })),
      summary: {
        totalWallets: wallets.length,
        totalValueUsd,
        chains: Array.from(new Set(wallets.map((w) => w.chain))),
      },
    });
  } catch (error) {
    console.error("Error fetching wallets:", error);
    return NextResponse.json({ error: "Failed to fetch wallets" }, { status: 500 });
  }
}

// POST /api/wallet - Add a new wallet
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { chain, address, label } = body;

    if (!chain || !address) {
      return NextResponse.json(
        { error: "Chain and address are required" },
        { status: 400 }
      );
    }

    // Check if wallet already exists for this user
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        userId: currentUser.id,
        address,
        chain,
      },
    });

    if (existingWallet) {
      return NextResponse.json(
        { error: "Wallet already connected" },
        { status: 409 }
      );
    }

    const wallet = await prisma.wallet.create({
      data: {
        userId: currentUser.id,
        chain,
        address,
        label: label || null,
      },
      include: {
        balances: true,
      },
    });

    return NextResponse.json(wallet, { status: 201 });
  } catch (error) {
    console.error("Error creating wallet:", error);
    return NextResponse.json({ error: "Failed to create wallet" }, { status: 500 });
  }
}

// DELETE /api/wallet - Remove a wallet
export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get("id");

    if (!walletId) {
      return NextResponse.json({ error: "Wallet ID is required" }, { status: 400 });
    }

    // Verify ownership
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: currentUser.id,
      },
    });

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    await prisma.wallet.delete({
      where: { id: walletId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting wallet:", error);
    return NextResponse.json({ error: "Failed to delete wallet" }, { status: 500 });
  }
}
