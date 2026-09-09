import { isHardcoverConfigured, readReadingActivity } from "@/lib/server/hardcover";
import { feedRoute } from "@/lib/server/route";

/**
 * Server-side proxy for the reading-activity heatmap: Hardcover's own
 * per-update `reading_journals` log, reduced to estimated minutes per day and
 * cached for the standard hour.
 */
export const GET = feedRoute({
  label: "hardcover-activity",
  isConfigured: isHardcoverConfigured,
  read: readReadingActivity,
});
