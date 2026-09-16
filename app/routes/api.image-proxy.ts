import type { Route } from "./+types/api.image-proxy";

export async function loader({ request }: Route.LoaderArgs) {
  const urlObj = new URL(request.url);
  const targetUrl = urlObj.searchParams.get("url");

  if (!targetUrl) {
    return new Response("Missing url parameter", { status: 400 });
  }

  try {
    const upstreamRes = await fetch(targetUrl);
    if (!upstreamRes.ok) {
      return new Response(`Failed to fetch image: ${upstreamRes.statusText}`, {
        status: upstreamRes.status,
      });
    }

    const contentType =
      upstreamRes.headers.get("Content-Type") || "application/octet-stream";
    const body = upstreamRes.body;

    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: any) {
    return new Response(`Image proxy error: ${err.message}`, { status: 500 });
  }
}
