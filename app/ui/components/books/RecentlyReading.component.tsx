"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { BookOpen } from "lucide-react";
import {
  HARDCOVER_PROFILE_URL,
  HARDCOVER_PROXY_PATH,
  hardcoverBookUrl,
  type ReadingEntry,
} from "@/lib/hardcover";
import FeedSection, { type FeedStatus } from "../feed/FeedSection.component";

const TILE_WIDTH = "w-40 sm:w-44";

/** Rounds for display without ever showing "0%" for a started book. */
function formatPercent(percent: number): string {
  const rounded = Math.round(percent);
  if (rounded === 0 && percent > 0) return "<1%";
  return `${rounded}%`;
}

function BookCover({ entry }: { entry: ReadingEntry }) {
  const art = entry.coverUrl ? (
    <Image
      src={entry.coverUrl}
      alt={`${entry.title} cover`}
      fill
      sizes="(max-width: 640px) 10rem, 11rem"
      unoptimized
      className="object-cover"
    />
  ) : (
    <span className="flex h-full items-center justify-center text-muted-foreground">
      <BookOpen className="size-8" aria-hidden="true" />
    </span>
  );

  return <span className="retro-frame aspect-[2/3]">{art}</span>;
}

/**
 * Reading progress as a segmented meter plus a monospace read-out. Always
 * occupies the same height — finished books render an empty slot — so meters
 * line up across the row instead of drifting with each title's length.
 */
function ProgressMeter({ entry }: { entry: ReadingEntry }) {
  const { progressPercent, progressPages, totalPages } = entry;
  if (progressPercent === undefined) {
    return <div className="mt-2 h-9" aria-hidden="true" />;
  }

  const pages =
    progressPages !== undefined && totalPages !== undefined
      ? `${progressPages} / ${totalPages} pp`
      : null;

  return (
    <div className="mt-2 flex h-9 flex-col justify-center gap-1">
      <div
        className="retro-meter"
        role="progressbar"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${entry.title} reading progress`}
      >
        <span
          className="retro-meter-fill"
          style={{ width: `${Math.max(progressPercent, 1.5)}%` }}
        />
      </div>
      <div className="flex items-baseline justify-between gap-2 text-muted-foreground">
        <span className="retro-eyebrow">{formatPercent(progressPercent)}</span>
        {pages && <span className="font-mono text-[0.6rem] tabular-nums">{pages}</span>}
      </div>
    </div>
  );
}

function BookTile({ entry }: { entry: ReadingEntry }) {
  const date = entry.finishedAt ? dayjs(entry.finishedAt) : null;
  const isReading = entry.state === "reading";
  const href = entry.slug ? hardcoverBookUrl(entry.slug) : null;

  const cover = <BookCover entry={entry} />;

  return (
    <li className={`${TILE_WIDTH} shrink-0 snap-start`}>
      <div className="relative">
        {href ? (
          <a
            className="block transition-transform hover:-translate-y-0.5"
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${entry.title} on Hardcover`}
          >
            {cover}
          </a>
        ) : (
          cover
        )}
        <span
          className={`retro-badge ${isReading ? "retro-badge-active" : "retro-badge-muted"}`}
        >
          {isReading ? "now reading" : date?.isValid() ? date.format("MMM D, YYYY") : "read"}
        </span>
      </div>

      <div className="mt-2 flex min-w-0 flex-col gap-0.5 px-0.5">
        {href ? (
          <a
            className="tile-title transition-colors hover:text-primary"
            href={href}
            target="_blank"
            rel="noreferrer"
            title={entry.title}
          >
            {entry.title}
          </a>
        ) : (
          <p className="tile-title" title={entry.title}>
            {entry.title}
          </p>
        )}
        <p className="tile-sub" title={entry.authors.join(", ") || undefined}>
          {entry.authors.join(", ")}
        </p>
        <ProgressMeter entry={entry} />
      </div>
    </li>
  );
}

function SkeletonTile() {
  return (
    <li className={`${TILE_WIDTH} shrink-0 snap-start`} aria-hidden="true">
      <div className="aspect-[2/3] animate-pulse rounded-xl border border-border bg-muted" />
      <div className="mt-2 space-y-2 px-0.5">
        <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-2.5 w-3/5 animate-pulse rounded bg-muted" />
      </div>
    </li>
  );
}

/**
 * "What I'm reading" — currently-reading books first, then recently finished,
 * up to 10 total. Fetched through the same-origin backend proxy which caches
 * Hardcover's response for an hour. Hidden entirely when no Hardcover token is
 * configured (`configured: false`).
 */
export default function RecentlyReading() {
  const [state, setState] = useState<{ status: FeedStatus; books: ReadingEntry[] }>({
    status: "loading",
    books: [],
  });

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const timeout = window.setTimeout(() => controller.abort(), 15_000);

    const load = async () => {
      const response = await fetch(HARDCOVER_PROXY_PATH, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`Feed responded with ${response.status}`);
      }
      const json = (await response.json()) as {
        configured?: boolean;
        books?: ReadingEntry[];
      };
      if (cancelled) return;

      if (json.configured === false) {
        setState({ status: "hidden", books: [] });
        return;
      }
      setState({ status: "ready", books: json.books ?? [] });
    };

    load()
      .catch(() => {
        if (cancelled) return;
        setState({ status: "error", books: [] });
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  if (state.status === "hidden") {
    return null;
  }

  return (
    <FeedSection
      id="reading"
      title="reading"
      blurb="what i'm reading & recently finished, from hardcover"
      ariaLabel="Reading on Hardcover"
      status={state.status}
      isEmpty={state.books.length === 0}
      errorText="couldn't reach hardcover right now."
      emptyText="no recent books logged — the TBR pile lives on."
      fallbackLink={{ href: HARDCOVER_PROFILE_URL, label: "open hardcover ↗" }}
      moreLink={{ href: HARDCOVER_PROFILE_URL, label: "more on hardcover →" }}
      skeleton={Array.from({ length: 5 }).map((_, index) => (
        <SkeletonTile key={index} />
      ))}
    >
      {state.books.map((book, index) => (
        <BookTile key={`${book.title}-${index}`} entry={book} />
      ))}
    </FeedSection>
  );
}
