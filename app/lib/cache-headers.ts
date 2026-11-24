/**
 * Cache-Control for pages whose HTML is identical for every visitor and only
 * changes on deploy. Browsers always revalidate (max-age=0), while Vercel's
 * CDN keeps the page (s-maxage) so most visits never start a server function.
 * Vercel clears its CDN cache on every new deployment, so content stays fresh.
 *
 * Don't use this on pages whose URL can carry a session token (/shopify,
 * /auth/*): the CDN would store a copy under that URL.
 */
export const STATIC_PAGE_CACHE_CONTROL =
  "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";

export function staticPageHeaders() {
  return { "Cache-Control": STATIC_PAGE_CACHE_CONTROL };
}
