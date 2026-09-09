/** Koito instance + helpers for reading the weekly favourites feed. */

import { asNumber, asRecord, asString } from "./utils/records";

/** Overridable so local dev can point at a LAN Koito (see .env.local). */
export const KOITO_ORIGIN =
  process.env.NEXT_PUBLIC_KOITO_ORIGIN ?? "https://koito.simrit.dev";
export const WEEKLY_PERIOD = "week";

/**
 * Same-origin proxy that reads the feed server-side. Optional: only useful if
 * Koito's login gate is on (the proxy authenticates with `KOITO_API_KEY`).
 */
export const KOITO_PROXY_PATH = "/api/koito/top-weekly";

/** "See more" points at the weekly chart on the Koito instance. */
export const KOITO_WEEKLY_CHART_URL = `${KOITO_ORIGIN}/chart/top/tracks?period=${WEEKLY_PERIOD}&limit=100`;

const MBID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidMbid(value: unknown): value is string {
  return typeof value === "string" && MBID_PATTERN.test(value);
}

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

/**
 * Normalises the `/top/tracks` payload into display-ready rows. Tolerates both
 * the ranked wrapper `{ item, rank }` and a flat list, and survives optional
 * fields Koito may omit.
 */
export function parseWeeklyPayload(json: unknown): WeeklyTrack[] {
  const root = asRecord(json);
  const rawItems = Array.isArray(root?.items) ? root.items : [];
  if (rawItems.length === 0) {
    return [];
  }

  return rawItems.flatMap((entryRaw, index): WeeklyTrack[] => {
    const entry = asRecord(entryRaw);
    if (!entry) {
      return [];
    }

    const wrapped = asRecord(entry.item);
    const item = wrapped ?? entry;
    if (typeof item.title !== "string") {
      return [];
    }

    const rankValue = entry.rank;
    const artists = Array.isArray(item.artists) ? item.artists : [];
    const cover = asRecord(item.image);

    return [
      {
        koitoId: typeof item.id === "number" ? item.id : undefined,
        rank: typeof rankValue === "number" ? rankValue : index + 1,
        title: item.title,
        artists: artists.flatMap((artistRaw): WeeklyArtist[] => {
          const artist = asRecord(artistRaw);
          return artist && typeof artist.name === "string"
            ? [
                {
                  name: artist.name,
                  koitoId: asNumber(artist.id),
                  musicbrainzId: isValidMbid(artist.musicbrainz_id)
                    ? artist.musicbrainz_id
                    : undefined,
                },
              ]
            : [];
        }),
        trackMusicbrainzId: isValidMbid(item.musicbrainz_id)
          ? item.musicbrainz_id
          : undefined,
        coverUrl: resolveCoverUrl(cover?.medium ?? cover?.small),
        plays: asNumber(item.listen_count),
      },
    ];
  });
}

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
