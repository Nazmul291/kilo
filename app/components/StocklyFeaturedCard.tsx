import React from "react";
import stocklyLogoUrl from "../assets/stockly-logo.png";
import { ArrowUpRight, CheckCircle2, Store, Globe, Sparkles } from "lucide-react";

export interface SponsorApp {
  id: string;
  name: string;
  category: string;
  description: string;
  logoUrl: string;
  badge?: string;
  rating?: string;
  appStoreUrl?: string;
  webUrl?: string;
  features: string[];
}

// Extensible list for current and future sponsored apps
const SPONSOR_APPS: SponsorApp[] = [
  {
    id: "stockly",
    name: "Stockly",
    category: "Official Shopify Embedded App",
    description:
      "Monitor merchant inventory in real-time, automatically hide out-of-stock items to prevent overselling, and dispatch automated multi-channel low-stock alerts.",
    logoUrl: stocklyLogoUrl,
    badge: "Featured Sponsor",
    rating: "4.9 ★ Rating",
    appStoreUrl: "https://apps.shopify.com/stock-alert-4",
    webUrl: "https://stockly.nazmulcodes.org/",
    features: [
      "Instant Low-Stock Notifications",
      "Multi-Location Inventory Sync",
      "Zero Overselling Protection",
    ],
  },
];

export function StocklyFeaturedCard() {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 mt-12">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Sponsored by
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Sponsored Ecosystem Partner
        </span>
      </div>

      {/* List of Sponsor Apps */}
      <div className="space-y-4">
        {SPONSOR_APPS.map((app) => (
          <div
            key={app.id}
            className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-7 shadow-xl hover:border-slate-700 transition-all duration-300"
          >
            {/* Subtle glow accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Left: App Logo & Details */}
              <div className="flex items-start gap-4 max-w-lg">
                {/* App Logo */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md flex-shrink-0 flex items-center justify-center p-2">
                  <img
                    src={app.logoUrl}
                    alt={`${app.name} Logo`}
                    width="80"
                    height="80"
                    loading="lazy"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>

                {/* App Content */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-extrabold text-white tracking-tight">
                      {app.name}
                    </h3>
                    {app.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        {app.badge}
                      </span>
                    )}
                    {app.rating && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        {app.rating}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-sky-400 font-semibold">
                    {app.category}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-0.5">
                    {app.description}
                  </p>

                  {/* Bullet features */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-xs text-slate-400">
                    {app.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Action CTAs */}
              <div className="flex-shrink-0 w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2 pt-2 md:pt-0">
                {app.appStoreUrl && (
                  <a
                    href={app.appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full md:w-44 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20 group"
                  >
                    <Store className="w-4 h-4" />
                    <span>Shopify App Store</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}

                {app.webUrl && (
                  <a
                    href={app.webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full md:w-44 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
                  >
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>Open Web App</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}

                <a
                  href="/shopify"
                  className="inline-flex items-center justify-center gap-1.5 w-full md:w-44 px-4 py-2 rounded-xl font-bold text-xs text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-500/30 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Batch Optimizer</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
