import { readNowPlaying } from "@/lib/server/koito";
import { feedRoute } from "@/lib/server/route";

/**
 * Server-side proxy for Koito's `/now-playing` feed.
 *
 * On the short `live` cache window rather than the hourly default every other
 * feed here uses, since this reflects what's playing right now — still well
 * short of hitting Koito on every page load.
 */
export const GET = feedRoute({
  label: "koito-now-playing",
  cache: "live",
  read: readNowPlaying,
  emptyBody: { track: null },
});
