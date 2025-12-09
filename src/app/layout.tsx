import type { Metadata } from "next";
import "@/styles/globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Kyzlo Platform | Automated Quant Trading",
  description:
    "Advanced DeFi and TradFi trading platform. Automated bots for crypto, stocks, and commodities.",
  keywords: ["DeFi", "trading", "crypto", "bots", "quantitative", "Solana", "stocks"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-galaxy min-h-screen">
        {/* Starfield background effect */}
        <div className="starfield" aria-hidden="true" />

        {/* Main content wrapper */}
        <TooltipProvider>
          <div className="relative z-10 min-h-screen">{children}</div>
        </TooltipProvider>
      </body>
    </html>
  );
}
