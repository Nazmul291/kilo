import React from "react";
import { KiloLogo } from "./KiloLogo";
import { ExternalLink } from "lucide-react";

export function HeaderNavigation() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Kilo Logo */}
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2 group">
            <KiloLogo />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-400">
            <a
              href="/"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
            >
              Compressor
            </a>
            <a
              href="/shopify"
              className="px-3 py-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/20 transition-all font-semibold flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Shopify Sync</span>
            </a>
            <a
              href="/story"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
            >
              Our Story
            </a>
            <a
              href="/blog"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
            >
              Guides &amp; Blog
            </a>
            <a
              href="/research"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
            >
              Research
            </a>
          </nav>
        </div>

        {/* Right: Powered by NazmulCodes */}
        <div className="flex items-center gap-2">
          <a
            href="https://www.nazmulcodes.org/"
            target="_blank"
            rel="noopener noreferrer"
            title="NazmulCodes — Senior Full-Stack & Shopify Engineer"
            className="group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-slate-900/80 border border-slate-700/60 hover:border-emerald-500/50 hover:bg-slate-800 transition-all duration-200"
          >
            <img
              src="/nazmulcodes-logo.svg"
              alt="NazmulCodes Logo"
              width="16"
              height="16"
              className="w-4 h-4 rounded-sm object-contain group-hover:scale-110 transition-transform"
            />
            <span className="hidden sm:inline">
              Powered by{" "}
              <strong className="text-white font-semibold group-hover:text-emerald-300 transition-colors">
                NazmulCodes
              </strong>
            </span>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-200 transition-colors" />
          </a>
        </div>
      </div>
    </header>
  );
}
