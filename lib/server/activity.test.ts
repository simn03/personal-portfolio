import { describe, expect, it } from "vitest";
import { buildActivitySummary, dailyWindowChunks, isoDate, shiftDays } from "./activity";

const TODAY = new Date("2026-09-09T12:00:00Z");

describe("buildActivitySummary", () => {
  it("zero-fills the window oldest-first, ending today", () => {
    const summary = buildActivitySummary(new Map([["2026-09-08", 4]]), 3, TODAY);
    expect(summary.points).toEqual([
      { date: "2026-09-07", value: 0 },
      { date: "2026-09-08", value: 4 },
      { date: "2026-09-09", value: 0 },
    ]);
  });

  it("rounds estimated values onto the same integer scale as real counts", () => {
    const summary = buildActivitySummary(new Map([["2026-09-09", 24.6]]), 1, TODAY);
    expect(summary.points).toEqual([{ date: "2026-09-09", value: 25 }]);
  });

  it("counts the streak back from today and stops at the first gap", () => {
    const values = new Map([
      ["2026-09-05", 1],
      ["2026-09-07", 1],
      ["2026-09-08", 1],
      ["2026-09-09", 1],
    ]);
    const summary = buildActivitySummary(values, 6, TODAY);
    expect(summary.streak).toBe(3);
    expect(summary.daysActive).toBe(4);
  });

  it("reports no streak when today itself is empty", () => {
    const summary = buildActivitySummary(new Map([["2026-09-08", 9]]), 3, TODAY);
    expect(summary.streak).toBe(0);
    expect(summary.daysActive).toBe(1);
  });

  it("handles an empty map", () => {
    expect(buildActivitySummary(new Map(), 2, TODAY)).toEqual({
      points: [
        { date: "2026-09-08", value: 0 },
        { date: "2026-09-09", value: 0 },
      ],
      streak: 0,
      daysActive: 0,
    });
  });
});

describe("dailyWindowChunks", () => {
  it("covers the whole window with contiguous, non-overlapping pieces", () => {
    const chunks = dailyWindowChunks(140, 60, TODAY);

    expect(chunks).toHaveLength(3);
    expect(isoDate(chunks.at(-1)!.until)).toBe("2026-09-09");

    // Every chunk is within the cap, and each starts the day after the last ended.
    for (const [index, chunk] of chunks.entries()) {
      const days =
        Math.round((chunk.until.getTime() - chunk.since.getTime()) / 86_400_000) + 1;
      expect(days).toBeLessThanOrEqual(60);
      if (index > 0) {
        expect(isoDate(chunk.since)).toBe(isoDate(shiftDays(chunks[index - 1].until, 1)));
      }
    }

    // The pieces add up to exactly the requested window.
    const first = chunks[0].since;
    const totalDays =
      Math.round((chunks.at(-1)!.until.getTime() - first.getTime()) / 86_400_000) + 1;
    expect(totalDays).toBe(140);
  });

  it("returns a single chunk when the window already fits", () => {
    const chunks = dailyWindowChunks(30, 60, TODAY);
    expect(chunks).toHaveLength(1);
    expect(isoDate(chunks[0].since)).toBe("2026-08-11");
    expect(isoDate(chunks[0].until)).toBe("2026-09-09");
  });
});

describe("shiftDays", () => {
  it("moves a date without mutating the original", () => {
    const start = new Date("2026-09-09T12:00:00Z");
    expect(isoDate(shiftDays(start, -1))).toBe("2026-09-08");
    expect(isoDate(start)).toBe("2026-09-09");
  });
});
