import type { Config } from "@react-router/dev/config";
import { getAllBlogPosts } from "./app/lib/blog-data";

export default {
  // Kilo is a fully static site: every page is rendered to HTML at build time
  // and served from Vercel's CDN, with no server function at runtime. All
  // image work (compression, Shopify fetches) happens in the browser.
  ssr: false,
  async prerender() {
    return [
      "/",
      "/story",
      "/blog",
      ...getAllBlogPosts().map((post) => `/blog/${post.slug}`),
      "/research",
      "/privacy",
      "/terms",
      "/shopify",
      "/auth/shopify",
      // Rendered by the catch-all route; copied to /404.html after the build.
      "/404",
    ];
  },
} satisfies Config;
