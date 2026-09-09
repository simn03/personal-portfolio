"use client";

import { ACTIVITY_WEEKS } from "@/lib/feeds";
import { HARDCOVER_ACTIVITY_PROXY_PATH, type ReadingActivityFeed } from "@/lib/hardcover";
import { formatCount } from "@/lib/utils/format";
import { useFeed } from "../../hooks/useFeed";
import ActivityCard from "../stats/ActivityCard.component";
import StatsPanel from "../stats/StatsPanel.component";

/**
 * Reading-activity heatmap: estimated minutes spent reading per day, derived
 * from Hardcover's own `reading_journals` progress log (see
 * `buildReadingActivity`) since Hardcover doesn't track session time itself.
 *
 * Read once through `/api/hardcover/activity`; hidden when Hardcover isn't
 * configured, same as the reading feed above it. There are no counts to sit
 * beside the grid — Hardcover exposes no lifetime totals — so this is the one
 * stats panel that is only a heatmap.
 */
export default function ReadingActivity() {
  const { status, data } = useFeed<ReadingActivityFeed>(HARDCOVER_ACTIVITY_PROXY_PATH);

  if (status === "error" || status === "hidden") {
    return null;
  }

  const activity = status === "ready" ? data.activity : undefined;

  return (
    <StatsPanel
      id="reading-activity"
      title="reading activity"
      ariaLabel="Reading activity on Hardcover"
      meta={
        activity &&
        (activity.streak > 0
          ? `${formatCount(activity.streak)} day streak`
          : `last ${ACTIVITY_WEEKS} weeks`)
      }
    >
      {activity ? (
        <ActivityCard points={activity.points} unit="min" subject="Reading" className="w-fit" />
      ) : (
        <div
          className="h-[8.5rem] w-full max-w-[420px] animate-pulse rounded-2xl border border-border bg-muted"
          aria-hidden="true"
        />
      )}
    </StatsPanel>
  );
}
