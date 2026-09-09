"use client";

import { Music } from "lucide-react";
import {
  KOITO_NOW_PLAYING_PROXY_PATH,
  koitoTrackUrl,
  type NowPlayingFeed,
} from "@/lib/koito";
import { useLiveFeed } from "../../hooks/useLiveFeed";
import CoverArt from "../feed/CoverArt.component";
import LiveBanner from "../feed/LiveBanner.component";
import ArtistLinks from "./ArtistLinks.component";

/**
 * "On air" banner above the weekly favourites row, shown only while a track is
 * actually playing on Koito. Polls the proxy while the tab is in front of
 * someone and renders nothing the rest of the time — this is a bonus, not a
 * feed with its own loading and error states.
 */
export default function NowPlaying() {
  const feed = useLiveFeed<NowPlayingFeed>(KOITO_NOW_PLAYING_PROXY_PATH);
  const track = feed?.track;

  if (!track) {
    return null;
  }

  return (
    <LiveBanner
      eyebrow="now playing on koito"
      href={koitoTrackUrl(track.koitoId)}
      title={track.title}
      cover={
        <CoverArt
          src={track.coverUrl}
          alt={`${track.title} album cover`}
          icon={Music}
          className="size-12 shrink-0"
          iconClassName="size-5"
          sizes="3rem"
        />
      }
      subtitle={
        track.artists.length > 0 ? <ArtistLinks artists={track.artists} /> : undefined
      }
    />
  );
}
