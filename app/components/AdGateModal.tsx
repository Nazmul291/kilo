import React, { useEffect } from "react";
import { useKiloStore } from "../lib/store";
import { X, Sparkles, Check, ExternalLink } from "lucide-react";

export function AdGateModal() {
  const processingState = useKiloStore((state) => state.processingState);
  const adTimer = useKiloStore((state) => state.adTimer);
  const decrementAdTimer = useKiloStore((state) => state.decrementAdTimer);
  const closeAdGate = useKiloStore((state) => state.closeAdGate);

  // Active 5-second countdown effect
  useEffect(() => {
    if (processingState !== "ad_gate") return;

    const interval = setInterval(() => {
      decrementAdTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [processingState, decrementAdTimer]);

  if (processingState !== "ad_gate") {
    return null;
  }

  const isReady = adTimer === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-5 text-center">
        {/* Top bar with compliant dismiss button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Advertisement / Sponsor
            </span>
          </div>

          <button
            type="button"
            onClick={closeAdGate}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Skip or Close"
            aria-label="Skip or close advertisement"
          >
            <span>Skip</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message header */}
        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-white">
            Your file is ready to save!
          </h3>
          <p className="text-xs text-slate-400">
            Kilo is 100% free, supported by Stockly.
          </p>
        </div>

        {/* Rigid-dimension AdSense container (300x250 Medium Rectangle to eliminate CLS) */}
        <div className="flex justify-center my-2">
          <div
            className="w-[300px] h-[250px] rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden relative"
            id="ad-slot-container"
          >
            <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-600 uppercase">
              Featured Sponsor
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Shopify Inventory Automation</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[230px]">
                  Never lose a sale to stockouts. Track and sync multi-location Shopify inventory with Stockly.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-1">
                <a
                  href="https://stockly.nazmulcodes.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 flex items-center gap-1"
                >
                  <span>Web App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-slate-600">•</span>
                <a
                  href="https://apps.shopify.com/stock-alert-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 underline underline-offset-4 flex items-center gap-1"
                >
                  <span>Shopify Store</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown & Unlock Action Button */}
        <div>
          <button
            type="button"
            onClick={closeAdGate}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              isReady
                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {isReady ? (
              <>
                <Check className="w-4 h-4" />
                <span>Continue to Download Now</span>
              </>
            ) : (
              <span>Your download unlocks in {adTimer}s... (Click to skip)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
