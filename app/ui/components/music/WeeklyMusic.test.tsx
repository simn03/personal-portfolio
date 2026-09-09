import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import WeeklyMusic from "./WeeklyMusic.component";
import { KOITO_ORIGIN, KOITO_PROXY_PATH, KOITO_WEEKLY_CHART_URL } from "@/lib/koito";
import { parseWeeklyPayload } from "@/lib/server/koito";

vi.mock("next/image", async () => {
  const React = await import("react");
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => React.createElement("img", props),
  };
});

const MBID = "b7ffd2af-418f-4be2-bdd1-22f8b48613da";

const upstream = {
  items: [
    {
      rank: 1,
      item: {
        id: 10,
        title: "Never Gonna Give You Up",
        musicbrainz_id: MBID,
        listen_count: 42,
        artists: [{ id: 1, name: "Rick Astley" }],
        image: { medium: "/image/medium/cover-1" },
      },
    },
  ],
};

/** What the proxy returns: parsed server-side, straight from the real payload. */
const payload = { tracks: parseWeeklyPayload(upstream) };

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: () => Promise.resolve(body) } as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("WeeklyMusic", () => {
  it("renders the section header immediately", () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(payload))));
    render(<WeeklyMusic />);
    expect(screen.getByRole("heading", { name: "music" })).toBeTruthy();
  });

  it("loads the weekly feed through the backend proxy", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(jsonResponse(payload)));
    vi.stubGlobal("fetch", fetchMock);
    render(<WeeklyMusic />);

    expect(await screen.findByText("Never Gonna Give You Up")).toBeTruthy();
    const requestedUrls = fetchMock.mock.calls.map((call) => String((call as Array<unknown>)[0]));
    expect(requestedUrls).toContain(KOITO_PROXY_PATH);
  });

  it("shows tracks as album tiles once loaded", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(payload))));
    render(<WeeklyMusic />);

    expect(await screen.findByText("Never Gonna Give You Up")).toBeTruthy();
    expect(screen.getByText("Rick Astley")).toBeTruthy();
    expect(screen.getByText("42 plays")).toBeTruthy();
    expect(screen.getByAltText("Never Gonna Give You Up album cover")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Never Gonna Give You Up on MusicBrainz" }).getAttribute(
        "href"
      )
    ).toBe(`https://musicbrainz.org/recording/${MBID}`);
  });

  it("links each track and artist back to the Koito instance", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(payload))));
    render(<WeeklyMusic />);

    await screen.findByText("Never Gonna Give You Up");
    expect(
      screen.getByRole("link", { name: "Never Gonna Give You Up on Koito" }).getAttribute("href")
    ).toBe(`${KOITO_ORIGIN}/track/10`);
    expect(
      screen.getByRole("link", { name: "Never Gonna Give You Up" }).getAttribute("href")
    ).toBe(`${KOITO_ORIGIN}/track/10`);
    expect(screen.getByRole("link", { name: "Rick Astley on Koito" }).getAttribute("href")).toBe(
      `${KOITO_ORIGIN}/artist/1`
    );
  });

  it("links to the weekly chart via the show-more control", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(payload))));
    render(<WeeklyMusic />);

    const showMore = await screen.findByRole("link", { name: /show more on koito/i });
    expect(showMore.getAttribute("href")).toBe(KOITO_WEEKLY_CHART_URL);
  });

  it("shows the friendly error card when the proxy is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("blocked"))));
    render(<WeeklyMusic />);

    await waitFor(() => {
      expect(screen.getByText(/couldn't reach koito right now/i)).toBeTruthy();
    });
  });

  it("shows an empty state when the feed has no items", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse({ items: [] }))));
    render(<WeeklyMusic />);

    await waitFor(() => {
      expect(screen.getByText(/nothing scrobbled this week yet/i)).toBeTruthy();
    });
  });

  it("offers a direct Koito link from the error card", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("nope"))));
    render(<WeeklyMusic />);

    const link = await screen.findByRole("link", { name: /open koito/i });
    expect(link.getAttribute("href")).toBe(KOITO_ORIGIN);
  });
});
