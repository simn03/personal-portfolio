/**
 * Turns a sparse "date → amount" map into the zero-filled window every activity
 * heatmap renders.
 *
 * SERVER ONLY — see the note at the top of `lib/server/upstream.ts`.
 *
 * Scrob and Hardcover both report only the days that had activity, and neither
 * computes a streak or an active-day count, so both need exactly this. Koito
 * zero-fills and streaks server-side already, but is normalised through the
 * same function so all three widgets are fed one shape.
 */

import { type ActivityPoint, type ActivitySummary } from "../feeds";
import { assertServerOnly } from "./upstream";

assertServerOnly();

/** The `YYYY-MM-DD` key for a `Date`, in UTC — the granularity every feed reports. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Midnight UTC on the day `date` falls in. */
function utcDayStart(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/** `date` shifted by `days`, without mutating the input. */
export function shiftDays(date: Date, days: number): Date {
  const shifted = new Date(date);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted;
}

/**
 * Zero-fills the `days` days ending on `today` from `valuesByDate`, then
 * derives the trailing streak and active-day count the upstreams don't provide.
 * Values are rounded, so an estimated figure (Hardcover's minutes-per-page
 * approximation) lands on the same integer scale as a real count.
 */
export function buildActivitySummary(
  valuesByDate: Map<string, number>,
  days: number,
  today: Date = new Date()
): ActivitySummary {
  const end = utcDayStart(today);

  const points: ActivityPoint[] = [];
  for (let offset = days - 1; offset >= 0; offset--) {
    const date = isoDate(shiftDays(end, -offset));
    points.push({ date, value: Math.round(valuesByDate.get(date) ?? 0) });
  }

  let streak = 0;
  for (let i = points.length - 1; i >= 0 && points[i].value > 0; i--) {
    streak++;
  }

  return { points, streak, daysActive: points.filter((point) => point.value > 0).length };
}

/**
 * Splits the `totalDays` days ending on `until` into contiguous, non-overlapping
 * windows no wider than `maxWindowDays`, oldest first.
 *
 * Scrob's `/stats` only buckets by day when a single request's range is narrow
 * enough; anything wider silently falls back to monthly buckets, so a wide
 * window has to be asked for in several narrower pieces.
 */
export function dailyWindowChunks(
  totalDays: number,
  maxWindowDays: number,
  until: Date = new Date()
): Array<{ since: Date; until: Date }> {
  const chunks: Array<{ since: Date; until: Date }> = [];
  let chunkUntil = new Date(until);
  let remaining = totalDays;

  while (remaining > 0) {
    const size = Math.min(remaining, maxWindowDays);
    const chunkSince = shiftDays(chunkUntil, -(size - 1));

    chunks.unshift({ since: chunkSince, until: chunkUntil });

    remaining -= size;
    chunkUntil = shiftDays(chunkSince, -1);
  }

  return chunks;
}
