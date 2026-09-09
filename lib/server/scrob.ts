/**
 * Scrob reader: builds the credentialed requests and normalises the payloads
 * into the client-safe shapes declared in `lib/scrob.ts`.
 *
 * SERVER ONLY — see the note at the top of `lib/server/upstream.ts`.
 *
 * Scrob is exposed through its Astro frontend at `/api/proxy/*`, which forwards
 * to the private FastAPI backend; auth is a per-user API key. If the instance
 * sits behind a private CA (e.g. Caddy's local CA), set `SCROB_CA_CERT` to that
 * root certificate — it is added to the trust store for the request, and
 * verification is never switched off, because the key travels on it.
 */

import { ACTIVITY_DAYS, type ActivitySummary } from "../feeds";
import {
  SCROB_ORIGIN,
  seasonEpisodeLabel,
  type NowWatchingFeed,
  type RecentShowsFeed,
  type WatchSession,
  type WatchStats,
  type WatchStatsFeed,
  type WatchedEpisode,
} from "../scrob";
import { asAbsoluteUrl, asNumber, asRecord, asString } from "../utils/records";
import { buildActivitySummary, dailyWindowChunks, isoDate } from "./activity";
import {
  LIVE_REVALIDATE_SECONDS,
  assertServerOnly,
  fetchFeedJson,
  resolveUpstreamUrl,
} from "./upstream";

assertServerOnly();

/** Scrob only buckets `/stats` by day when the range is this many days or less. */
const MAX_DAILY_WINDOW_DAYS = 60;

/** True once the API key (and, where needed, the user id) is configured. */
export function isScrobConfigured(): boolean {
  return Boolean(process.env.SCROB_API_KEY);
}

/** The recently-watched and stats feeds are per-profile, so they need the id too. */
export function isScrobProfileConfigured(): boolean {
  return Boolean(process.env.SCROB_API_KEY && process.env.SCROB_USER_ID);
}

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

/**
 * Normalises the `/history/now-playing` payload: `{ now_playing: [...] }`, one
 * entry per active Plex/Jellyfin/Kodi playback session.
 */
export function parseNowWatching(json: unknown): WatchSession[] {
  const root = asRecord(json);
  const rawSessions = Array.isArray(root?.now_playing) ? root.now_playing : [];

  return rawSessions.flatMap((entryRaw): WatchSession[] => {
    const entry = asRecord(entryRaw);
    const media = asRecord(entry?.media);
    const sessionKey = asString(entry?.session_key);
    if (!entry || !media || !sessionKey) {
      return [];
    }

    const showTitle = asString(media.show_title);

    return [
      {
        sessionKey,
        state: asString(entry.state) ?? "playing",
        progressPercent: asNumber(entry.progress_percent) ?? 0,
        title: showTitle ?? asString(media.title) ?? "",
        subtitle: showTitle
          ? seasonEpisodeLabel(asNumber(media.season_number), asNumber(media.episode_number))
          : undefined,
        posterPath: resolvePoster(showTitle ? media.show_poster_path : media.poster_path),
        showTmdbId: asNumber(media.show_tmdb_id),
        showTvdbId: asNumber(media.show_tvdb_id),
      },
    ];
  });
}

/** Normalises the all-time slice of Scrob's `/profile/{id}/stats` payload. */
export function parseWatchStats(json: unknown): WatchStats | undefined {
  const root = asRecord(json);
  if (!root || typeof root.movies_watched !== "number") {
    return undefined;
  }
  return {
    moviesWatched: root.movies_watched,
    showsWatched: asNumber(root.shows_watched) ?? 0,
    episodesWatched: asNumber(root.episodes_watched) ?? 0,
    totalWatchMinutes: asNumber(root.total_watch_minutes) ?? 0,
  };
}

/**
 * Folds Scrob's sparse `watch_activity` rows — only days with a watch appear —
 * into the zero-filled window the heatmap renders, counting movies and episodes
 * together. Scrob computes neither a streak nor an active-day count itself.
 */
export function buildWatchActivity(
  json: unknown,
  days: number = ACTIVITY_DAYS,
  today?: Date
): ActivitySummary {
  const root = asRecord(json);
  const rows = Array.isArray(root?.watch_activity) ? root.watch_activity : [];

  const watchesByDate = new Map<string, number>();
  for (const rowRaw of rows) {
    const row = asRecord(rowRaw);
    const date = asString(row?.month)?.slice(0, 10);
    if (!date) continue;
    const watches = (asNumber(row?.movies) ?? 0) + (asNumber(row?.episodes) ?? 0);
    watchesByDate.set(date, (watchesByDate.get(date) ?? 0) + watches);
  }

  return buildActivitySummary(watchesByDate, days, today);
}

/** Resolves the instance origin, the shared headers and the private-CA option. */
function scrobEndpoint() {
  const { origin } = resolveUpstreamUrl(process.env.SCROB_UPSTREAM_ORIGIN, SCROB_ORIGIN);

  return {
    url: (path: string) => `${origin}/api/proxy/${path}`,
    profilePath: `profile/${encodeURIComponent(process.env.SCROB_USER_ID ?? "")}`,
    headers: { Accept: "application/json", "X-Api-Key": process.env.SCROB_API_KEY ?? "" },
    caPath: process.env.SCROB_CA_CERT,
  };
}

/** The latest watched episode of each recently-watched show. */
export async function readRecentShows(): Promise<RecentShowsFeed> {
  const { url, profilePath, headers, caPath } = scrobEndpoint();

  const payload = await fetchFeedJson(url(`${profilePath}/recently-watched-shows?page=1`), {
    label: "scrob",
    headers,
    caPath,
  });

  return { episodes: parseRecentEpisodes(payload) };
}

/**
 * Active playback sessions. Unlike the profile feeds this endpoint resolves the
 * user from the API key alone, so `SCROB_USER_ID` isn't needed here.
 */
export async function readNowWatching(): Promise<NowWatchingFeed> {
  const { url, headers, caPath } = scrobEndpoint();

  const payload = await fetchFeedJson(url("history/now-playing"), {
    label: "scrob-now-playing",
    revalidateSeconds: LIVE_REVALIDATE_SECONDS,
    headers,
    caPath,
  });

  return { sessions: parseNowWatching(payload) };
}

/**
 * Lifetime watch counts plus the activity window.
 *
 * `/profile/{id}/stats` is a genuinely heavy endpoint — a dozen-plus aggregate
 * queries per call — so this is on the standard hourly budget like every other
 * non-live feed, and reads it as:
 *
 *  - one all-time call (no date range) for the headline counts
 *  - a handful of `MAX_DAILY_WINDOW_DAYS`-or-narrower calls covering the last
 *    `ACTIVITY_DAYS` days between them, because a wider single request silently
 *    falls back to monthly buckets
 *
 * Every call lands in the same hourly cache window on its own tag, and
 * concurrent visitors are coalesced by `fetchFeedJson`, so a burst of traffic
 * still costs Scrob one round of these per hour.
 */
export async function readWatchStats(): Promise<WatchStatsFeed> {
  const { url, profilePath, headers, caPath } = scrobEndpoint();
  const chunks = dailyWindowChunks(ACTIVITY_DAYS, MAX_DAILY_WINDOW_DAYS);

  const [allTime, ...windows] = await Promise.all([
    fetchFeedJson(url(`${profilePath}/stats`), {
      label: "scrob-stats:all-time",
      headers,
      caPath,
    }),
    ...chunks.map((chunk, index) =>
      fetchFeedJson(
        url(`${profilePath}/stats?since=${isoDate(chunk.since)}&until=${isoDate(chunk.until)}`),
        { label: `scrob-stats:activity:${index}`, headers, caPath }
      )
    ),
  ]);

  const watchActivity = windows.flatMap((payload) => {
    const rows = asRecord(payload)?.watch_activity;
    return Array.isArray(rows) ? rows : [];
  });

  return {
    stats: parseWatchStats(allTime) ?? null,
    activity: buildWatchActivity({ watch_activity: watchActivity }),
  };
}
