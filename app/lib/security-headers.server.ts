/**
 * Single source of truth for the security headers sent with HTML documents.
 * The CSP allows exactly what the app loads: its own assets, Google Fonts,
 * Google AdSense, and the configured Stockly API.
 */

function stocklyOrigin(): string | null {
  const raw = process.env.STOCKLY_API_URL || process.env.VITE_STOCKLY_API_URL;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

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
  const stockly = stocklyOrigin();

  const connectSrc = ["'self'", ...ADSENSE_CONNECT_SOURCES];
  if (stockly) connectSrc.push(stockly);
  if (isDev) connectSrc.push("ws:", "wss:"); // Vite HMR

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // 'unsafe-inline' is needed for React Router's inline hydration scripts.
    "script-src": ["'self'", "'unsafe-inline'", ...ADSENSE_SCRIPT_SOURCES],
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
