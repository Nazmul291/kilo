/**
 * Google Analytics 4 (gtag.js) with Consent Mode v2.
 *
 * - Loads only in the browser, never on localhost or on /auth/* (those URLs
 *   can carry a Stockly session token).
 * - Every page URL sent to Google has the `token` / `shop` query parameters
 *   and the hash removed.
 * - Consent: the visitor's banner choice wins. With no choice yet, analytics
 *   cookies are denied in the EEA, UK and Switzerland and allowed elsewhere.
 * - Event params never contain file names, shop domains or tokens.
 */

export const GA_MEASUREMENT_ID = "G-4T7M6G9TSD";

export const CONSENT_STORAGE_KEY = "kilo_cookie_consent";
export type ConsentChoice = "all" | "essential";

// Regions where analytics cookies need opt-in consent.
const OPT_IN_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "IS", "LI", "NO", "GB", "CH",
];

const SENSITIVE_QUERY_KEYS = ["token", "shop"];

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

let initialized = false;

function isAnalyticsAllowedHere(): boolean {
  const { hostname, pathname } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]") return false;
  if (pathname.startsWith("/auth/")) return false;
  return true;
}

export function sanitizePageUrl(href: string): string {
  try {
    const url = new URL(href);
    for (const key of SENSITIVE_QUERY_KEYS) url.searchParams.delete(key);
    url.hash = "";
    return url.toString();
  } catch {
    return window.location.origin + window.location.pathname;
  }
}

export function getStoredConsent(): ConsentChoice | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "all" || value === "essential" ? value : null;
  } catch {
    return null;
  }
}

function consentState(granted: boolean) {
  return { analytics_storage: granted ? "granted" : "denied" };
}

/**
 * Loads gtag.js once. Safe to call repeatedly.
 */
export function initAnalytics(): void {
  if (initialized || typeof window === "undefined" || !isAnalyticsAllowedHere()) return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js requires the `arguments` object itself, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };

  const stored = getStoredConsent();
  if (stored) {
    window.gtag("consent", "default", consentState(stored === "all"));
  } else {
    window.gtag("consent", "default", consentState(true));
    window.gtag("consent", "default", { ...consentState(false), region: OPT_IN_REGIONS });
  }

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_location: sanitizePageUrl(window.location.href),
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function updateAnalyticsConsent(choice: ConsentChoice): void {
  window.gtag?.("consent", "update", consentState(choice === "all"));
}

export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

/**
 * Coarse size bucket so exact file sizes are never sent.
 */
export function sizeBucket(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 0.1) return "<100KB";
  if (mb < 0.5) return "100-500KB";
  if (mb < 1) return "0.5-1MB";
  if (mb < 5) return "1-5MB";
  if (mb < 10) return "5-10MB";
  return "10MB+";
}
