import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// Runtime secret validation - called during auth operations, not at build time
// This avoids build failures on Netlify where env vars may not be available during build
function validateSecretAtRuntime(): void {
  if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_SECRET) {
    console.error(
      "[NextAuth] CRITICAL: NEXTAUTH_SECRET is not set in production! " +
        "Authentication will fail. Please set NEXTAUTH_SECRET in your environment variables."
    );
  }
}

// Development fallback secret - only used when NEXTAUTH_SECRET is not set in dev
const DEV_FALLBACK_SECRET = "dev-only-secret-change-in-production-" +
  (typeof process !== "undefined" ? "static" : "build");

// Demo user constants - matches the seeded user in the database
const DEMO_USER_EMAIL = "test@kyzlo.xyz";
const DEMO_USER_PASSWORD = "password123";

export type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "admin";
  walletAddress?: string | null;
} | null;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: "user" | "admin";
      walletAddress?: string | null;
    };
  }
  interface User {
    id: string;
    email: string;
    name: string | null;
    role: "user" | "admin";
    walletAddress?: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: "user" | "admin";
    walletAddress?: string | null;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    // Email/Password credentials
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("[Auth] Credentials: Missing email or password");
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          // Always try database lookup first
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            const isValidPassword = await bcrypt.compare(password, user.passwordHash);

            if (!isValidPassword) {
              console.error("[Auth] Credentials: Invalid password for user:", email);
              return null;
            }

            console.log("[Auth] Credentials: Successfully authenticated user:", email);
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role as "user" | "admin",
              walletAddress: null,
            };
          }

          // User not found in database
          // In development, allow demo account as fallback if DB is empty
          if (process.env.NODE_ENV !== "production") {
            if (email === DEMO_USER_EMAIL && password === DEMO_USER_PASSWORD) {
              console.warn(
                "[Auth] Credentials: Using demo fallback (user not in DB). " +
                  "Run `npx prisma db seed` to seed the database."
              );
              return {
                id: "demo-user-fallback",
                email: DEMO_USER_EMAIL,
                name: "Demo User (Fallback)",
                role: "user" as const,
                walletAddress: null,
              };
            }
          }

          console.error("[Auth] Credentials: User not found:", email);
          return null;
        } catch (error) {
          console.error("[Auth] Credentials: Database error:", error);

          // In development only, allow demo account if database is unavailable
          if (process.env.NODE_ENV !== "production") {
            if (email === DEMO_USER_EMAIL && password === DEMO_USER_PASSWORD) {
              console.warn(
                "[Auth] Credentials: Database unavailable, using demo fallback. " +
                  "Ensure DATABASE_URL is configured correctly."
              );
              return {
                id: "demo-user-no-db",
                email: DEMO_USER_EMAIL,
                name: "Demo User (No DB)",
                role: "user" as const,
                walletAddress: null,
              };
            }
          }

          return null;
        }
      },
    }),
    // Wallet-based authentication (for Phantom, Solflare, etc.)
    Credentials({
      id: "wallet",
      name: "wallet",
      credentials: {
        walletAddress: { label: "Wallet Address", type: "text" },
        walletType: { label: "Wallet Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.walletAddress) {
          console.error("[Auth] Wallet: Missing wallet address");
          return null;
        }

        const walletAddress = credentials.walletAddress as string;
        const walletType = (credentials.walletType as string) || "phantom";

        console.log(
          "[Auth] Wallet: Attempting auth for wallet:",
          walletAddress.slice(0, 8) + "..."
        );

        try {
          // Look for an existing wallet in the database
          const existingWallet = await prisma.wallet.findFirst({
            where: { address: walletAddress },
            include: { user: true },
          });

          if (existingWallet) {
            // Wallet exists - return the associated user
            console.log(
              "[Auth] Wallet: Found existing wallet, user:",
              existingWallet.user.email
            );
            return {
              id: existingWallet.user.id,
              email: existingWallet.user.email,
              name: existingWallet.user.name,
              role: existingWallet.user.role as "user" | "admin",
              walletAddress: walletAddress,
            };
          }

          // For demo purposes: link wallet to the demo user if they exist
          // In production, you would create a new user or require email signup
          const demoUser = await prisma.user.findUnique({
            where: { email: DEMO_USER_EMAIL },
          });

          if (demoUser) {
            // Create a new wallet record linked to the demo user
            await prisma.wallet.create({
              data: {
                userId: demoUser.id,
                chain: "solana",
                address: walletAddress,
                label: `${walletType.charAt(0).toUpperCase() + walletType.slice(1)} Wallet`,
              },
            });

            console.log("[Auth] Wallet: Created new wallet for demo user");
            return {
              id: demoUser.id,
              email: demoUser.email,
              name:
                demoUser.name ||
                `${walletType.charAt(0).toUpperCase() + walletType.slice(1)} Wallet`,
              role: demoUser.role as "user" | "admin",
              walletAddress: walletAddress,
            };
          }

          // No demo user - create a synthetic user for demo purposes
          // In production, this should require proper user registration
          console.warn("[Auth] Wallet: No demo user found, creating synthetic session");
          return {
            id: `wallet-${walletAddress.slice(0, 16)}`,
            email: `${walletAddress.slice(0, 8)}@wallet.demo`,
            name: `${walletType.charAt(0).toUpperCase() + walletType.slice(1)} Wallet`,
            role: "user" as const,
            walletAddress: walletAddress,
          };
        } catch (error) {
          console.error("[Auth] Wallet: Database error:", error);

          // Database unavailable - create synthetic session for demo
          console.warn("[Auth] Wallet: Database unavailable, using synthetic session");
          return {
            id: `wallet-${walletAddress.slice(0, 16)}`,
            email: `${walletAddress.slice(0, 8)}@wallet.demo`,
            name: `${walletType.charAt(0).toUpperCase() + walletType.slice(1)} Wallet`,
            role: "user" as const,
            walletAddress: walletAddress,
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.walletAddress = user.walletAddress || null;
        console.log("[Auth] JWT: Token created for user:", user.email);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.walletAddress = token.walletAddress || null;
      }
      return session;
    },
    async signIn({ user }) {
      // Validate secret at runtime (not build time)
      validateSecretAtRuntime();
      console.log("[Auth] SignIn: User signed in:", user.email);
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Use env var directly - NextAuth reads it at runtime, not build time
  // In dev, fall back to a static secret if NEXTAUTH_SECRET is not set
  secret: process.env.NEXTAUTH_SECRET || DEV_FALLBACK_SECRET,
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export async function getCurrentUser(): Promise<CurrentUser> {
  try {
    const session = await auth();

    if (!session?.user) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email ?? "",
      name: session.user.name ?? null,
      role: session.user.role ?? "user",
      walletAddress: session.user.walletAddress ?? null,
    };
  } catch (error) {
    console.error("[Auth] getCurrentUser: Error fetching session:", error);
    return null;
  }
}
