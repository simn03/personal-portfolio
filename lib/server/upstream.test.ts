import { describe, expect, it, vi } from "vitest";
import { FEED_REVALIDATE_SECONDS, LIVE_REVALIDATE_SECONDS } from "../feeds";
import { UpstreamError, fetchFeedJson, resolveUpstreamUrl } from "./upstream";

const FALLBACK = "https://feed.example.com";

/** A fresh URL per test, so the in-flight coalescing map never collides. */
let urlCounter = 0;
function uniqueUrl(): string {
  urlCounter += 1;
  return `${FALLBACK}/x/${urlCounter}`;
}

function initOf(fetchMock: { mock: { calls: unknown[][] } }, call = 0) {
  return fetchMock.mock.calls[call][1] as RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  };
}

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

describe("fetchFeedJson", () => {
  it("opts into the data cache explicitly, since these requests are credentialed", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ hello: "world" }) } as Response)
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchFeedJson(uniqueUrl(), {
        label: "demo",
        headers: { Authorization: "Token secret" },
      })
    ).resolves.toEqual({ hello: "world" });

    const init = initOf(fetchMock);
    expect(init.cache).toBe("force-cache");
    expect(init.next?.revalidate).toBe(FEED_REVALIDATE_SECONDS);
    expect(init.next?.tags).toContain("feed:demo");
    expect(init.signal).toBeInstanceOf(AbortSignal);

    vi.unstubAllGlobals();
  });

  it("honours a custom revalidate window for live feeds", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as Response)
    );
    vi.stubGlobal("fetch", fetchMock);

    await fetchFeedJson(uniqueUrl(), {
      label: "demo",
      headers: {},
      revalidateSeconds: LIVE_REVALIDATE_SECONDS,
    });

    expect(initOf(fetchMock).next?.revalidate).toBe(LIVE_REVALIDATE_SECONDS);

    vi.unstubAllGlobals();
  });

  it("raises UpstreamError on a non-2xx so the failure is never cached", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({ ok: false, status: 503 } as Response)));

    await expect(
      fetchFeedJson(uniqueUrl(), { label: "demo", headers: {} })
    ).rejects.toBeInstanceOf(UpstreamError);

    vi.unstubAllGlobals();
  });

  it("coalesces identical concurrent reads into one upstream call", async () => {
    let resolveUpstream: (value: unknown) => void = () => {};
    const pending = new Promise((resolve) => {
      resolveUpstream = resolve;
    });

    const fetchMock = vi.fn(() =>
      pending.then(() => ({ ok: true, json: () => Promise.resolve({ n: 1 }) }) as Response)
    );
    vi.stubGlobal("fetch", fetchMock);

    const url = uniqueUrl();
    const request = { label: "demo", headers: {} };
    const both = Promise.all([fetchFeedJson(url, request), fetchFeedJson(url, request)]);
    resolveUpstream(undefined);

    expect(await both).toEqual([{ n: 1 }, { n: 1 }]);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
  });

  it("does not coalesce reads of different urls", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as Response)
    );
    vi.stubGlobal("fetch", fetchMock);

    await Promise.all([
      fetchFeedJson(uniqueUrl(), { label: "demo", headers: {} }),
      fetchFeedJson(uniqueUrl(), { label: "demo", headers: {} }),
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    vi.unstubAllGlobals();
  });

  it("releases the in-flight slot once a read fails, so the next visitor retries", async () => {
    const url = uniqueUrl();
    const request = { label: "demo", headers: {} };

    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("down"))));
    await expect(fetchFeedJson(url, request)).rejects.toThrow("down");
    vi.unstubAllGlobals();

    const ok = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ retried: true }) } as Response)
    );
    vi.stubGlobal("fetch", ok);
    await expect(fetchFeedJson(url, request)).resolves.toEqual({ retried: true });
    expect(ok).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
  });
});
