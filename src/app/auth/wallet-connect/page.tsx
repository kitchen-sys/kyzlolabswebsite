"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wallet, ArrowLeft, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  popular?: boolean;
}

const walletOptions: WalletOption[] = [
  {
    id: "phantom",
    name: "Phantom",
    icon: "👻",
    description: "The friendly Solana wallet",
    popular: true,
  },
  {
    id: "solflare",
    name: "Solflare",
    icon: "☀️",
    description: "A secure Solana wallet",
  },
  {
    id: "backpack",
    name: "Backpack",
    icon: "🎒",
    description: "xNFT wallet for Solana",
  },
  {
    id: "ledger",
    name: "Ledger",
    icon: "🔐",
    description: "Hardware wallet support",
  },
];

// Demo wallet addresses for each wallet type
const demoAddresses: Record<string, string> = {
  phantom: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  solflare: "9aE5Ld4PFLGmqrPUYRkWH8dMm7hcKBUTQFQo5E8Zf7nB",
  backpack: "BPK4r3EfVSM5E9kLJGXCdNB5hZP9F8mDq3L7vXQ2uYnK",
  ledger: "LGR8x2M1nGJvqWJzrP7FhQ4d5KmY3Cq9TbNs6yU4wXeR",
};

export default function WalletConnectPage() {
  const router = useRouter();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnectWallet = async (walletId: string) => {
    setSelectedWallet(walletId);
    setConnectionStatus("connecting");
    setError(null);

    // Get demo address for this wallet type
    const demoAddress = demoAddresses[walletId];

    // Simulate wallet connection delay (in production, this would be actual wallet interaction)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      // Use NextAuth signIn with the wallet provider
      const result = await signIn("wallet", {
        walletAddress: demoAddress,
        walletType: walletId,
        redirect: false,
      });

      if (result?.error) {
        setConnectionStatus("error");
        setError("Failed to authenticate wallet. Please try again.");
        return;
      }

      // Success
      setWalletAddress(`${demoAddress.slice(0, 4)}...${demoAddress.slice(-4)}`);
      setConnectionStatus("connected");

      // Redirect to dashboard after brief success message
      setTimeout(() => {
        router.push("/dashboard/overview");
        router.refresh();
      }, 1500);
    } catch {
      setConnectionStatus("error");
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connecting":
        return <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-neon)]" />;
      case "connected":
        return <CheckCircle2 className="w-6 h-6 text-green-400" />;
      case "error":
        return <AlertCircle className="w-6 h-6 text-destructive" />;
      default:
        return <Wallet className="w-6 h-6 text-[var(--accent-gold)]" />;
    }
  };

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case "connecting":
        return "Connecting to wallet...";
      case "connected":
        return `Connected: ${walletAddress}`;
      case "error":
        return error || "Connection failed. Please try again.";
      default:
        return "Select a wallet to connect";
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center">
          {getStatusIcon()}
        </div>
        <CardTitle className="text-2xl">Connect Wallet</CardTitle>
        <CardDescription>{getStatusMessage()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connectionStatus === "connected" ? (
          <div className="text-center space-y-4">
            <div className="p-4 rounded-lg bg-green-400/10 border border-green-400/20">
              <p className="text-sm text-green-400">
                Successfully connected! Redirecting to dashboard...
              </p>
            </div>
            <Button variant="ghost" className="gap-2" onClick={() => router.push("/dashboard/overview")}>
              Go to Dashboard
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            {connectionStatus === "error" && (
              <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20">
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {walletOptions.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleConnectWallet(wallet.id)}
                  disabled={connectionStatus === "connecting"}
                  className={`w-full p-4 rounded-lg border transition-all flex items-center gap-4 ${
                    selectedWallet === wallet.id && connectionStatus === "connecting"
                      ? "border-[var(--accent-neon)] bg-[var(--accent-neon)]/5"
                      : "border-border hover:border-[var(--accent-gold)]/50 hover:bg-white/5"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                    {wallet.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{wallet.name}</span>
                      {wallet.popular && (
                        <span className="px-2 py-0.5 text-xs bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{wallet.description}</p>
                  </div>
                  {selectedWallet === wallet.id && connectionStatus === "connecting" && (
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-neon)]" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-4">
                New to Solana wallets?{" "}
                <a
                  href="https://phantom.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-neon)] hover:underline inline-flex items-center gap-1"
                >
                  Get Phantom
                  <ExternalLink className="w-3 h-3" />
                </a>
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Demo mode: Click any wallet to connect with a demo address
              </p>
            </div>
          </>
        )}

        <Link href="/auth/login" className="block">
          <Button variant="ghost" className="w-full gap-2">
            <ArrowLeft className="w-4 h-4" />
            Sign in with Email Instead
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
