import { describe, expect, it } from "vitest";
import {
  KOITO_ORIGIN,
  isValidMbid,
  koitoArtistUrl,
  koitoTrackUrl,
  musicbrainzArtistUrl,
  musicbrainzRecordingUrl,
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
    expect(resolveCoverUrl("/image/medium/abc-123")).toBe(
      `${KOITO_ORIGIN}/image/medium/abc-123`
    );
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
});
