import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import NowPlaying from "./NowPlaying.component";
import { KOITO_NOW_PLAYING_PROXY_PATH } from "@/lib/koito";

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

describe("NowPlaying", () => {
  it("renders nothing when nothing is playing", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse({ track: null }))));
    const { container } = render(<NowPlaying />);

    await waitFor(() => expect(container).toBeTruthy());
    expect(container.firstChild).toBeNull();
  });

  it("shows the currently-playing track once loaded", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          track: {
            koitoId: 10,
            title: "Never Gonna Give You Up",
            artists: [{ name: "Rick Astley", koitoId: 1 }],
            coverUrl: "https://koito.example.com/image/medium/cover-1",
          },
        })
      )
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<NowPlaying />);

    expect(await screen.findByText("Never Gonna Give You Up")).toBeTruthy();
    expect(screen.getByText("Rick Astley")).toBeTruthy();
    expect(screen.getByText("now playing on koito")).toBeTruthy();
    expect(String((fetchMock.mock.calls[0] as Array<unknown>)[0])).toBe(
      KOITO_NOW_PLAYING_PROXY_PATH
    );
  });

  it("stays hidden when the proxy errors", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("down"))));
    const { container } = render(<NowPlaying />);

    await waitFor(() => expect(container).toBeTruthy());
    expect(container.firstChild).toBeNull();
  });
});
