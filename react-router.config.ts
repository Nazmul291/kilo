import type { Config } from "@react-router/dev/config";
import { getAllBlogPosts } from "./app/lib/blog-data";

export default {
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  // Static content pages are rendered to HTML at build time and served from
  // the CDN, so they never start a server function. Dynamic pages (/shopify,
  // /auth/shopify) and API routes still render on the server.
  async prerender() {
    return [
      "/",
      "/story",
      "/blog",
      ...getAllBlogPosts().map((post) => `/blog/${post.slug}`),
      "/research",
      "/privacy",
      "/terms",
    ];
  },
} satisfies Config;
