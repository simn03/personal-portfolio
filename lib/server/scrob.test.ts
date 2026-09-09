import { describe, expect, it } from "vitest";
import { ACTIVITY_DAYS } from "../feeds";
import {
  buildWatchActivity,
  parseNowWatching,
  parseRecentEpisodes,
  parseWatchStats,
  resolvePoster,
} from "./scrob";

const payload = {
  page: 1,
  total_pages: 1,
  total_results: 2,
  results: [
    {
      episode_number: 80,
      media_type: "episode",
      poster_path: "https://image.tmdb.org/t/p/w500/oHqYrPAsIiTD5m4DuxumV4er8BU.jpg",
      season_number: 1,
      show_title: "Re:ZERO -Starting Life in Another World-",
      show_tmdb_id: 65942,
      show_tvdb_id: 305089,
      title: "Episode 80",
      tmdb_id: 7130164,
      watched_at: "2026-09-09T03:52:22.671150",
    },
    {
      episode_number: 2,
      media_type: "episode",
      poster_path: null,
      season_number: 2,
      show_title: "Saga of Tanya the Evil",
      show_tmdb_id: 69346,
      show_tvdb_id: null,
      title: "A Strange Friendship",
      tmdb_id: 7483284,
      watched_at: "2026-07-16T00:56:00",
    },
  ],
};

describe("resolvePoster", () => {
  it("accepts absolute image urls", () => {
    expect(resolvePoster("https://image.tmdb.org/t/p/w500/x.jpg")).toBe(
      "https://image.tmdb.org/t/p/w500/x.jpg"
    );
  });

  it("returns undefined for null/relative/other values", () => {
    expect(resolvePoster(null)).toBeUndefined();
    expect(resolvePoster("/local.jpg")).toBeUndefined();
    expect(resolvePoster(undefined)).toBeUndefined();
  });
});

describe("parseRecentEpisodes", () => {
  it("normalises the scrob recently-watched payload", () => {
    const parsed = parseRecentEpisodes(payload);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toMatchObject({
      showTitle: "Re:ZERO -Starting Life in Another World-",
      episodeTitle: "Episode 80",
      seasonNumber: 1,
      episodeNumber: 80,
      posterPath: "https://image.tmdb.org/t/p/w500/oHqYrPAsIiTD5m4DuxumV4er8BU.jpg",
      watchedAt: "2026-09-09T03:52:22.671150",
      showTmdbId: 65942,
      showTvdbId: 305089,
    });
    expect(parsed[1].posterPath).toBeUndefined();
    expect(parsed[1].showTvdbId).toBeUndefined();
  });

  it("skips rows without a show title and handles empty payloads", () => {
    expect(parseRecentEpisodes({ results: [{ title: "orphan" }] })).toEqual([]);
    expect(parseRecentEpisodes(null)).toEqual([]);
    expect(parseRecentEpisodes({ results: [] })).toEqual([]);
  });
});

describe("parseNowWatching", () => {
  it("normalises an active episode session", () => {
    const json = {
      now_playing: [
        {
          session_key: "plex-123",
          source: "plex",
          state: "playing",
          progress_percent: 42.5,
          progress_seconds: 600,
          media: {
            id: 1,
            type: "episode",
            title: "Episode 80",
            season_number: 1,
            episode_number: 80,
            show_title: "Re:ZERO",
            show_poster_path: "https://image.tmdb.org/t/p/w500/rezero.jpg",
            show_tmdb_id: 65942,
          },
        },
      ],
    };
    expect(parseNowWatching(json)).toEqual([
      {
        sessionKey: "plex-123",
        state: "playing",
        progressPercent: 42.5,
        title: "Re:ZERO",
        subtitle: "S1 · E80",
        posterPath: "https://image.tmdb.org/t/p/w500/rezero.jpg",
        showTmdbId: 65942,
        showTvdbId: undefined,
      },
    ]);
  });

  it("falls back to the media title for a movie session", () => {
    const json = {
      now_playing: [
        {
          session_key: "jellyfin-9",
          state: "paused",
          progress_percent: 10,
          media: {
            id: 2,
            type: "movie",
            title: "Arrival",
            poster_path: "https://image.tmdb.org/t/p/w500/a.jpg",
          },
        },
      ],
    };
    const [session] = parseNowWatching(json);
    expect(session).toMatchObject({
      title: "Arrival",
      subtitle: undefined,
      posterPath: "https://image.tmdb.org/t/p/w500/a.jpg",
    });
  });

  it("handles empty/malformed payloads", () => {
    expect(parseNowWatching(null)).toEqual([]);
    expect(parseNowWatching({ now_playing: [{ media: {} }] })).toEqual([]);
    expect(parseNowWatching({ now_playing: "nope" })).toEqual([]);
  });
});

describe("parseWatchStats", () => {
  it("normalises the all-time slice of the stats payload", () => {
    const json = {
      movies_watched: 120,
      shows_watched: 40,
      episodes_watched: 900,
      total_watch_minutes: 54000,
      // Fields this widget doesn't use, present on the real payload.
      top_movie_genres: [],
      rating_distribution: [],
    };
    expect(parseWatchStats(json)).toEqual({
      moviesWatched: 120,
      showsWatched: 40,
      episodesWatched: 900,
      totalWatchMinutes: 54000,
    });
  });

  it("returns undefined for a malformed payload", () => {
    expect(parseWatchStats(null)).toBeUndefined();
    expect(parseWatchStats({ error: "forbidden" })).toBeUndefined();
  });
});

describe("buildWatchActivity", () => {
  const today = new Date("2026-09-09T12:00:00Z");

  it("zero-fills every day in the window and sums movies + episodes", () => {
    const json = {
      watch_activity: [
        { month: "2026-09-08", movies: 1, episodes: 2 },
        { month: "2026-09-09", movies: 0, episodes: 3 },
      ],
    };
    expect(buildWatchActivity(json, 3, today).points).toEqual([
      { date: "2026-09-07", value: 0 },
      { date: "2026-09-08", value: 3 },
      { date: "2026-09-09", value: 3 },
    ]);
  });

  it("defaults to the shared window length", () => {
    expect(buildWatchActivity({}, undefined, today).points).toHaveLength(ACTIVITY_DAYS);
  });

  it("computes the current streak as consecutive active days ending today", () => {
    const json = {
      watch_activity: [
        { month: "2026-09-06", episodes: 1 },
        { month: "2026-09-08", episodes: 1 },
        { month: "2026-09-09", episodes: 1 },
      ],
    };
    const { streak, daysActive } = buildWatchActivity(json, 5, today);
    // 09-07 is a zero, so the streak only counts back from today through 09-08.
    expect(streak).toBe(2);
    expect(daysActive).toBe(3);
  });

  it("handles empty/malformed payloads", () => {
    expect(buildWatchActivity(null, 2, today)).toEqual({
      points: [
        { date: "2026-09-08", value: 0 },
        { date: "2026-09-09", value: 0 },
      ],
      streak: 0,
      daysActive: 0,
    });
    expect(buildWatchActivity({ watch_activity: "nope" }, 1, today).points).toEqual([
      { date: "2026-09-09", value: 0 },
    ]);
  });
});
