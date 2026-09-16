import type { Route } from "./+types/terms";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { FooterCredits } from "../components/FooterCredits";
import { FileText, ArrowLeft, Shield, Mail, Globe } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Terms of Service — Kilo" },
    {
      name: "description",
      content:
        "Terms of Service for Kilo media compression and conversion tool. Read our usage guidelines, user ownership, and service terms.",
    },
    { property: "og:title", content: "Terms of Service — Kilo" },
    { property: "og:type", content: "website" },
  ];
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      <HeaderNavigation />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Back Link */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Kilo Image Compressor</span>
        </a>

        {/* Title */}
        <div className="border-b border-slate-800 pb-6 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-sky-300 bg-sky-950/80 border border-sky-500/30 mb-3">
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Legal Document</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Last Updated: September 16, 2026 • Effective Immediately
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-300">
          <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-sky-400" />
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-300 text-sm">
              By accessing and using <strong>Kilo</strong> (https://kilo.nazmulcodes.org), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please discontinue using this website.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white">
              2. Intellectual Property &amp; File Ownership
            </h2>
            <p className="text-slate-300 text-sm">
              You retain <strong>100% full ownership, rights, and title</strong> to all images and media assets you compress or convert using Kilo. Because all operations execute locally within your browser memory without uploading to our servers, Kilo claims zero copyright or rights to your media files.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white">
              3. Fair &amp; Permitted Use
            </h2>
            <p className="text-slate-300 text-sm">
              Kilo is provided free for both personal and commercial use (such as optimizing product imagery for e-commerce stores, web applications, and digital marketing). You agree not to use the service for illegal, harmful, or malicious purposes.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white">
              4. Sponsorship &amp; External Links
            </h2>
            <p className="text-slate-300 text-sm">
              Kilo is supported and sponsored by <strong>Stockly</strong> (Shopify Inventory Management &amp; Low-Stock Alerts application). Links to external third-party services, including the Shopify App Store and Google AdSense partner networks, are governed by their respective terms and policies.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white">
              5. Disclaimer of Warranties &amp; Limitation of Liability
            </h2>
            <p className="text-slate-300 text-sm">
              Kilo is provided on an <strong>"AS IS" and "AS AVAILABLE"</strong> basis without warranties of any kind, whether express or implied. In no event shall Kilo, its maintainers, or sponsors be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this utility.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white">
              6. Contact Information
            </h2>
            <p className="text-slate-300 text-sm">
              For any legal or technical inquiries, contact us at:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2 text-sm">
              <a
                href="mailto:info@nazmulcodes.org"
                className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:underline"
              >
                <Mail className="w-4 h-4" />
                <span>info@nazmulcodes.org</span>
              </a>
              <a
                href="https://www.nazmulcodes.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-slate-300 font-semibold hover:underline"
              >
                <Globe className="w-4 h-4 text-sky-400" />
                <span>nazmulcodes.org</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      <FooterCredits />
    </div>
  );
}
