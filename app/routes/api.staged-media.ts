import type { Route } from "./+types/api.staged-media";
import { saveStagedBuffer } from "../lib/staged-media.server";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    let buffer: Buffer;
    let format = "webp";

    const contentType = request.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { base64Data, targetFormat } = body;
      if (!base64Data) {
        return Response.json({ error: "Missing base64Data" }, { status: 400 });
      }

      const cleanBase64 = base64Data.replace(/^data:image\/[a-z0-9+.-]+;base64,/, "");
      buffer = Buffer.from(cleanBase64, "base64");
      if (targetFormat) format = targetFormat.toLowerCase();
    } else {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return Response.json({ error: "No file uploaded" }, { status: 400 });
      }

      const arrayBuf = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuf);
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext) format = ext;
    }

    const { uniqueId, filename, sizeBytes } = saveStagedBuffer(buffer, format);

    const urlObj = new URL(request.url);
    const origin = `${urlObj.protocol}//${urlObj.host}`;
    const publicUrl = `${origin}/api/staged-media/${filename}`;

    return Response.json({
      success: true,
      id: uniqueId,
      filename,
      url: publicUrl,
      sizeBytes,
      format,
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Failed to stage image." },
      { status: 500 }
    );
  }
}
