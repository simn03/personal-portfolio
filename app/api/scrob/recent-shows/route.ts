import { NextResponse } from "next/server";
import { SCROB_ORIGIN, parseRecentEpisodes } from "@/lib/scrob";
import {
  FEED_CACHE_HEADERS,
  NO_STORE_HEADERS,
  feedUnavailable,
  fetchFeedJsonWithOptionalCa,
  resolveUpstreamUrl,
} from "@/lib/upstream";

const LABEL = "scrob";

/**
 * Server-side proxy for Scrob's recently-watched shows feed.
 *
 * Scrob is exposed through its Astro frontend at `/api/proxy/*`, which forwards
 * to the private FastAPI backend; auth is a per-user Scrob API key that stays
 * server-side. The response is cached for an hour, so the instance is hit at
 * most hourly rather than once per visitor, and only the episode fields the
 * section renders are forwarded to the browser.
 *
 * TLS: if the instance sits behind a private CA (e.g. Caddy's local CA), set
 * `SCROB_CA_CERT` to that root certificate. It is added to the trust store for
 * the request; verification is never switched off, because the API key travels
 * on this connection.
 */
export async function GET() {
  const apiKey = process.env.SCROB_API_KEY;
  const userId = process.env.SCROB_USER_ID;

  if (!apiKey || !userId) {
    return NextResponse.json(
      { configured: false, episodes: [] },
      { headers: NO_STORE_HEADERS }
    );
  }

  try {
    const { origin } = resolveUpstreamUrl(process.env.SCROB_UPSTREAM_ORIGIN, SCROB_ORIGIN);

    const payload = await fetchFeedJsonWithOptionalCa(
      `${origin}/api/proxy/profile/${encodeURIComponent(userId)}/recently-watched-shows?page=1`,
      {
        label: LABEL,
        headers: { Accept: "application/json", "X-Api-Key": apiKey },
      },
      process.env.SCROB_CA_CERT
    );

    return NextResponse.json(
      { configured: true, episodes: parseRecentEpisodes(payload) },
      { headers: FEED_CACHE_HEADERS }
    );
  } catch (error) {
    return feedUnavailable(LABEL, error);
  }
}
