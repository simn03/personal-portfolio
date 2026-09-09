/**
 * Client-safe Koito contract: the shapes the proxy routes emit, the same-origin
 * paths the widgets read them from, and deep links back to the instance.
 *
 * Nothing here touches a credential or describes Koito's own API — the request
 * building and payload parsing live in `lib/server/koito.ts`, which never
 * reaches the browser.
 */

import { type ActivitySummary } from "./feeds";

/** Overridable so local dev can point at a LAN Koito (see .env.local). */
export const KOITO_ORIGIN =
  process.env.NEXT_PUBLIC_KOITO_ORIGIN ?? "https://koito.simrit.dev";

export const WEEKLY_PERIOD = "week";

/** "See more" points at the weekly chart on the Koito instance. */
export const KOITO_WEEKLY_CHART_URL = `${KOITO_ORIGIN}/chart/top/tracks?period=${WEEKLY_PERIOD}&limit=100`;

/**
 * Same-origin proxies that read the feeds server-side, so the optional
 * `KOITO_API_KEY` (needed only when Koito's login gate is on) never reaches the
 * client and the instance is asked on a fixed schedule rather than per visitor.
 */
export const KOITO_PROXY_PATH = "/api/koito/top-weekly";
export const KOITO_NOW_PLAYING_PROXY_PATH = "/api/koito/now-playing";
export const KOITO_STATS_PROXY_PATH = "/api/koito/stats";

export type WeeklyArtist = {
  name: string;
  /** Koito artist id (for deep links back to the instance). */
  koitoId?: number;
  musicbrainzId?: string;
};

export type WeeklyTrack = {
  /** Koito track id (for deep links back to the instance). */
  koitoId?: number;
  rank: number;
  title: string;
  artists: WeeklyArtist[];
  /** Recording MBID, when Koito has linked one. */
  trackMusicbrainzId?: string;
  coverUrl?: string;
  plays?: number;
};

export type NowPlayingTrack = {
  koitoId: number;
  title: string;
  artists: WeeklyArtist[];
  coverUrl?: string;
};

export type KoitoStats = {
  listenCount: number;
  trackCount: number;
  albumCount: number;
  artistCount: number;
  minutesListened: number;
  daysActive: number;
  longestStreak: number;
  avgDailyPlays: number;
};

/** `GET /api/koito/top-weekly` */
export type WeeklyFeed = { tracks: WeeklyTrack[] };

/** `GET /api/koito/now-playing` */
export type NowPlayingFeed = { track: NowPlayingTrack | null };

/** `GET /api/koito/stats` */
export type MusicStatsFeed = {
  stats: KoitoStats | null;
  activity: ActivitySummary;
  /** ISO date of the first scrobble Koito has, for the "since …" caption. */
  listeningSince: string | null;
};

export function musicbrainzRecordingUrl(mbid: string): string {
  return `https://musicbrainz.org/recording/${mbid}`;
}

export function musicbrainzArtistUrl(mbid: string): string {
  return `https://musicbrainz.org/artist/${mbid}`;
}

/** Deep link to a track's page on the Koito instance. */
export function koitoTrackUrl(trackId: number): string {
  return `${KOITO_ORIGIN}/track/${trackId}`;
}

/** Deep link to an artist's page on the Koito instance. */
export function koitoArtistUrl(artistId: number): string {
  return `${KOITO_ORIGIN}/artist/${artistId}`;
}
