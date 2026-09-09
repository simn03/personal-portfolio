import { describe, expect, it } from "vitest";
import { ACTIVITY_DAYS } from "../feeds";
import { KOITO_ORIGIN } from "../koito";
import {
  isValidMbid,
  parseFirstActivity,
  parseListenActivity,
  parseNowPlayingTrack,
  parseStats,
  parseWeeklyPayload,
  resolveCoverUrl,
} from "./koito";

const MBID = "b7ffd2af-418f-4be2-bdd1-22f8b48613da";

describe("isValidMbid", () => {
  it("accepts canonical uuids", () => {
    expect(isValidMbid(MBID)).toBe(true);
  });

  it("rejects non-strings and invalid values", () => {
    expect(isValidMbid(null)).toBe(false);
    expect(isValidMbid("not-a-mbid")).toBe(false);
    expect(isValidMbid("")).toBe(false);
  });
});

describe("resolveCoverUrl", () => {
  it("prefixes relative Koito image paths", () => {
    expect(resolveCoverUrl("/image/medium/abc-123")).toBe(`${KOITO_ORIGIN}/image/medium/abc-123`);
  });

  it("keeps absolute urls untouched", () => {
    expect(resolveCoverUrl("https://example.com/c.png")).toBe("https://example.com/c.png");
  });

  it("returns undefined for empty/missing values", () => {
    expect(resolveCoverUrl("")).toBeUndefined();
    expect(resolveCoverUrl(undefined)).toBeUndefined();
  });
});

describe("parseWeeklyPayload", () => {
  it("normalises the ranked payload shape", () => {
    const json = {
      items: [
        {
          rank: 1,
          item: {
            id: 10,
            title: "Never Gonna Give You Up",
            musicbrainz_id: MBID,
            listen_count: 42,
            artists: [{ id: 1, name: "Rick Astley" }],
            image: { medium: "/image/medium/cover-1", small: "/image/small/cover-1" },
          },
        },
        {
          rank: 2,
          item: {
            id: 11,
            title: "No Artist / No Cover",
            artists: [],
            image: { medium: "" },
          },
        },
      ],
    };

    expect(parseWeeklyPayload(json)).toEqual([
      {
        koitoId: 10,
        rank: 1,
        title: "Never Gonna Give You Up",
        artists: [{ name: "Rick Astley", koitoId: 1, musicbrainzId: undefined }],
        trackMusicbrainzId: MBID,
        coverUrl: `${KOITO_ORIGIN}/image/medium/cover-1`,
        plays: 42,
      },
      {
        koitoId: 11,
        rank: 2,
        title: "No Artist / No Cover",
        artists: [],
        trackMusicbrainzId: undefined,
        coverUrl: undefined,
        plays: undefined,
      },
    ]);
  });

  it("handles a flat (non-ranked) payload and missing fields", () => {
    const json = { items: [{ title: "Loose Track" }] };
    const [track] = parseWeeklyPayload(json);
    expect(track).toMatchObject({ rank: 1, title: "Loose Track", artists: [] });
  });

  it("returns an empty list for unexpected payloads", () => {
    expect(parseWeeklyPayload(null)).toEqual([]);
    expect(parseWeeklyPayload({ items: "nope" })).toEqual([]);
  });

  it("drops rows that have no title", () => {
    const json = { items: [{ item: { rank: 3 } }, { item: { title: "OK", rank: 4 } }] };
    const parsed = parseWeeklyPayload(json);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe("OK");
  });
});

describe("parseNowPlayingTrack", () => {
  it("normalises a currently-playing track", () => {
    const json = {
      currently_playing: true,
      track: {
        id: 5,
        title: "Africa",
        artists: [{ id: 2, name: "Toto" }],
        image: { medium: "/image/medium/cover-5" },
      },
    };
    expect(parseNowPlayingTrack(json)).toEqual({
      koitoId: 5,
      title: "Africa",
      artists: [{ name: "Toto", koitoId: 2 }],
      coverUrl: `${KOITO_ORIGIN}/image/medium/cover-5`,
    });
  });

  it("returns undefined when nothing is playing or the payload is malformed", () => {
    expect(parseNowPlayingTrack({ currently_playing: false })).toBeUndefined();
    expect(parseNowPlayingTrack({ currently_playing: true })).toBeUndefined();
    expect(parseNowPlayingTrack(null)).toBeUndefined();
  });
});

describe("parseStats", () => {
  it("normalises the stats payload", () => {
    const json = {
      listen_count: 1000,
      track_count: 200,
      album_count: 50,
      artist_count: 30,
      minutes_listened: 4000,
      days_active: 90,
      longest_streak: 12,
      avg_daily_plays: 11.1,
    };
    expect(parseStats(json)).toEqual({
      listenCount: 1000,
      trackCount: 200,
      albumCount: 50,
      artistCount: 30,
      minutesListened: 4000,
      daysActive: 90,
      longestStreak: 12,
      avgDailyPlays: 11.1,
    });
  });

  it("returns undefined for a malformed payload", () => {
    expect(parseStats(null)).toBeUndefined();
    expect(parseStats({ error: "unauthorized" })).toBeUndefined();
  });
});

describe("parseListenActivity", () => {
  const today = new Date("2026-09-02T09:00:00Z");

  it("lands Koito's rows on the shared zero-filled window", () => {
    const json = {
      activity: [
        { start_time: "2026-09-01T00:00:00Z", listens: 3 },
        { start_time: "2026-09-02T00:00:00Z", listens: 0 },
      ],
      streak: 7,
    };

    const activity = parseListenActivity(json, 3, today);

    expect(activity.points).toEqual([
      { date: "2026-08-31", value: 0 },
      { date: "2026-09-01", value: 3 },
      { date: "2026-09-02", value: 0 },
    ]);
    expect(activity.daysActive).toBe(1);
  });

  it("defaults to the shared window length", () => {
    expect(parseListenActivity({}, undefined, today).points).toHaveLength(ACTIVITY_DAYS);
  });

  it("prefers Koito's own streak, which spans its whole history", () => {
    const json = { activity: [{ start_time: "2026-09-01T00:00:00Z", listens: 3 }], streak: 7 };
    expect(parseListenActivity(json, 3, today).streak).toBe(7);
  });

  it("handles missing/malformed payloads", () => {
    for (const json of [null, { activity: "nope" }]) {
      const activity = parseListenActivity(json, 2, today);
      expect(activity.streak).toBe(0);
      expect(activity.daysActive).toBe(0);
      expect(activity.points).toEqual([
        { date: "2026-09-01", value: 0 },
        { date: "2026-09-02", value: 0 },
      ]);
    }
  });
});

describe("parseFirstActivity", () => {
  it("extracts the first-listen timestamp", () => {
    expect(parseFirstActivity({ time: "2020-01-01T00:00:00Z" })).toBe("2020-01-01T00:00:00Z");
  });

  it("returns undefined for a malformed payload", () => {
    expect(parseFirstActivity(null)).toBeUndefined();
  });
});
