"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownUp, Settings, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  price: number;
}

const tokens: Token[] = [
  { symbol: "SOL", name: "Solana", icon: "◎", balance: 125.45, price: 195.32 },
  { symbol: "USDC", name: "USD Coin", icon: "$", balance: 5420.0, price: 1.0 },
  { symbol: "RAY", name: "Raydium", icon: "☀", balance: 340.5, price: 4.82 },
  { symbol: "JUP", name: "Jupiter", icon: "♃", balance: 1200.0, price: 1.15 },
  { symbol: "BONK", name: "Bonk", icon: "🐕", balance: 45000000, price: 0.00003 },
];

interface SwapBoxProps {
  className?: string;
}

export function SwapBox({ className }: SwapBoxProps) {
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [slippage, setSlippage] = useState("0.5");

  const fromTokenData = tokens.find((t) => t.symbol === fromToken);
  const toTokenData = tokens.find((t) => t.symbol === toToken);

  const toAmount = fromAmount && fromTokenData && toTokenData
    ? (parseFloat(fromAmount) * fromTokenData.price / toTokenData.price).toFixed(4)
    : "";

  const handleSwap = async () => {
    setIsLoading(true);

    // TODO: Implement actual swap logic via Jupiter API
    // - Get quote from Jupiter aggregator
    // - Build swap transaction
    // - Sign with connected wallet
    // - Submit and confirm transaction
    // - Update balances

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const handleSwitchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Swap</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">From</Label>
            <span className="text-xs text-muted-foreground">
              Balance: {fromTokenData?.balance.toLocaleString()} {fromToken}
            </span>
          </div>
          <div className="flex gap-2">
            <Select value={fromToken} onValueChange={setFromToken}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <span className="flex items-center gap-2">
                      <span>{token.icon}</span>
                      <span>{token.symbol}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1 text-right font-mono"
            />
          </div>
          <div className="flex justify-end gap-2">
            {["25%", "50%", "75%", "MAX"].map((percent) => (
              <Button
                key={percent}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  const pct = percent === "MAX" ? 1 : parseInt(percent) / 100;
                  setFromAmount(((fromTokenData?.balance || 0) * pct).toString());
                }}
              >
                {percent}
              </Button>
            ))}
          </div>
        </div>

        {/* Switch Button */}
        <div className="flex justify-center -my-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8 bg-background z-10"
            onClick={handleSwitchTokens}
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        {/* To */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm text-muted-foreground">To</Label>
            <span className="text-xs text-muted-foreground">
              Balance: {toTokenData?.balance.toLocaleString()} {toToken}
            </span>
          </div>
          <div className="flex gap-2">
            <Select value={toToken} onValueChange={setToToken}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    <span className="flex items-center gap-2">
                      <span>{token.icon}</span>
                      <span>{token.symbol}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="0.00"
              value={toAmount}
              readOnly
              className="flex-1 text-right font-mono bg-muted/50"
            />
          </div>
        </div>

        {/* Route Info */}
        {fromAmount && parseFloat(fromAmount) > 0 && (
          <div className="p-3 rounded-lg bg-muted/50 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                Rate
              </span>
              <span className="font-mono">
                1 {fromToken} = {(fromTokenData!.price / toTokenData!.price).toFixed(4)} {toToken}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Slippage</span>
              <span className="text-[var(--accent-neon)]">{slippage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Route</span>
              <span className="text-[var(--accent-gold)]">Jupiter Aggregator</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <Button
          className="w-full"
          size="lg"
          disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isLoading}
          onClick={handleSwap}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Swapping...
            </>
          ) : !fromAmount || parseFloat(fromAmount) <= 0 ? (
            "Enter an amount"
          ) : (
            "Swap via Jupiter"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
