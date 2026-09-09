/** Hardcover adapter for the "currently reading + recently read" feed. */

import { HARDCOVER_HANDLE } from "./site";
import {
  asAbsoluteUrl,
  asNumber,
  asRecord,
  asString,
  type RawRecord,
} from "./utils/records";

export const HARDCOVER_PROFILE_ORIGIN =
  process.env.NEXT_PUBLIC_HARDCOVER_ORIGIN ?? "https://hardcover.app";

/** Public profile the section links out to. */
export const HARDCOVER_PROFILE_URL = `${HARDCOVER_PROFILE_ORIGIN}/@${HARDCOVER_HANDLE}`;

/** Deep link to a book's page on Hardcover. */
export function hardcoverBookUrl(slug: string): string {
  return `${HARDCOVER_PROFILE_ORIGIN}/books/${slug}`;
}

/** Same-origin backend proxy that reads & caches the feed server-side. */
export const HARDCOVER_PROXY_PATH = "/api/hardcover/reading";

/** Max entries the section shows (reading + read combined). */
export const READING_LIMIT = 10;

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
      asString(item.name) ??
      asString(item.author_name) ??
      asString(asRecord(item.author)?.name);
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
 * GraphQL query for the current user's currently-reading and recently-finished
 * logs. Hardcover's exact enum/field names are validated with the account token
 * before going live — any adjustments belong here, in one place.
 */
export function buildReadingLogQuery(): string {
  return `query Reading($limit: Int!) {
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
}
