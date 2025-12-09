import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// Fallback secret for development/demo - in production, always set NEXTAUTH_SECRET
const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "demo-secret-for-development-only-change-in-production";

export type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "admin";
} | null;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: "user" | "admin";
    };
  }
  interface User {
    id: string;
    email: string;
    name: string | null;
    role: "user" | "admin";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: "user" | "admin";
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
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Demo account - works without database
        if (email === "test@kyzlo.xyz" && password === "password123") {
          return {
            id: "demo-user-id",
            email: "test@kyzlo.xyz",
            name: "Demo User",
            role: "user" as const,
          };
        }

        // Try database lookup for real users
        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(password, user.passwordHash);

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as "user" | "admin",
          };
        } catch {
          // Database not available - only demo account works
          return null;
        }
      },
    }),
    // Wallet-based authentication (for Phantom, etc.)
    Credentials({
      id: "wallet",
      name: "wallet",
      credentials: {
        walletAddress: { label: "Wallet Address", type: "text" },
        walletType: { label: "Wallet Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.walletAddress) {
          return null;
        }

        const walletAddress = credentials.walletAddress as string;
        const walletType = (credentials.walletType as string) || "phantom";

        // For demo purposes, accept any wallet address
        // In production, you would verify a signed message here
        return {
          id: `wallet-${walletAddress.slice(0, 8)}`,
          email: `${walletAddress.slice(0, 8)}...${walletAddress.slice(-4)}@wallet.local`,
          name: `${walletType.charAt(0).toUpperCase() + walletType.slice(1)} Wallet`,
          role: "user" as const,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
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
  secret: AUTH_SECRET,
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export async function getCurrentUser(): Promise<CurrentUser> {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: session.user.role ?? "user",
  };
}
