import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("shopify", "routes/shopify.tsx"),
  route("story", "routes/story.tsx"),
  route("blog", "routes/blog._index.tsx"),
  route("blog/:slug", "routes/blog.$slug.tsx"),
  route("research", "routes/research.tsx"),
  route("api/stockly/auth", "routes/api.stockly.auth.ts"),
  route("api/stockly/products", "routes/api.stockly.products.ts"),
  route("api/stockly/sync", "routes/api.stockly.sync.ts"),
  route("api/image-proxy", "routes/api.image-proxy.ts"),
  route("ads.txt", "routes/ads.ts"),
  route("robots.txt", "routes/robots.ts"),
  route("sitemap.xml", "routes/sitemap.ts"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
