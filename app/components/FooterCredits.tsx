import React from "react";
import { KiloLogo } from "./KiloLogo";
import { ShieldCheck, ExternalLink, Store, User } from "lucide-react";

export function FooterCredits() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 mt-20 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left branding */}
        <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
          <KiloLogo className="w-7 h-7" textClassName="text-lg font-bold" />
          <p className="text-xs text-slate-400 max-w-sm">
            High-Speed Media Compression &amp; Format Conversion for Developers and E-Commerce Merchants.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Private</span>
            </span>
            <span>•</span>
            <a
              href="/story"
              className="hover:text-emerald-400 transition-colors underline underline-offset-2"
            >
              Our Story
            </a>
            <span>•</span>
            <a
              href="/blog"
              className="hover:text-emerald-400 transition-colors underline underline-offset-2"
            >
              Guides &amp; Blog
            </a>
            <span>•</span>
            <a
              href="/research"
              className="hover:text-emerald-400 transition-colors underline underline-offset-2"
            >
              Research
            </a>
            <span>•</span>
            <a
              href="https://github.com/Nazmul291/kilo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-slate-300 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>GitHub</span>
            </a>
            <span>•</span>
            <a
              href="/privacy"
              className="hover:text-emerald-400 transition-colors underline underline-offset-2"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a
              href="/terms"
              className="hover:text-emerald-400 transition-colors underline underline-offset-2"
            >
              Terms of Service
            </a>
          </div>
        </div>

        {/* Center / Right Links */}
        <div className="flex flex-col items-center md:items-end gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-slate-300">
            <span>Sponsored by</span>
            <a
              href="https://stockly.nazmulcodes.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-emerald-400 font-bold underline underline-offset-2 transition-colors flex items-center gap-1"
            >
              <span>Stockly Web App</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>&amp;</span>
            <a
              href="https://apps.shopify.com/stock-alert-4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-300 hover:text-sky-200 font-bold underline underline-offset-2 transition-colors flex items-center gap-1"
            >
              <Store className="w-3 h-3" />
              <span>Shopify App Store</span>
            </a>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Built by</span>
            <a
              href="https://www.nazmulcodes.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-200 hover:text-emerald-400 underline underline-offset-2 transition-colors flex items-center gap-1"
            >
              <User className="w-3 h-3" />
              <span>Nazmul Hawlader (Founder)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
