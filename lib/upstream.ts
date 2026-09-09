/**
 * Shared plumbing for the third-party feed proxies in `app/api/*`.
 *
 * SERVER ONLY. These helpers handle API credentials and must never be pulled
 * into a client bundle — client components import the link/parse helpers from
 * `lib/koito`, `lib/scrob` and `lib/hardcover` instead.
 */

import { readFileSync } from "node:fs";
import https from "node:https";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

/**
 * Every feed is cached for an hour. The upstreams are small self-hosted boxes
 * (plus Hardcover's public API) and should be asked roughly once an hour, never
 * once per visitor.
 */
export const FEED_REVALIDATE_SECONDS = 3600;

/** Give up on a hung upstream instead of holding the request open. */
export const UPSTREAM_TIMEOUT_MS = 10_000;

/**
 * Successful feeds stay cacheable by the CDN for the same hour, so in
 * production most visitors are served without the route handler running at all.
 */
export const FEED_CACHE_HEADERS: Record<string, string> = {
  "Cache-Control": `public, s-maxage=${FEED_REVALIDATE_SECONDS}, stale-while-revalidate=300`,
};

/** Failures and unconfigured feeds are never cached — the next visitor retries. */
export const NO_STORE_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store",
};

export class UpstreamError extends Error {
  constructor(
    readonly label: string,
    readonly status: number
  ) {
    super(`${label} upstream responded with ${status}`);
    this.name = "UpstreamError";
  }
}

const LOOPBACK_HOSTNAMES = new Set(["localhost", "::1", "[::1]"]);

/** RFC1918 / loopback / link-local IPv4, plus IPv6 loopback and unique-local. */
function isPrivateHost(hostname: string): boolean {
  if (LOOPBACK_HOSTNAMES.has(hostname) || hostname.endsWith(".local")) {
    return true;
  }

  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(hostname);
  if (ipv4) {
    const [a, b] = ipv4.slice(1).map(Number);
    if ([a, b, ...ipv4.slice(3).map(Number)].some((part) => part > 255)) return false;
    return (
      a === 127 || // loopback
      a === 10 || // 10.0.0.0/8
      (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12
      (a === 192 && b === 168) || // 192.168.0.0/16
      (a === 169 && b === 254) // link-local
    );
  }

  // IPv6 literals arrive bracketed from `URL.hostname`.
  const ipv6 = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  return ipv6 === "::1" || /^f[cd]/.test(ipv6) || ipv6.startsWith("fe80:");
}

/**
 * Resolves an env-configurable upstream URL, refusing any target that would put
 * an API credential on the public wire in clear text.
 *
 * Plain http is tolerated for loopback and private-range hosts (a LAN Koito or
 * Scrob box), since that traffic never leaves the local network. Anything
 * publicly routable must be https.
 */
export function resolveUpstreamUrl(configured: string | undefined, fallback: string): URL {
  const raw = configured?.trim() || fallback;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`Invalid upstream URL configured: ${raw}`);
  }

  if (url.protocol !== "https:" && !(url.protocol === "http:" && isPrivateHost(url.hostname))) {
    throw new Error(
      `Refusing to send credentials to a non-https upstream (${url.protocol}//${url.host})`
    );
  }

  return url;
}

type FeedRequest = {
  /** Short name used for cache tags and server-side logs. */
  label: string;
  headers: Record<string, string>;
  method?: "GET" | "POST";
  body?: string;
};

/**
 * Reads JSON from an upstream feed with a timeout and an hour of caching.
 *
 * `cache: "force-cache"` is required rather than `next.revalidate` alone:
 * caching is opt-in, and Next only caches credentialed requests (and `POST`
 * bodies, which Hardcover's GraphQL endpoint needs) when asked explicitly. Only
 * `200` responses are stored, so a failing upstream never poisons the cache.
 */
export async function fetchFeedJson(
  url: string,
  { label, headers, method = "GET", body }: FeedRequest
): Promise<unknown> {
  const response = await fetch(url, {
    method,
    headers,
    body,
    cache: "force-cache",
    next: { revalidate: FEED_REVALIDATE_SECONDS, tags: [`feed:${label}`] },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new UpstreamError(label, response.status);
  }
  return response.json();
}

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


/**
 * Reads JSON over TLS while trusting an extra root certificate, for an upstream
 * served by a private CA (e.g. Caddy's local authority).
 *
 * Certificate verification stays ON — the private root is *added* to the trust
 * store for this one request, rather than verification being switched off. The
 * API key travels on this connection, so it must stay verified.
 *
 * Node's global `fetch` cannot be given a custom CA without pulling in undici,
 * so this uses `https.get`, which Next's fetch cache cannot see. The caller is
 * therefore responsible for wrapping it in `cachedFeed`.
 */
function fetchWithPrivateCa(url: string, headers: Record<string, string>, caPath: string) {
  const ca = readFileSync(caPath);

  return new Promise<unknown>((resolve, reject) => {
    const request = https.get(
      url,
      { headers, ca, rejectUnauthorized: true },
      (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk: Buffer) => chunks.push(chunk));
        response.on("end", () => {
          const status = response.statusCode ?? 0;
          if (status < 200 || status >= 300) {
            reject(new UpstreamError("private-ca upstream", status));
            return;
          }
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
          } catch (error) {
            reject(error);
          }
        });
      }
    );
    request.on("error", reject);
    request.setTimeout(UPSTREAM_TIMEOUT_MS, () =>
      request.destroy(new Error("upstream timed out"))
    );
  });
}

/**
 * Hour-long cache for upstream reads that bypass `fetch` (and therefore Next's
 * fetch cache). Keeps the private-CA path on the same "ask at most hourly"
 * budget as every other feed.
 */
function cachedFeed<T>(label: string, read: () => Promise<T>) {
  return unstable_cache(read, [`feed:${label}`], {
    revalidate: FEED_REVALIDATE_SECONDS,
    tags: [`feed:${label}`],
  });
}

/**
 * Reads a feed, transparently using the private-CA path when `caPath` is set
 * (and the plain cached `fetch` otherwise). Either way the upstream is asked at
 * most once an hour and the connection is verified.
 */
export async function fetchFeedJsonWithOptionalCa(
  url: string,
  request: FeedRequest,
  caPath: string | undefined
): Promise<unknown> {
  if (!caPath) {
    return fetchFeedJson(url, request);
  }
  return cachedFeed(request.label, () =>
    fetchWithPrivateCa(url, request.headers, caPath)
  )();
}
