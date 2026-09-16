import React from "react";
import { useKiloStore } from "../lib/store";
import { Zap, Loader2, ArrowRight } from "lucide-react";

export function ActionButton() {
  const file = useKiloStore((state) => state.file);
  const targetFormat = useKiloStore((state) => state.targetFormat);
  const compressionLevel = useKiloStore((state) => state.compressionLevel);
  const processingState = useKiloStore((state) => state.processingState);
  const startCompression = useKiloStore((state) => state.startCompression);

  if (!file) {
    return null;
  }

  const isBusy = processingState === "compressing" || processingState === "analyzing";

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-6">
      <button
        type="button"
        disabled={isBusy}
        onClick={startCompression}
        className={`w-full relative group overflow-hidden rounded-2xl py-4 px-6 font-bold text-base sm:text-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${
          isBusy
            ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
            : "bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 hover:shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.99]"
        }`}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

        {isBusy ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            <span>Processing In-Browser Memory...</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 fill-current" />
            <span>
              Compress & Convert to {targetFormat.toUpperCase()} ({compressionLevel}% Reduction)
            </span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      <p className="text-center text-[11px] text-slate-500 mt-2">
        Zero server footprint • Private in-browser execution
      </p>
    </div>
  );
}
