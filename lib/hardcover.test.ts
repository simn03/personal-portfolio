import { describe, expect, it } from "vitest";
import {
  READING_LIMIT,
  buildReadingLogQuery,
  parseReadingFeed,
} from "./hardcover";

const finished = [
  {
    date_finished: "2026-09-01",
    book: {
      id: 1,
      title: "Project Hail Mary",
      image: { url: "https://images.hardcover.app/1.jpg" },
      authors: [{ id: 1, name: "Andy Weir" }],
    },
  },
  {
    date_finished: "2026-08-20",
    book: { id: 2, title: "Annihilation", authors: [{ id: 2, name: "Jeff VanderMeer" }] },
  },
];

const current = [
  {
    book: { id: 3, title: "The Left Hand of Darkness", authors: [{ id: 3, name: "Ursula K. Le Guin" }] },
  },
];

describe("parseReadingFeed", () => {
  it("leads with currently-reading then finished books newest-first", () => {
    const parsed = parseReadingFeed({ current, finished });
    expect(parsed.map((b) => b.title)).toEqual([
      "The Left Hand of Darkness",
      "Project Hail Mary",
      "Annihilation",
    ]);
    expect(parsed[0]).toMatchObject({ state: "reading", title: "The Left Hand of Darkness" });
    expect(parsed[1]).toMatchObject({
      state: "read",
      finishedAt: "2026-09-01",
      coverUrl: "https://images.hardcover.app/1.jpg",
      authors: ["Andy Weir"],
    });
    // Finished books without a finish date are dropped from the read bucket.
    expect(parsed.every((b) => b.state !== "read" || b.finishedAt)).toBe(true);
  });

  it("caps the combined total at the limit", () => {
    const lots = Array.from({ length: 6 }, (_, i) => ({
      book: { id: i, title: `Book ${i}` },
    }));
    const manyFinished = Array.from({ length: 8 }, (_, i) => ({
      date_finished: `2026-0${(i % 9) + 1}-10`,
      book: { id: 100 + i, title: `Done ${i}` },
    }));
    const parsed = parseReadingFeed({ current: lots, finished: manyFinished }, 10);
    expect(parsed).toHaveLength(10);
  });

  it("handles missing/empty buckets", () => {
    expect(parseReadingFeed({})).toEqual([]);
    expect(parseReadingFeed({ current: [], finished: [] })).toEqual([]);
  });
});

describe("READING_LIMIT / buildReadingLogQuery", () => {
  it("caps at 10 and builds a query against the user's book statuses", () => {
    expect(READING_LIMIT).toBe(10);
    const query = buildReadingLogQuery();
    expect(query).toContain("user_books");
    expect(query).toContain("currently-reading");
    expect(query).toContain("contributions");
  });
});
