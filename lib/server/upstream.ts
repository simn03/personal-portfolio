/**
 * Shared plumbing for the third-party feed proxies in `app/api/*`.
 *
 * SERVER ONLY. Everything under `lib/server/` handles API credentials and must
 * never be pulled into a client bundle — client components import the
 * link/type/path helpers from `lib/koito`, `lib/scrob` and `lib/hardcover`
 * instead, which carry no secrets and no upstream request detail. The ESLint
 * config forbids `@/lib/server/*` imports from `app/ui/**` and `components/**`;
 * `assertServerOnly` below is the belt to that braces.
 */

import { readFileSync } from "node:fs";
import https from "node:https";
import { unstable_cache } from "next/cache";
import { FEED_REVALIDATE_SECONDS, LIVE_REVALIDATE_SECONDS } from "../feeds";

export { FEED_REVALIDATE_SECONDS, LIVE_REVALIDATE_SECONDS };

/** Give up on a hung upstream instead of holding the request open. */
export const UPSTREAM_TIMEOUT_MS = 10_000;

/**
 * Refuses to run in a browser bundle. `lib/server/*` reads `process.env`
 * secrets; if a client component ever imports one of these modules, this turns
 * a silent credential leak into a loud build/runtime failure.
 */
export function assertServerOnly(): void {
  // Vitest runs these modules under jsdom, where `window` exists but nothing
  // was ever bundled — the guard is about a browser, not the test runner.
  if (typeof window !== "undefined" && process.env.NODE_ENV !== "test") {
    throw new Error(
      "lib/server/* is server-only and was imported into a client bundle — import from lib/<feed> instead."
    );
  }
}

assertServerOnly();

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

export type FeedRequest = {
  /** Short name used for cache tags and server-side logs. */
  label: string;
  headers: Record<string, string>;
  method?: "GET" | "POST";
  body?: string;
  /** Defaults to `FEED_REVALIDATE_SECONDS`; pass `LIVE_REVALIDATE_SECONDS` for now-playing feeds. */
  revalidateSeconds?: number;
  /** Root certificate for an upstream behind a private CA (see `fetchWithPrivateCa`). */
  caPath?: string;
};

/**
 * In-flight upstream reads, keyed by the exact request. Next's data cache only
 * dedupes *after* a response has been stored, so a cold cache plus a burst of
 * visitors would otherwise fan out into one upstream call each. Coalescing them
 * here means a self-hosted box sees a single request no matter how many people
 * land at once.
 */
const inFlight = new Map<string, Promise<unknown>>();

function requestKey(url: string, { method = "GET", body, revalidateSeconds }: FeedRequest): string {
  return `${method} ${url} ${revalidateSeconds ?? FEED_REVALIDATE_SECONDS} ${body ?? ""}`;
}

/** Runs `read` unless an identical read is already in flight, in which case both share it. */
function singleFlight<T>(key: string, read: () => Promise<T>): Promise<T> {
  const existing = inFlight.get(key) as Promise<T> | undefined;
  if (existing) {
    return existing;
  }

  const pending = read().finally(() => inFlight.delete(key));
  inFlight.set(key, pending);
  return pending;
}

/**
 * Reads JSON from an upstream feed with a timeout and an hour of caching.
 *
 * `cache: "force-cache"` is required rather than `next.revalidate` alone:
 * caching is opt-in, and Next only caches credentialed requests (and `POST`
 * bodies, which Hardcover's GraphQL endpoint needs) when asked explicitly. Only
 * `200` responses are stored, so a failing upstream never poisons the cache.
 */
async function fetchJson(url: string, request: FeedRequest): Promise<unknown> {
  const { label, headers, method = "GET", body, revalidateSeconds } = request;

  const response = await fetch(url, {
    method,
    headers,
    body,
    cache: "force-cache",
    next: {
      revalidate: revalidateSeconds ?? FEED_REVALIDATE_SECONDS,
      tags: [`feed:${label}`],
    },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new UpstreamError(label, response.status);
  }
  return response.json();
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
 * so this uses `https.get`, which Next's fetch cache cannot see. Callers reach
 * it through `fetchFeedJson`, which wraps it in `cachedRead` to put it back on
 * the same revalidate budget as every other feed.
 */
function fetchWithPrivateCa(url: string, headers: Record<string, string>, caPath: string) {
  const ca = readFileSync(caPath);

  return new Promise<unknown>((resolve, reject) => {
    const request = https.get(url, { headers, ca, rejectUnauthorized: true }, (response) => {
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
    });
    request.on("error", reject);
    request.setTimeout(UPSTREAM_TIMEOUT_MS, () =>
      request.destroy(new Error("upstream timed out"))
    );
  });
}

/**
 * Cache for upstream reads that bypass `fetch` (and therefore Next's fetch
 * cache), on the same revalidate budget the caller asked for.
 *
 * The full URL is part of the key, not just the label: the watch-activity
 * windows shift by a day at midnight while keeping their label, and a
 * label-only key would keep serving yesterday's window until it expired.
 */
function cachedRead<T>(
  label: string,
  url: string,
  revalidateSeconds: number,
  read: () => Promise<T>
) {
  return unstable_cache(read, [`feed:${label}`, url], {
    revalidate: revalidateSeconds,
    tags: [`feed:${label}`],
  });
}

/**
 * Reads a feed, transparently using the private-CA path when `request.caPath`
 * is set and the plain cached `fetch` otherwise. Either way the upstream is
 * asked at most once per `request.revalidateSeconds`, concurrent readers share
 * one round-trip, and the connection is verified.
 */
export function fetchFeedJson(url: string, request: FeedRequest): Promise<unknown> {
  const { label, headers, caPath, revalidateSeconds = FEED_REVALIDATE_SECONDS } = request;

  return singleFlight(requestKey(url, request), () =>
    caPath
      ? cachedRead(label, url, revalidateSeconds, () => fetchWithPrivateCa(url, headers, caPath))()
      : fetchJson(url, request)
  );
}
