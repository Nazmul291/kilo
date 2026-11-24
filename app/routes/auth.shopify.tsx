import type { Route } from "./+types/auth.shopify";
import { useEffect, useRef, useState } from "react";
import { Store, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { FooterCredits } from "../components/FooterCredits";
import { setStoredSession } from "../lib/stockly-client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Authenticating with Stockly — Kilo" },
    { name: "robots", content: "noindex, nofollow" },
    // The URL carries a session token: never leak it via the Referer header.
    { name: "referrer", content: "no-referrer" },
  ];
}

type AuthStatus = "pending" | "connecting" | "missing";

/**
 * Reads shop/token from the URL fragment (preferred: never sent to any server)
 * or, for backwards compatibility, from the query string.
 */
function readCredentialsFromLocation(): { shop: string | null; token: string | null } {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const query = new URLSearchParams(window.location.search);
  return {
    shop: hash.get("shop") || query.get("shop"),
    token: hash.get("token") || query.get("token"),
  };
}

export default function AuthShopify() {
  const [status, setStatus] = useState<AuthStatus>("pending");
  const [shop, setShop] = useState<string | null>(null);
  // Read once: StrictMode re-runs effects after the URL has been stripped.
  const credsRef = useRef<{ shop: string | null; token: string | null } | null>(null);

  useEffect(() => {
    credsRef.current ??= readCredentialsFromLocation();
    const creds = credsRef.current;

    // Strip credentials from the address bar and history immediately.
    window.history.replaceState({}, "", window.location.pathname);

    if (!creds.shop || !creds.token) {
      setStatus("missing");
      return;
    }

    setStoredSession(creds.token, creds.shop);
    setShop(creds.shop);
    setStatus("connecting");

    const timer = setTimeout(() => {
      window.location.replace(`/shopify?connected=true&shop=${encodeURIComponent(creds.shop!)}`);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const hasCredentials = status !== "missing";

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      <HeaderNavigation />

      <main className="flex-1 max-w-xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        {hasCredentials ? (
          <div className="w-full rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              {shop ? `Connecting to ${shop}` : "Connecting to Stockly"}
            </h1>
            <p className="text-sm text-slate-400 mb-6">
              Validating HMAC-SHA256 Single Sign-On session from Stockly...
            </p>

            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 py-2.5 px-4 rounded-xl">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Redirecting to your Shopify Product Optimizer...</span>
            </div>
          </div>
        ) : (
          <div className="w-full rounded-3xl border border-red-500/30 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">
              Missing Authentication Parameters
            </h1>
            <p className="text-sm text-slate-400 mb-6">
              To launch Kilo with your Shopify store, please click <strong>"Open in Kilo"</strong> directly from your Stockly app inside Shopify Admin.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/shopify"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                Go to Shopify Optimizer
              </a>
              <a
                href="https://apps.shopify.com/stock-alert-4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <Store className="w-4 h-4" />
                <span>Open Stockly on Shopify</span>
              </a>
            </div>
          </div>
        )}
      </main>

      <FooterCredits />
    </div>
  );
}
