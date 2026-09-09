import { readMusicStats } from "@/lib/server/koito";
import { feedRoute } from "@/lib/server/route";

/**
 * Server-side proxy that combines three Koito endpoints — `/stats`,
 * `/listen-activity` and `/first-activity` — into the one payload the stats
 * widget needs, so the browser makes a single request instead of three.
 */
export const GET = feedRoute({
  label: "koito-stats",
  read: readMusicStats,
});
