/**
 * Hardcover reader: the GraphQL queries, the credentialed request and the
 * normalisers that turn the response into the client-safe shapes declared in
 * `lib/hardcover.ts`.
 *
 * SERVER ONLY — see the note at the top of `lib/server/upstream.ts`.
 */

import { ACTIVITY_DAYS, type ActivitySummary } from "../feeds";
import {
  type ReadingActivityFeed,
  type ReadingEntry,
  type ReadingFeed,
} from "../hardcover";
import { asAbsoluteUrl, asNumber, asRecord, asString, type RawRecord } from "../utils/records";
import { buildActivitySummary, shiftDays } from "./activity";
import { assertServerOnly, fetchFeedJson, resolveUpstreamUrl } from "./upstream";

assertServerOnly();

const HARDCOVER_GRAPHQL = "https://api.hardcover.app/v1/graphql";

/** Max entries the reading section shows (reading + read combined). */
export const READING_LIMIT = 10;

/**
 * Hardcover doesn't expose a "minutes spent reading" field — a progress update
 * only carries pages (or, for audiobooks, seconds) read since the last one. A
 * page is approximated at this many minutes (~250-300 words/page at an average
 * adult reading pace) so page-based and audiobook progress land on one scale.
 */
const MINUTES_PER_PAGE = 1.5;

export function isHardcoverConfigured(): boolean {
  return Boolean(process.env.HARDCOVER_ACCESS_TOKEN);
}

/** Clamps Hardcover's percentage into a sane 0-100 range. */
function clampPercent(value: number | undefined): number | undefined {
  if (value === undefined || Number.isNaN(value)) return undefined;
  return Math.min(100, Math.max(0, value));
}

/**
 * Reading progress for the most recent read of a book. Hardcover reports a
 * `progress` percentage directly; when it is missing we derive one from pages
 * read against the edition's (or book's) page count.
 */
function readingProgress(log: RawRecord, book: RawRecord) {
  const reads = Array.isArray(log.user_book_reads) ? log.user_book_reads : [];
  const latest = asRecord(reads[0]);
  const totalPages = asNumber(asRecord(log.edition)?.pages) ?? asNumber(book.pages);
  const progressPages = asNumber(latest?.progress_pages);

  const derived =
    progressPages !== undefined && totalPages !== undefined && totalPages > 0
      ? (progressPages / totalPages) * 100
      : undefined;

  return {
    progressPercent: clampPercent(asNumber(latest?.progress) ?? derived),
    progressPages,
    totalPages,
  };
}

function namesFrom(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((entry): string[] => {
    const item = asRecord(entry);
    if (!item) return [];
    const name =
      asString(item.name) ?? asString(item.author_name) ?? asString(asRecord(item.author)?.name);
    return name ? [name] : [];
  });
}

/** Hardcover exposes authors via `book.contributions[].author.name`. */
function authorNames(book: RawRecord): string[] {
  const direct = namesFrom(book.authors);
  if (direct.length > 0) return direct;
  return namesFrom(book.contributions);
}

function coverUrl(book: RawRecord): string | undefined {
  const raw = book.image ?? book.cover_image_url ?? book.coverUrl;
  return asAbsoluteUrl(typeof raw === "string" ? raw : asRecord(raw)?.url);
}

function normalizeLog(rawLog: unknown, state: ReadingEntry["state"]): ReadingEntry | null {
  const log = asRecord(rawLog);
  if (!log) return null;
  const book = asRecord(log.book);
  if (!book) return null;
  const title = asString(book.title);
  if (!title) return null;

  const finishedAt =
    asString(log.last_read_date) ?? asString(log.date_finished) ?? asString(log.first_read_date);
  return {
    bookId: asNumber(book.id),
    title,
    authors: authorNames(book),
    coverUrl: coverUrl(book),
    slug: asString(book.slug),
    state,
    finishedAt,
    ...(state === "reading" ? readingProgress(log, book) : {}),
  };
}

/**
 * Merges Hardcover's two reading-log buckets ("currently reading" and
 * "finished") into one newest-first list up to `limit` total entries. Reading
 * entries lead, then finished books by finish date (newest first).
 */
export function parseReadingFeed(
  raw: { current?: unknown; finished?: unknown },
  limit = READING_LIMIT
): ReadingEntry[] {
  const reading = (Array.isArray(raw.current) ? raw.current : [])
    .flatMap((log) => {
      const entry = normalizeLog(log, "reading");
      return entry ? [entry] : [];
    })
    .sort((a, b) => String(b.finishedAt ?? "").localeCompare(String(a.finishedAt ?? "")));

  const read = (Array.isArray(raw.finished) ? raw.finished : [])
    .flatMap((log) => {
      const entry = normalizeLog(log, "read");
      return entry && entry.finishedAt ? [entry] : [];
    })
    .sort((a, b) => String(b.finishedAt).localeCompare(String(a.finishedAt)));

  return [...reading, ...read].slice(0, limit);
}

/**
 * Sums a `reading_journals` row's progress delta into minutes. Hardcover has
 * reported `pages_delta`/`seconds_delta` directly on newer rows; older ones
 * only carry the before/after progress, so it's derived from that instead.
 * Bulk "mark as finished" completions (`source: "completion"`) are excluded —
 * they log the whole remaining book in one jump, not a real reading session,
 * and would otherwise blow out the heatmap's scale for that single day.
 */
function minutesFromJournalRow(row: RawRecord): number {
  const meta = asRecord(row.metadata);
  if (!meta || meta.source === "completion") {
    return 0;
  }

  const pagesDelta =
    asNumber(meta.pages_delta) ??
    Math.max(0, (asNumber(meta.progress_pages) ?? 0) - (asNumber(meta.progress_pages_was) ?? 0));
  const secondsDelta =
    asNumber(meta.seconds_delta) ??
    Math.max(0, (asNumber(meta.progress_seconds) ?? 0) - (asNumber(meta.progress_seconds_was) ?? 0));

  return Math.max(0, secondsDelta) / 60 + Math.max(0, pagesDelta) * MINUTES_PER_PAGE;
}

/**
 * Estimated minutes spent reading per day, from a `{ reading_journals: [...] }`
 * payload, on the shared heatmap window.
 */
export function buildReadingActivity(
  json: unknown,
  days: number = ACTIVITY_DAYS,
  today?: Date
): ActivitySummary {
  const root = asRecord(json);
  const rows = Array.isArray(root?.reading_journals) ? root.reading_journals : [];

  const minutesByDate = new Map<string, number>();
  for (const rowRaw of rows) {
    const row = asRecord(rowRaw);
    const date = asString(row?.action_at)?.slice(0, 10);
    if (!row || !date) continue;
    minutesByDate.set(date, (minutesByDate.get(date) ?? 0) + minutesFromJournalRow(row));
  }

  return buildActivitySummary(minutesByDate, days, today);
}

/**
 * GraphQL query for `reading_journals` progress-update rows since `$since`,
 * used to build the reading-activity heatmap. Scoped to the token's own account
 * by Hardcover's API, same as the reading-log query below.
 */
export const READING_ACTIVITY_QUERY = `query ReadingActivity($since: timestamp!) {
  reading_journals(
    where: { created_at: { _gte: $since }, event: { _eq: "progress_updated" } }
    order_by: { created_at: asc }
    limit: 1000
  ) {
    action_at
    metadata
  }
}`;

/**
 * GraphQL query for the current user's currently-reading and recently-finished
 * logs. Hardcover's exact enum/field names are validated with the account token
 * before going live — any adjustments belong here, in one place.
 */
export const READING_LOG_QUERY = `query Reading($limit: Int!) {
  me {
    reading: user_books(
      limit: $limit
      where: { user_book_status: { slug: { _eq: "currently-reading" } } }
      order_by: { updated_at: desc_nulls_last }
    ) {
      last_read_date
      first_read_date
      user_book_status { slug }
      edition { pages }
      user_book_reads(order_by: { started_at: desc_nulls_last }, limit: 1) {
        progress
        progress_pages
        started_at
      }
      book {
        id
        title
        slug
        pages
        image { url }
        contributions { author { name } }
      }
    }
    finished: user_books(
      limit: $limit
      where: { user_book_status: { slug: { _eq: "read" } } }
      order_by: { last_read_date: desc_nulls_last }
    ) {
      last_read_date
      first_read_date
      user_book_status { slug }
      book {
        id
        title
        slug
        image { url }
        contributions { author { name } }
      }
    }
  }
}`;

/**
 * Runs one GraphQL query against Hardcover and returns its `data`.
 *
 * GraphQL errors arrive with a `200`, so they're checked here rather than by
 * status — and raised rather than returned, since the messages can describe the
 * query and the token's scope.
 */
async function queryHardcover(
  label: string,
  query: string,
  variables: Record<string, unknown>
): Promise<unknown> {
  const endpoint = resolveUpstreamUrl(process.env.HARDCOVER_API_URL, HARDCOVER_GRAPHQL).href;

  const payload = await fetchFeedJson(endpoint, {
    label,
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.HARDCOVER_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const root = asRecord(payload);
  const errors = Array.isArray(root?.errors) ? root.errors : [];
  if (errors.length > 0) {
    throw new Error(
      `Hardcover GraphQL error: ${asString(asRecord(errors[0])?.message) ?? "unknown"}`
    );
  }

  return root?.data;
}

/** Currently-reading books first, then recently finished. */
export async function readReadingFeed(): Promise<ReadingFeed> {
  const data = await queryHardcover("hardcover", READING_LOG_QUERY, { limit: READING_LIMIT });

  // Hardcover returns `me` as a single-element list.
  const rawMe = asRecord(data)?.me;
  const me = asRecord(Array.isArray(rawMe) ? rawMe[0] : rawMe);

  return { books: parseReadingFeed({ current: me?.reading, finished: me?.finished }) };
}

/** Estimated reading minutes per day over the shared activity window. */
export async function readReadingActivity(): Promise<ReadingActivityFeed> {
  const since = shiftDays(new Date(), -(ACTIVITY_DAYS - 1)).toISOString();
  const data = await queryHardcover("hardcover-activity", READING_ACTIVITY_QUERY, { since });

  return { activity: buildReadingActivity(data) };
}
