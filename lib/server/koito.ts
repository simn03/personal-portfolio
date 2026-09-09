/**
 * Koito reader: builds the credentialed requests and normalises the payloads
 * into the client-safe shapes declared in `lib/koito.ts`.
 *
 * SERVER ONLY — see the note at the top of `lib/server/upstream.ts`.
 */

import { ACTIVITY_DAYS, type ActivitySummary } from "../feeds";
import {
  KOITO_ORIGIN,
  WEEKLY_PERIOD,
  type KoitoStats,
  type MusicStatsFeed,
  type NowPlayingFeed,
  type NowPlayingTrack,
  type WeeklyArtist,
  type WeeklyFeed,
  type WeeklyTrack,
} from "../koito";
import { asNumber, asRecord, asString } from "../utils/records";
import { buildActivitySummary } from "./activity";
import {
  LIVE_REVALIDATE_SECONDS,
  assertServerOnly,
  fetchFeedJson,
  resolveUpstreamUrl,
} from "./upstream";

assertServerOnly();

/** Tracks shown in the weekly row. */
const WEEKLY_LIMIT = 8;

/** Koito's stats endpoint takes a period; the widget reports lifetime numbers. */
const STATS_PERIOD = "all_time";

const MBID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidMbid(value: unknown): value is string {
  return typeof value === "string" && MBID_PATTERN.test(value);
}

/** Turns a Koito image URL/path into an absolute URL (falls back to none). */
export function resolveCoverUrl(rawUrl: unknown): string | undefined {
  const url = asString(rawUrl)?.trim();
  if (!url) {
    return undefined;
  }
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  if (url.startsWith("/image/") || url.startsWith("/")) {
    return `${KOITO_ORIGIN}${url}`;
  }
  return url;
}

/** Koito nests artists identically on tracks and now-playing entries. */
function parseArtists(raw: unknown): WeeklyArtist[] {
  const artists = Array.isArray(raw) ? raw : [];
  return artists.flatMap((artistRaw): WeeklyArtist[] => {
    const artist = asRecord(artistRaw);
    if (!artist || typeof artist.name !== "string") {
      return [];
    }
    return [
      {
        name: artist.name,
        koitoId: asNumber(artist.id),
        musicbrainzId: isValidMbid(artist.musicbrainz_id) ? artist.musicbrainz_id : undefined,
      },
    ];
  });
}

/** Koito serves cover art at three sizes; the tiles want the middle one. */
function parseCover(raw: unknown): string | undefined {
  const cover = asRecord(raw);
  return resolveCoverUrl(cover?.medium ?? cover?.small);
}

/**
 * Normalises the `/top/tracks` payload into display-ready rows. Tolerates both
 * the ranked wrapper `{ item, rank }` and a flat list, and survives optional
 * fields Koito may omit.
 */
export function parseWeeklyPayload(json: unknown): WeeklyTrack[] {
  const root = asRecord(json);
  const rawItems = Array.isArray(root?.items) ? root.items : [];

  return rawItems.flatMap((entryRaw, index): WeeklyTrack[] => {
    const entry = asRecord(entryRaw);
    if (!entry) {
      return [];
    }

    const item = asRecord(entry.item) ?? entry;
    if (typeof item.title !== "string") {
      return [];
    }

    return [
      {
        koitoId: asNumber(item.id),
        rank: asNumber(entry.rank) ?? index + 1,
        title: item.title,
        artists: parseArtists(item.artists),
        trackMusicbrainzId: isValidMbid(item.musicbrainz_id) ? item.musicbrainz_id : undefined,
        coverUrl: parseCover(item.image),
        plays: asNumber(item.listen_count),
      },
    ];
  });
}

/** Normalises the `/now-playing` payload: `{ currently_playing, track }`. */
export function parseNowPlayingTrack(json: unknown): NowPlayingTrack | undefined {
  const root = asRecord(json);
  if (!root?.currently_playing) {
    return undefined;
  }

  const track = asRecord(root.track);
  if (!track || typeof track.title !== "string" || typeof track.id !== "number") {
    return undefined;
  }

  return {
    koitoId: track.id,
    title: track.title,
    artists: parseArtists(track.artists),
    coverUrl: parseCover(track.image),
  };
}

/** Normalises the `/stats` payload (see `StatsResponse` in Koito's Go handler). */
export function parseStats(json: unknown): KoitoStats | undefined {
  const root = asRecord(json);
  if (!root || typeof root.listen_count !== "number") {
    return undefined;
  }
  return {
    listenCount: root.listen_count,
    trackCount: asNumber(root.track_count) ?? 0,
    albumCount: asNumber(root.album_count) ?? 0,
    artistCount: asNumber(root.artist_count) ?? 0,
    minutesListened: asNumber(root.minutes_listened) ?? 0,
    daysActive: asNumber(root.days_active) ?? 0,
    longestStreak: asNumber(root.longest_streak) ?? 0,
    avgDailyPlays: asNumber(root.avg_daily_plays) ?? 0,
  };
}

/**
 * Normalises `/listen-activity` (`{ activity: [{ start_time, listens }] }`)
 * onto the shared heatmap shape. Koito zero-fills and reports its own streak,
 * but the window is rebuilt here anyway so all three widgets agree on length
 * and on how a streak is counted.
 */
export function parseListenActivity(
  json: unknown,
  days: number = ACTIVITY_DAYS,
  today?: Date
): ActivitySummary {
  const root = asRecord(json);
  const rows = Array.isArray(root?.activity) ? root.activity : [];

  const listensByDate = new Map<string, number>();
  for (const rowRaw of rows) {
    const row = asRecord(rowRaw);
    const date = asString(row?.start_time)?.slice(0, 10);
    if (!date) continue;
    listensByDate.set(date, (listensByDate.get(date) ?? 0) + (asNumber(row?.listens) ?? 0));
  }

  const summary = buildActivitySummary(listensByDate, days, today);
  // Koito counts the streak across its whole history, not just this window.
  return { ...summary, streak: asNumber(root?.streak) ?? summary.streak };
}

/** Normalises the `/first-activity` payload: `{ time }`, an ISO date/time. */
export function parseFirstActivity(json: unknown): string | undefined {
  return asString(asRecord(json)?.time);
}

/** Resolves the instance origin and the headers every Koito read shares. */
function koitoEndpoint() {
  const { origin } = resolveUpstreamUrl(process.env.KOITO_UPSTREAM_ORIGIN, KOITO_ORIGIN);
  const apiKey = process.env.KOITO_API_KEY;

  return {
    url: (path: string) => `${origin}/apis/web/v1/${path}`,
    headers: {
      Accept: "application/json",
      ...(apiKey ? { Authorization: `Token ${apiKey}` } : {}),
    },
  };
}

/** The current week's most-played tracks. */
export async function readWeeklyTracks(): Promise<WeeklyFeed> {
  const { url, headers } = koitoEndpoint();

  const payload = await fetchFeedJson(
    url(`top/tracks?limit=${WEEKLY_LIMIT}&period=${WEEKLY_PERIOD}&page=0`),
    { label: "koito", headers }
  );

  return { tracks: parseWeeklyPayload(payload).slice(0, WEEKLY_LIMIT) };
}

/** What's playing right now, if anything. */
export async function readNowPlaying(): Promise<NowPlayingFeed> {
  const { url, headers } = koitoEndpoint();

  const payload = await fetchFeedJson(url("now-playing"), {
    label: "koito-now-playing",
    revalidateSeconds: LIVE_REVALIDATE_SECONDS,
    headers,
  });

  return { track: parseNowPlayingTrack(payload) ?? null };
}

/**
 * Lifetime counts, the activity window and the first-scrobble date, combined
 * into the one payload the stats widget needs so the browser makes a single
 * request instead of three.
 */
export async function readMusicStats(): Promise<MusicStatsFeed> {
  const { url, headers } = koitoEndpoint();

  const [stats, activity, firstActivity] = await Promise.all([
    fetchFeedJson(url(`stats?period=${STATS_PERIOD}`), { label: "koito-stats", headers }),
    fetchFeedJson(url(`listen-activity?step=day&range=${ACTIVITY_DAYS}`), {
      label: "koito-activity",
      headers,
    }),
    fetchFeedJson(url("first-activity"), { label: "koito-first-activity", headers }),
  ]);

  return {
    stats: parseStats(stats) ?? null,
    activity: parseListenActivity(activity),
    listeningSince: parseFirstActivity(firstActivity) ?? null,
  };
}
