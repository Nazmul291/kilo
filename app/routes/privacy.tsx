import type { Route } from "./+types/privacy";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { FooterCredits } from "../components/FooterCredits";
import { ShieldCheck, Cookie, ArrowLeft, Lock, Mail, ExternalLink, Globe } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy — Kilo" },
    {
      name: "description",
      content:
        "Privacy Policy for Kilo. 100% client-side in-memory processing. Learn how we handle privacy, zero server storage, and Google AdSense advertising cookies.",
    },
    { property: "og:title", content: "Privacy Policy — Kilo" },
    { property: "og:type", content: "website" },
  ];
}

export default function PrivacyPolicy() {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 mb-3">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Legal Document</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400 mt-2">
            Last Updated: September 16, 2026 • Effective Immediately
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. 100% Private In-Browser Processing (Zero Server Storage)
            </h2>
            <p className="text-slate-300 text-sm">
              At <strong>Kilo</strong>, accessible from <a href="https://kilo.nazmulcodes.org" className="text-emerald-400 underline">https://kilo.nazmulcodes.org</a>, privacy is our core architectural foundation.
            </p>
            <p className="text-slate-300 text-sm">
              All image compression, format conversions (WebP, PNG, JPEG, ICO), and data processing happen <strong>100% locally in your device's browser memory</strong> (using HTML5 Canvas, Web Workers, and WebAssembly).
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-400 space-y-1">
              <li>Your images are <strong>never uploaded</strong> to any remote server or cloud database.</li>
              <li>We do not store, view, copy, inspect, or log your media assets.</li>
              <li>Once you close the browser tab or upload a new file, all temporary memory references are completely cleared.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Cookie className="w-5 h-5 text-amber-400" />
              2. Cookies &amp; Google AdSense Advertising
            </h2>
            <p className="text-slate-300 text-sm">
              Kilo is provided as a free utility. To support hosting and maintenance costs, we partner with <strong>Google AdSense</strong> to display advertisements.
            </p>
            <p className="text-slate-300 text-sm">
              Google, as a third-party vendor, uses cookies to serve ads on this website:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-400 space-y-1.5">
              <li>
                <strong>DoubleClick DART Cookie:</strong> Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to Kilo and other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline font-medium inline-flex items-center gap-1"
                >
                  <span>Google Ads Settings</span>
                  <ExternalLink className="w-3 h-3" />
                </a>.
              </li>
              <li>
                Alternatively, you can opt out of third-party vendors' cookies for personalized advertising by visiting{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 underline font-medium inline-flex items-center gap-1"
                >
                  <span>aboutads.info</span>
                  <ExternalLink className="w-3 h-3" />
                </a>.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white">
              3. GDPR &amp; CCPA Privacy Rights
            </h2>
            <p className="text-slate-300 text-sm">
              Under international data regulations such as the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you have the right to request information on any personal data held about you.
            </p>
            <p className="text-slate-300 text-sm">
              Because Kilo does not collect, track, or store personal account profiles or uploaded media files, we hold no user data to transfer or sell.
            </p>
          </section>

          {/* Section 4 */}
          <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white">
              4. Local Storage Preferences
            </h2>
            <p className="text-slate-300 text-sm">
              We use browser <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs text-emerald-300">localStorage</code> exclusively to save your cookie consent choice and user interface preferences, preventing repetitive prompts.
            </p>
          </section>

          {/* Section 5 */}
          <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-3">
            <h2 className="text-lg font-bold text-white">
              5. Contact Us
            </h2>
            <p className="text-slate-300 text-sm">
              If you have any questions, feedback, or concerns regarding this Privacy Policy, feel free to contact the maintainer:
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
