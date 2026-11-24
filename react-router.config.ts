import type { Config } from "@react-router/dev/config";

export default {
  // Server-side render by default, to enable SPA mode set this to `false`
  // Static pages are cached on Vercel's CDN via Cache-Control headers
  // (app/lib/cache-headers.ts) rather than prerendered: on Vercel this app
  // runs as a single Node server, which would redirect prerendered paths
  // (/blog -> /blog/) instead of serving them from the CDN.
  ssr: true,
} satisfies Config;
