/** Scrob instance + helpers for the recently-watched TV feed. */

import { asAbsoluteUrl, asNumber, asRecord, asString } from "./utils/records";

/** Overridable so local/dev can point elsewhere (see .env.local). */
export const SCROB_ORIGIN =
  process.env.NEXT_PUBLIC_SCROB_ORIGIN ?? "https://scrob.simrit.dev";

/** Same-origin backend proxy that reads & caches the feed server-side. */
export const SCROB_PROXY_PATH = "/api/scrob/recent-shows";

/** "Show more" opens the history page on the Scrob instance. */
export const SCROB_HISTORY_URL = `${SCROB_ORIGIN}/history`;

export type WatchedEpisode = {
  showTitle: string;
  episodeTitle: string;
  seasonNumber?: number;
  episodeNumber?: number;
  posterPath?: string;
  watchedAt?: string;
  showTmdbId?: number;
  showTvdbId?: number;
};

/** A full TMDB image URL (Scrob returns these pre-joined) or undefined. */
export function resolvePoster(path: unknown): string | undefined {
  return asAbsoluteUrl(path);
}

/**
 * Normalises the `/profile/{id}/recently-watched-shows` payload (one row per
 * show, carrying that show's latest watched episode) into display rows.
 */
export function parseRecentEpisodes(json: unknown): WatchedEpisode[] {
  const root = asRecord(json);
  const rawResults = Array.isArray(root?.results) ? root.results : [];
  if (rawResults.length === 0) {
    return [];
  }

  return rawResults.flatMap((entryRaw): WatchedEpisode[] => {
    const entry = asRecord(entryRaw);
    if (!entry || typeof entry.show_title !== "string") {
      return [];
    }
    return [
      {
        showTitle: entry.show_title,
        episodeTitle: asString(entry.title) ?? "",
        seasonNumber: asNumber(entry.season_number),
        episodeNumber: asNumber(entry.episode_number),
        posterPath: resolvePoster(entry.poster_path),
        watchedAt: asString(entry.watched_at),
        showTmdbId: asNumber(entry.show_tmdb_id),
        showTvdbId: asNumber(entry.show_tvdb_id),
      },
    ];
  });
}

export function episodeLabel(episode: WatchedEpisode): string {
  if (typeof episode.seasonNumber === "number" && typeof episode.episodeNumber === "number") {
    return `S${episode.seasonNumber} · E${episode.episodeNumber}`;
  }
  if (typeof episode.episodeNumber === "number") {
    return `E${episode.episodeNumber}`;
  }
  return "episode";
}

/** Deep link to a show's page on The Movie Database. */
export function tmdbShowUrl(showTmdbId: number): string {
  return `https://www.themoviedb.org/tv/${showTmdbId}`;
}

/** Deep link to a show's page on TheTVDB. */
export function tvdbShowUrl(showTvdbId: number): string {
  return `https://www.thetvdb.com/dereferrer/series/${showTvdbId}`;
}
