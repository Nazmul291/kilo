import type { Route } from "./+types/api.staged-media.$filename";
import { readStagedFile } from "../lib/staged-media.server";

export async function loader({ params }: Route.LoaderArgs) {
  const result = readStagedFile(params.filename ?? "");
  if (!result) {
    return new Response("Staged image not found or expired", { status: 404 });
  }

  return new Response(new Uint8Array(result.buffer), {
    headers: {
      "Content-Type": result.contentType,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=7200",
    },
  });
}
