"use client";

import dayjs from "dayjs";
import { Clapperboard } from "lucide-react";
import {
  SCROB_HISTORY_URL,
  SCROB_ORIGIN,
  SCROB_PROXY_PATH,
  episodeLabel,
  tmdbShowUrl,
  tvdbShowUrl,
  type RecentShowsFeed,
  type WatchedEpisode,
} from "@/lib/scrob";
import { useFeed } from "../../hooks/useFeed";
import CoverArt from "../feed/CoverArt.component";
import FeedSection from "../feed/FeedSection.component";
import MediaTile, { TILE_ASPECT } from "../feed/MediaTile.component";
import { tileSkeletons } from "../feed/TileSkeleton.component";
import NowWatching from "./NowWatching.component";

/** Primary external destination for a show: TMDB, else TheTVDB, else nothing. */
function showLink(episode: WatchedEpisode): { href: string; label: string } | undefined {
  if (episode.showTmdbId !== undefined) {
    return {
      href: tmdbShowUrl(episode.showTmdbId),
      label: `${episode.showTitle} on The Movie Database`,
    };
  }
  if (episode.showTvdbId !== undefined) {
    return { href: tvdbShowUrl(episode.showTvdbId), label: `${episode.showTitle} on TheTVDB` };
  }
  return undefined;
}

function EpisodeTile({ episode }: { episode: WatchedEpisode }) {
  const date = episode.watchedAt ? dayjs(episode.watchedAt) : null;
  const link = showLink(episode);
  const hasNumbering =
    episode.seasonNumber !== undefined || episode.episodeNumber !== undefined;

  return (
    <MediaTile
      href={link?.href}
      coverLabel={link?.label}
      title={episode.showTitle}
      badge={hasNumbering ? episodeLabel(episode) : undefined}
      cover={
        <CoverArt
          src={episode.posterPath}
          alt={`${episode.showTitle} poster`}
          icon={Clapperboard}
          className={TILE_ASPECT.poster}
          sizes="(max-width: 640px) 10rem, 11rem"
        />
      }
      subtitle={episode.episodeTitle}
      subtitleTitle={episode.episodeTitle || undefined}
      footer={
        <span className="retro-eyebrow mt-1 min-h-4 text-muted-foreground">
          {date?.isValid() ? date.format("MMM D, YYYY") : ""}
        </span>
      }
    />
  );
}

/**
 * Latest watched TV episodes from the Scrob instance — one card per show,
 * carrying that show's most recent episode. The same-origin proxy does the
 * reading, parsing and hour-long caching, so the instance isn't hit per visitor
 * and only display fields reach the browser.
 */
export default function RecentlyWatched() {
  const { status, data } = useFeed<RecentShowsFeed>(SCROB_PROXY_PATH);
  const episodes = data?.episodes ?? [];

  return (
    <FeedSection
      id="watching"
      title="watching"
      blurb="one card per show — the most recent episode i've watched of each, from my scrob instance"
      ariaLabel="Recently watched on Scrob"
      status={status}
      isEmpty={episodes.length === 0}
      errorText="couldn't reach my scrob instance right now."
      emptyText="nothing watched recently — the couch is gathering dust."
      fallbackLink={{ href: SCROB_ORIGIN, label: "open scrob ↗" }}
      moreLink={{ href: SCROB_HISTORY_URL, label: "more on scrob →" }}
      beforeItems={<NowWatching />}
      skeleton={tileSkeletons(5, "poster")}
    >
      {episodes.map((episode, index) => (
        <EpisodeTile
          key={`${episode.showTitle}-${episode.watchedAt ?? index}`}
          episode={episode}
        />
      ))}
    </FeedSection>
  );
}
