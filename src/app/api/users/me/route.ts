import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/users/me - Get current user profile
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      console.log("[API] /users/me: No authenticated user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[API] /users/me: Fetching user:", currentUser.id);

    // Check if this is a wallet-only or synthetic user (ID not in DB)
    const isWalletUser = !!currentUser.walletAddress;
    const isSyntheticUser = currentUser.id.startsWith("wallet-") ||
                           currentUser.id.startsWith("demo-user-");

    try {
      const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              bots: true,
              trades: true,
              wallets: true,
            },
          },
        },
      });

      if (user) {
        console.log("[API] /users/me: Found user in DB:", user.email);
        return NextResponse.json({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt,
          walletAddress: currentUser.walletAddress || null,
          isWalletUser,
          stats: {
            botsCount: user._count.bots,
            tradesCount: user._count.trades,
            walletsCount: user._count.wallets,
          },
        });
      }

      // User not found in database
      if (isSyntheticUser) {
        // Return session data for synthetic users
        console.log("[API] /users/me: Returning synthetic user data");
        return NextResponse.json({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
          role: currentUser.role,
          createdAt: null,
          walletAddress: currentUser.walletAddress || null,
          isWalletUser,
          stats: {
            botsCount: 0,
            tradesCount: 0,
            walletsCount: isWalletUser ? 1 : 0,
          },
        });
      }

      console.error("[API] /users/me: User not found in DB:", currentUser.id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    } catch (dbError) {
      console.error("[API] /users/me: Database error:", dbError);

      // If DB is unavailable but we have session data, return it
      if (isSyntheticUser || currentUser.email) {
        console.warn("[API] /users/me: Returning session data due to DB error");
        return NextResponse.json({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
          role: currentUser.role,
          createdAt: null,
          walletAddress: currentUser.walletAddress || null,
          isWalletUser,
          stats: {
            botsCount: 0,
            tradesCount: 0,
            walletsCount: 0,
          },
        });
      }

      throw dbError;
    }
  } catch (error) {
    console.error("[API] /users/me: Unexpected error:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// PATCH /api/users/me - Update current user profile
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      console.log("[API] /users/me PATCH: No authenticated user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    console.log("[API] /users/me PATCH: Updating user:", currentUser.id);

    const user = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: name !== undefined ? name : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[API] /users/me PATCH: Error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
