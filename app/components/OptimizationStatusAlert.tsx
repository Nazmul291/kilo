import React from "react";
import { useKiloStore } from "../lib/store";
import { CheckCircle, Info } from "lucide-react";

export function OptimizationStatusAlert() {
  const fileAnalysis = useKiloStore((state) => state.fileAnalysis);
  const file = useKiloStore((state) => state.file);

  if (!file || !fileAnalysis || !fileAnalysis.isAlreadyOptimized) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-4 animate-fadeIn">
      <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/40 p-4 text-emerald-300 flex items-start gap-3 shadow-lg shadow-emerald-950/20">
        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-emerald-200">
            Already Optimized! Further compression may reduce quality.
          </p>
          <p className="text-xs text-emerald-400/90 mt-0.5 leading-relaxed">
            This image has a lean density ratio ({fileAnalysis.bytesPerPixel.toFixed(2)} bytes/pixel). You can still proceed if you wish to convert formats (e.g. to WebP or Favicon .ICO) or apply aggressive downsizing.
          </p>
        </div>
      </div>
    </div>
  );
}
