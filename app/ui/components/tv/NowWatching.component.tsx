"use client";

import { Clapperboard } from "lucide-react";
import { SCROB_NOW_PLAYING_PROXY_PATH, tmdbShowUrl, type NowWatchingFeed } from "@/lib/scrob";
import { useLiveFeed } from "../../hooks/useLiveFeed";
import CoverArt from "../feed/CoverArt.component";
import LiveBanner from "../feed/LiveBanner.component";

/**
 * "On air" banner above the recently-watched row, one per active Plex /
 * Jellyfin / Kodi playback session. Polls while the tab is visible and renders
 * nothing when nothing's playing (or Scrob isn't configured).
 */
export default function NowWatching() {
  const feed = useLiveFeed<NowWatchingFeed>(SCROB_NOW_PLAYING_PROXY_PATH);
  const sessions = feed?.sessions ?? [];

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      {sessions.map((session) => (
        <LiveBanner
          key={session.sessionKey}
          eyebrow={session.state === "paused" ? "paused on scrob" : "now watching on scrob"}
          href={session.showTmdbId ? tmdbShowUrl(session.showTmdbId) : undefined}
          title={session.title}
          subtitle={session.subtitle}
          progressPercent={session.progressPercent}
          cover={
            <CoverArt
              src={session.posterPath}
              alt={`${session.title} poster`}
              icon={Clapperboard}
              className="size-12 shrink-0"
              iconClassName="size-5"
              sizes="3rem"
            />
          }
        />
      ))}
    </div>
  );
}
