/**
 * Client-safe Hardcover contract: the shapes the proxy routes emit, the
 * same-origin paths the widgets read them from, and deep links to the profile.
 *
 * The access token, the GraphQL endpoint and the queries themselves live in
 * `lib/server/hardcover.ts`, which never reaches the browser — a public bundle
 * has no business carrying the shape of an authenticated API.
 */

import { type ActivitySummary } from "./feeds";
import { HARDCOVER_HANDLE } from "./site";

export const HARDCOVER_PROFILE_ORIGIN =
  process.env.NEXT_PUBLIC_HARDCOVER_ORIGIN ?? "https://hardcover.app";

/** Public profile the section links out to. */
export const HARDCOVER_PROFILE_URL = `${HARDCOVER_PROFILE_ORIGIN}/@${HARDCOVER_HANDLE}`;

/** Same-origin backend proxies that read & cache the feeds server-side. */
export const HARDCOVER_PROXY_PATH = "/api/hardcover/reading";
export const HARDCOVER_ACTIVITY_PROXY_PATH = "/api/hardcover/activity";

export type ReadingEntry = {
  bookId?: number;
  title: string;
  authors: string[];
  coverUrl?: string;
  /** Hardcover slug, for a deep link to the book's page. */
  slug?: string;
  state: "reading" | "read";
  /** ISO date string, present for finished books. */
  finishedAt?: string;
  /** 0-100, present for in-progress books Hardcover has progress for. */
  progressPercent?: number;
  progressPages?: number;
  totalPages?: number;
};

/** `GET /api/hardcover/reading` */
export type ReadingFeed = { books: ReadingEntry[] };

/** `GET /api/hardcover/activity` */
export type ReadingActivityFeed = { activity: ActivitySummary };

/** Deep link to a book's page on Hardcover. */
export function hardcoverBookUrl(slug: string): string {
  return `${HARDCOVER_PROFILE_ORIGIN}/books/${slug}`;
}
