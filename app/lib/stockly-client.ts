/**
 * Kilo ↔ Stockly API Client
 * 
 * Implements unidirectional communication from Kilo to Stockly backend
 * according to the integration specification.
 */

export const STOCKLY_PROD_URL = "https://stockly.nazmulcodes.org";
export const TOKEN_STORAGE_KEY = "stockly_jwt";
export const SHOP_STORAGE_KEY = "stockly_shop";

export interface StocklyImage {
  mediaId: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  originalSizeBytes?: number;
}

export interface StocklyProduct {
  id: string;
  gid: string;
  title: string;
  handle: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  featuredImageUrl?: string;
  mediaCount: number;
  optimized: boolean;
  savingsPercent?: number | null;
  mode?: "replace" | "keep_both" | null;
  lastOptimizedAt?: string | null;
  images: StocklyImage[];
  vendor?: string;
}

export interface StocklyPageInfo {
  hasNextPage: boolean;
  endCursor?: string | null;
}

export interface StocklyProductsResponse {
  success: boolean;
  shop: string;
  pageInfo: StocklyPageInfo;
  products: StocklyProduct[];
  isDemo?: boolean;
}

export interface SyncMediaItem {
  url: string;
  format: string;
  alt: string;
  sizeBytes: number;
}

export interface SyncProductMediaPayload {
  productId: string;
  mode: "replace" | "keep_both";
  savingsPercent: number;
  totalOriginalBytes?: number;
  totalOptimizedBytes?: number;
  optimizedImages: SyncMediaItem[];
}

export interface SyncProductMediaResponse {
  success: boolean;
  shop: string;
  productId: string;
  mode: string;
  mediaCount: number;
  savingsPercent: number;
  error?: string;
}

export interface ProductStatusResponse {
  success: boolean;
  shop: string;
  productId: string;
  found: boolean;
  productTitle: string;
  mediaCount: number;
  optimized: boolean;
  backupData?: {
    version: number;
    status: string;
    lastOptimizedAt: string;
    revertedAt?: string | null;
    mode: string;
    savingsPercent: number;
    totalOriginalBytes: number;
    totalOptimizedBytes: number;
    previousMedia: Array<{
      mediaId: string;
      originalSourceUrl: string;
      alt: string;
      position: number;
    }>;
    kiloMedia: Array<{
      mediaId: string;
      url: string;
      format: string;
    }>;
  };
  error?: string;
}

export interface RevertProductMediaResponse {
  success: boolean;
  shop: string;
  productId: string;
  alreadyReverted: boolean;
  restoredCount: number;
  message: string;
  error?: string;
}

// Fallback high-fidelity demo products for demo mode or local sandbox testing
export const DEMO_STOCKLY_PRODUCTS: StocklyProduct[] = [
  {
    id: "9876543210",
    gid: "gid://shopify/Product/9876543210",
    title: "Classic Heavyweight Cotton T-Shirt",
    handle: "classic-heavyweight-cotton-tshirt",
    status: "ACTIVE",
    featuredImageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=90",
    mediaCount: 2,
    optimized: false,
    savingsPercent: null,
    mode: null,
    lastOptimizedAt: null,
    vendor: "Modern Apparel Co.",
    images: [
      {
        mediaId: "gid://shopify/MediaImage/11111111",
        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=90",
        alt: "Front view of white cotton crewneck t-shirt",
        width: 1200,
        height: 1200,
        originalSizeBytes: 3420000,
      },
      {
        mediaId: "gid://shopify/MediaImage/22222222",
        url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=90",
        alt: "Back view of black graphic oversized streetwear",
        width: 1200,
        height: 1200,
        originalSizeBytes: 3180000,
      },
    ],
  },
  {
    id: "9876543211",
    gid: "gid://shopify/Product/9876543211",
    title: "Leather Minimalist Daily Sneaker",
    handle: "leather-minimalist-daily-sneaker",
    status: "ACTIVE",
    featuredImageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=90",
    mediaCount: 2,
    optimized: false,
    savingsPercent: null,
    mode: null,
    lastOptimizedAt: null,
    vendor: "Stride Athletic",
    images: [
      {
        mediaId: "gid://shopify/MediaImage/33333333",
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=90",
        alt: "Red performance sneaker lateral studio shot",
        width: 1200,
        height: 800,
        originalSizeBytes: 2840000,
      },
      {
        mediaId: "gid://shopify/MediaImage/44444444",
        url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=90",
        alt: "White athletic sneaker angled studio perspective",
        width: 1200,
        height: 800,
        originalSizeBytes: 2150000,
      },
    ],
  },
  {
    id: "9876543212",
    gid: "gid://shopify/Product/9876543212",
    title: "Matte Ceramic Pour-Over Coffee Dripper",
    handle: "matte-ceramic-pour-over-dripper",
    status: "ACTIVE",
    featuredImageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=90",
    mediaCount: 2,
    optimized: false,
    savingsPercent: null,
    mode: null,
    lastOptimizedAt: null,
    vendor: "Artisan Living",
    images: [
      {
        mediaId: "gid://shopify/MediaImage/55555555",
        url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=90",
        alt: "Dark roast coffee in handcrafted ceramic dripper",
        width: 1200,
        height: 1500,
        originalSizeBytes: 4120000,
      },
      {
        mediaId: "gid://shopify/MediaImage/66666666",
        url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=90",
        alt: "Artisan roasted coffee beans and hand grinder setup",
        width: 1200,
        height: 800,
        originalSizeBytes: 2450000,
      },
    ],
  },
];

/**
 * Get stored Stockly JWT token from localStorage
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
}

/**
 * Get stored shop domain
 */
export function getStoredShop(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SHOP_STORAGE_KEY) || null;
}

/**
 * Save Stockly credentials
 */
export function setStoredSession(token: string, shop: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(SHOP_STORAGE_KEY, shop);
}

/**
 * Clear stored Stockly credentials
 */
export function clearStoredSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(SHOP_STORAGE_KEY);
}

/**
 * Decode payload from standard JWT without verifying signature client-side
 */
export function decodeJwtPayload(jwt: string): any | null {
  try {
    const parts = jwt.split(".");
    if (parts.length < 2) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/**
 * Core fetch wrapper sending Bearer token to Stockly API
 */
async function stocklyFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && options.method && options.method !== "GET") {
    headers.set("Content-Type", "application/json");
  }

  const url = `${STOCKLY_PROD_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Session expired or invalid
    clearStoredSession();
    throw new Error(
      "Your Stockly 24-hour authentication session has expired. Please re-open Kilo from your Stockly dashboard in Shopify."
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.error || `Stockly API request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

/**
 * Fetch products list from Stockly API
 */
export async function fetchStocklyProducts(params: {
  limit?: number;
  cursor?: string | null;
  query?: string | null;
} = {}): Promise<StocklyProductsResponse> {
  const token = getStoredToken();
  const isDemo = token === "demo-token" || !token;

  // In demo mode or if no token yet, provide curated sandbox items
  if (isDemo) {
    return {
      success: true,
      shop: getStoredShop() || "demo-store.myshopify.com",
      pageInfo: { hasNextPage: false, endCursor: null },
      products: DEMO_STOCKLY_PRODUCTS,
      isDemo: true,
    };
  }

  try {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.cursor) searchParams.set("cursor", params.cursor);
    if (params.query) searchParams.set("query", params.query);

    const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return await stocklyFetch<StocklyProductsResponse>(`/api/kilo/products${queryStr}`, {
      method: "GET",
    });
  } catch (err: any) {
    // If remote endpoint returns 404/500 during initial integration test, fallback to demo catalog with warning
    console.warn("Stockly products fetch fallback:", err.message);
    return {
      success: true,
      shop: getStoredShop() || "demo-store.myshopify.com",
      pageInfo: { hasNextPage: false, endCursor: null },
      products: DEMO_STOCKLY_PRODUCTS,
      isDemo: true,
    };
  }
}

/**
 * Push optimized images to Shopify via Stockly
 */
export async function syncProductMediaToStockly(
  payload: SyncProductMediaPayload
): Promise<SyncProductMediaResponse> {
  const token = getStoredToken();
  const isDemo = token === "demo-token" || !token;

  if (isDemo) {
    // Simulate instantaneous successful sync for demo sandbox
    await new Promise((r) => setTimeout(r, 600));
    return {
      success: true,
      shop: getStoredShop() || "demo-store.myshopify.com",
      productId: payload.productId,
      mode: payload.mode,
      mediaCount: payload.optimizedImages.length,
      savingsPercent: payload.savingsPercent,
    };
  }

  return await stocklyFetch<SyncProductMediaResponse>("/api/kilo/sync-product-media", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Query product optimization and backup status
 */
export async function getProductOptimizationStatus(
  productId: string
): Promise<ProductStatusResponse> {
  const token = getStoredToken();
  const isDemo = token === "demo-token" || !token;

  if (isDemo) {
    return {
      success: true,
      shop: getStoredShop() || "demo-store.myshopify.com",
      productId,
      found: true,
      productTitle: "Demo Product",
      mediaCount: 2,
      optimized: false,
    };
  }

  return await stocklyFetch<ProductStatusResponse>(
    `/api/kilo/product-status?productId=${encodeURIComponent(productId)}`,
    {
      method: "GET",
    }
  );
}

/**
 * 1-Click Rollback / Revert product media to original high-res backup
 */
export async function revertProductMedia(
  productId: string
): Promise<RevertProductMediaResponse> {
  const token = getStoredToken();
  const isDemo = token === "demo-token" || !token;

  if (isDemo) {
    await new Promise((r) => setTimeout(r, 500));
    return {
      success: true,
      shop: getStoredShop() || "demo-store.myshopify.com",
      productId,
      alreadyReverted: false,
      restoredCount: 2,
      message: "Restored 2 original images successfully from private backup.",
    };
  }

  return await stocklyFetch<RevertProductMediaResponse>(
    "/api/kilo/revert-product-media",
    {
      method: "POST",
      body: JSON.stringify({ productId }),
    }
  );
}
