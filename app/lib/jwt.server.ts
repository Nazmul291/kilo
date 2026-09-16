import crypto from "node:crypto";

const JWT_SECRET =
  process.env.STOCKLY_JWT_SECRET ||
  "kilo_stockly_stateless_secret_key_2026_super_secure_hmac";
const COOKIE_NAME = "kilo_stockly_session";
const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;

export interface StocklySessionPayload {
  shop: string;
  token: string;
  connectedAt: number;
  exp: number;
}

/**
 * Base64URL encoding helper
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Base64URL decoding helper
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

/**
 * Sign a stateless JWT for Stockly session
 */
export function signStocklySession(
  shop: string,
  token: string,
  expiresInSeconds: number = THIRTY_DAYS_SECONDS
): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const payloadData: StocklySessionPayload = {
    shop,
    token,
    connectedAt: now,
    exp: now + expiresInSeconds,
  };
  const payload = base64UrlEncode(JSON.stringify(payloadData));
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}

/**
 * Verify and decode the stateless Stockly JWT session
 */
export function verifyStocklySession(
  jwt: string
): StocklySessionPayload | null {
  try {
    const parts = jwt.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const decodedPayload: StocklySessionPayload = JSON.parse(
      base64UrlDecode(payload)
    );
    const now = Math.floor(Date.now() / 1000);

    if (decodedPayload.exp && decodedPayload.exp < now) {
      return null; // Expired
    }

    return decodedPayload;
  } catch {
    return null;
  }
}

/**
 * Extract and parse session from Request Cookie header
 */
export function parseSessionFromRequest(
  request: Request
): StocklySessionPayload | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    if (name) acc[name] = rest.join("=");
    return acc;
  }, {} as Record<string, string>);

  const sessionToken = cookies[COOKIE_NAME];
  if (!sessionToken) return null;

  return verifyStocklySession(sessionToken);
}

/**
 * Generate HttpOnly, Secure, SameSite=Lax Set-Cookie header
 */
export function createSessionCookieHeader(jwt: string): string {
  return `${COOKIE_NAME}=${jwt}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${THIRTY_DAYS_SECONDS}`;
}

/**
 * Generate Set-Cookie header to clear session
 */
export function createClearSessionCookieHeader(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
