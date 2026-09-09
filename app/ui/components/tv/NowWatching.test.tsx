import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import NowWatching from "./NowWatching.component";
import { SCROB_NOW_PLAYING_PROXY_PATH } from "@/lib/scrob";

vi.mock("next/image", async () => {
  const React = await import("react");
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => React.createElement("img", props),
  };
});

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: () => Promise.resolve(body) } as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("NowWatching", () => {
  it("renders nothing when there is no active session", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(jsonResponse({ configured: true, sessions: [] })))
    );
    const { container } = render(<NowWatching />);

    await waitFor(() => expect(container).toBeTruthy());
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when scrob isn't configured", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse({ configured: false }))));
    const { container } = render(<NowWatching />);

    await waitFor(() => expect(container).toBeTruthy());
    expect(container.firstChild).toBeNull();
  });

  it("shows an active playback session with its progress", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          configured: true,
          sessions: [
            {
              sessionKey: "plex-1",
              state: "playing",
              progressPercent: 42,
              title: "Re:ZERO",
              subtitle: "S1 · E80",
              posterPath: "https://image.tmdb.org/t/p/w500/rezero.jpg",
              showTmdbId: 65942,
            },
          ],
        })
      )
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<NowWatching />);

    expect(await screen.findByText("Re:ZERO")).toBeTruthy();
    expect(screen.getByText("S1 · E80")).toBeTruthy();
    expect(screen.getByText("now watching on scrob")).toBeTruthy();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("42");
    expect(String((fetchMock.mock.calls[0] as Array<unknown>)[0])).toBe(
      SCROB_NOW_PLAYING_PROXY_PATH
    );
  });

  it("labels a paused session distinctly", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          jsonResponse({
            configured: true,
            sessions: [
              { sessionKey: "plex-2", state: "paused", progressPercent: 10, title: "Arrival" },
            ],
          })
        )
      )
    );
    render(<NowWatching />);

    expect(await screen.findByText("paused on scrob")).toBeTruthy();
  });
});
