import { describe, expect, it } from "vitest";
import {
  SCROB_NOW_PLAYING_PROXY_PATH,
  SCROB_ORIGIN,
  SCROB_PROXY_PATH,
  SCROB_STATS_PROXY_PATH,
  episodeLabel,
  seasonEpisodeLabel,
  tmdbShowUrl,
  tvdbShowUrl,
  type WatchedEpisode,
} from "./scrob";

describe("seasonEpisodeLabel", () => {
  it("formats season and episode", () => {
    expect(seasonEpisodeLabel(2, 5)).toBe("S2 · E5");
  });

  it("degrades to whichever half it has", () => {
    expect(seasonEpisodeLabel(undefined, 5)).toBe("E5");
    expect(seasonEpisodeLabel(2, undefined)).toBe("S2 · E?");
  });

  it("returns nothing when there is no numbering at all", () => {
    expect(seasonEpisodeLabel(undefined, undefined)).toBeUndefined();
  });
});

describe("episodeLabel", () => {
  it("formats season and episode", () => {
    const episode: WatchedEpisode = {
      showTitle: "S",
      episodeTitle: "E",
      seasonNumber: 2,
      episodeNumber: 5,
    };
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

describe("proxy paths", () => {
  it("keeps every Scrob read on the site's own origin", () => {
    for (const path of [
      SCROB_PROXY_PATH,
      SCROB_NOW_PLAYING_PROXY_PATH,
      SCROB_STATS_PROXY_PATH,
    ]) {
      expect(path.startsWith("/api/")).toBe(true);
    }
  });
});
