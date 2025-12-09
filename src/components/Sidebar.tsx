"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  TrendingUp,
  Coins,
  ArrowLeftRight,
  Wallet,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

const navigationItems = [
  {
    name: "Overview",
    href: "/dashboard/overview",
    icon: LayoutDashboard,
  },
  {
    name: "Crypto Bots",
    href: "/dashboard/crypto-bots",
    icon: Bot,
  },
  {
    name: "Stock Bots",
    href: "/dashboard/stock-bots",
    icon: TrendingUp,
  },
  {
    name: "Commodities",
    href: "/dashboard/commodities",
    icon: Coins,
  },
  {
    name: "DEX",
    href: "/dashboard/dex",
    icon: ArrowLeftRight,
  },
  {
    name: "Wallet",
    href: "/dashboard/wallet",
    icon: Wallet,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-card/50 border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-neon)] to-[var(--accent-gold)] flex items-center justify-center flex-shrink-0">
          <span className="text-black font-bold text-sm">K</span>
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-gradient-gold">KYZLO</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          const linkContent = (
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                isActive
                  ? "bg-[var(--accent-neon)]/10 text-[var(--accent-neon)] border border-[var(--accent-neon)]/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-[var(--accent-neon)]" : "group-hover:text-foreground"
                )}
              />
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.name}</TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.href}>{linkContent}</div>;
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
