"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function WalletConnectPage() {
  const router = useRouter();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("idle");
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnectWallet = async (walletId: string) => {
    setSelectedWallet(walletId);
    setConnectionStatus("connecting");

    // TODO: Implement actual wallet connection logic
    // - Detect if wallet extension is installed
    // - Request connection to the wallet
    // - Get public key and sign authentication message
    // - Verify signature on backend
    // - Create or retrieve user account
    // - Store session token

    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate successful connection with mock address
    const mockAddress = "7xKX...8dY2";
    setWalletAddress(mockAddress);
    setConnectionStatus("connected");

    // Auto-redirect after successful connection
    setTimeout(() => {
      router.push("/dashboard/overview");
    }, 1500);
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
        return "Connection failed. Please try again.";
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
