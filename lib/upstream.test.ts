import { describe, expect, it, vi } from "vitest";
import {
  FEED_CACHE_HEADERS,
  FEED_REVALIDATE_SECONDS,
  NO_STORE_HEADERS,
  UpstreamError,
  fetchFeedJson,
  resolveUpstreamUrl,
} from "./upstream";

const FALLBACK = "https://feed.example.com";

describe("resolveUpstreamUrl", () => {
  it("falls back when nothing is configured", () => {
    expect(resolveUpstreamUrl(undefined, FALLBACK).origin).toBe(FALLBACK);
    expect(resolveUpstreamUrl("", FALLBACK).origin).toBe(FALLBACK);
    expect(resolveUpstreamUrl("   ", FALLBACK).origin).toBe(FALLBACK);
  });

  it("accepts a configured https origin", () => {
    expect(resolveUpstreamUrl("https://other.example.com", FALLBACK).origin).toBe(
      "https://other.example.com"
    );
  });

  it("refuses plaintext http, which would leak the API credential", () => {
    expect(() => resolveUpstreamUrl("http://feed.example.com", FALLBACK)).toThrow(/non-https/i);
  });

  it("allows http for loopback and private-range dev instances", () => {
    for (const origin of [
      "http://localhost:4533",
      "http://127.0.0.1:4533",
      "http://192.168.1.253:4111",
      "http://10.0.0.5:8080",
      "http://172.16.4.2:8080",
      "http://nas.local:4111",
    ]) {
      expect(resolveUpstreamUrl(origin, FALLBACK).origin).toBe(origin);
    }
  });

  it("still refuses http to publicly routable hosts", () => {
    for (const origin of [
      "http://koito.example.com",
      "http://8.8.8.8",
      "http://172.32.0.1",
      "http://193.168.1.1",
    ]) {
      expect(() => resolveUpstreamUrl(origin, FALLBACK)).toThrow(/non-https/i);
    }
  });

  it("refuses other schemes and unparseable values", () => {
    expect(() => resolveUpstreamUrl("ftp://feed.example.com", FALLBACK)).toThrow(/non-https/i);
    expect(() => resolveUpstreamUrl("file:///etc/passwd", FALLBACK)).toThrow(/non-https/i);
    expect(() => resolveUpstreamUrl("not a url", FALLBACK)).toThrow(/Invalid upstream URL/i);
  });
});

describe("cache headers", () => {
  it("lets the CDN hold a successful feed for an hour", () => {
    expect(FEED_REVALIDATE_SECONDS).toBeGreaterThanOrEqual(3600);
    expect(FEED_CACHE_HEADERS["Cache-Control"]).toContain(`s-maxage=${FEED_REVALIDATE_SECONDS}`);
  });

  it("never caches a failure", () => {
    expect(NO_STORE_HEADERS["Cache-Control"]).toBe("no-store");
  });
});

describe("fetchFeedJson", () => {
  it("opts into the data cache explicitly, since these requests are credentialed", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ hello: "world" }) } as Response)
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchFeedJson("https://feed.example.com/x", {
        label: "demo",
        headers: { Authorization: "Token secret" },
      })
    ).resolves.toEqual({ hello: "world" });

    const init = (fetchMock.mock.calls[0] as Array<unknown>)[1] as RequestInit & {
      next?: { revalidate?: number; tags?: string[] };
    };
    expect(init.cache).toBe("force-cache");
    expect(init.next?.revalidate).toBe(FEED_REVALIDATE_SECONDS);
    expect(init.next?.tags).toContain("feed:demo");
    expect(init.signal).toBeInstanceOf(AbortSignal);

    vi.unstubAllGlobals();
  });

  it("raises UpstreamError on a non-2xx so the failure is never cached", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false, status: 503 } as Response)));

    await expect(
      fetchFeedJson("https://feed.example.com/x", { label: "demo", headers: {} })
    ).rejects.toBeInstanceOf(UpstreamError);

    vi.unstubAllGlobals();
  });
});
