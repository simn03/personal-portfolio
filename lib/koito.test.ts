import { describe, expect, it } from "vitest";
import {
  KOITO_NOW_PLAYING_PROXY_PATH,
  KOITO_ORIGIN,
  KOITO_PROXY_PATH,
  KOITO_STATS_PROXY_PATH,
  KOITO_WEEKLY_CHART_URL,
  koitoArtistUrl,
  koitoTrackUrl,
  musicbrainzArtistUrl,
  musicbrainzRecordingUrl,
} from "./koito";

const MBID = "b7ffd2af-418f-4be2-bdd1-22f8b48613da";

describe("musicbrainz url helpers", () => {
  it("builds recording and artist links", () => {
    expect(musicbrainzRecordingUrl(MBID)).toBe(`https://musicbrainz.org/recording/${MBID}`);
    expect(musicbrainzArtistUrl(MBID)).toBe(`https://musicbrainz.org/artist/${MBID}`);
  });
});

describe("koito url helpers", () => {
  it("builds track and artist deep links on the Koito instance", () => {
    expect(koitoTrackUrl(838)).toBe(`${KOITO_ORIGIN}/track/838`);
    expect(koitoArtistUrl(12)).toBe(`${KOITO_ORIGIN}/artist/12`);
  });

  it("points the weekly chart link at the instance's own chart", () => {
    expect(KOITO_WEEKLY_CHART_URL.startsWith(`${KOITO_ORIGIN}/chart/`)).toBe(true);
  });
});

describe("proxy paths", () => {
  it("keeps every Koito read on the site's own origin", () => {
    for (const path of [
      KOITO_PROXY_PATH,
      KOITO_NOW_PLAYING_PROXY_PATH,
      KOITO_STATS_PROXY_PATH,
    ]) {
      expect(path.startsWith("/api/")).toBe(true);
    }
  });
});
