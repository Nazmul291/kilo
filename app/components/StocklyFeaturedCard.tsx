import React from "react";
import { Boxes, BellRing, ArrowUpRight, CheckCircle2, Store } from "lucide-react";

export function StocklyFeaturedCard() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-8">
      <div className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-sky-950/40 p-6 sm:p-7 backdrop-blur-sm shadow-xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-2 max-w-md">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-sky-300 bg-sky-950/80 border border-sky-500/30">
              <Store className="w-3 h-3 text-sky-400" />
              <span>SPONSORED BY STOCKLY</span>
            </div>

            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Running an E-commerce Store on Shopify?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Stop losing revenue to stockouts. <strong className="text-white">Stockly</strong> keeps your Shopify inventory accurate with automated low-stock notifications and multi-location tracking.
            </p>

            {/* Value bullets */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Instant Low-Stock Alerts</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Multi-Location Sync</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Zero Sales Interruption</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex-shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
            <a
              href="https://apps.shopify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white bg-sky-500 hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/20 group"
            >
              <span>Explore Stockly on Shopify</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
