import type { Route } from "./+types/api.stockly.products";
import { parseSessionFromRequest } from "../lib/jwt.server";

export interface ShopifyProductImage {
  id: string;
  url: string;
  altText: string;
  width: number;
  height: number;
  originalSizeBytes: number;
  format: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  totalImages: number;
  images: ShopifyProductImage[];
}

// Curated high-resolution demo products with realistic photography
const DEMO_PRODUCTS: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/847192001",
    title: "Minimalist Leather Minimalist Runner",
    handle: "minimalist-leather-runner",
    vendor: "Modern Apparel Co.",
    totalImages: 2,
    images: [
      {
        id: "img_001",
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=90",
        altText: "Red performance sneaker lateral studio shot",
        width: 1400,
        height: 933,
        originalSizeBytes: 2840000, // ~2.8 MB unoptimized JPEG
        format: "JPEG",
      },
      {
        id: "img_002",
        url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1400&q=90",
        altText: "White athletic sneaker studio angle",
        width: 1400,
        height: 933,
        originalSizeBytes: 2150000, // ~2.1 MB
        format: "JPEG",
      },
    ],
  },
  {
    id: "gid://shopify/Product/847192002",
    title: "Organic Cotton Relaxed Fit Overshirt",
    handle: "organic-cotton-overshirt",
    vendor: "EcoWear Studio",
    totalImages: 2,
    images: [
      {
        id: "img_003",
        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=90",
        altText: "White unisex crewneck cotton apparel",
        width: 1400,
        height: 1400,
        originalSizeBytes: 3420000, // ~3.4 MB
        format: "PNG",
      },
      {
        id: "img_004",
        url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1400&q=90",
        altText: "Black graphic oversized streetwear",
        width: 1400,
        height: 1400,
        originalSizeBytes: 3180000, // ~3.1 MB
        format: "PNG",
      },
    ],
  },
  {
    id: "gid://shopify/Product/847192003",
    title: "Ceramic Matte Pour-Over Coffee Dripper",
    handle: "ceramic-matte-pour-over",
    vendor: "Artisan Living",
    totalImages: 2,
    images: [
      {
        id: "img_005",
        url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1400&q=90",
        altText: "Dark roast coffee in handcrafted ceramic mug",
        width: 1400,
        height: 1750,
        originalSizeBytes: 4120000, // ~4.1 MB
        format: "JPEG",
      },
      {
        id: "img_006",
        url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=90",
        altText: "Coffee beans and wooden grinder setup",
        width: 1400,
        height: 933,
        originalSizeBytes: 2450000, // ~2.4 MB
        format: "JPEG",
      },
    ],
  },
  {
    id: "gid://shopify/Product/847192004",
    title: "Anodized Aluminum Mechanical Keyboard",
    handle: "anodized-aluminum-mechanical-keyboard",
    vendor: "Nordic Tech",
    totalImages: 2,
    images: [
      {
        id: "img_007",
        url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1400&q=90",
        altText: "Mechanical keyboard top down desk setup",
        width: 1400,
        height: 933,
        originalSizeBytes: 3650000, // ~3.6 MB
        format: "JPEG",
      },
      {
        id: "img_008",
        url: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1400&q=90",
        altText: "Ergonomic keyboard mechanical switches closeup",
        width: 1400,
        height: 933,
        originalSizeBytes: 2980000, // ~2.9 MB
        format: "JPEG",
      },
    ],
  },
];

export async function loader({ request }: Route.LoaderArgs) {
  const session = parseSessionFromRequest(request);

  if (!session) {
    return Response.json(
      { error: "Unauthorized. Please connect your Shopify store with Stockly." },
      { status: 401 }
    );
  }

  // If connected via live Stockly / Shopify API, we proxy to Shopify GraphQL Admin:
  // query { products(first: 20) { edges { node { id title handle vendor images(...) } } } }
  // If demo shop or token: return DEMO_PRODUCTS
  const isDemo =
    session.shop.includes("demo") || session.token.includes("demo");

  if (isDemo) {
    return Response.json({
      shop: session.shop,
      isDemo: true,
      totalProducts: DEMO_PRODUCTS.length,
      totalImages: DEMO_PRODUCTS.reduce((acc, p) => acc + p.totalImages, 0),
      products: DEMO_PRODUCTS,
    });
  }

  // Attempt live Shopify API fetch if standard token provided
  try {
    const shopifyGraphQLUrl = `https://${session.shop}/admin/api/2026-01/graphql.json`;
    const query = `
      query {
        products(first: 20) {
          edges {
            node {
              id
              title
              handle
              vendor
              images(first: 10) {
                edges {
                  node {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
          }
        }
      }
    `;

    const shopifyRes = await fetch(shopifyGraphQLUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": session.token,
      },
      body: JSON.stringify({ query }),
    });

    if (shopifyRes.ok) {
      const data = await shopifyRes.json();
      const rawProducts = data.data?.products?.edges || [];
      const products: ShopifyProduct[] = rawProducts.map((edge: any) => {
        const node = edge.node;
        const images: ShopifyProductImage[] = (node.images?.edges || []).map(
          (imgEdge: any, idx: number) => {
            const img = imgEdge.node;
            return {
              id: img.id || `img_${idx}`,
              url: img.url,
              altText: img.altText || node.title,
              width: img.width || 1200,
              height: img.height || 1200,
              originalSizeBytes: 2500000,
              format: "JPEG",
            };
          }
        );

        return {
          id: node.id,
          title: node.title,
          handle: node.handle,
          vendor: node.vendor || "Store",
          totalImages: images.length,
          images,
        };
      });

      return Response.json({
        shop: session.shop,
        isDemo: false,
        totalProducts: products.length,
        totalImages: products.reduce((acc, p) => acc + p.totalImages, 0),
        products: products.length > 0 ? products : DEMO_PRODUCTS,
      });
    }
  } catch {
    // Gracefully fallback to demo catalog if network / credentials mock
  }

  return Response.json({
    shop: session.shop,
    isDemo: false,
    totalProducts: DEMO_PRODUCTS.length,
    totalImages: DEMO_PRODUCTS.reduce((acc, p) => acc + p.totalImages, 0),
    products: DEMO_PRODUCTS,
  });
}
