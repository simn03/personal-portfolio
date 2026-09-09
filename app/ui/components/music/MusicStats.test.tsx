import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import MusicStats from "./MusicStats.component";
import { KOITO_STATS_PROXY_PATH } from "@/lib/koito";

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: () => Promise.resolve(body) } as Response;
}

const payload = {
  stats: {
    listenCount: 1234,
    trackCount: 300,
    albumCount: 80,
    artistCount: 40,
    minutesListened: 5000,
    daysActive: 100,
    longestStreak: 15,
    avgDailyPlays: 12.3,
  },
  activity: {
    points: [
      { date: "2026-09-01", value: 3 },
      { date: "2026-09-02", value: 0 },
    ],
    streak: 4,
    daysActive: 1,
  },
  listeningSince: "2020-01-15T12:00:00Z",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("MusicStats", () => {
  it("loads combined stats through the backend proxy", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(jsonResponse(payload)));
    vi.stubGlobal("fetch", fetchMock);
    render(<MusicStats />);

    expect(await screen.findByText("1,234")).toBeTruthy();
    expect(String((fetchMock.mock.calls[0] as Array<unknown>)[0])).toBe(KOITO_STATS_PROXY_PATH);
  });

  it("shows the all-time counts and current streak", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(payload))));
    render(<MusicStats />);

    await screen.findByText("1,234");
    expect(screen.getByText("300")).toBeTruthy();
    expect(screen.getByText("80")).toBeTruthy();
    expect(screen.getByText("40")).toBeTruthy();
    expect(screen.getByText("4")).toBeTruthy();
    expect(screen.getByText("day streak")).toBeTruthy();
    expect(screen.getByText(/since jan 2020/i)).toBeTruthy();
  });

  it("renders nothing when the proxy is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("down"))));
    const { container } = render(<MusicStats />);

    await waitFor(() => {
      expect(container.querySelector("section")).toBeNull();
    });
  });

  it("renders nothing when koito isn't configured", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(jsonResponse({ stats: null, activity: { points: [], streak: 0, daysActive: 0 }, listeningSince: null })))
    );
    const { container } = render(<MusicStats />);

    await waitFor(() => {
      expect(container.querySelector("section")).toBeNull();
    });
  });
});
