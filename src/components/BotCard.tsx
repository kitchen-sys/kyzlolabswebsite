import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Play, Pause, Settings, TrendingUp, TrendingDown } from "lucide-react";

export interface BotData {
  id: string;
  name: string;
  market: string;
  pair: string;
  status: "running" | "paused" | "stopped" | "error";
  pnl: number;
  pnlPercent: number;
  tradesCount: number;
  strategy: string;
}

interface BotCardProps {
  bot: BotData;
  className?: string;
  onToggle?: (botId: string) => void;
  onSettings?: (botId: string) => void;
}

const statusConfig = {
  running: { label: "Running", variant: "success" as const, color: "bg-green-400" },
  paused: { label: "Paused", variant: "warning" as const, color: "bg-yellow-400" },
  stopped: { label: "Stopped", variant: "outline" as const, color: "bg-gray-400" },
  error: { label: "Error", variant: "destructive" as const, color: "bg-red-400" },
};

export function BotCard({ bot, className, onToggle, onSettings }: BotCardProps) {
  const status = statusConfig[bot.status];
  const isPositive = bot.pnl >= 0;

  return (
    <Card className={cn("group hover:border-[var(--accent-neon)]/30 transition-colors", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{bot.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{bot.pair}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", status.color)} />
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* PnL */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total PnL</span>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={cn("font-semibold", isPositive ? "text-green-400" : "text-red-400")}>
              {isPositive ? "+" : ""}${bot.pnl.toLocaleString()}
            </span>
            <span className={cn("text-xs", isPositive ? "text-green-400" : "text-red-400")}>
              ({isPositive ? "+" : ""}{bot.pnlPercent}%)
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Strategy</p>
            <p className="font-medium">{bot.strategy}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Trades</p>
            <p className="font-medium">{bot.tradesCount}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant={bot.status === "running" ? "outline" : "default"}
            size="sm"
            className="flex-1"
            onClick={() => onToggle?.(bot.id)}
          >
            {bot.status === "running" ? (
              <>
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1" />
                Start
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onSettings?.(bot.id)}>
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
