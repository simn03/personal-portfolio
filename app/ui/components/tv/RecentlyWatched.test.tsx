import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import RecentlyWatched from "./RecentlyWatched.component";
import {
  SCROB_HISTORY_URL,
  SCROB_ORIGIN,
  SCROB_PROXY_PATH,
  parseRecentEpisodes,
} from "@/lib/scrob";

vi.mock("next/image", async () => {
  const React = await import("react");
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => React.createElement("img", props),
  };
});

const upstream = {
  page: 1,
  total_pages: 1,
  total_results: 1,
  results: [
    {
      episode_number: 80,
      season_number: 1,
      show_title: "Re:ZERO -Starting Life in Another World-",
      show_tmdb_id: 65942,
      show_tvdb_id: 305089,
      title: "Episode 80",
      poster_path: "https://image.tmdb.org/t/p/w500/oHqYrPAsIiTD5m4DuxumV4er8BU.jpg",
      watched_at: "2026-09-09T03:52:22.671150",
    },
  ],
};

/** What the proxy returns: parsed server-side, straight from the real payload. */
const payload = { configured: true, episodes: parseRecentEpisodes(upstream) };

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: () => Promise.resolve(body) } as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("RecentlyWatched", () => {
  it("renders the section header immediately", () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(payload))));
    render(<RecentlyWatched />);
    expect(screen.getByRole("heading", { name: "watching" })).toBeTruthy();
  });

  it("loads episodes through the backend proxy", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(jsonResponse(payload)));
    vi.stubGlobal("fetch", fetchMock);
    render(<RecentlyWatched />);

    expect(await screen.findByText("Re:ZERO -Starting Life in Another World-")).toBeTruthy();
    expect(String((fetchMock.mock.calls[0] as Array<unknown>)[0])).toBe(SCROB_PROXY_PATH);
  });

  it("shows episode info once loaded", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(payload))));
    render(<RecentlyWatched />);

    expect(await screen.findByText("Episode 80")).toBeTruthy();
    expect(screen.getByText("S1 · E80")).toBeTruthy();
    expect(screen.getByAltText("Re:ZERO -Starting Life in Another World- poster")).toBeTruthy();
    expect(screen.getByText(/2026/)).toBeTruthy();
    // The poster is the button — it prefers the TMDB link when available.
    const posterLink = screen.getByRole("link", {
      name: "Re:ZERO -Starting Life in Another World- on The Movie Database",
    });
    expect(posterLink.getAttribute("href")).toBe("https://www.themoviedb.org/tv/65942");
  });

  it("falls back to the TVDB link on the poster when no TMDB id exists", async () => {
    const tvdbOnly = {
      configured: true,
      episodes: parseRecentEpisodes({
        results: [
          {
            episode_number: 2,
            season_number: 2,
            show_title: "Saga of Tanya the Evil",
            title: "A Strange Friendship",
            show_tvdb_id: 305089,
            watched_at: "2026-07-16T00:56:00",
          },
        ],
      }),
    };
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(tvdbOnly))));
    render(<RecentlyWatched />);

    const posterLink = await screen.findByRole("link", {
      name: "Saga of Tanya the Evil on TheTVDB",
    });
    expect(posterLink.getAttribute("href")).toBe(
      "https://www.thetvdb.com/dereferrer/series/305089"
    );
  });

  it("links to the scrob history page via the show-more control", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(payload))));
    render(<RecentlyWatched />);

    const more = await screen.findByRole("link", { name: /more on scrob/i });
    expect(more.getAttribute("href")).toBe(SCROB_HISTORY_URL);
  });

  it("shows the friendly error card when the proxy is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("down"))));
    render(<RecentlyWatched />);

    await waitFor(() => {
      expect(screen.getByText(/couldn't reach my scrob instance right now/i)).toBeTruthy();
    });
    const link = screen.getByRole("link", { name: /open scrob/i });
    expect(link.getAttribute("href")).toBe(SCROB_ORIGIN);
  });

  it("shows an empty state when there are no recent episodes", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse({ results: [] }))));
    render(<RecentlyWatched />);

    await waitFor(() => {
      expect(screen.getByText(/nothing watched recently/i)).toBeTruthy();
    });
  });
});
