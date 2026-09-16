import React, { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already chosen cookie preferences
    const consent = localStorage.getItem("kilo_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("kilo_cookie_consent", "all");
    setShowBanner(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem("kilo_cookie_consent", "essential");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fadeIn">
      <div className="rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md text-slate-200">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>

          <div className="flex-1 text-xs">
            <p className="font-bold text-white text-sm mb-1">
              Cookie &amp; Privacy Choices
            </p>
            <p className="text-slate-400 leading-relaxed">
              We use cookies and Google AdSense to personalize ads and keep Kilo free. Your uploaded media files are 100% private and never leave your device.
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleEssentialOnly}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
              >
                Essential Only
              </button>
              <a
                href="/privacy"
                aria-label="Read our Privacy and Cookie Policy"
                className="px-2 py-1.5 text-slate-400 hover:text-emerald-400 font-semibold text-xs underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={handleEssentialOnly}
            className="text-slate-400 hover:text-slate-200 p-1"
            title="Dismiss"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
