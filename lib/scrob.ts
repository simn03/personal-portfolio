/**
 * Client-safe Scrob contract: the shapes the proxy routes emit, the same-origin
 * paths the widgets read them from, and deep links out to TMDB / TheTVDB.
 *
 * Nothing here touches the Scrob API key or describes Scrob's own endpoints —
 * that lives in `lib/server/scrob.ts`, which never reaches the browser.
 */

import { type ActivitySummary } from "./feeds";

/** Overridable so local/dev can point elsewhere (see .env.local). */
export const SCROB_ORIGIN =
  process.env.NEXT_PUBLIC_SCROB_ORIGIN ?? "https://scrob.simrit.dev";

/** "Show more" opens the history page on the Scrob instance. */
export const SCROB_HISTORY_URL = `${SCROB_ORIGIN}/history`;

/** Same-origin backend proxies that read & cache the feeds server-side. */
export const SCROB_PROXY_PATH = "/api/scrob/recent-shows";
export const SCROB_NOW_PLAYING_PROXY_PATH = "/api/scrob/now-playing";
export const SCROB_STATS_PROXY_PATH = "/api/scrob/stats";

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

export type WatchSession = {
  sessionKey: string;
  /** "playing" | "paused", as reported by the media server webhook. */
  state: string;
  progressPercent: number;
  title: string;
  /** Episode-only: an `S1 · E80`-style label. */
  subtitle?: string;
  posterPath?: string;
  showTmdbId?: number;
  showTvdbId?: number;
};

export type WatchStats = {
  moviesWatched: number;
  showsWatched: number;
  episodesWatched: number;
  totalWatchMinutes: number;
};

/** `GET /api/scrob/recent-shows` */
export type RecentShowsFeed = { episodes: WatchedEpisode[] };

/** `GET /api/scrob/now-playing` */
export type NowWatchingFeed = { sessions: WatchSession[] };

/** `GET /api/scrob/stats` */
export type WatchStatsFeed = { stats: WatchStats | null; activity: ActivitySummary };

/**
 * The one season/episode label in the codebase — the recently-watched badge and
 * the now-watching banner both read from it, so they can never drift apart.
 */
export function seasonEpisodeLabel(
  seasonNumber: number | undefined,
  episodeNumber: number | undefined
): string | undefined {
  if (seasonNumber === undefined && episodeNumber === undefined) {
    return undefined;
  }
  if (seasonNumber === undefined) {
    return `E${episodeNumber}`;
  }
  return `S${seasonNumber} · E${episodeNumber ?? "?"}`;
}

export function episodeLabel(episode: WatchedEpisode): string {
  return seasonEpisodeLabel(episode.seasonNumber, episode.episodeNumber) ?? "episode";
}

/** Deep link to a show's page on The Movie Database. */
export function tmdbShowUrl(showTmdbId: number): string {
  return `https://www.themoviedb.org/tv/${showTmdbId}`;
}

/** Deep link to a show's page on TheTVDB. */
export function tvdbShowUrl(showTvdbId: number): string {
  return `https://www.thetvdb.com/dereferrer/series/${showTvdbId}`;
}
