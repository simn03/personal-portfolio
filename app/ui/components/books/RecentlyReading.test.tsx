import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import RecentlyReading from "./RecentlyReading.component";
import {
  HARDCOVER_PROFILE_URL,
  HARDCOVER_PROXY_PATH,
  hardcoverBookUrl,
  parseReadingFeed,
} from "@/lib/hardcover";

vi.mock("next/image", async () => {
  const React = await import("react");
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => React.createElement("img", props),
  };
});

const upstream = {
  current: [
    {
      edition: { pages: 304 },
      user_book_reads: [{ progress: 42.5, progress_pages: 129 }],
      book: {
        id: 3,
        title: "The Left Hand of Darkness",
        slug: "the-left-hand-of-darkness",
        pages: 304,
        authors: [{ id: 3, name: "Ursula K. Le Guin" }],
      },
    },
  ],
  finished: [
    {
      date_finished: "2026-09-01",
      book: {
        id: 1,
        title: "Project Hail Mary",
        slug: "project-hail-mary",
        image: { url: "https://images.hardcover.app/1.jpg" },
        authors: [{ id: 1, name: "Andy Weir" }],
      },
    },
  ],
};

/** What the proxy returns: parsed server-side, straight from the real payload. */
const payload = { configured: true, books: parseReadingFeed(upstream) };

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: () => Promise.resolve(body) } as Response;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("RecentlyReading", () => {
  it("renders the section header once loaded", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(payload))));
    render(<RecentlyReading />);

    expect(await screen.findByRole("heading", { name: "reading" })).toBeTruthy();
  });

  it("loads through the backend proxy and shows current + finished books", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(jsonResponse(payload)));
    vi.stubGlobal("fetch", fetchMock);
    render(<RecentlyReading />);

    expect(await screen.findByText("The Left Hand of Darkness")).toBeTruthy();
    expect(screen.getByText("Project Hail Mary")).toBeTruthy();
    expect(screen.getAllByText("now reading")).toHaveLength(1);
    expect(screen.getByText("Sep 1, 2026")).toBeTruthy();
    expect(String((fetchMock.mock.calls[0] as Array<unknown>)[0])).toBe(HARDCOVER_PROXY_PATH);
  });

  it("hides the section entirely when no Hardcover token is configured", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse({ configured: false }))));
    render(<RecentlyReading />);

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "reading" })).toBeNull();
    });
  });

  it("shows the error card when the proxy is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("down"))));
    render(<RecentlyReading />);

    await waitFor(() => {
      expect(screen.getByText(/couldn't reach hardcover right now/i)).toBeTruthy();
    });
    expect(
      screen.getByRole("link", { name: /open hardcover/i }).getAttribute("href")
    ).toBe(HARDCOVER_PROFILE_URL);
  });

  it("shows an empty state when there are no reading logs", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(jsonResponse({ configured: true, current: [], finished: [] }))
      )
    );
    render(<RecentlyReading />);

    await waitFor(() => {
      expect(screen.getByText(/no recent books logged/i)).toBeTruthy();
    });
  });

  it("links each book to its Hardcover page", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(payload))));
    render(<RecentlyReading />);

    const title = await screen.findByRole("link", { name: "The Left Hand of Darkness" });
    expect(title.getAttribute("href")).toBe(hardcoverBookUrl("the-left-hand-of-darkness"));

    expect(
      screen
        .getByRole("link", { name: "Project Hail Mary on Hardcover" })
        .getAttribute("href")
    ).toBe(hardcoverBookUrl("project-hail-mary"));
  });

  it("shows a progress meter for books in progress", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(payload))));
    render(<RecentlyReading />);

    const meter = await screen.findByRole("progressbar", {
      name: /The Left Hand of Darkness reading progress/i,
    });
    expect(meter.getAttribute("aria-valuenow")).toBe("43");
    expect(screen.getByText("43%")).toBeTruthy();
    expect(screen.getByText("129 / 304 pp")).toBeTruthy();
  });

  it("shows no progress meter on finished books", async () => {
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(jsonResponse(payload))));
    render(<RecentlyReading />);

    await screen.findByText("Project Hail Mary");
    expect(screen.getAllByRole("progressbar")).toHaveLength(1);
  });
});
