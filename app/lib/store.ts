import { create } from "zustand";
import { analyzeImage, type FileAnalysis } from "./detector";
import {
  compressImage,
  type TargetFormat,
  type CompressionResult,
} from "./compressor";

export type ProcessingState = "idle" | "analyzing" | "compressing" | "ad_gate" | "completed" | "error";

interface KiloState {
  file: File | null;
  fileAnalysis: FileAnalysis | null;
  previewUrl: string | null;
  compressionLevel: number;
  targetFormat: TargetFormat;
  processingState: ProcessingState;
  adTimer: number;
  adTimerActive: boolean;
  compressedResult: CompressionResult | null;
  errorMessage: string | null;

  // Actions
  setFile: (file: File) => Promise<void>;
  clearFile: () => void;
  setCompressionLevel: (level: number) => void;
  setTargetFormat: (format: TargetFormat) => void;
  startCompression: () => Promise<void>;
  decrementAdTimer: () => void;
  closeAdGate: () => void;
  resetAll: () => void;
}

export const useKiloStore = create<KiloState>((set, get) => ({
  file: null,
  fileAnalysis: null,
  previewUrl: null,
  compressionLevel: 65, // Recommended default for modern web
  targetFormat: "webp",
  processingState: "idle",
  adTimer: 5,
  adTimerActive: false,
  compressedResult: null,
  errorMessage: null,

  setFile: async (file: File) => {
    const currentState = get();
    // Cleanup previous object URLs to prevent memory leaks
    if (currentState.previewUrl) {
      URL.revokeObjectURL(currentState.previewUrl);
    }
    if (currentState.compressedResult?.blobUrl) {
      URL.revokeObjectURL(currentState.compressedResult.blobUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    set({
      file,
      previewUrl,
      processingState: "analyzing",
      errorMessage: null,
      compressedResult: null,
    });

    try {
      const analysis = await analyzeImage(file);
      if (!analysis.isValidImage) {
        set({
          processingState: "error",
          errorMessage: analysis.errorMessage || "Unsupported image format.",
        });
      } else {
        set({
          fileAnalysis: analysis,
          processingState: "idle",
        });
      }
    } catch (err: any) {
      set({
        processingState: "error",
        errorMessage: err.message || "Failed to analyze image.",
      });
    }
  },

  clearFile: () => {
    const { previewUrl, compressedResult } = get();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (compressedResult?.blobUrl) URL.revokeObjectURL(compressedResult.blobUrl);

    set({
      file: null,
      fileAnalysis: null,
      previewUrl: null,
      processingState: "idle",
      compressedResult: null,
      errorMessage: null,
      adTimer: 5,
      adTimerActive: false,
    });
  },

  setCompressionLevel: (level: number) => {
    set({ compressionLevel: level });
  },

  setTargetFormat: (format: TargetFormat) => {
    set({ targetFormat: format });
  },

  startCompression: async () => {
    const { file, compressionLevel, targetFormat, compressedResult } = get();
    if (!file) return;

    if (compressedResult?.blobUrl) {
      URL.revokeObjectURL(compressedResult.blobUrl);
    }

    set({
      processingState: "compressing",
      errorMessage: null,
      adTimer: 5,
      adTimerActive: false,
    });

    try {
      // In-memory client-side processing
      const result = await compressImage(file, {
        compressionLevel,
        targetFormat,
      });

      // Transition to ad_gate with 5s countdown
      set({
        compressedResult: result,
        processingState: "ad_gate",
        adTimer: 5,
        adTimerActive: true,
      });
    } catch (err: any) {
      set({
        processingState: "error",
        errorMessage: err.message || "An error occurred during compression.",
      });
    }
  },

  decrementAdTimer: () => {
    const { adTimer } = get();
    if (adTimer <= 1) {
      set({ adTimer: 0, adTimerActive: false, processingState: "completed" });
    } else {
      set({ adTimer: adTimer - 1 });
    }
  },

  closeAdGate: () => {
    // Compliant dismiss option: user can skip or close modal
    set({ adTimer: 0, adTimerActive: false, processingState: "completed" });
  },

  resetAll: () => {
    get().clearFile();
    set({
      compressionLevel: 65,
      targetFormat: "webp",
    });
  },
}));
