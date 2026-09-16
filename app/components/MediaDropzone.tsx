import React, { useRef, useState } from "react";
import { useKiloStore } from "../lib/store";
import { formatBytes } from "../lib/compressor";
import { UploadCloud, FileImage, X, CheckCircle2, AlertCircle } from "lucide-react";

export function MediaDropzone() {
  const file = useKiloStore((state) => state.file);
  const fileAnalysis = useKiloStore((state) => state.fileAnalysis);
  const previewUrl = useKiloStore((state) => state.previewUrl);
  const processingState = useKiloStore((state) => state.processingState);
  const errorMessage = useKiloStore((state) => state.errorMessage);
  const setFile = useKiloStore((state) => state.setFile);
  const clearFile = useKiloStore((state) => state.clearFile);

  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const openPicker = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,image/gif,image/svg+xml,image/x-icon"
        className="hidden"
        aria-label="Upload image file to compress"
        onChange={handleFileChange}
      />

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openPicker}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
            isDragOver
              ? "border-emerald-400 bg-emerald-950/20 scale-[1.01] shadow-xl shadow-emerald-500/10"
              : "border-slate-700/80 bg-slate-900/40 hover:border-slate-500 hover:bg-slate-900/70"
          }`}
        >
          {/* Icon container */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:text-emerald-400 transition-all duration-300 shadow-inner">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h2 className="text-lg font-bold text-white mb-2">
            Drag & Drop your image here, or <span className="text-emerald-400 underline underline-offset-4 group-hover:text-emerald-300">browse</span>
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-4">
            Supports JPEG, PNG, WebP, AVIF, SVG, GIF, and ICO formats.
          </p>

          <div className="inline-flex items-center gap-3 text-xs text-slate-400">
            <span>• 100% Private</span>
            <span>• No file size limits</span>
            <span>• Instant conversions</span>
          </div>
        </div>
      ) : (
        /* Selected file card */
        <div className="relative rounded-3xl border border-slate-700/80 bg-slate-900/80 p-5 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            {/* Preview thumbnail */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={file.name}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <FileImage className="w-10 h-10 text-slate-600" />
              )}
            </div>

            {/* File details */}
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="font-semibold text-white truncate max-w-[260px] sm:max-w-xs" title={file.name}>
                  {file.name}
                </span>
                {fileAnalysis?.formatName && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-slate-800 text-sky-400 border border-slate-700">
                    {fileAnalysis.formatName}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-400">
                <span>Original Size: <strong className="text-slate-200">{formatBytes(file.size)}</strong></span>
                {fileAnalysis?.width && fileAnalysis?.height ? (
                  <span>Dimensions: <strong className="text-slate-200">{fileAnalysis.width} × {fileAnalysis.height} px</strong></span>
                ) : null}
              </div>

              {processingState === "analyzing" && (
                <div className="mt-2 text-xs text-amber-400 flex items-center justify-center sm:justify-start gap-1">
                  <div className="w-2.5 h-2.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  <span>Checking image properties...</span>
                </div>
              )}

              {fileAnalysis?.isValidImage && processingState !== "analyzing" && (
                <div className="mt-2 text-xs text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified format</span>
                </div>
              )}
            </div>

            {/* Remove / replace button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openPicker}
                className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={clearFile}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                title="Remove image"
                aria-label="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
