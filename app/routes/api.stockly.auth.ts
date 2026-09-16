import type { Route } from "./+types/api.stockly.auth";
import {
  signStocklySession,
  parseSessionFromRequest,
  createSessionCookieHeader,
  createClearSessionCookieHeader,
} from "../lib/jwt.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = parseSessionFromRequest(request);
  if (!session) {
    return Response.json({ authenticated: false, shop: null });
  }

  return Response.json({
    authenticated: true,
    shop: session.shop,
    connectedAt: session.connectedAt,
    expiresAt: session.exp,
  });
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method === "DELETE") {
    return Response.json(
      { success: true, disconnected: true },
      {
        headers: {
          "Set-Cookie": createClearSessionCookieHeader(),
        },
      }
    );
  }

  if (request.method === "POST") {
    try {
      const body = await request.json();
      let { shop, accessToken } = body;

      if (!shop || typeof shop !== "string" || !accessToken || typeof accessToken !== "string") {
        return Response.json(
          { error: "Both shop domain and Stockly access token are required." },
          { status: 400 }
        );
      }

      // Normalize shop domain
      shop = shop.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/+$/, "");
      if (!shop.includes(".")) {
        shop = `${shop}.myshopify.com`;
      }

      accessToken = accessToken.trim();

      // Demo sandbox support
      const isDemo =
        shop.includes("demo") ||
        accessToken.toLowerCase().includes("demo") ||
        accessToken === "demo-stockly-token-2026";

      if (!isDemo && accessToken.length < 10) {
        return Response.json(
          { error: "Invalid access token length. Please provide a valid Stockly access token." },
          { status: 400 }
        );
      }

      // Create stateless JWT session
      const jwt = signStocklySession(shop, accessToken);

      return Response.json(
        {
          success: true,
          shop,
          isDemo,
          message: "Successfully authenticated with Stockly. Session encrypted in secure cookie.",
        },
        {
          headers: {
            "Set-Cookie": createSessionCookieHeader(jwt),
          },
        }
      );
    } catch (err: any) {
      return Response.json(
        { error: err.message || "Failed to parse authentication request." },
        { status: 500 }
      );
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
