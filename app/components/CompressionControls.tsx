import React from "react";
import { useKiloStore } from "../lib/store";
import { type TargetFormat } from "../lib/compressor";
import { Sliders, Sparkles, Image as ImageIcon } from "lucide-react";

const FORMAT_OPTIONS: { id: TargetFormat; label: string; tag?: string }[] = [
  { id: "webp", label: "WebP", tag: "Recommended" },
  { id: "original", label: "Original Format" },
  { id: "jpeg", label: "JPEG / JPG" },
  { id: "png", label: "PNG" },
  { id: "ico", label: "Favicon (.ICO)", tag: "Icon" },
];

export function CompressionControls() {
  const file = useKiloStore((state) => state.file);
  const compressionLevel = useKiloStore((state) => state.compressionLevel);
  const targetFormat = useKiloStore((state) => state.targetFormat);
  const setCompressionLevel = useKiloStore((state) => state.setCompressionLevel);
  const setTargetFormat = useKiloStore((state) => state.setTargetFormat);

  if (!file) {
    return null;
  }

  // Label based on slider value
  const getCompressionLabel = (val: number) => {
    if (val <= 10) return "Lossless / High Quality (Minimal Reduction)";
    if (val <= 50) return "Light Compression (Very High Quality)";
    if (val <= 75) return "Balanced (Recommended for E-Commerce)";
    return "Aggressive Reduction (Maximum Data Savings)";
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-6">
      <div className="rounded-3xl border border-slate-700/80 bg-slate-900/60 p-6 backdrop-blur-sm shadow-xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Compression & Format Settings</h3>
          </div>
          <span className="text-xs text-slate-400">100% In-Memory Canvas</span>
        </div>

        {/* Compression Level Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="compression-slider" className="text-sm font-semibold text-slate-200">
              Compression Level
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded">
                {compressionLevel}% Reduction
              </span>
            </div>
          </div>

          <div className="relative">
            <input
              id="compression-slider"
              type="range"
              min="0"
              max="90"
              step="1"
              value={compressionLevel}
              onChange={(e) => setCompressionLevel(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>0% (Lossless)</span>
              <span>45%</span>
              <span>65% (Optimal)</span>
              <span>90% (Aggressive)</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            Mode: <span className="text-slate-200">{getCompressionLabel(compressionLevel)}</span>
          </p>
        </div>

        {/* Target Format Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-200 block">
            Target Output Format
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {FORMAT_OPTIONS.map((opt) => {
              const isSelected = targetFormat === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTargetFormat(opt.id)}
                  className={`relative p-3 rounded-2xl border text-left sm:text-center transition-all duration-200 flex flex-col items-start sm:items-center justify-center gap-1 ${
                    isSelected
                      ? "border-emerald-400 bg-emerald-950/40 text-white shadow-md shadow-emerald-500/10 scale-[1.02]"
                      : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {opt.tag && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                        isSelected
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {opt.tag}
                    </span>
                  )}
                  <span className="text-sm font-bold">{opt.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-slate-500">
            {targetFormat === "webp" && "WebP produces 25%–35% smaller files than JPEG with high visual fidelity."}
            {targetFormat === "ico" && "Generates a multi-size Windows .ICO file (16x16, 32x32, 48x48) perfect for website favicons."}
            {targetFormat === "png" && "PNG maintains full alpha transparency, ideal for logos and UI graphics."}
            {targetFormat === "jpeg" && "Standard JPEG format compatible across all legacy devices and platforms."}
            {targetFormat === "original" && "Keeps the original image container format while re-encoding."}
          </p>
        </div>
      </div>
    </div>
  );
}
