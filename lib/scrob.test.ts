import { describe, expect, it } from "vitest";
import {
  SCROB_ORIGIN,
  episodeLabel,
  parseRecentEpisodes,
  resolvePoster,
  tmdbShowUrl,
  tvdbShowUrl,
  type WatchedEpisode,
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

describe("episodeLabel", () => {
  it("formats season and episode", () => {
    const episode: WatchedEpisode = { showTitle: "S", episodeTitle: "E", seasonNumber: 2, episodeNumber: 5 };
    expect(episodeLabel(episode)).toBe("S2 · E5");
  });

  it("falls back gracefully", () => {
    expect(episodeLabel({ showTitle: "S", episodeTitle: "E" })).toBe("episode");
  });
});

describe("SCROB_ORIGIN", () => {
  it("defaults to the public scrob instance", () => {
    expect(SCROB_ORIGIN).toContain("scrob");
  });
});

describe("episode deep link helpers", () => {
  it("builds tmdb and tvdb show urls", () => {
    expect(tmdbShowUrl(65942)).toBe("https://www.themoviedb.org/tv/65942");
    expect(tvdbShowUrl(305089)).toBe("https://www.thetvdb.com/dereferrer/series/305089");
  });
});
