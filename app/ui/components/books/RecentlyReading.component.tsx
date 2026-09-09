"use client";

import dayjs from "dayjs";
import { BookOpen } from "lucide-react";
import {
  HARDCOVER_PROFILE_URL,
  HARDCOVER_PROXY_PATH,
  hardcoverBookUrl,
  type ReadingEntry,
  type ReadingFeed,
} from "@/lib/hardcover";
import { formatPercent } from "@/lib/utils/format";
import { useFeed } from "../../hooks/useFeed";
import CoverArt from "../feed/CoverArt.component";
import FeedSection from "../feed/FeedSection.component";
import MediaTile, { TILE_ASPECT } from "../feed/MediaTile.component";
import { tileSkeletons } from "../feed/TileSkeleton.component";

/**
 * Reading progress as a meter plus a monospace read-out. Always occupies the
 * same height — finished books render an empty slot — so meters line up across
 * the row instead of drifting with each title's length.
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
  const authors = entry.authors.join(", ");

  return (
    <MediaTile
      href={entry.slug ? hardcoverBookUrl(entry.slug) : undefined}
      coverLabel={`${entry.title} on Hardcover`}
      title={entry.title}
      badgeTone={isReading ? "active" : "muted"}
      badge={isReading ? "now reading" : date?.isValid() ? date.format("MMM D, YYYY") : "read"}
      cover={
        <CoverArt
          src={entry.coverUrl}
          alt={`${entry.title} cover`}
          icon={BookOpen}
          className={TILE_ASPECT.poster}
          sizes="(max-width: 640px) 10rem, 11rem"
        />
      }
      subtitle={authors}
      subtitleTitle={authors || undefined}
      footer={<ProgressMeter entry={entry} />}
    />
  );
}

/**
 * "What I'm reading" — currently-reading books first, then recently finished.
 * Fetched through the same-origin proxy, which caches Hardcover's response for
 * an hour and keeps both the access token and the GraphQL query server-side.
 */
export default function RecentlyReading() {
  const { status, data } = useFeed<ReadingFeed>(HARDCOVER_PROXY_PATH);
  const books = data?.books ?? [];

  return (
    <FeedSection
      id="reading"
      title="reading"
      blurb="what i'm reading & recently finished, from hardcover"
      ariaLabel="Reading on Hardcover"
      status={status}
      isEmpty={books.length === 0}
      errorText="couldn't reach hardcover right now."
      emptyText="no recent books logged — the TBR pile lives on."
      fallbackLink={{ href: HARDCOVER_PROFILE_URL, label: "open hardcover ↗" }}
      moreLink={{ href: HARDCOVER_PROFILE_URL, label: "more on hardcover →" }}
      skeleton={tileSkeletons(5, "poster")}
    >
      {books.map((book, index) => (
        <BookTile key={`${book.title}-${index}`} entry={book} />
      ))}
    </FeedSection>
  );
}
