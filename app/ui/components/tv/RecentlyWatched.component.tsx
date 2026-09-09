"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { Clapperboard } from "lucide-react";
import {
  SCROB_HISTORY_URL,
  SCROB_ORIGIN,
  SCROB_PROXY_PATH,
  episodeLabel,
  tmdbShowUrl,
  tvdbShowUrl,
  type WatchedEpisode,
} from "@/lib/scrob";
import FeedSection, { type FeedStatus } from "../feed/FeedSection.component";

const TILE_WIDTH = "w-40 sm:w-44";

function PosterArt({ episode }: { episode: WatchedEpisode }) {
  const art = episode.posterPath ? (
    <Image
      src={episode.posterPath}
      alt={`${episode.showTitle} poster`}
      fill
      sizes="(max-width: 640px) 10rem, 11rem"
      unoptimized
      className="object-cover"
    />
  ) : (
    <span className="flex h-full items-center justify-center text-muted-foreground">
      <Clapperboard className="size-8" aria-hidden="true" />
    </span>
  );
  return <span className="retro-frame aspect-[2/3]">{art}</span>;
}

/** Primary external destination for an episode's poster: TMDB, else TVDB. */
function posterLink(episode: WatchedEpisode): { href: string; label: string } | null {
  if (episode.showTmdbId !== undefined) {
    return { href: tmdbShowUrl(episode.showTmdbId), label: `${episode.showTitle} on The Movie Database` };
  }
  if (episode.showTvdbId !== undefined) {
    return { href: tvdbShowUrl(episode.showTvdbId), label: `${episode.showTitle} on TheTVDB` };
  }
  return null;
}

function EpisodeTile({ episode }: { episode: WatchedEpisode }) {
  const date = episode.watchedAt ? dayjs(episode.watchedAt) : null;
  const target = posterLink(episode);
  const poster = (
    <div className="relative">
      <PosterArt episode={episode} />
      {(episode.seasonNumber !== undefined || episode.episodeNumber !== undefined) && (
        <span className="retro-badge retro-badge-muted">{episodeLabel(episode)}</span>
      )}
    </div>
  );

  return (
    <li className={`${TILE_WIDTH} shrink-0 snap-start`}>
      {target ? (
        <a
          className="block transition-transform hover:-translate-y-0.5"
          href={target.href}
          target="_blank"
          rel="noreferrer"
          aria-label={target.label}
        >
          {poster}
        </a>
      ) : (
        poster
      )}

      <div className="mt-2 flex min-w-0 flex-col gap-0.5 px-0.5">
        <p className="tile-title" title={episode.showTitle}>
          {episode.showTitle}
        </p>
        <p className="tile-sub" title={episode.episodeTitle || undefined}>
          {episode.episodeTitle}
        </p>
        <span className="retro-eyebrow mt-1 min-h-4 text-muted-foreground">
          {date?.isValid() ? date.format("MMM D, YYYY") : ""}
        </span>
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
 * Latest watched TV episodes from the Scrob instance. The same-origin proxy
 * does the reading, parsing and hour-long caching, so the instance isn't hit
 * per visitor and only display fields reach the browser.
 */
export default function RecentlyWatched() {
  const [state, setState] = useState<{ status: FeedStatus; episodes: WatchedEpisode[] }>({
    status: "loading",
    episodes: [],
  });

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const timeout = window.setTimeout(() => controller.abort(), 15_000);

    const load = async () => {
      const response = await fetch(SCROB_PROXY_PATH, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`Feed responded with ${response.status}`);
      }
      const json = (await response.json()) as {
        configured?: boolean;
        episodes?: WatchedEpisode[];
      };
      if (cancelled) return;

      if (json.configured === false) {
        setState({ status: "hidden", episodes: [] });
        return;
      }
      setState({ status: "ready", episodes: json.episodes ?? [] });
    };

    load()
      .catch(() => {
        if (cancelled) return;
        setState({ status: "error", episodes: [] });
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
      id="watching"
      title="watching"
      blurb="one card per show — the most recent episode i've watched of each, from my scrob instance"
      ariaLabel="Recently watched on Scrob"
      status={state.status}
      isEmpty={state.episodes.length === 0}
      errorText="couldn't reach my scrob instance right now."
      emptyText="nothing watched recently — the couch is gathering dust."
      fallbackLink={{ href: SCROB_ORIGIN, label: "open scrob \u2197" }}
      moreLink={{ href: SCROB_HISTORY_URL, label: "more on scrob \u2192" }}
      skeleton={Array.from({ length: 5 }).map((_, index) => (
        <SkeletonTile key={index} />
      ))}
    >
      {state.episodes.map((episode, index) => (
        <EpisodeTile
          key={`${episode.showTitle}-${episode.watchedAt ?? index}`}
          episode={episode}
        />
      ))}
    </FeedSection>
  );
}
