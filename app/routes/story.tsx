import type { Route } from "./+types/story";
import nazmulcodesLogoUrl from "../assets/nazmulcodes-logo.svg";
import stocklyLogoUrl from "../assets/stockly-logo.png";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { FooterCredits } from "../components/FooterCredits";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Cpu,
  Heart,
  ExternalLink,
  ArrowLeft,
  Store,
  Layers,
  Award,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Our Story — Why We Built Kilo (The Zero-Server Philosophy)" },
    {
      name: "description",
      content:
        "Learn the mission behind Kilo: A 100% private, client-side media compression tool created by NazmulCodes and sponsored by Stockly to eliminate paywalls and data harvesting.",
    },
    { name: "robots", content: "index, follow" },
    {
      name: "keywords",
      content:
        "about kilo, our story kilo, nazmulcodes, client side image compressor, free private image compression, stockly shopify sponsor",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://kilo.nazmulcodes.org/story",
    },
    { property: "og:title", content: "Our Story — Why We Built Kilo" },
    {
      property: "og:description",
      content:
        "The story behind Kilo: 100% in-browser image compression with zero server uploads and zero privacy compromise.",
    },
    { property: "og:url", content: "https://kilo.nazmulcodes.org/story" },
    { property: "og:type", content: "website" },
  ];
}

export default function OurStory() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Our Story — Kilo",
    url: "https://kilo.nazmulcodes.org/story",
    description:
      "The mission, philosophy, and engineering behind Kilo's zero-server client-side media compression platform.",
    mainEntity: {
      "@type": "Organization",
      name: "Kilo",
      url: "https://kilo.nazmulcodes.org",
      founder: {
        "@type": "Person",
        name: "Nazmul Hawlader",
        jobTitle: "Senior Full-Stack & Shopify Engineer",
        url: "https://www.nazmulcodes.org/",
      },
      sponsor: {
        "@type": "Organization",
        name: "Stockly",
        url: "https://stockly.nazmulcodes.org/",
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeaderNavigation />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Back navigation */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Kilo Tool</span>
        </a>

        {/* Hero header */}
        <div className="space-y-4 border-b border-slate-800/80 pb-10 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>The Kilo Philosophy</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Why We Built Kilo: The Zero-Server Media Philosophy
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            We believe that basic media compression should be instant, completely private, and permanently free for everyone—without cloud queues, subscription paywalls, or privacy risks.
          </p>
        </div>

        {/* Story Content Sections */}
        <div className="space-y-12 text-slate-300 text-sm sm:text-base leading-relaxed">
          {/* Section 1: The Problem */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Zap className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <span>1. The Problem with Modern Image Converters</span>
            </h2>
            <p>
              Every modern website designer, developer, and e-commerce merchant knows the rule: <em>keep your images lightweight</em>. Heavy images ruin mobile page speeds, increase bounce rates, and hurt Google search rankings.
            </p>
            <p>
              Yet when you try to compress an image online, you inevitably run into three frustrating obstacles:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
                <span className="text-rose-400 font-bold text-sm block">1. Artificial Limits</span>
                <p className="text-xs text-slate-400">
                  Services that restrict you to 5 MB per file or 20 conversions per day unless you enter a credit card.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
                <span className="text-amber-400 font-bold text-sm block">2. Privacy Invasions</span>
                <p className="text-xs text-slate-400">
                  Uploading private business photography and personal files to unknown third-party cloud servers where they are stored on disk.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
                <span className="text-sky-400 font-bold text-sm block">3. Sluggish Upload Speeds</span>
                <p className="text-xs text-slate-400">
                  Waiting 10–30 seconds for a 20 MB image to upload over your network just to download it back down.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: The Breakthrough */}
          <section className="space-y-4 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-950 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Cpu className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <span>2. The Engineering Breakthrough: 100% Client-Side RAM</span>
            </h2>
            <p>
              Modern web browsers (Chrome, Safari, Firefox, Edge) are operating systems in their own right. Your computer or smartphone has multiple gigabytes of high-speed RAM and hardware-accelerated GPUs that are hundreds of times faster than shared cloud containers.
            </p>
            <p>
              We designed Kilo from the ground up to utilize <strong>zero backend processing servers</strong>:
            </p>
            <ul className="space-y-2 pl-2 text-sm">
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span><strong>Pure In-Memory Streams:</strong> Files dropped into Kilo are decoded into browser memory using HTML5 Canvas and WebAssembly. No bytes ever leave your machine.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span><strong>Real-Time Re-encoding:</strong> WebP, PNG, JPEG, and Windows multi-resolution Favicon (.ICO) algorithms run on your local hardware in fractions of a second.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                <span><strong>Zero Server Cost &rarr; Permanently Free:</strong> Because we don't pay for multi-terabyte cloud compute and bandwidth bills to process your files, Kilo can remain free forever.</span>
              </li>
            </ul>
          </section>

          {/* Section 3: Founder & Sponsoring Partnership */}
          <section className="space-y-6 pt-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Heart className="w-6 h-6 text-rose-400 flex-shrink-0" />
              <span>3. Built by NazmulCodes &amp; Supported by Stockly</span>
            </h2>
            <p>
              Kilo was conceived and engineered by <strong>Nazmul Hawlader (NazmulCodes)</strong>, a Senior Full-Stack &amp; Shopify App Engineer specializing in high-performance web applications, serverless architecture, and e-commerce infrastructure.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Founder Profile Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center">
                    <img
                      src={nazmulcodesLogoUrl}
                      alt="NazmulCodes"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Nazmul Hawlader</h3>
                    <p className="text-xs text-emerald-400 font-medium">Founder &amp; Lead Architect</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dedicated to engineering resilient, zero-server-waste web tools and merchant solutions. Check out other open-source projects, case studies, and engineering writeups on the official portfolio.
                </p>
                <a
                  href="https://www.nazmulcodes.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Visit nazmulcodes.org</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Sponsor Profile Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 p-2 flex items-center justify-center">
                    <img
                      src={stocklyLogoUrl}
                      alt="Stockly Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Stockly</h3>
                    <p className="text-xs text-sky-400 font-medium">Official Supporting Sponsor</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Stockly is the official Shopify app that helps thousands of e-commerce brands automate low-stock notifications, hide out-of-stock items, and eliminate overselling.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="https://apps.shopify.com/stock-alert-4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-300 hover:text-sky-200 transition-colors"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Shopify App Store</span>
                  </a>
                  <span className="text-slate-600">•</span>
                  <a
                    href="https://stockly.nazmulcodes.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    <span>Open Web App</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Call to Action */}
          <div className="pt-8 border-t border-slate-800/80 text-center space-y-4">
            <h3 className="text-xl font-bold text-white">Ready to experience lightning-fast compression?</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No registration, no cookies required to process, and zero bytes stored.
            </p>
            <div className="pt-2">
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                Launch Kilo Compressor
              </a>
            </div>
          </div>
        </div>
      </main>

      <FooterCredits />
    </div>
  );
}
