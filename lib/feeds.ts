/**
 * The contract shared by every "what I'm currently into" feed — music, watching
 * and reading — and by both sides of each one: the proxy routes in `app/api/*`
 * that produce the data and the widgets in `app/ui/components/*` that render it.
 *
 * Client-safe by construction: shapes, windows and timings only, never a
 * credential or a description of an upstream's own API.
 */

/**
 * Every feed is cached for an hour. The upstreams are small self-hosted boxes
 * (plus Hardcover's public API) and should be asked roughly once an hour, never
 * once per visitor.
 */
export const FEED_REVALIDATE_SECONDS = 3600;

/**
 * "Now playing" feeds change while a visitor is on the page, so they're asked
 * far more often than the hourly feeds — still capped well short of "once per
 * request" so a busy page load can't hammer a self-hosted box.
 */
export const LIVE_REVALIDATE_SECONDS = 20;

/**
 * How often a live widget re-reads its proxy. Matched to the server's window on
 * purpose: polling faster would only re-serve the same cached response.
 */
export const LIVE_POLL_INTERVAL_MS = LIVE_REVALIDATE_SECONDS * 1000;

/** Weeks of history every activity grid shows (Koito's own dashboard uses 36). */
export const ACTIVITY_WEEKS = 20;

/** Days of history to request upstream — always a whole number of weeks. */
export const ACTIVITY_DAYS = ACTIVITY_WEEKS * 7;

export type ActivityPoint = {
  /** ISO date, day granularity (`YYYY-MM-DD`). */
  date: string;
  /** Whatever is being counted that day: plays, watches, minutes read. */
  value: number;
};

export type ActivitySummary = {
  /** Zero-filled, consecutive days ending today — always `ACTIVITY_DAYS` long. */
  points: ActivityPoint[];
  /** Current consecutive-day streak. */
  streak: number;
  /** Days in the window with any activity at all. */
  daysActive: number;
};

/** The empty summary, for a feed with nothing to report. */
export const EMPTY_ACTIVITY: ActivitySummary = { points: [], streak: 0, daysActive: 0 };
