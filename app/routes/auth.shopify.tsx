import type { Route } from "./+types/auth.shopify";
import { useEffect } from "react";
import { Store, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { FooterCredits } from "../components/FooterCredits";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Authenticating with Stockly — Kilo" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const token = url.searchParams.get("token");
  const source = url.searchParams.get("source") || "stockly";

  return {
    shop,
    token,
    source,
    hasCredentials: Boolean(shop && token),
  };
}

export default function AuthShopify({ loaderData }: Route.ComponentProps) {
  const { shop, token, hasCredentials } = loaderData;

  useEffect(() => {
    if (hasCredentials && shop && token) {
      // Store in localStorage as specified in the Kilo ↔ Stockly integration contract
      localStorage.setItem("stockly_jwt", token);
      localStorage.setItem("stockly_shop", shop);

      // Brief pause to ensure localStorage is flushed before redirect
      const timer = setTimeout(() => {
        window.location.href = `/shopify?connected=true&shop=${encodeURIComponent(shop)}`;
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [hasCredentials, shop, token]);

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
              Connecting to {shop}
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
