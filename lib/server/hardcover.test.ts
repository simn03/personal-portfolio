import { describe, expect, it } from "vitest";
import { ACTIVITY_DAYS } from "../feeds";
import {
  READING_ACTIVITY_QUERY,
  READING_LIMIT,
  READING_LOG_QUERY,
  buildReadingActivity,
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
    book: {
      id: 3,
      title: "The Left Hand of Darkness",
      authors: [{ id: 3, name: "Ursula K. Le Guin" }],
    },
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

describe("graphql queries", () => {
  it("caps the reading log at 10 and queries the user's book statuses", () => {
    expect(READING_LIMIT).toBe(10);
    expect(READING_LOG_QUERY).toContain("user_books");
    expect(READING_LOG_QUERY).toContain("currently-reading");
    expect(READING_LOG_QUERY).toContain("contributions");
  });

  it("filters reading_journals to progress updates since the given variable", () => {
    expect(READING_ACTIVITY_QUERY).toContain("reading_journals");
    expect(READING_ACTIVITY_QUERY).toContain("progress_updated");
    expect(READING_ACTIVITY_QUERY).toContain("$since");
  });
});

describe("buildReadingActivity", () => {
  const today = new Date("2026-09-09T12:00:00Z");

  it("estimates minutes from pages_delta/seconds_delta when present", () => {
    const json = {
      reading_journals: [
        { action_at: "2026-09-08T10:00:00Z", metadata: { pages_delta: 10, seconds_delta: 0 } },
        { action_at: "2026-09-08T20:00:00Z", metadata: { pages_delta: 0, seconds_delta: 600 } },
      ],
    };
    // 10 pages * 1.5 min/page + 600s / 60 = 15 + 10 = 25 minutes on 09-08.
    expect(buildReadingActivity(json, 2, today).points).toEqual([
      { date: "2026-09-08", value: 25 },
      { date: "2026-09-09", value: 0 },
    ]);
  });

  it("defaults to the shared window length", () => {
    expect(buildReadingActivity({}, undefined, today).points).toHaveLength(ACTIVITY_DAYS);
  });

  it("derives a delta from before/after progress when Hardcover doesn't report one directly", () => {
    const json = {
      reading_journals: [
        {
          action_at: "2026-09-09T10:00:00Z",
          metadata: { progress_pages: 50, progress_pages_was: 40 },
        },
      ],
    };
    // 10-page delta * 1.5 min/page = 15 minutes.
    expect(buildReadingActivity(json, 1, today).points).toEqual([
      { date: "2026-09-09", value: 15 },
    ]);
  });

  it("excludes bulk mark-as-finished completions", () => {
    const json = {
      reading_journals: [
        {
          action_at: "2026-09-09T10:00:00Z",
          metadata: { source: "completion", pages_delta: 300, seconds_delta: 0 },
        },
      ],
    };
    expect(buildReadingActivity(json, 1, today).points).toEqual([
      { date: "2026-09-09", value: 0 },
    ]);
  });

  it("never counts a negative progress correction", () => {
    const json = {
      reading_journals: [
        {
          action_at: "2026-09-09T10:00:00Z",
          metadata: { progress_pages: 10, progress_pages_was: 50 },
        },
      ],
    };
    expect(buildReadingActivity(json, 1, today).points).toEqual([
      { date: "2026-09-09", value: 0 },
    ]);
  });

  it("computes the current streak as consecutive active days ending today", () => {
    const json = {
      reading_journals: [
        { action_at: "2026-09-07T10:00:00Z", metadata: { pages_delta: 5 } },
        { action_at: "2026-09-09T10:00:00Z", metadata: { pages_delta: 5 } },
      ],
    };
    const { streak, daysActive } = buildReadingActivity(json, 5, today);
    // 09-08 is a zero, so the streak only counts today.
    expect(streak).toBe(1);
    expect(daysActive).toBe(2);
  });

  it("handles empty/malformed payloads", () => {
    expect(buildReadingActivity(null, 2, today)).toEqual({
      points: [
        { date: "2026-09-08", value: 0 },
        { date: "2026-09-09", value: 0 },
      ],
      streak: 0,
      daysActive: 0,
    });
    expect(buildReadingActivity({ reading_journals: "nope" }, 1, today).points).toEqual([
      { date: "2026-09-09", value: 0 },
    ]);
  });
});
