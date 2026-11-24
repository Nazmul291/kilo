import type { Route } from "./+types/api.image-proxy";
import {
  SAFE_IMAGE_CONTENT_TYPES,
  readBodyWithLimit,
  sniffImageFormat,
} from "../lib/image-sniff.server";

/**
 * Hosts this proxy may fetch from. Shopify product media lives on the Shopify
 * CDN; Unsplash is used by the demo catalog. Anything else is refused so the
 * server can't be used to reach internal or arbitrary addresses (SSRF).
 */
const ALLOWED_HOSTS = ["cdn.shopify.com", "images.unsplash.com"];
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15_000;

function isAllowedImageUrl(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  if (url.port && url.port !== "443") return null;
  if (!ALLOWED_HOSTS.includes(url.hostname.toLowerCase())) return null;
  return url;
}

export async function loader({ request }: Route.LoaderArgs) {
  const targetParam = new URL(request.url).searchParams.get("url");
  if (!targetParam) {
    return new Response("Missing url parameter", { status: 400 });
  }

  const target = isAllowedImageUrl(targetParam);
  if (!target) {
    return new Response("Image host not allowed", { status: 400 });
  }

  try {
    // redirect: "error" stops an allowed host from bouncing us somewhere else.
    const upstreamRes = await fetch(target, {
      redirect: "error",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { Accept: "image/*" },
    });
    if (!upstreamRes.ok) {
      await upstreamRes.body?.cancel();
      return new Response("Failed to fetch image", { status: 502 });
    }

    const declaredLength = Number(upstreamRes.headers.get("Content-Length") || 0);
    if (declaredLength > MAX_IMAGE_BYTES) {
      await upstreamRes.body?.cancel();
      return new Response("Image too large", { status: 413 });
    }

    const bytes = await readBodyWithLimit(upstreamRes.body, MAX_IMAGE_BYTES);
    if (!bytes) {
      return new Response("Image too large", { status: 413 });
    }

    const format = sniffImageFormat(bytes);
    if (!format) {
      return new Response("Upstream response is not a supported image", { status: 415 });
    }

    return new Response(bytes, {
      headers: {
        "Content-Type": SAFE_IMAGE_CONTENT_TYPES[format],
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Image proxy error", { status: 502 });
  }
}
