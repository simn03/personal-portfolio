import { feedRoute } from "@/lib/server/route";
import { isScrobProfileConfigured, readWatchStats } from "@/lib/server/scrob";

/**
 * Server-side proxy for Scrob's watch stats + activity heatmap. This is the
 * heaviest upstream on the page — see `readWatchStats` for how it is kept to
 * one round of calls per hour no matter how much traffic the page gets.
 */
export const GET = feedRoute({
  label: "scrob-stats",
  isConfigured: isScrobProfileConfigured,
  read: readWatchStats,
});
