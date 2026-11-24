import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  SAFE_IMAGE_CONTENT_TYPES,
  sniffImageFormat,
  type SafeImageFormat,
} from "./image-sniff.server";

const STAGING_DIR = path.join(process.cwd(), "node_modules", ".cache", "kilo-staged-media");

export const MAX_STAGED_FILE_BYTES = 15 * 1024 * 1024;
const MAX_STAGED_TOTAL_BYTES = 1024 * 1024 * 1024;
const MAX_STAGED_FILES = 2000;
const TWO_HOURS = 2 * 60 * 60 * 1000;

// Staged filenames are always generated here: 24 hex chars + a safe raster extension.
const STAGED_FILENAME_RE = /^[a-f0-9]{24}\.(jpg|png|webp|gif|avif)$/;

if (!fs.existsSync(STAGING_DIR)) {
  fs.mkdirSync(STAGING_DIR, { recursive: true });
}

export class StagingError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

/**
 * Deletes files older than 2 hours and returns what remains on disk.
 */
function cleanOldStagedFiles(): { count: number; totalBytes: number } {
  let count = 0;
  let totalBytes = 0;
  try {
    const now = Date.now();
    for (const file of fs.readdirSync(STAGING_DIR)) {
      const filePath = path.join(STAGING_DIR, file);
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > TWO_HOURS) {
        fs.unlinkSync(filePath);
      } else {
        count++;
        totalBytes += stats.size;
      }
    }
  } catch {
    // Ignore cleanup errors
  }
  return { count, totalBytes };
}

export function saveStagedBuffer(buffer: Uint8Array): {
  uniqueId: string;
  filename: string;
  sizeBytes: number;
  format: SafeImageFormat;
} {
  if (buffer.byteLength === 0) {
    throw new StagingError("Empty file.", 400);
  }
  if (buffer.byteLength > MAX_STAGED_FILE_BYTES) {
    throw new StagingError("File too large.", 413);
  }

  // The stored format comes from the file's bytes, never from the client.
  const format = sniffImageFormat(buffer);
  if (!format) {
    throw new StagingError("Only JPEG, PNG, WebP, GIF and AVIF images can be staged.", 415);
  }

  const usage = cleanOldStagedFiles();
  if (
    usage.count >= MAX_STAGED_FILES ||
    usage.totalBytes + buffer.byteLength > MAX_STAGED_TOTAL_BYTES
  ) {
    throw new StagingError("Staging storage is full. Please try again later.", 503);
  }

  const uniqueId = crypto.randomBytes(12).toString("hex");
  const filename = `${uniqueId}.${format}`;
  fs.writeFileSync(path.join(STAGING_DIR, filename), buffer);
  return { uniqueId, filename, sizeBytes: buffer.byteLength, format };
}

export function readStagedFile(filename: string): { buffer: Buffer; contentType: string } | null {
  if (!filename || !STAGED_FILENAME_RE.test(filename)) {
    return null;
  }
  const filePath = path.join(STAGING_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const format = path.extname(filename).slice(1) as SafeImageFormat;
  return { buffer: fs.readFileSync(filePath), contentType: SAFE_IMAGE_CONTENT_TYPES[format] };
}
