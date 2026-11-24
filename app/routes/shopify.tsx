import React, { useState, useEffect, useMemo } from "react";
import type { Route } from "./+types/shopify";
import { HeaderNavigation } from "../components/HeaderNavigation";
import { FooterCredits } from "../components/FooterCredits";
import {
  fetchStocklyProducts,
  syncProductMediaToStockly,
  revertProductMedia,
  getStoredToken,
  getStoredShop,
  setStoredSession,
  clearStoredSession,
  decodeJwtPayload,
  type StocklyProduct,
  type StocklyImage,
  type SyncMediaItem,
} from "../lib/stockly-client";
import {
  generateSmartAltText,
  validateShopifyAltText,
  SHOPIFY_MAX_ALT_TEXT_LENGTH,
} from "../lib/smart-alt-text";
import {
  Store,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Sliders,
  LogOut,
  X,
  History,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileImage,
  Check,
  Layers,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    {
      title: "Shopify Merchant Optimizer — Fast Media Tools | Kilo",
    },
    {
      name: "description",
      content:
        "Connect your Shopify store via Stockly to batch-optimize product photography directly in your browser. Unidirectional API, zero database storage, smart SEO alt text, and 1-click rollback.",
    },
    { name: "robots", content: "index, follow" },
    // A Stockly token may arrive in the URL: never leak it via the Referer header.
    { name: "referrer", content: "no-referrer" },
    {
      name: "keywords",
      content:
        "shopify image optimizer, stockly shopify integration, batch compress shopify images, client side shopify webp converter, shopify alt text generator",
    },
    {
      tagName: "link",
      rel: "canonical",
      href: "https://kilo.nazmulcodes.org/shopify",
    },
    {
      property: "og:title",
      content: "Stockly & Shopify Merchant Optimizer — Kilo",
    },
    {
      property: "og:description",
      content:
        "Batch compress product photos and generate smart alt texts for Shopify with 1-click rollback.",
    },
    { property: "og:url", content: "https://kilo.nazmulcodes.org/shopify" },
    { property: "og:type", content: "website" },
  ];
}

interface StagedResult {
  imageId: string;
  originalBytes: number;
  optimizedBytes: number;
  reductionPercent: number;
  stagedUrl: string;
  base64?: string;
  blobUrl: string;
  format: string;
  altText: string;
}

/**
 * Truncate long strings with ellipsis (...)
 */
function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export default function ShopifyOptimizer() {
  // Session State
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [connectedShop, setConnectedShop] = useState<string | null>(null);
  const [tokenPayload, setTokenPayload] = useState<any | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // Products state
  const [products, setProducts] = useState<StocklyProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageCursor, setPageCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  // Cursor-based Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);

  // Optimization Modal / Drawer State
  const [selectedProduct, setSelectedProduct] = useState<StocklyProduct | null>(null);
  const [targetFormat, setTargetFormat] = useState<"webp" | "jpeg" | "png">("webp");
  const [quality, setQuality] = useState<number>(80);
  const [syncMode, setSyncMode] = useState<"replace" | "keep_both">("replace");
  
  // Custom Alt Texts state per image { [mediaId]: string }
  const [customAltTexts, setCustomAltTexts] = useState<Record<string, string>>({});

  // Optimization execution state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>("");
  const [processProgress, setProcessProgress] = useState({ current: 0, total: 0 });
  const [stagedResults, setStagedResults] = useState<Record<string, StagedResult>>({});

  // Action status / Notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Revert loading state per product
  const [revertingProductId, setRevertingProductId] = useState<string | null>(null);

  // Initialize session from URL query or localStorage on mount
  useEffect(() => {
    // Prefer the URL fragment (never sent to servers); accept the query for compatibility.
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const params = new URLSearchParams(window.location.search);
    const urlToken = hashParams.get("token") || params.get("token");
    const urlShop = hashParams.get("shop") || params.get("shop");

    if (urlToken && urlShop) {
      setStoredSession(urlToken, urlShop);
      setAuthToken(urlToken);
      setConnectedShop(urlShop);
      setTokenPayload(decodeJwtPayload(urlToken));
      // Clean query params from URL cleanly without page reload
      window.history.replaceState({}, "", "/shopify");
    } else {
      const storedToken = getStoredToken();
      const storedShop = getStoredShop();
      if (storedToken && storedShop) {
        setAuthToken(storedToken);
        setConnectedShop(storedShop);
        setTokenPayload(decodeJwtPayload(storedToken));
      }
    }
  }, []);

  // Load products whenever token changes
  useEffect(() => {
    if (authToken || isDemo) {
      loadProducts();
    }
  }, [authToken, isDemo]);

  // Load products list from Stockly
  async function loadProducts(cursor: string | null = null, query: string = searchQuery) {
    setIsLoadingProducts(true);
    try {
      const res = await fetchStocklyProducts({
        limit: 20,
        cursor,
        query: query ? `title:${query}*` : null,
      });

      if (res.success) {
        setProducts(res.products);
        setHasNextPage(res.pageInfo.hasNextPage);
        setPageCursor(res.pageInfo.endCursor || null);
        if (res.isDemo) {
          setIsDemo(true);
        }
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to load products from Stockly.",
      });
    } finally {
      setIsLoadingProducts(false);
    }
  }

  // Handle Next Page
  function handleNextPage() {
    if (!hasNextPage || !pageCursor || isLoadingProducts) return;
    setCursorHistory((prev) => [...prev, pageCursor]);
    setCurrentPage((prev) => prev + 1);
    loadProducts(pageCursor, searchQuery);
  }

  // Handle Previous Page
  function handlePrevPage() {
    if (currentPage <= 1 || isLoadingProducts) return;
    const targetPage = currentPage - 1;
    const targetCursor = cursorHistory[targetPage - 1] || null;
    setCurrentPage(targetPage);
    loadProducts(targetCursor, searchQuery);
  }

  // Handle Search submit
  function handleSearchSubmit() {
    setCurrentPage(1);
    setCursorHistory([null]);
    setPageCursor(null);
    loadProducts(null, searchQuery);
  }

  // Handle Refresh
  function handleRefresh() {
    setCurrentPage(1);
    setCursorHistory([null]);
    setPageCursor(null);
    loadProducts(null, searchQuery);
  }

  // Handle Demo Mode quick-connect
  function handleLaunchDemo() {
    setIsDemo(true);
    setAuthToken("demo-token");
    setConnectedShop("modern-apparel.myshopify.com");
    setStoredSession("demo-token", "modern-apparel.myshopify.com");
    setNotification({
      type: "info",
      message: "Connected in Demo Mode. Experience the full Kilo ↔ Stockly workflow with sample products.",
    });
  }

  // Handle Disconnect
  function handleDisconnect() {
    clearStoredSession();
    setAuthToken(null);
    setConnectedShop(null);
    setTokenPayload(null);
    setIsDemo(false);
    setProducts([]);
    setSelectedProduct(null);
    setStagedResults({});
    setNotification({
      type: "info",
      message: "Disconnected from Shopify store.",
    });
  }

  // Open optimization drawer for a product
  function handleOpenOptimizeModal(product: StocklyProduct) {
    setSelectedProduct(product);
    setStagedResults({});
    
    // Pre-generate Smart Alt Texts complying with Shopify's 512 char limit
    const initialAltTexts: Record<string, string> = {};
    product.images.forEach((img, idx) => {
      initialAltTexts[img.mediaId] = generateSmartAltText({
        productTitle: product.title,
        vendor: product.vendor,
        imageIndex: idx,
        totalImages: product.images.length,
      });
    });
    setCustomAltTexts(initialAltTexts);
  }

  // Execute in-browser compression and staging to Kilo staging endpoint
  async function handleCompressAndStage() {
    if (!selectedProduct || selectedProduct.images.length === 0) return;

    setIsProcessing(true);
    setProcessStep("Compressing images in browser...");
    setProcessProgress({ current: 0, total: selectedProduct.images.length });

    const newStaged: Record<string, StagedResult> = {};

    try {
      for (let i = 0; i < selectedProduct.images.length; i++) {
        const img = selectedProduct.images[i];
        setProcessProgress({ current: i + 1, total: selectedProduct.images.length });

        // 1. Fetch image via proxy to bypass cross-origin canvas tainting
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(img.url)}`;
        const imageRes = await fetch(proxyUrl);
        if (!imageRes.ok) throw new Error(`Could not load image ${img.mediaId}`);
        const imageBlob = await imageRes.blob();

        // 2. Render onto offscreen canvas for zero-server compression
        const imgElement = new Image();
        const objectUrl = URL.createObjectURL(imageBlob);
        imgElement.src = objectUrl;
        await new Promise((resolve, reject) => {
          imgElement.onload = resolve;
          imgElement.onerror = reject;
        });

        const canvas = document.createElement("canvas");
        canvas.width = imgElement.naturalWidth || img.width;
        canvas.height = imgElement.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not initialize 2D canvas context");
        ctx.drawImage(imgElement, 0, 0);

        const mimeType =
          targetFormat === "png"
            ? "image/png"
            : targetFormat === "jpeg"
            ? "image/jpeg"
            : "image/webp";

        const compressedBlob: Blob = await new Promise((resolve) => {
          canvas.toBlob((b) => resolve(b || imageBlob), mimeType, quality / 100);
        });

        URL.revokeObjectURL(objectUrl);

        // Convert Blob to Base64 (directly usable by Stockly proxy)
        const base64DataUrl = canvas.toDataURL(mimeType, quality / 100);

        // 3. Stage the compressed image on Kilo temporary staging CDN
        setProcessStep(`Staging image ${i + 1} of ${selectedProduct.images.length}...`);
        
        let stagedUrl = "";
        try {
          const formData = new FormData();
          formData.append("file", compressedBlob, `opt-${img.mediaId}.${targetFormat}`);

          const stageRes = await fetch("/api/staged-media", {
            method: "POST",
            body: formData,
          });

          if (stageRes.ok) {
            const stageData = await stageRes.json();
            stagedUrl = stageData.url || "";
          }
        } catch (e) {
          console.warn("Local staging CDN skipped, using direct base64 upload:", e);
        }

        const originalBytes = img.originalSizeBytes || imageBlob.size;
        const optimizedBytes = compressedBlob.size;
        const reductionPercent = Math.max(
          0,
          Math.round(((originalBytes - optimizedBytes) / originalBytes) * 100)
        );

        // Retrieve custom alt text or fallback to generated smart alt text
        const altText =
          customAltTexts[img.mediaId] ||
          generateSmartAltText({
            productTitle: selectedProduct.title,
            imageIndex: i,
            totalImages: selectedProduct.images.length,
          });

        newStaged[img.mediaId] = {
          imageId: img.mediaId,
          originalBytes,
          optimizedBytes,
          reductionPercent,
          stagedUrl: stagedUrl || "",
          base64: base64DataUrl,
          blobUrl: URL.createObjectURL(compressedBlob),
          format: targetFormat.toUpperCase(),
          altText: altText.slice(0, SHOPIFY_MAX_ALT_TEXT_LENGTH),
        };
      }

      setStagedResults(newStaged);
      setProcessStep("Compression complete! Ready to sync with Shopify.");
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Compression failed.",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  // Push staged optimized media to Shopify via Stockly
  async function handleSyncToShopify() {
    if (!selectedProduct) return;
    const stagedList = Object.values(stagedResults);
    if (stagedList.length === 0) return;

    setIsProcessing(true);
    setProcessStep("Syncing optimized media to Shopify via Stockly...");

    try {
      const totalOriginalBytes = stagedList.reduce((sum, item) => sum + item.originalBytes, 0);
      const totalOptimizedBytes = stagedList.reduce((sum, item) => sum + item.optimizedBytes, 0);
      const overallSavingsPercent = Math.max(
        1,
        Math.round(((totalOriginalBytes - totalOptimizedBytes) / totalOriginalBytes) * 100)
      );

      const syncPayload = {
        productId: selectedProduct.id,
        mode: syncMode,
        savingsPercent: overallSavingsPercent,
        totalOriginalBytes,
        totalOptimizedBytes,
        optimizedImages: stagedList.map((item) => ({
          base64: item.base64,
          url: item.stagedUrl || undefined,
          format: item.format.toLowerCase(),
          alt: item.altText,
          sizeBytes: item.optimizedBytes,
        })),
      };

      const syncRes = await syncProductMediaToStockly(syncPayload);

      if (syncRes.success) {
        // Update product in local state
        setProducts((prev) =>
          prev.map((p) =>
            p.id === selectedProduct.id
              ? {
                  ...p,
                  optimized: true,
                  savingsPercent: overallSavingsPercent,
                  mode: syncMode,
                  lastOptimizedAt: new Date().toISOString(),
                }
              : p
          )
        );

        setNotification({
          type: "success",
          message: `Successfully optimized and synced "${selectedProduct.title}" to Shopify! Saved ${overallSavingsPercent}%. Original photos backed up in private Shopify metafield.`,
        });

        setSelectedProduct(null);
        setStagedResults({});
      } else {
        throw new Error(syncRes.error || "Failed to sync product media.");
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to sync with Stockly.",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle 1-Click Rollback / Revert
  async function handleRevert(product: StocklyProduct) {
    const confirmRevert = window.confirm(
      `Are you sure you want to revert "${product.title}" back to its original high-resolution photography?`
    );
    if (!confirmRevert) return;

    setRevertingProductId(product.id);
    try {
      const res = await revertProductMedia(product.id);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  optimized: false,
                  savingsPercent: null,
                  mode: null,
                  lastOptimizedAt: null,
                }
              : p
          )
        );

        setNotification({
          type: "success",
          message: res.message || `Successfully restored original media for "${product.title}".`,
        });
      } else {
        throw new Error(res.error || "Rollback failed.");
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to revert product media.",
      });
    } finally {
      setRevertingProductId(null);
    }
  }

  // Format bytes helper
  function formatBytes(bytes: number) {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }

  // Computed summary metrics across products
  const metrics = useMemo(() => {
    const totalCount = products.length;
    const optimizedCount = products.filter((p) => p.optimized).length;
    const totalImages = products.reduce((sum, p) => sum + p.images.length, 0);
    return { totalCount, optimizedCount, totalImages };
  }, [products]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      <HeaderNavigation />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Top Notification Banner */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-start justify-between gap-3 animate-fadeIn ${
              notification.type === "success"
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
                : notification.type === "error"
                ? "bg-red-950/60 border-red-500/40 text-red-200"
                : "bg-sky-950/60 border-sky-500/40 text-sky-200"
            }`}
          >
            <div className="flex items-center gap-2.5 text-sm font-medium">
              {notification.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
              {notification.type === "error" && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
              {notification.type === "info" && <Sparkles className="w-5 h-5 text-sky-400 flex-shrink-0" />}
              <span>{notification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 mb-3">
              <Store className="w-3.5 h-3.5" />
              <span>Official Kilo ↔ Stockly Integration</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Shopify Product Media Optimizer
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Batch-compress Shopify product photography directly in your browser. Unidirectional API proxy via Stockly with 0 bytes database overhead and 1-click rollback.
            </p>
          </div>

          {/* Connection Pill / Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {connectedShop ? (
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 pl-3.5 rounded-2xl shadow-sm">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected Store {isDemo && "(Demo Mode)"}
                  </span>
                  <span className="text-xs font-semibold text-white truncate max-w-[180px]">
                    {connectedShop}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Disconnect store"
                  aria-label="Disconnect store"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLaunchDemo}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Try Demo Store</span>
                </button>
                <a
                  href="https://apps.shopify.com/stock-alert-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Store className="w-4 h-4" />
                  <span>Open from Stockly</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        {!connectedShop ? (
          /* Unauthenticated Onboarding State */
          <div className="py-16 flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 shadow-xl shadow-emerald-500/5">
              <Store className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              Connect Your Shopify Store via Stockly
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
              Kilo operates with zero inbound webhooks or database overhead. To optimize your store's media, open Stockly from your Shopify Admin and click <strong>"Optimize in Kilo"</strong>.
            </p>

            {/* Architecture Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left mb-8">
              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white mb-1">100% Client-Side</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Images compress in your browser. No files or credentials stored in databases.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 w-fit mb-2">
                  <History className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white mb-1">1-Click Rollback</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Original photos are saved to your store's private metafields. Revert anytime.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 w-fit mb-2">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white mb-1">Smart Alt Text</h3>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Auto-generates SEO-rich alt text adhering strictly to Shopify's 512-character limit.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleLaunchDemo}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Launch Interactive Demo Store</span>
              </button>
              <a
                href="https://apps.shopify.com/stock-alert-4"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Store className="w-4 h-4" />
                <span>Install Stockly on Shopify</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          /* Authenticated Merchant Dashboard */
          <div className="pt-6 space-y-6">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  Catalog Products
                </span>
                <span className="text-2xl font-black text-white">
                  {metrics.totalCount} Products
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {metrics.totalImages} total product photos
                </span>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  Optimized Media
                </span>
                <span className="text-2xl font-black text-emerald-400">
                  {metrics.optimizedCount} / {metrics.totalCount}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {metrics.optimizedCount > 0
                    ? `${Math.round((metrics.optimizedCount / metrics.totalCount) * 100)}% catalog coverage`
                    : "Ready for WebP compression"}
                </span>
              </div>

              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
                <span className="text-xs font-semibold text-slate-400 block mb-1">
                  Safety &amp; Backup
                </span>
                <span className="text-2xl font-black text-sky-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-6 h-6" />
                  <span>Metafield Protected</span>
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Private store snapshot before every change
                </span>
              </div>
            </div>

            {/* Catalog Search & Actions Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit();
                  }}
                  placeholder="Search products by title..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isLoadingProducts}
                  className="px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  aria-label="Refresh catalog"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProducts ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Products Catalog Table / List */}
            {isLoadingProducts ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-3" />
                <p className="text-sm text-slate-400">Loading products from Shopify via Stockly...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-slate-800 rounded-3xl">
                <FileImage className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No products found</h3>
                <p className="text-xs text-slate-400">
                  {searchQuery ? `No products matched "${searchQuery}".` : "Your Shopify catalog appears to be empty."}
                </p>
              </div>
            ) : (
              <div className="border border-slate-800/80 rounded-3xl overflow-hidden bg-slate-900/40 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        <th className="py-3.5 px-4">Product</th>
                        <th className="py-3.5 px-4">Media</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Optimization</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {products.map((product) => {
                        const isReverting = revertingProductId === product.id;

                        return (
                          <tr key={product.id} className="hover:bg-slate-800/20 transition-colors">
                            {/* Product Info */}
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                  {product.featuredImageUrl || product.images[0]?.url ? (
                                    <img
                                      src={product.featuredImageUrl || product.images[0]?.url}
                                      alt={product.title}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <FileImage className="w-5 h-5 text-slate-600" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <span
                                    className="font-bold text-white block truncate max-w-xs text-sm"
                                    title={product.title}
                                  >
                                    {truncateText(product.title, 50)}
                                  </span>
                                  <span
                                    className="text-slate-400 text-[11px] block truncate"
                                    title={`/${product.handle}`}
                                  >
                                    /{truncateText(product.handle, 35)}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Media Count */}
                            <td className="py-4 px-4 text-slate-300">
                              <span className="inline-flex items-center gap-1 font-semibold">
                                <Layers className="w-3.5 h-3.5 text-slate-400" />
                                <span>{product.images.length} photos</span>
                              </span>
                            </td>

                            {/* Product Status */}
                            <td className="py-4 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  product.status === "ACTIVE"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-slate-800 text-slate-400 border border-slate-700"
                                }`}
                              >
                                {product.status}
                              </span>
                            </td>

                            {/* Optimization Status Badge */}
                            <td className="py-4 px-4">
                              {product.optimized ? (
                                <div className="flex flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Optimized ({product.savingsPercent || 74}% saved)</span>
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    Mode: {product.mode === "keep_both" ? "Appended" : "Replaced (Safe)"}
                                  </span>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  <span>Unoptimized JPEG/PNG</span>
                                </span>
                              )}
                            </td>

                            {/* Action Buttons */}
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {product.optimized ? (
                                  <button
                                    type="button"
                                    onClick={() => handleRevert(product)}
                                    disabled={isReverting}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                    title="Restore original photos from private backup"
                                  >
                                    {isReverting ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <History className="w-3.5 h-3.5" />
                                    )}
                                    <span>Revert</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenOptimizeModal(product)}
                                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm flex items-center gap-1.5"
                                  >
                                    <Zap className="w-3.5 h-3.5 fill-current" />
                                    <span>Optimize</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Cursor-based Pagination Toolbar */}
                <div className="p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60">
                  <div className="text-xs text-slate-400">
                    Showing <span className="font-semibold text-white">{products.length}</span> products on Page{" "}
                    <span className="font-semibold text-emerald-400">{currentPage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevPage}
                      disabled={currentPage <= 1 || isLoadingProducts}
                      className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    <span className="px-3 py-1 rounded-xl bg-slate-800 border border-slate-700/60 text-xs font-bold text-white">
                      {currentPage}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={!hasNextPage || isLoadingProducts}
                      className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Next Page"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal / Drawer for In-Browser Compression & Smart Alt Text */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1">
                    <Zap className="w-4 h-4 fill-current" />
                    <span>In-Browser Client-Side Optimization</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Optimize &amp; Sync: {selectedProduct.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedProduct.images.length} photos ready for compression &amp; smart alt text enrichment.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isProcessing) setSelectedProduct(null);
                  }}
                  disabled={isProcessing}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Settings Form */}
              <div className="py-5 space-y-5">
                {/* Format & Quality selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-200 block mb-1.5">
                      Target Format
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["webp", "jpeg", "png"] as const).map((fmt) => (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => setTargetFormat(fmt)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                            targetFormat === fmt
                              ? "bg-emerald-400 text-slate-950 shadow-sm"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          {fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-slate-200">
                        Compression Quality
                      </label>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {quality}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={40}
                      max={100}
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>
                </div>

                {/* Shopify Replace Mode Selector */}
                <div>
                  <label className="text-xs font-bold text-slate-200 block mb-1.5">
                    Shopify Media Attachment Mode
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSyncMode("replace")}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        syncMode === "replace"
                          ? "border-emerald-400 bg-emerald-950/30 text-white"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs mb-0.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Replace Existing Media (Recommended)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Detaches original photos and sets fast WebP as primary. Originals safely snapshot into private metafields.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSyncMode("keep_both")}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        syncMode === "keep_both"
                          ? "border-emerald-400 bg-emerald-950/30 text-white"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs mb-0.5">
                        <Layers className="w-4 h-4 text-sky-400" />
                        <span>Keep Both (Append Optimized)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">
                        Appends the new optimized WebP photos without removing the older photos.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Smart Alt Text Section with 512 Char Limit */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Smart SEO Alt Text (Shopify limit: {SHOPIFY_MAX_ALT_TEXT_LENGTH} chars)</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Auto-generated from title &amp; variant
                    </span>
                  </div>

                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {selectedProduct.images.map((img, idx) => {
                      const currentVal =
                        customAltTexts[img.mediaId] ||
                        generateSmartAltText({
                          productTitle: selectedProduct.title,
                          imageIndex: idx,
                          totalImages: selectedProduct.images.length,
                        });
                      const validation = validateShopifyAltText(currentVal);

                      return (
                        <div
                          key={img.mediaId}
                          className="flex items-center gap-3 p-3 rounded-2xl border border-slate-800 bg-slate-950"
                        >
                          <img
                            src={img.url}
                            alt=""
                            className="w-12 h-12 object-cover rounded-xl bg-slate-900 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                              <span>Photo #{idx + 1}</span>
                              <span
                                className={`font-mono font-semibold ${
                                  validation.remaining < 30 ? "text-amber-400" : "text-emerald-400"
                                }`}
                              >
                                {validation.length} / {SHOPIFY_MAX_ALT_TEXT_LENGTH}
                              </span>
                            </div>
                            <input
                              type="text"
                              value={currentVal}
                              maxLength={SHOPIFY_MAX_ALT_TEXT_LENGTH}
                              onChange={(e) =>
                                setCustomAltTexts((prev) => ({
                                  ...prev,
                                  [img.mediaId]: e.target.value,
                                }))
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-400"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Staged Results Preview if compressed */}
                {Object.keys(stagedResults).length > 0 && (
                  <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-2">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Ready to Sync ({Object.keys(stagedResults).length} photos staged)</span>
                      </span>
                      <span>
                        Savings: ~
                        {Math.round(
                          (Object.values(stagedResults).reduce((acc, i) => acc + i.reductionPercent, 0) /
                            Object.values(stagedResults).length) || 0
                        )}
                        %
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Images compressed to WebP and staged on Kilo's temporary CDN. Clicking "Sync to Shopify" will prompt Stockly and Shopify to ingest them permanently.
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  {isProcessing ? processStep : "Zero storage on Kilo servers."}
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  {Object.keys(stagedResults).length === 0 ? (
                    <button
                      type="button"
                      onClick={handleCompressAndStage}
                      disabled={isProcessing}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md shadow-emerald-500/20"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing ({processProgress.current}/{processProgress.total})...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-current" />
                          <span>1. Compress &amp; Stage</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSyncToShopify}
                      disabled={isProcessing}
                      className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md shadow-emerald-500/20"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Syncing to Shopify...</span>
                        </>
                      ) : (
                        <>
                          <Store className="w-4 h-4" />
                          <span>2. Sync to Shopify via Stockly</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
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
