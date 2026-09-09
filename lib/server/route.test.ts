import { afterEach, describe, expect, it, vi } from "vitest";
import { FEED_REVALIDATE_SECONDS, LIVE_REVALIDATE_SECONDS } from "../feeds";
import {
  FEED_CACHE_HEADERS,
  LIVE_CACHE_HEADERS,
  NO_STORE_HEADERS,
  feedRoute,
} from "./route";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("cache headers", () => {
  it("lets the CDN hold a successful feed for an hour", () => {
    expect(FEED_REVALIDATE_SECONDS).toBeGreaterThanOrEqual(3600);
    expect(FEED_CACHE_HEADERS["Cache-Control"]).toContain(`s-maxage=${FEED_REVALIDATE_SECONDS}`);
  });

  it("never caches a failure", () => {
    expect(NO_STORE_HEADERS["Cache-Control"]).toBe("no-store");
  });

  it("lets a now-playing feed refresh far more often than the hourly default", () => {
    expect(LIVE_REVALIDATE_SECONDS).toBeLessThan(FEED_REVALIDATE_SECONDS);
    expect(LIVE_CACHE_HEADERS["Cache-Control"]).toContain(`s-maxage=${LIVE_REVALIDATE_SECONDS}`);
  });
});

describe("feedRoute", () => {
  it("returns the rows under `configured: true` and lets the CDN hold them", async () => {
    const response = await feedRoute({
      label: "demo",
      read: async () => ({ rows: [1, 2] }),
    })();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe(FEED_CACHE_HEADERS["Cache-Control"]);
    expect(await response.json()).toEqual({ configured: true, rows: [1, 2] });
  });

  it("uses the short window for a live feed", async () => {
    const response = await feedRoute({
      label: "demo",
      cache: "live",
      read: async () => ({ track: null }),
    })();

    expect(response.headers.get("Cache-Control")).toBe(LIVE_CACHE_HEADERS["Cache-Control"]);
  });

  it("never reads the upstream when the feed isn't configured", async () => {
    const read = vi.fn(async () => ({ rows: [1] }));
    const response = await feedRoute({
      label: "demo",
      isConfigured: () => false,
      read,
      emptyBody: { rows: [] },
    })();

    expect(read).not.toHaveBeenCalled();
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ configured: false, rows: [] });
  });

  it("answers a failed read with a vague 502 that reveals no upstream detail", async () => {
    const logged = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await feedRoute({
      label: "demo",
      read: async () => {
        throw new Error("connect ECONNREFUSED 192.168.1.253:4111");
      },
    })();

    expect(response.status).toBe(502);
    expect(response.headers.get("Cache-Control")).toBe("no-store");

    const body = JSON.stringify(await response.json());
    expect(body).not.toContain("192.168.1.253");
    expect(body).toContain("unavailable");

    // The real cause is still logged server-side for debugging.
    expect(logged).toHaveBeenCalled();
  });
});
