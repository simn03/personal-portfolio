import { feedRoute } from "@/lib/server/route";
import { isScrobConfigured, readNowWatching } from "@/lib/server/scrob";

/**
 * Server-side proxy for Scrob's active-playback-sessions feed, fed by
 * Plex/Jellyfin/Kodi webhooks. On the short `live` cache window since a
 * session's progress moves while a visitor is on the page.
 */
export const GET = feedRoute({
  label: "scrob-now-playing",
  cache: "live",
  isConfigured: isScrobConfigured,
  read: readNowWatching,
  emptyBody: { sessions: [] },
});
