"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ExternalLink, TrendingUp, TrendingDown } from "lucide-react";

export interface WalletBalance {
  asset: string;
  symbol: string;
  chain: string;
  balance: number;
  value: number;
  change24h: number;
  icon: string;
}

interface WalletBalancesTableProps {
  balances: WalletBalance[];
  className?: string;
}

const chainColors: Record<string, string> = {
  Solana: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  Ethereum: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  Polygon: "bg-violet-500/10 text-violet-400 border-violet-500/30",
  Alpaca: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
};

export function WalletBalancesTable({ balances, className }: WalletBalancesTableProps) {
  return (
    <div className={cn("rounded-lg border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Chain</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">24h Change</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {balances.map((balance) => (
            <TableRow key={`${balance.symbol}-${balance.chain}`}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-lg">
                    {balance.icon}
                  </div>
                  <div>
                    <p className="font-medium">{balance.asset}</p>
                    <p className="text-xs text-muted-foreground">{balance.symbol}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn(chainColors[balance.chain])}>
                  {balance.chain}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-mono">
                {balance.balance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 6,
                })}
              </TableCell>
              <TableCell className="text-right font-mono font-medium">
                ${balance.value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {balance.change24h >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span
                    className={cn(
                      "font-mono text-sm",
                      balance.change24h >= 0 ? "text-green-400" : "text-red-400"
                    )}
                  >
                    {balance.change24h >= 0 ? "+" : ""}
                    {balance.change24h.toFixed(2)}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
