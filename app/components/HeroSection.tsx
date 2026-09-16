import React from "react";
import { ShieldCheck, HardDriveDownload } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-6 text-center max-w-4xl mx-auto px-4">
      {/* Glow background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Feature pill badges: 100% Private & Instant Download only */}
      <div className="inline-flex flex-wrap items-center justify-center gap-3 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Private</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 shadow-sm">
          <HardDriveDownload className="w-3.5 h-3.5 text-amber-400" />
          <span>Instant Download</span>
        </div>
      </div>

      {/* Primary Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
        Turn Heavy <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">MBs</span> into Fast-Loading{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">KBs</span>
      </h1>

      {/* Subtitle / Value Proposition without 'client-side' */}
      <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
        High-speed media compression and modern format conversion tailored for e-commerce merchants and web developers. Optimize WebP, PNG, JPEG, and create website favicons effortlessly.
      </p>
    </section>
  );
}
