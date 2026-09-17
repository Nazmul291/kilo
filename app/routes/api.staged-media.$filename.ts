import type { Route } from "./+types/api.staged-media.$filename";
import { readStagedFile } from "../lib/staged-media.server";

export async function loader({ params }: Route.LoaderArgs) {
  const filename = params.filename;
  if (!filename) {
    return new Response("Invalid filename", { status: 400 });
  }

  const result = readStagedFile(filename);
  if (!result) {
    return new Response("Staged image not found or expired", { status: 404 });
  }

  return new Response(result.buffer, {
    headers: {
      "Content-Type": result.contentType,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=7200",
    },
  });
}
