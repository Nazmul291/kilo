import React from "react";
import { useKiloStore } from "../lib/store";
import { formatBytes } from "../lib/compressor";
import { Download, ArrowDown, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";

export function ResultDownloadCard() {
  const compressedResult = useKiloStore((state) => state.compressedResult);
  const processingState = useKiloStore((state) => state.processingState);
  const clearFile = useKiloStore((state) => state.clearFile);

  // Show only when completed
  if (processingState !== "completed" || !compressedResult) {
    return null;
  }

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = compressedResult.blobUrl;
    link.download = compressedResult.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-8 animate-fadeIn">
      <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-900/90 to-emerald-950/20 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
        {/* Header Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Compression Successful!</span>
          </div>

          <span className="text-xs font-mono text-slate-400">
            Format: <strong className="text-white">{compressedResult.format}</strong>
          </span>
        </div>

        {/* Before vs After Visual Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Before */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Original Size
            </span>
            <span className="text-2xl font-black text-slate-300">
              {formatBytes(compressedResult.originalSize)}
            </span>
            <span className="block text-[11px] text-slate-400 mt-1">
              Before optimization
            </span>
          </div>

          {/* After */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
              -{compressedResult.savedPercentage}%
            </div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
              Compressed Size
            </span>
            <span className="text-2xl font-black text-emerald-300">
              {formatBytes(compressedResult.compressedSize)}
            </span>
            <span className="block text-[11px] text-emerald-400/80 mt-1">
              Saved {formatBytes(compressedResult.savedBytes)}!
            </span>
          </div>
        </div>

        {/* Download Action */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full group rounded-2xl py-4 px-6 font-bold text-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3"
          >
            <Download className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
            <span>Download Optimized File ({formatBytes(compressedResult.compressedSize)})</span>
          </button>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={clearFile}
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200 py-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Compress another image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
