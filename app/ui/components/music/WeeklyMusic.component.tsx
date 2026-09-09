"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Music } from "lucide-react";
import {
  KOITO_ORIGIN,
  KOITO_PROXY_PATH,
  KOITO_WEEKLY_CHART_URL,
  koitoArtistUrl,
  koitoTrackUrl,
  musicbrainzArtistUrl,
  musicbrainzRecordingUrl,
  type WeeklyTrack,
} from "@/lib/koito";
import FeedSection, { type FeedStatus } from "../feed/FeedSection.component";

const TILE_WIDTH = "w-40 sm:w-44";

function CoverArt({ track }: { track: WeeklyTrack }) {
  const art = track.coverUrl ? (
    <span className="retro-frame aspect-square">
      <Image
        src={track.coverUrl}
        alt={`${track.title} album cover`}
        fill
        sizes="(max-width: 640px) 10rem, 11rem"
        unoptimized
        className="object-cover"
      />
    </span>
  ) : (
    <span className="retro-frame flex aspect-square items-center justify-center text-muted-foreground">
      <Music className="size-8" aria-hidden="true" />
    </span>
  );

  if (typeof track.koitoId !== "number") {
    return art;
  }
  return (
    <a
      className="block transition-transform hover:-translate-y-0.5"
      href={koitoTrackUrl(track.koitoId)}
      target="_blank"
      rel="noreferrer"
      aria-label={`${track.title} on Koito`}
    >
      {art}
    </a>
  );
}

function Artists({ artists }: { artists: WeeklyTrack["artists"] }) {
  return (
    <>
      {artists.map((artist, index) => (
        <span key={`${artist.name}-${index}`}>
          {typeof artist.koitoId === "number" ? (
            <a
              className="transition-colors hover:text-primary"
              href={koitoArtistUrl(artist.koitoId)}
              target="_blank"
              rel="noreferrer"
              aria-label={`${artist.name} on Koito`}
            >
              {artist.name}
            </a>
          ) : (
            artist.name
          )}
          {artist.musicbrainzId && (
            <>
              {" "}
              <a
                className="font-mono text-[0.6rem] text-muted-foreground underline underline-offset-2 transition-colors hover:text-primary"
                href={musicbrainzArtistUrl(artist.musicbrainzId)}
                target="_blank"
                rel="noreferrer"
                aria-label={`${artist.name} on MusicBrainz`}
              >
                mbz
              </a>
            </>
          )}
          {index < artists.length - 1 ? ", " : ""}
        </span>
      ))}
    </>
  );
}

function TrackTile({ track }: { track: WeeklyTrack }) {
  const title = track.title;
  const hasKoitoLink = typeof track.koitoId === "number";

  return (
    <li className={`${TILE_WIDTH} shrink-0 snap-start scroll-mx-2`}>
      <div className="relative">
        <CoverArt track={track} />
        <span className="retro-badge retro-badge-muted tabular-nums" aria-hidden="true">
          {String(track.rank).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-2 flex min-w-0 flex-col gap-0.5 px-0.5">
        {hasKoitoLink ? (
          <a
            className="tile-title transition-colors hover:text-primary"
            href={koitoTrackUrl(track.koitoId as number)}
            target="_blank"
            rel="noreferrer"
            title={title}
          >
            {title}
          </a>
        ) : (
          <p className="tile-title" title={title}>
            {title}
          </p>
        )}
        <p className="tile-sub">
          <Artists artists={track.artists} />
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          {track.trackMusicbrainzId ? (
            <a
              className="link-accent retro-eyebrow"
              href={musicbrainzRecordingUrl(track.trackMusicbrainzId)}
              target="_blank"
              rel="noreferrer"
              aria-label={`${title} on MusicBrainz`}
            >
              musicbrainz ↗
            </a>
          ) : (
            <span />
          )}
          {typeof track.plays === "number" && (
            <span className="font-mono text-[0.65rem] text-muted-foreground">
              {track.plays} plays
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

function TileSkeleton() {
  return (
    <li className={`${TILE_WIDTH} shrink-0 snap-start`} aria-hidden="true">
      <div className="aspect-square animate-pulse rounded-xl border border-border bg-muted" />
      <div className="mt-2 space-y-2 px-0.5">
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        <div className="h-2.5 w-2/3 animate-pulse rounded bg-muted" />
      </div>
    </li>
  );
}

/**
 * Renders the current week's favourite songs as a horizontal carousel of album
 * tiles. The same-origin proxy does the reading, parsing and hour-long caching,
 * so Koito is asked at most hourly and only display fields reach the browser.
 */
export default function WeeklyMusic() {
  const [state, setState] = useState<{ status: FeedStatus; tracks: WeeklyTrack[] }>({
    status: "loading",
    tracks: [],
  });

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const timeout = window.setTimeout(() => controller.abort(), 15_000);

    const load = async () => {
      const response = await fetch(KOITO_PROXY_PATH, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`Feed responded with ${response.status}`);
      }
      const json = (await response.json()) as { tracks?: WeeklyTrack[] };
      if (cancelled) return;

      setState({ status: "ready", tracks: json.tracks ?? [] });
    };

    load()
      .catch(() => {
        if (cancelled) return;
        setState({ status: "error", tracks: [] });
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  return (
    <FeedSection
      id="music"
      title="music"
      blurb="favourite songs of the week, straight from my koito instance"
      ariaLabel="This week on Koito"
      status={state.status}
      isEmpty={state.tracks.length === 0}
      errorText="couldn't reach koito right now — maybe my ears are on strike."
      emptyText="nothing scrobbled this week yet — check back soon."
      fallbackLink={{ href: KOITO_ORIGIN, label: "open koito \u2197" }}
      moreLink={{ href: KOITO_WEEKLY_CHART_URL, label: "show more on koito \u2192" }}
      skeleton={Array.from({ length: 5 }).map((_, index) => (
        <TileSkeleton key={index} />
      ))}
    >
      {state.tracks.map((track) => (
        <TrackTile key={`${track.title}-${track.rank}`} track={track} />
      ))}
    </FeedSection>
  );
}
