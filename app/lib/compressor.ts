export type TargetFormat = "original" | "webp" | "jpeg" | "png" | "ico";

export interface CompressionOptions {
  compressionLevel: number; // 0 (lossless/max quality) to 90+ (aggressive reduction)
  targetFormat: TargetFormat;
  maxWidth?: number;
  maxHeight?: number;
}

export interface CompressionResult {
  blob: Blob;
  blobUrl: string;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercentage: number;
  format: string;
  fileName: string;
  width: number;
  height: number;
}

/**
 * Single Source of Truth: Format file size into human-readable string
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${value} ${sizes[i]}`;
}

/**
 * Calculates size reduction percentage and bytes saved
 */
export function calculateSavings(originalSize: number, newSize: number): { savedBytes: number; percentage: number } {
  const savedBytes = Math.max(0, originalSize - newSize);
  const percentage = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;
  return { savedBytes, percentage };
}

/**
 * Converts compression slider (0% to 90%+) into quality factor (1.0 down to 0.1)
 */
export function sliderToQuality(sliderValue: number): number {
  // Slider: 0% compression -> Quality 1.0 (lossless / highest quality)
  // Slider: 90% compression -> Quality 0.1 (aggressive compression)
  const clamped = Math.min(95, Math.max(0, sliderValue));
  const quality = 1.0 - (clamped / 100) * 0.9;
  return Math.max(0.05, Math.min(1.0, quality));
}

/**
 * Encodes multiple PNG/canvas buffers into a standard Windows .ICO file binary
 */
export async function createIcoFromCanvas(sourceCanvas: HTMLCanvasElement): Promise<Blob> {
  const sizes = [16, 32, 48];
  const pngBlobs: { size: number; buffer: ArrayBuffer }[] = [];

  for (const s of sizes) {
    const iconCanvas = document.createElement("canvas");
    iconCanvas.width = s;
    iconCanvas.height = s;
    const ctx = iconCanvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(sourceCanvas, 0, 0, s, s);
      const blob = await new Promise<Blob | null>((resolve) => iconCanvas.toBlob(resolve, "image/png"));
      if (blob) {
        const buffer = await blob.arrayBuffer();
        pngBlobs.push({ size: s, buffer });
      }
    }
  }

  // ICO header: 6 bytes
  // 0-1: Reserved (0)
  // 2-3: Type (1 for ICO)
  // 4-5: Count of images
  const count = pngBlobs.length;
  const header = new Uint8Array(6);
  header[0] = 0;
  header[1] = 0;
  header[2] = 1;
  header[3] = 0;
  header[4] = count & 0xff;
  header[5] = (count >> 8) & 0xff;

  // Directory entries: 16 bytes per image
  const dirSize = 16 * count;
  let currentOffset = 6 + dirSize;
  const dirBuffers: Uint8Array[] = [];

  for (const item of pngBlobs) {
    const entry = new Uint8Array(16);
    entry[0] = item.size === 256 ? 0 : item.size; // Width
    entry[1] = item.size === 256 ? 0 : item.size; // Height
    entry[2] = 0; // Color count
    entry[3] = 0; // Reserved
    entry[4] = 1; // Color planes
    entry[5] = 0;
    entry[6] = 32; // Bits per pixel
    entry[7] = 0;
    // Image data size (4 bytes)
    const len = item.buffer.byteLength;
    entry[8] = len & 0xff;
    entry[9] = (len >> 8) & 0xff;
    entry[10] = (len >> 16) & 0xff;
    entry[11] = (len >> 24) & 0xff;
    // Image offset (4 bytes)
    entry[12] = currentOffset & 0xff;
    entry[13] = (currentOffset >> 8) & 0xff;
    entry[14] = (currentOffset >> 16) & 0xff;
    entry[15] = (currentOffset >> 24) & 0xff;

    dirBuffers.push(entry);
    currentOffset += len;
  }

  const finalParts = [header, ...dirBuffers, ...pngBlobs.map((p) => p.buffer)] as unknown as BlobPart[];
  return new Blob(finalParts, { type: "image/x-icon" });
}

/**
 * 100% In-Memory client-side image compression & conversion engine
 */
export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<CompressionResult> {
  const originalSize = file.size;
  const quality = sliderToQuality(options.compressionLevel);

  // Load image
  const imgUrl = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (e) => reject(new Error("Unable to decode source image: " + e));
    image.src = imgUrl;
  });

  // Calculate target dimensions
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (options.maxWidth && width > options.maxWidth) {
    height = Math.round((height * options.maxWidth) / width);
    width = options.maxWidth;
  }
  if (options.maxHeight && height > options.maxHeight) {
    width = Math.round((width * options.maxHeight) / height);
    height = options.maxHeight;
  }

  // Draw into canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    URL.revokeObjectURL(imgUrl);
    throw new Error("Could not initialize 2D canvas context");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Determine output MIME type & file extension
  let outMime: string;
  let extension: string;

  if (options.targetFormat === "original") {
    outMime = file.type || "image/jpeg";
    extension = file.name.includes(".") ? file.name.split(".").pop() || "jpg" : "jpg";
  } else if (options.targetFormat === "webp") {
    outMime = "image/webp";
    extension = "webp";
  } else if (options.targetFormat === "jpeg") {
    outMime = "image/jpeg";
    extension = "jpg";
  } else if (options.targetFormat === "png") {
    outMime = "image/png";
    extension = "png";
  } else if (options.targetFormat === "ico") {
    outMime = "image/x-icon";
    extension = "ico";
  } else {
    outMime = "image/webp";
    extension = "webp";
  }

  // If converting to JPEG or ICO, fill background if transparency exists
  if (outMime === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(imgUrl);

  let outputBlob: Blob;

  if (options.targetFormat === "ico") {
    outputBlob = await createIcoFromCanvas(canvas);
  } else {
    outputBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas conversion returned null blob"));
        },
        outMime,
        quality
      );
    });
  }

  const compressedSize = outputBlob.size;
  const { savedBytes, percentage: savedPercentage } = calculateSavings(originalSize, compressedSize);

  // Formulate cleaned filename
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const outFileName = `${baseName}-kilo.${extension}`;
  const blobUrl = URL.createObjectURL(outputBlob);

  return {
    blob: outputBlob,
    blobUrl,
    originalSize,
    compressedSize,
    savedBytes,
    savedPercentage,
    format: extension.toUpperCase(),
    fileName: outFileName,
    width,
    height,
  };
}
