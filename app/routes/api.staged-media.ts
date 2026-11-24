import type { Route } from "./+types/api.staged-media";
import {
  MAX_STAGED_FILE_BYTES,
  StagingError,
  saveStagedBuffer,
} from "../lib/staged-media.server";

// Allow room for multipart / base64 overhead on top of the raw file limit.
const MAX_REQUEST_BYTES = Math.ceil(MAX_STAGED_FILE_BYTES * 1.4) + 64 * 1024;

/**
 * Only accept uploads made by Kilo's own pages in a browser.
 */
function isSameOriginRequest(request: Request): boolean {
  const fetchSite = request.headers.get("Sec-Fetch-Site");
  if (fetchSite) return fetchSite === "same-origin";

  const origin = request.headers.get("Origin");
  if (!origin) return false;
  return origin === new URL(request.url).origin;
}

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("Content-Length") || NaN);
  if (!Number.isFinite(contentLength)) {
    return Response.json({ error: "Content-Length required" }, { status: 411 });
  }
  if (contentLength > MAX_REQUEST_BYTES) {
    return Response.json({ error: "File too large." }, { status: 413 });
  }

  try {
    let buffer: Uint8Array;
    const contentType = request.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const base64Data = typeof body?.base64Data === "string" ? body.base64Data : "";
      if (!base64Data) {
        return Response.json({ error: "Missing base64Data" }, { status: 400 });
      }
      const cleanBase64 = base64Data.replace(/^data:image\/[a-z0-9+.-]+;base64,/, "");
      buffer = Buffer.from(cleanBase64, "base64");
    } else {
      const formData = await request.formData();
      const file = formData.get("file");
      if (!(file instanceof File)) {
        return Response.json({ error: "No file uploaded" }, { status: 400 });
      }
      buffer = new Uint8Array(await file.arrayBuffer());
    }

    const { uniqueId, filename, sizeBytes, format } = saveStagedBuffer(buffer);
    const publicUrl = `${new URL(request.url).origin}/api/staged-media/${filename}`;

    return Response.json({
      success: true,
      id: uniqueId,
      filename,
      url: publicUrl,
      sizeBytes,
      format,
    });
  } catch (err) {
    if (err instanceof StagingError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return Response.json({ error: "Failed to stage image." }, { status: 500 });
  }
}
