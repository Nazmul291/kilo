/**
 * Smart Alt Text Generator for Shopify Products & Variants
 * 
 * Complies with Shopify's strict 512-character maximum limit for image alt text
 * and implements best practices for e-commerce SEO & accessibility.
 */

export const SHOPIFY_MAX_ALT_TEXT_LENGTH = 512;
export const RECOMMENDED_ALT_TEXT_LENGTH = 160;

export interface AltTextOptions {
  productTitle: string;
  variantTitle?: string | null;
  optionNames?: string[];
  optionValues?: string[];
  imageIndex?: number;
  totalImages?: number;
  vendor?: string | null;
  customPrefix?: string;
  customSuffix?: string;
}

/**
 * Clean and normalize text strings for alt text
 */
function cleanText(str: string): string {
  return str
    .replace(/<[^>]*>/g, "") // remove HTML tags
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim();
}

/**
 * Generate a smart, SEO-optimized alt text for product images
 * 
 * Rules:
 * 1. Includes Product Title.
 * 2. Includes Variant Title / Option values (e.g., "Navy Blue / Extra Large") if available.
 * 3. Includes image angle context if multiple images (e.g., "Front View", "Angle 2", "Detailed View").
 * 4. Stays strictly within Shopify's 512 character limit.
 */
export function generateSmartAltText(options: AltTextOptions): string {
  const title = cleanText(options.productTitle || "Product");
  const parts: string[] = [];

  if (options.customPrefix) {
    parts.push(cleanText(options.customPrefix));
  }

  // Add primary product title
  parts.push(title);

  // Add variant or options if present and not default
  if (
    options.variantTitle &&
    options.variantTitle.toLowerCase() !== "default title" &&
    options.variantTitle.toLowerCase() !== "default"
  ) {
    parts.push(`in ${cleanText(options.variantTitle)}`);
  } else if (options.optionValues && options.optionValues.length > 0) {
    const validOptions = options.optionValues
      .map(cleanText)
      .filter((val) => val && val.toLowerCase() !== "default");
    if (validOptions.length > 0) {
      parts.push(`(${validOptions.join(", ")})`);
    }
  }

  // Add image index context if multiple images
  if (typeof options.imageIndex === "number" && (options.totalImages || 0) > 1) {
    const idx = options.imageIndex;
    let angleLabel = "";
    if (idx === 0) angleLabel = "Front View";
    else if (idx === 1) angleLabel = "Side Angle";
    else if (idx === 2) angleLabel = "Back View";
    else if (idx === 3) angleLabel = "Close-up Detail";
    else angleLabel = `View ${idx + 1}`;

    parts.push(`- ${angleLabel}`);
  }

  // Optional vendor attribution if space allows
  if (options.vendor && options.vendor.toLowerCase() !== "store") {
    parts.push(`by ${cleanText(options.vendor)}`);
  }

  if (options.customSuffix) {
    parts.push(cleanText(options.customSuffix));
  }

  let fullAltText = parts.join(" ");

  // Ensure strict enforcement of Shopify's 512-character limit
  if (fullAltText.length > SHOPIFY_MAX_ALT_TEXT_LENGTH) {
    // Truncate at word boundary if possible
    fullAltText = fullAltText.slice(0, SHOPIFY_MAX_ALT_TEXT_LENGTH - 3).trim();
    const lastSpace = fullAltText.lastIndexOf(" ");
    if (lastSpace > SHOPIFY_MAX_ALT_TEXT_LENGTH - 40) {
      fullAltText = fullAltText.slice(0, lastSpace);
    }
    fullAltText += "...";
  }

  return fullAltText;
}

/**
 * Validate that an alt text string satisfies Shopify's platform requirements
 */
export function validateShopifyAltText(altText: string): {
  isValid: boolean;
  length: number;
  remaining: number;
  error?: string;
} {
  const length = altText.length;
  const remaining = SHOPIFY_MAX_ALT_TEXT_LENGTH - length;

  if (length > SHOPIFY_MAX_ALT_TEXT_LENGTH) {
    return {
      isValid: false,
      length,
      remaining,
      error: `Exceeds Shopify's maximum limit of ${SHOPIFY_MAX_ALT_TEXT_LENGTH} characters by ${length - SHOPIFY_MAX_ALT_TEXT_LENGTH} chars.`,
    };
  }

  return {
    isValid: true,
    length,
    remaining,
  };
}
