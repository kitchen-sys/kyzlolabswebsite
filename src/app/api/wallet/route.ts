import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/wallet - Get all wallets and balances for current user
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      console.log("[API] /wallet: No authenticated user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[API] /wallet: Fetching wallets for user:", currentUser.id);

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

    console.log("[API] /wallet: Found", wallets.length, "wallets, total value:", totalValueUsd);

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
    console.error("[API] /wallet: Error fetching wallets:", error);
    return NextResponse.json({ error: "Failed to fetch wallets" }, { status: 500 });
  }
}

// POST /api/wallet - Add a new wallet
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      console.log("[API] /wallet POST: No authenticated user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { chain, address, label } = body;

    if (!chain || !address) {
      console.log("[API] /wallet POST: Missing chain or address");
      return NextResponse.json(
        { error: "Chain and address are required" },
        { status: 400 }
      );
    }

    console.log("[API] /wallet POST: Creating wallet for user:", currentUser.id, "chain:", chain);

    // Check if wallet already exists for this user
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        userId: currentUser.id,
        address,
        chain,
      },
    });

    if (existingWallet) {
      console.log("[API] /wallet POST: Wallet already exists:", existingWallet.id);
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

    console.log("[API] /wallet POST: Created wallet:", wallet.id);
    return NextResponse.json(wallet, { status: 201 });
  } catch (error) {
    console.error("[API] /wallet POST: Error creating wallet:", error);
    return NextResponse.json({ error: "Failed to create wallet" }, { status: 500 });
  }
}

// DELETE /api/wallet - Remove a wallet
export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      console.log("[API] /wallet DELETE: No authenticated user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const walletId = searchParams.get("id");

    if (!walletId) {
      console.log("[API] /wallet DELETE: Missing wallet ID");
      return NextResponse.json({ error: "Wallet ID is required" }, { status: 400 });
    }

    console.log("[API] /wallet DELETE: Deleting wallet:", walletId, "for user:", currentUser.id);

    // Verify ownership
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: currentUser.id,
      },
    });

    if (!wallet) {
      console.log("[API] /wallet DELETE: Wallet not found or not owned by user");
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    await prisma.wallet.delete({
      where: { id: walletId },
    });

    console.log("[API] /wallet DELETE: Successfully deleted wallet:", walletId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] /wallet DELETE: Error deleting wallet:", error);
    return NextResponse.json({ error: "Failed to delete wallet" }, { status: 500 });
  }
}
