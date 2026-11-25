import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("shopify", "routes/shopify.tsx"),
  route("story", "routes/story.tsx"),
  route("blog", "routes/blog._index.tsx"),
  route("blog/:slug", "routes/blog.$slug.tsx"),
  route("research", "routes/research.tsx"),
  route("auth/shopify", "routes/auth.shopify.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx"),
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
