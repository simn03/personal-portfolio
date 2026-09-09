import { feedRoute } from "@/lib/server/route";
import { isScrobProfileConfigured, readRecentShows } from "@/lib/server/scrob";

/**
 * Server-side proxy for Scrob's recently-watched shows feed. The API key stays
 * server-side, the response is cached for an hour so the instance is hit at
 * most hourly rather than once per visitor, and only the episode fields the
 * section renders are forwarded to the browser.
 */
export const GET = feedRoute({
  label: "scrob",
  isConfigured: isScrobProfileConfigured,
  read: readRecentShows,
  emptyBody: { episodes: [] },
});
