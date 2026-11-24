/**
 * Single source of truth for the security headers sent with HTML documents.
 * The CSP allows exactly what the app loads: its own assets, Google Fonts,
 * Google AdSense, and the configured Stockly API.
 *
 * vercel.json carries a copy of this CSP (minus the Stockly origins) for
 * responses that don't pass through entry.server, such as files in public/.
 * Keep the two in sync.
 */

import { DEFAULT_STOCKLY_URL } from "./stockly-client";

function toOrigin(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

/**
 * Every origin the browser may call for the Stockly API. The browser bundle
 * resolves VITE_STOCKLY_API_URL at build time and otherwise falls back to
 * DEFAULT_STOCKLY_URL, so both must be allowed even when no env var is set.
 */
function stocklyOrigins(): string[] {
  const candidates = [
    import.meta.env.VITE_STOCKLY_API_URL || DEFAULT_STOCKLY_URL,
    process.env.STOCKLY_API_URL,
    process.env.VITE_STOCKLY_API_URL,
  ];
  const origins = candidates.map(toOrigin).filter((o): o is string => o !== null);
  return [...new Set(origins)];
}

// Google Analytics 4 (gtag.js) script and collection endpoints.
const ANALYTICS_SCRIPT_SOURCES = ["https://www.googletagmanager.com"];
const ANALYTICS_CONNECT_SOURCES = [
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://*.googletagmanager.com",
];

const ADSENSE_SCRIPT_SOURCES = [
  "https://pagead2.googlesyndication.com",
  "https://*.googlesyndication.com",
  "https://*.adtrafficquality.google",
  "https://www.googletagservices.com",
  "https://adservice.google.com",
];

const ADSENSE_FRAME_SOURCES = [
  "https://*.googlesyndication.com",
  "https://*.doubleclick.net",
  "https://www.google.com",
  "https://*.adtrafficquality.google",
];

const ADSENSE_CONNECT_SOURCES = [
  "https://*.googlesyndication.com",
  "https://*.doubleclick.net",
  "https://*.google.com",
  "https://*.adtrafficquality.google",
];

export function buildContentSecurityPolicy(): string {
  const isDev = process.env.NODE_ENV !== "production";

  const connectSrc = ["'self'", ...ADSENSE_CONNECT_SOURCES, ...ANALYTICS_CONNECT_SOURCES];
  connectSrc.push(...stocklyOrigins());
  if (isDev) connectSrc.push("ws:", "wss:"); // Vite HMR

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // 'unsafe-inline' is needed for React Router's inline hydration scripts.
    "script-src": ["'self'", "'unsafe-inline'", ...ADSENSE_SCRIPT_SOURCES, ...ANALYTICS_SCRIPT_SOURCES],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "connect-src": connectSrc,
    "frame-src": ADSENSE_FRAME_SOURCES,
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  return Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ");
}

export function applyDocumentSecurityHeaders(headers: Headers): void {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Content-Security-Policy", buildContentSecurityPolicy());
}
