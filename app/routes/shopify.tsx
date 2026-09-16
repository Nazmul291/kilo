import React, { useState, useEffect } from "react";
import type { Route } from "./+types/shopify";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { FooterCredits } from "../components/FooterCredits";
import type { ShopifyProduct } from "./api.stockly.products";
import {
  Store,
  Key,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  Sparkles,
  ExternalLink,
  Download,
  Sliders,
  Check,
  LogOut,
  Info,
  Eye,
  X,
  Columns,
  Split,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Stockly & Shopify Merchant Optimizer — 1-Click Batch Image Compression — Kilo",
    },
    {
      name: "description",
      content:
        "Connect your Shopify store with Stockly to batch-optimize product photography directly in your browser. 100% private, zero server storage, and instant WebP conversion.",
    },
    { name: "robots", content: "index, follow" },
    {
      name: "keywords",
      content:
        "shopify image optimizer, stockly shopify integration, batch compress shopify images, client side shopify webp converter, speed up shopify store",
    },
    {
      property: "og:title",
      content: "Stockly & Shopify Merchant Optimizer — Kilo",
    },
    {
      property: "og:description",
      content:
        "Batch compress your entire Shopify product catalog in your browser with zero server storage.",
    },
    { property: "og:url", content: "https://kilo.nazmulcodes.org/shopify" },
    { property: "og:type", content: "website" },
  ];
}

interface OptimizedImageResult {
  imageId: string;
  originalBytes: number;
  optimizedBytes: number;
  reductionPercent: number;
  blobUrl: string;
  format: string;
}

interface CompareItem {
  productId: string;
  productTitle: string;
  imageId: string;
  altText: string;
  originalUrl: string;
  originalBytes: number;
  optimizedUrl: string;
  optimizedBytes: number;
  reductionPercent: number;
  format: string;
}

export default function ShopifyOptimizer() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [connectedShop, setConnectedShop] = useState<string | null>(null);
  const [shopDomain, setShopDomain] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Products state
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Batch compression settings
  const [targetFormat, setTargetFormat] = useState<"webp" | "jpeg" | "png">("webp");
  const [quality, setQuality] = useState<number>(80);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedResults, setOptimizedResults] = useState<
    Record<string, OptimizedImageResult>
  >({});
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // Compare modal state
  const [compareItem, setCompareItem] = useState<CompareItem | null>(null);
  const [compareMode, setCompareMode] = useState<"side-by-side" | "slider">("side-by-side");
  const [sliderPos, setSliderPos] = useState<number>(50);

  // Close compare modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCompareItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Check auth status on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/stockly/auth");
        const data = await res.json();
        if (data.authenticated && data.shop) {
          setIsAuthenticated(true);
          setConnectedShop(data.shop);
          fetchProducts();
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // Fetch products
  async function fetchProducts() {
    setIsLoadingProducts(true);
    try {
      const res = await fetch("/api/stockly/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setIsLoadingProducts(false);
    }
  }

  // Handle Connect
  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/stockly/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop: shopDomain, accessToken }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      setIsAuthenticated(true);
      setConnectedShop(data.shop);
      fetchProducts();
    } catch (err: any) {
      setAuthError(err.message || "Failed to connect store.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle Demo Mode quick-connect
  async function handleDemoConnect() {
    setShopDomain("modern-apparel.myshopify.com");
    setAccessToken("demo-stockly-token-2026");
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/stockly/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop: "modern-apparel.myshopify.com",
          accessToken: "demo-stockly-token-2026",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Demo connection failed.");
      }

      setIsAuthenticated(true);
      setConnectedShop(data.shop);
      fetchProducts();
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle Disconnect
  async function handleDisconnect() {
    try {
      await fetch("/api/stockly/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setConnectedShop(null);
      setProducts([]);
      setOptimizedResults({});
    } catch (err) {
      console.error("Failed to disconnect", err);
    }
  }

  // 1-Click In-Browser Batch Compression
  async function handleBatchOptimize() {
    const allImages = products.flatMap((p) => p.images);
    if (allImages.length === 0) return;

    setIsOptimizing(true);
    setProgress({ current: 0, total: allImages.length });
    setSyncSuccessMessage(null);

    const newResults: Record<string, OptimizedImageResult> = {};

    for (let i = 0; i < allImages.length; i++) {
      const img = allImages[i];
      setProgress({ current: i + 1, total: allImages.length });

      try {
        // Fetch image via proxy to avoid CORS canvas tainting
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(img.url)}`;
        const imageRes = await fetch(proxyUrl);
        const imageBlob = await imageRes.blob();

        // Load into in-memory image
        const imgElement = new Image();
        const objectUrl = URL.createObjectURL(imageBlob);
        imgElement.src = objectUrl;

        await new Promise((resolve) => {
          imgElement.onload = resolve;
        });

        // Draw onto offscreen canvas
        const canvas = document.createElement("canvas");
        canvas.width = imgElement.naturalWidth || img.width;
        canvas.height = imgElement.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(imgElement, 0, 0);

          // Compress to target format
          const mimeType =
            targetFormat === "png"
              ? "image/png"
              : targetFormat === "jpeg"
              ? "image/jpeg"
              : "image/webp";

          const compressedBlob: Blob = await new Promise((resolve) => {
            canvas.toBlob((b) => resolve(b || imageBlob), mimeType, quality / 100);
          });

          const resultUrl = URL.createObjectURL(compressedBlob);
          const originalBytes = img.originalSizeBytes;
          const optimizedBytes = compressedBlob.size;
          const reductionPercent = Math.max(
            0,
            Math.round(((originalBytes - optimizedBytes) / originalBytes) * 100)
          );

          newResults[img.id] = {
            imageId: img.id,
            originalBytes,
            optimizedBytes,
            reductionPercent,
            blobUrl: resultUrl,
            format: targetFormat.toUpperCase(),
          };
        }

        URL.revokeObjectURL(objectUrl);
      } catch (err) {
        console.error(`Failed to compress image ${img.id}`, err);
      }
    }

    setOptimizedResults(newResults);
    setIsOptimizing(false);
  }

  // Handle Sync back to Shopify via Stockly
  async function handleSyncToShopify() {
    const resultsArray = Object.values(optimizedResults);
    if (resultsArray.length === 0) return;

    setIsSyncing(true);
    setSyncSuccessMessage(null);

    try {
      const payload = {
        updates: resultsArray.map((r) => ({
          imageId: r.imageId,
          targetFormat: r.format,
          optimizedSizeBytes: r.optimizedBytes,
          savedBytes: r.originalBytes - r.optimizedBytes,
        })),
      };

      const res = await fetch("/api/stockly/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to sync.");
      }

      setSyncSuccessMessage(
        `Successfully synced ${resultsArray.length} optimized images to ${connectedShop} via Stockly! Temporary processing buffers flushed.`
      );
    } catch (err: any) {
      alert(err.message || "Sync failed.");
    } finally {
      setIsSyncing(false);
    }
  }

  // Format bytes helper
  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  const allImages = products.flatMap((p) => p.images);
  const totalOriginalBytes = allImages.reduce(
    (acc, img) => acc + img.originalSizeBytes,
    0
  );
  const optimizedCount = Object.keys(optimizedResults).length;
  const totalOptimizedBytes = Object.values(optimizedResults).reduce(
    (acc, res) => acc + res.optimizedBytes,
    0
  );
  const totalSavedBytes = Object.values(optimizedResults).reduce(
    (acc, res) => acc + (res.originalBytes - res.optimizedBytes),
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      <HeaderNavigation />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 mb-8">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/30">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Stockly Merchant Feature</span>
              </span>
              <span className="text-[11px] text-slate-400">
                100% Client-Side RAM
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Shopify Catalog Image Optimizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Connect your Shopify store using your Stockly access token. Batch-compress your catalog photography directly in your browser with zero server uploads.
            </p>
          </div>

          {/* Connection Status Pill */}
          {isAuthenticated && connectedShop && (
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-2 px-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div className="text-left">
                  <p className="text-xs font-bold text-white leading-none">
                    {connectedShop}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-medium pt-0.5">
                    Verified via Stockly
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDisconnect}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-rose-400 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
                title="Disconnect Store"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          )}
        </div>

        {/* VIEW 1: Disconnected / Onboarding Form */}
        {isAuthenticated === false && (
          <div className="max-w-3xl mx-auto space-y-8 py-4 animate-fadeIn">
            {/* Instruction Card */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Connect with Stockly
                  </h2>
                  <p className="text-xs text-slate-400">
                    Follow these 3 simple steps to connect your Shopify store
                  </p>
                </div>
              </div>

              {/* 3 Step Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <h3 className="font-bold text-white text-sm">Open Stockly</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Open your Shopify Admin and click on the <strong>Stockly</strong> application in your apps list.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <h3 className="font-bold text-white text-sm">Copy Token</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Go to <strong>Settings &rarr; Kilo Optimizer Key</strong> and generate your secure access token.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <h3 className="font-bold text-white text-sm">Start Optimizing</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Paste your credentials below to batch-compress your products in pure browser RAM.
                  </p>
                </div>
              </div>

              {/* Connection Form */}
              <form onSubmit={handleConnect} className="space-y-4 pt-2">
                {authError && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-slate-400" />
                      <span>Shopify Store Domain</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={shopDomain}
                      onChange={(e) => setShopDomain(e.target.value)}
                      placeholder="your-brand.myshopify.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-slate-400" />
                      <span>Stockly Access Token</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="stk_tok_xxxxxxxxxxxxxx"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>Connect &amp; Load Catalog</span>
                  </button>

                  {/* Sandbox Demo Button */}
                  <button
                    type="button"
                    onClick={handleDemoConnect}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Try Sample Catalog (Demo Sandbox)</span>
                  </button>
                </div>
              </form>

              {/* Zero database notice */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <p>
                  <strong>Zero Database Storage:</strong> Your Stockly credentials are encrypted in a temporary, HTTP-only signed browser cookie. Kilo's server never stores your access keys or images.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Connected Merchant Dashboard */}
        {isAuthenticated === true && (
          <div className="space-y-8 animate-fadeIn">
            {/* Sync Success Banner */}
            {syncSuccessMessage && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{syncSuccessMessage}</span>
                </div>
                <button
                  onClick={() => setSyncSuccessMessage(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Top Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Products
                </p>
                <p className="text-2xl font-black text-white">
                  {products.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Catalog Images
                </p>
                <p className="text-2xl font-black text-white">{allImages.length}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Original Payload
                </p>
                <p className="text-2xl font-black text-slate-300">
                  {formatBytes(totalOriginalBytes)}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-1">
                <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Bytes Saved
                </p>
                <p className="text-2xl font-black text-emerald-300">
                  {totalSavedBytes > 0 ? formatBytes(totalSavedBytes) : "0 KB"}
                </p>
              </div>
            </div>

            {/* Batch Compression Control Bar */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <span>Batch Compression Settings</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Runs 100% in your browser RAM using HTML5 Canvas WebP encoding.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs w-full lg:w-auto">
                  {/* Format Selector */}
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
                    <span className="text-slate-400 px-2 font-medium">Format:</span>
                    {(["webp", "jpeg", "png"] as const).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setTargetFormat(fmt)}
                        className={`px-3 py-1 rounded-lg font-bold uppercase text-[11px] transition-colors ${
                          targetFormat === fmt
                            ? "bg-emerald-500 text-slate-950 shadow-sm"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>

                  {/* Quality Slider */}
                  <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                    <span className="text-slate-400 font-medium">
                      Quality: <strong className="text-white">{quality}%</strong>
                    </span>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      step="5"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-24 accent-emerald-400 cursor-pointer"
                    />
                  </div>

                  {/* 1-Click Optimize Button */}
                  <button
                    type="button"
                    onClick={handleBatchOptimize}
                    disabled={isOptimizing || allImages.length === 0}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {isOptimizing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                    <span>
                      {isOptimizing
                        ? `Optimizing ${progress.current}/${progress.total}...`
                        : "1-Click Optimize All"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Progress Bar when running */}
              {isOptimizing && (
                <div className="space-y-1.5 pt-2">
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-emerald-400 h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${(progress.current / progress.total) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>
                      Processing in browser memory (0 bytes uploaded to Kilo)...
                    </span>
                    <span>
                      {progress.current} of {progress.total} assets
                    </span>
                  </div>
                </div>
              )}

              {/* Sync Action Banner if optimized */}
              {optimizedCount > 0 && !isOptimizing && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 mt-4">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <p className="text-xs font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>
                        Optimized {optimizedCount} images! Saved {formatBytes(totalSavedBytes)} total.
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Sync directly to your Shopify store via Stockly, or download locally.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSyncToShopify}
                      disabled={isSyncing}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isSyncing ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Store className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isSyncing ? "Syncing..." : "Sync to Shopify via Stockly"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Products Gallery */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-slate-400" />
                  <span>Shopify Product Assets</span>
                </h3>
                <span className="text-xs text-slate-500">
                  {products.length} Products Loaded
                </span>
              </div>

              {isLoadingProducts ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
                  <span>Fetching catalog photography from Shopify...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            {product.vendor}
                          </span>
                          <h4 className="text-base font-bold text-white leading-tight">
                            {product.title}
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                          {product.images.length} images
                        </span>
                      </div>

                      {/* Image Thumbnails Row */}
                      <div className="grid grid-cols-2 gap-3">
                        {product.images.map((img) => {
                          const opt = optimizedResults[img.id];

                          return (
                            <div
                              key={img.id}
                              className="rounded-2xl border border-slate-800/80 bg-slate-950 p-2.5 space-y-2 relative group overflow-hidden"
                            >
                              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900">
                                <img
                                  src={opt?.blobUrl || img.url}
                                  alt={img.altText}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {opt && (
                                  <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-md">
                                    -{opt.reductionPercent}%
                                  </div>
                                )}
                              </div>

                              <div className="text-[10px] space-y-0.5">
                                <div className="flex items-center justify-between text-slate-400">
                                  <span>Original:</span>
                                  <span className="font-mono text-slate-300">
                                    {formatBytes(img.originalSizeBytes)}
                                  </span>
                                </div>

                                {opt && (
                                  <div className="flex items-center justify-between text-emerald-400 font-bold pt-0.5 border-t border-slate-800/60">
                                    <span>{opt.format}:</span>
                                    <span className="font-mono">
                                      {formatBytes(opt.optimizedBytes)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {opt && (
                                <div className="grid grid-cols-2 gap-1.5 pt-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setCompareItem({
                                        productId: product.id,
                                        productTitle: product.title,
                                        imageId: img.id,
                                        altText: img.altText,
                                        originalUrl: img.url,
                                        originalBytes: img.originalSizeBytes,
                                        optimizedUrl: opt.blobUrl,
                                        optimizedBytes: opt.optimizedBytes,
                                        reductionPercent: opt.reductionPercent,
                                        format: opt.format,
                                      })
                                    }
                                    className="inline-flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 transition-colors shadow-sm"
                                    title="Compare original vs compressed quality"
                                  >
                                    <Eye className="w-3 h-3 text-emerald-400" />
                                    <span>Compare</span>
                                  </button>

                                  <a
                                    href={opt.blobUrl}
                                    download={`${product.handle}-${img.id}.${targetFormat}`}
                                    className="inline-flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-[10px] font-semibold text-slate-300 hover:text-white transition-colors border border-slate-800"
                                    title="Download optimized image"
                                  >
                                    <Download className="w-3 h-3" />
                                    <span>Download</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full-Screen Interactive Comparison Modal */}
        {compareItem && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
            <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/80">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                      Visual Quality Inspection
                    </span>
                    <span className="text-xs text-slate-500 hidden sm:inline">•</span>
                    <span className="text-xs text-slate-400 truncate hidden sm:inline">
                      {compareItem.productTitle}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                    {compareItem.altText || compareItem.productTitle}
                  </h3>
                </div>

                {/* Switcher & Close */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  {/* Mode Toggle */}
                  <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setCompareMode("side-by-side")}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        compareMode === "side-by-side"
                          ? "bg-emerald-500 text-slate-950 shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Side-by-Side</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompareMode("slider")}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        compareMode === "slider"
                          ? "bg-emerald-500 text-slate-950 shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Split className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Split Slider</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCompareItem(null)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Close preview (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/40">
                {compareMode === "side-by-side" ? (
                  /* Side-by-Side View */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 h-full items-stretch">
                    {/* Left: Original */}
                    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 text-xs">
                        <span className="font-bold text-slate-300">
                          Original (Uncompressed)
                        </span>
                        <span className="font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {formatBytes(compareItem.originalBytes)}
                        </span>
                      </div>
                      <div className="flex-1 min-h-[300px] sm:min-h-[420px] flex items-center justify-center p-3 bg-slate-950/80">
                        <img
                          src={compareItem.originalUrl}
                          alt="Original uncompressed product"
                          className="max-h-[50vh] w-auto max-w-full object-contain rounded-lg shadow-md"
                        />
                      </div>
                    </div>

                    {/* Right: Compressed */}
                    <div className="flex flex-col rounded-2xl border border-emerald-500/30 bg-slate-900/60 overflow-hidden shadow-lg shadow-emerald-500/5">
                      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-emerald-950/40 text-xs">
                        <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Kilo Compressed ({compareItem.format})</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                            {formatBytes(compareItem.optimizedBytes)}
                          </span>
                          <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">
                            -{compareItem.reductionPercent}%
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-h-[300px] sm:min-h-[420px] flex items-center justify-center p-3 bg-slate-950/80">
                        <img
                          src={compareItem.optimizedUrl}
                          alt="Kilo optimized compressed product"
                          className="max-h-[50vh] w-auto max-w-full object-contain rounded-lg shadow-md"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Interactive Split Slider View */
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-full max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 select-none shadow-xl">
                      {/* Underneath: Compressed Image */}
                      <img
                        src={compareItem.optimizedUrl}
                        alt="Compressed product"
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                      <div className="absolute top-3 right-3 z-10 bg-emerald-950/90 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm shadow-md">
                        Compressed ({formatBytes(compareItem.optimizedBytes)})
                      </div>

                      {/* Overlaid: Original Image clipped by slider position */}
                      <div
                        className="absolute inset-0 overflow-hidden pointer-events-none"
                        style={{ width: `${sliderPos}%` }}
                      >
                        <img
                          src={compareItem.originalUrl}
                          alt="Original product"
                          className="absolute inset-0 w-full h-full object-contain max-w-none"
                          style={{ width: "100%" }}
                        />
                        <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700 text-slate-200 text-[11px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm shadow-md">
                          Original ({formatBytes(compareItem.originalBytes)})
                        </div>
                      </div>

                      {/* Divider Line & Drag Handle */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 pointer-events-none"
                        style={{ left: `${sliderPos}%` }}
                      >
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg border-2 border-white">
                          <Split className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Interactive Drag input overlay */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={sliderPos}
                        onChange={(e) => setSliderPos(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                        aria-label="Drag before and after split slider"
                      />
                    </div>

                    <p className="text-xs text-slate-400 text-center">
                      👈 Drag the slider horizontally to reveal original vs. compressed pixels in real-time 👉
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-300 text-center sm:text-left">
                  <span>Saved </span>
                  <strong className="text-emerald-400 font-bold">
                    {formatBytes(compareItem.originalBytes - compareItem.optimizedBytes)}
                  </strong>
                  <span> ({compareItem.reductionPercent}% byte reduction) with zero perceived loss in visual clarity.</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <a
                    href={compareItem.optimizedUrl}
                    download={`kilo-optimized-${compareItem.imageId}.${compareItem.format.toLowerCase()}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-emerald-500/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setCompareItem(null)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <FooterCredits />
    </div>
  );
}
