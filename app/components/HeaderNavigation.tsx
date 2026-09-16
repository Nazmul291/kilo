import React from "react";
import { KiloLogo } from "./KiloLogo";
import { ExternalLink, Sparkles } from "lucide-react";

export function HeaderNavigation() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Kilo Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <KiloLogo />
        </a>

        {/* Right: Stockly Links (Web App & Shopify App Store) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://stockly.nazmulcodes.org/"
            target="_blank"
            rel="noopener noreferrer"
            title="Stockly — Shopify Inventory Management & Low Stock Alerts"
            className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-slate-900/80 border border-slate-700/60 hover:border-emerald-500/50 hover:bg-slate-800 transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            <span>
              Powered by <strong className="text-white font-semibold group-hover:text-emerald-300 transition-colors">Stockly</strong>
            </span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-200 transition-colors" />
          </a>

          <a
            href="https://apps.shopify.com/stock-alert-4"
            target="_blank"
            rel="noopener noreferrer"
            title="Get Stockly on Shopify App Store"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-sky-300 bg-sky-950/60 border border-sky-500/30 hover:bg-sky-900/60 transition-all duration-200"
          >
            <span>Shopify App</span>
            <ExternalLink className="w-3 h-3 text-sky-400" />
          </a>
        </div>
      </div>
    </header>
  );
}
