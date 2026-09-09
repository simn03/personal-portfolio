/**
 * The one shape every feed proxy in `app/api/*` is built from.
 *
 * SERVER ONLY — see the note at the top of `lib/server/upstream.ts`.
 *
 * Each route differs only in which upstream it reads and how it names the rows
 * it returns; the caching, the "not configured" gate and the deliberately vague
 * failure response are identical, so they live here rather than being repeated
 * seven times.
 */

import { NextResponse } from "next/server";
import { FEED_REVALIDATE_SECONDS, LIVE_REVALIDATE_SECONDS, assertServerOnly } from "./upstream";

assertServerOnly();

/**
 * Successful feeds stay cacheable by the CDN for the same hour the data cache
 * holds them, so in production most visitors are served without the route
 * handler running at all.
 */
export const FEED_CACHE_HEADERS: Record<string, string> = {
  "Cache-Control": `public, s-maxage=${FEED_REVALIDATE_SECONDS}, stale-while-revalidate=300`,
};

/** Short-lived counterpart to `FEED_CACHE_HEADERS` for "now playing" feeds. */
export const LIVE_CACHE_HEADERS: Record<string, string> = {
  "Cache-Control": `public, s-maxage=${LIVE_REVALIDATE_SECONDS}, stale-while-revalidate=10`,
};

/** Failures and unconfigured feeds are never cached — the next visitor retries. */
export const NO_STORE_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store",
};

/**
 * Logs the real cause server-side and returns a deliberately vague 502. The
 * upstream URL, hostname and any TLS/DNS detail of a self-hosted instance must
 * not be echoed to an anonymous visitor.
 */
export function feedUnavailable(label: string, cause: unknown): NextResponse {
  console.error(`[feed:${label}] upstream read failed:`, cause);
  return NextResponse.json(
    { error: `The ${label} feed is unavailable right now.` },
    { status: 502, headers: NO_STORE_HEADERS }
  );
}

type FeedRouteOptions<T extends object> = {
  /** Short name used for cache tags and server-side logs. */
  label: string;
  /** `"live"` opts into the 20s window used by the now-playing feeds. */
  cache?: "feed" | "live";
  /**
   * Reads the upstream and returns the display rows, or `null` when the feed's
   * credentials aren't configured — the section then hides itself rather than
   * showing an error.
   */
  read: () => Promise<T>;
  /** True when this feed's credentials are present. Defaults to always-on. */
  isConfigured?: () => boolean;
  /** Extra keys to pad the `configured: false` body with, e.g. `{ episodes: [] }`. */
  emptyBody?: object;
};

/**
 * Builds a route handler that reads one upstream feed.
 *
 * Every response carries `configured`, so the client can tell "hide this
 * section" (no credentials) apart from "show the error card" (a 502) without
 * each feed inventing its own envelope.
 */
export function feedRoute<T extends object>({
  label,
  cache = "feed",
  read,
  isConfigured,
  emptyBody = {},
}: FeedRouteOptions<T>) {
  return async function GET(): Promise<NextResponse> {
    if (isConfigured && !isConfigured()) {
      return NextResponse.json(
        { configured: false, ...emptyBody },
        { headers: NO_STORE_HEADERS }
      );
    }

    try {
      return NextResponse.json(
        { configured: true, ...(await read()) },
        { headers: cache === "live" ? LIVE_CACHE_HEADERS : FEED_CACHE_HEADERS }
      );
    } catch (error) {
      return feedUnavailable(label, error);
    }
  };
}
