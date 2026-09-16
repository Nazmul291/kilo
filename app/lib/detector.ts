export interface FileAnalysis {
  mimeType: string;
  formatName: string;
  width: number;
  height: number;
  bytesPerPixel: number;
  isAlreadyOptimized: boolean;
  isValidImage: boolean;
  errorMessage?: string;
}

/**
 * Detects actual file format from magic bytes (file signature)
 */
export async function detectFileSignature(file: File): Promise<{ mimeType: string; formatName: string; isValid: boolean }> {
  const buffer = await file.slice(0, 32).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { mimeType: "image/jpeg", formatName: "JPEG", isValid: true };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { mimeType: "image/png", formatName: "PNG", isValid: true };
  }

  // WebP: RIFF .... WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { mimeType: "image/webp", formatName: "WebP", isValid: true };
  }

  // GIF: GIF87a or GIF89a (47 49 46 38)
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return { mimeType: "image/gif", formatName: "GIF", isValid: true };
  }

  // ICO: 00 00 01 00
  if (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00) {
    return { mimeType: "image/x-icon", formatName: "ICO", isValid: true };
  }

  // AVIF: check ftyp avif
  const headerAscii = Array.from(bytes.slice(4, 16))
    .map((b) => String.fromCharCode(b))
    .join("");
  if (headerAscii.includes("ftypavif") || headerAscii.includes("ftypavis")) {
    return { mimeType: "image/avif", formatName: "AVIF", isValid: true };
  }

  // SVG: test if text contains <svg
  if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
    const text = await file.slice(0, 500).text();
    if (text.includes("<svg") || text.includes("<?xml")) {
      return { mimeType: "image/svg+xml", formatName: "SVG", isValid: true };
    }
  }

  // Fallback to file.type if known image
  if (file.type.startsWith("image/")) {
    const name = file.type.replace("image/", "").toUpperCase();
    return { mimeType: file.type, formatName: name, isValid: true };
  }

  return { mimeType: "unknown", formatName: "Unknown", isValid: false };
}

/**
 * Loads image dimensions and performs byte-per-pixel optimization analysis
 */
export async function analyzeImage(file: File): Promise<FileAnalysis> {
  const signature = await detectFileSignature(file);

  if (!signature.isValid) {
    return {
      mimeType: signature.mimeType,
      formatName: signature.formatName,
      width: 0,
      height: 0,
      bytesPerPixel: 0,
      isAlreadyOptimized: false,
      isValidImage: false,
      errorMessage: "Unsupported or unreadable image file signature.",
    };
  }

  // Handle SVG specifically (vector graphics have no fixed pixels)
  if (signature.mimeType === "image/svg+xml") {
    return {
      mimeType: signature.mimeType,
      formatName: signature.formatName,
      width: 512,
      height: 512,
      bytesPerPixel: 0,
      isAlreadyOptimized: file.size < 15 * 1024, // <15KB SVG is already lightweight
      isValidImage: true,
    };
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth || 1;
      const height = img.naturalHeight || 1;
      URL.revokeObjectURL(objectUrl);

      const totalPixels = width * height;
      const bytesPerPixel = file.size / totalPixels;

      // In digital photography and web graphics:
      // An uncompressed 24-bit RGB bitmap is 3.0 bytes/pixel.
      // High-quality JPEG is typically 0.5 - 1.5 bytes/pixel.
      // Already well-compressed WebP/JPEG is typically <= 0.25 - 0.35 bytes/pixel.
      const isAlreadyOptimized = bytesPerPixel <= 0.28 && file.size < 350 * 1024;

      resolve({
        mimeType: signature.mimeType,
        formatName: signature.formatName,
        width,
        height,
        bytesPerPixel,
        isAlreadyOptimized,
        isValidImage: true,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        mimeType: signature.mimeType,
        formatName: signature.formatName,
        width: 0,
        height: 0,
        bytesPerPixel: 0,
        isAlreadyOptimized: false,
        isValidImage: false,
        errorMessage: "Failed to decode image data.",
      });
    };

    img.src = objectUrl;
  });
}
