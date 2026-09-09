import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import WatchStats from "./WatchStats.component";
import { SCROB_STATS_PROXY_PATH } from "@/lib/scrob";

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: () => Promise.resolve(body) } as Response;
}

const payload = {
  configured: true,
  stats: {
    moviesWatched: 120,
    showsWatched: 40,
    episodesWatched: 900,
    totalWatchMinutes: 54000,
  },
  activity: {
    points: [
      { date: "2026-09-08", value: 2 },
      { date: "2026-09-09", value: 0 },
    ],
    streak: 5,
    daysActive: 30,
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("WatchStats", () => {
  it("loads combined stats through the backend proxy", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(jsonResponse(payload)));
    vi.stubGlobal("fetch", fetchMock);
    render(<WatchStats />);

    expect(await screen.findByText("120")).toBeTruthy();
    expect(String((fetchMock.mock.calls[0] as Array<unknown>)[0])).toBe(SCROB_STATS_PROXY_PATH);
  });

  /** Reads the big number out of the stat cell carrying `label`. */
  function statValue(label: string): string | undefined {
    return screen.getByText(label).parentElement?.firstElementChild?.textContent ?? undefined;
  }

  it("shows the all-time counts and current streak", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(payload))));
    render(<WatchStats />);

    await screen.findByText("120");
    expect(statValue("movies")).toBe("120");
    expect(statValue("shows")).toBe("40");
    expect(statValue("episodes")).toBe("900");
    expect(statValue("day streak")).toBe("5");
    expect(statValue("days active")).toBe("30");
  });

  it("reports watch time in hours rather than a five-figure minute count", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(payload))));
    render(<WatchStats />);

    await screen.findByText("120");
    // 54,000 minutes is 900 hours.
    expect(statValue("hours")).toBe("900");
  });

  it("renders nothing when scrob isn't configured", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse({ configured: false }))));
    const { container } = render(<WatchStats />);

    await waitFor(() => {
      expect(container.querySelector("section")).toBeNull();
    });
  });

  it("renders nothing when the proxy is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("down"))));
    const { container } = render(<WatchStats />);

    await waitFor(() => {
      expect(container.querySelector("section")).toBeNull();
    });
  });
});
