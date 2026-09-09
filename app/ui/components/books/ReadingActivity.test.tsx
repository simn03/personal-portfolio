import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ReadingActivity from "./ReadingActivity.component";
import { HARDCOVER_ACTIVITY_PROXY_PATH } from "@/lib/hardcover";

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: () => Promise.resolve(body) } as Response;
}

const payload = {
  configured: true,
  activity: {
    points: [
      { date: "2026-09-08", value: 30 },
      { date: "2026-09-09", value: 0 },
    ],
    streak: 3,
    daysActive: 1,
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("ReadingActivity", () => {
  it("loads the activity heatmap through the backend proxy", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(jsonResponse(payload)));
    vi.stubGlobal("fetch", fetchMock);
    render(<ReadingActivity />);

    expect(await screen.findByText("3 day streak")).toBeTruthy();
    expect(String((fetchMock.mock.calls[0] as Array<unknown>)[0])).toBe(
      HARDCOVER_ACTIVITY_PROXY_PATH
    );
  });

  it("falls back to the week label when there is no current streak", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          jsonResponse({ configured: true, activity: { points: [], streak: 0, daysActive: 0 } })
        )
      )
    );
    render(<ReadingActivity />);

    expect(await screen.findByText(/last 20 weeks/i)).toBeTruthy();
  });

  it("renders nothing when hardcover isn't configured", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse({ configured: false }))));
    const { container } = render(<ReadingActivity />);

    await waitFor(() => {
      expect(container.querySelector("section")).toBeNull();
    });
  });

  it("renders nothing when the proxy is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("down"))));
    const { container } = render(<ReadingActivity />);

    await waitFor(() => {
      expect(container.querySelector("section")).toBeNull();
    });
  });
});
