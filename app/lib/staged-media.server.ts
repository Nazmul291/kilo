import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const STAGING_DIR = path.join(process.cwd(), "node_modules", ".cache", "kilo-staged-media");

// Ensure staging directory exists
if (!fs.existsSync(STAGING_DIR)) {
  fs.mkdirSync(STAGING_DIR, { recursive: true });
}

// Clean up files older than 2 hours to maintain zero long-term database/server overhead
export function cleanOldStagedFiles() {
  try {
    const now = Date.now();
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    const files = fs.readdirSync(STAGING_DIR);
    for (const file of files) {
      const filePath = path.join(STAGING_DIR, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > TWO_HOURS) {
        fs.unlinkSync(filePath);
      }
    }
  } catch {
    // Ignore cleanup errors
  }
}

export function saveStagedBuffer(buffer: Buffer, format: string): { uniqueId: string; filename: string; sizeBytes: number } {
  cleanOldStagedFiles();
  const uniqueId = crypto.randomBytes(12).toString("hex");
  const filename = `${uniqueId}.${format}`;
  const filePath = path.join(STAGING_DIR, filename);
  fs.writeFileSync(filePath, buffer);
  return { uniqueId, filename, sizeBytes: buffer.length };
}

export function readStagedFile(filename: string): { buffer: Buffer; contentType: string } | null {
  if (!filename || filename.includes("..") || filename.includes("/")) {
    return null;
  }
  const filePath = path.join(STAGING_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const ext = path.extname(filename).toLowerCase();
  let contentType = "image/webp";
  if (ext === ".png") contentType = "image/png";
  else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
  else if (ext === ".avif") contentType = "image/avif";
  else if (ext === ".gif") contentType = "image/gif";
  else if (ext === ".svg") contentType = "image/svg+xml";

  return { buffer: fs.readFileSync(filePath), contentType };
}
