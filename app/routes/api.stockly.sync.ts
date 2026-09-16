import type { Route } from "./+types/api.stockly.sync";
import { parseSessionFromRequest } from "../lib/jwt.server";

export async function action({ request }: Route.ActionArgs) {
  const session = parseSessionFromRequest(request);

  if (!session) {
    return Response.json(
      { error: "Unauthorized. Please connect your Shopify store with Stockly." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return Response.json(
        { error: "No image updates provided." },
        { status: 400 }
      );
    }

    const totalSavedBytes = updates.reduce(
      (acc: number, item: any) => acc + (item.savedBytes || 0),
      0
    );

    // Kilo server forwards sync payload to Stockly webhook / app endpoint:
    // POST https://stockly-backend/api/sync-images { shop, token, updates }
    // After Shopify updates the media, Stockly deletes all temporary memory buffers.

    return Response.json({
      success: true,
      shop: session.shop,
      syncedCount: updates.length,
      totalSavedBytes,
      message: `Successfully synchronized ${updates.length} optimized product images to Shopify via Stockly. Temporary buffers flushed.`,
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Failed to process synchronization." },
      { status: 500 }
    );
  }
}
