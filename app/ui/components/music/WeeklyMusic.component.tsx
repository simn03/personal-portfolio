"use client";

import { Music } from "lucide-react";
import {
  KOITO_ORIGIN,
  KOITO_PROXY_PATH,
  KOITO_WEEKLY_CHART_URL,
  koitoTrackUrl,
  musicbrainzRecordingUrl,
  type WeeklyFeed,
  type WeeklyTrack,
} from "@/lib/koito";
import { formatCount } from "@/lib/utils/format";
import { useFeed } from "../../hooks/useFeed";
import CoverArt from "../feed/CoverArt.component";
import ExternalLink from "../feed/ExternalLink.component";
import FeedSection from "../feed/FeedSection.component";
import MediaTile, { TILE_ASPECT } from "../feed/MediaTile.component";
import { tileSkeletons } from "../feed/TileSkeleton.component";
import ArtistLinks from "./ArtistLinks.component";
import NowPlaying from "./NowPlaying.component";

function TrackTile({ track }: { track: WeeklyTrack }) {
  const href = typeof track.koitoId === "number" ? koitoTrackUrl(track.koitoId) : undefined;

  return (
    <MediaTile
      href={href}
      coverLabel={`${track.title} on Koito`}
      title={track.title}
      badge={<span className="tabular-nums">{String(track.rank).padStart(2, "0")}</span>}
      cover={
        <CoverArt
          src={track.coverUrl}
          alt={`${track.title} album cover`}
          icon={Music}
          className={TILE_ASPECT.square}
          sizes="(max-width: 640px) 10rem, 11rem"
        />
      }
      subtitle={<ArtistLinks artists={track.artists} withMusicbrainz />}
      subtitleTitle={track.artists.map((artist) => artist.name).join(", ") || undefined}
      footer={
        <div className="mt-1 flex min-h-4 items-center justify-between gap-2">
          {track.trackMusicbrainzId ? (
            <ExternalLink
              className="link-accent retro-eyebrow"
              href={musicbrainzRecordingUrl(track.trackMusicbrainzId)}
              label={`${track.title} on MusicBrainz`}
            >
              musicbrainz ↗
            </ExternalLink>
          ) : (
            <span />
          )}
          {typeof track.plays === "number" && (
            <span className="font-mono text-[0.65rem] tabular-nums text-muted-foreground">
              {formatCount(track.plays)} plays
            </span>
          )}
        </div>
      }
    />
  );
}

/**
 * The current week's favourite songs, as a horizontal row of album tiles. The
 * same-origin proxy does the reading, parsing and hour-long caching, so Koito
 * is asked at most hourly and only display fields reach the browser.
 */
export default function WeeklyMusic() {
  const { status, data } = useFeed<WeeklyFeed>(KOITO_PROXY_PATH);
  const tracks = data?.tracks ?? [];

  return (
    <FeedSection
      id="music"
      title="music"
      blurb="favourite songs of the week, straight from my koito instance"
      ariaLabel="This week on Koito"
      status={status}
      isEmpty={tracks.length === 0}
      errorText="couldn't reach koito right now — maybe my ears are on strike."
      emptyText="nothing scrobbled this week yet — check back soon."
      fallbackLink={{ href: KOITO_ORIGIN, label: "open koito ↗" }}
      moreLink={{ href: KOITO_WEEKLY_CHART_URL, label: "show more on koito →" }}
      beforeItems={<NowPlaying />}
      skeleton={tileSkeletons(5, "square")}
    >
      {tracks.map((track) => (
        <TrackTile key={`${track.title}-${track.rank}`} track={track} />
      ))}
    </FeedSection>
  );
}
