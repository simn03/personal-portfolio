"use client";

import type { ActivitySummary } from "@/lib/feeds";
import { ACTIVITY_WEEKS } from "@/lib/feeds";
import { SCROB_STATS_PROXY_PATH, type WatchStats as WatchStatsData, type WatchStatsFeed } from "@/lib/scrob";
import { formatCount, formatMinutes } from "@/lib/utils/format";
import { useFeed } from "../../hooks/useFeed";
import ActivityCard from "../stats/ActivityCard.component";
import StatCell from "../stats/StatCell.component";
import StatsPanel, {
  StatGrid,
  StatsLayout,
  StatsSkeleton,
} from "../stats/StatsPanel.component";

function Numbers({ stats, activity }: { stats: WatchStatsData; activity: ActivitySummary }) {
  const watched = formatMinutes(stats.totalWatchMinutes);

  return (
    <StatsLayout>
      <StatGrid columns={3}>
        <StatCell value={formatCount(stats.moviesWatched)} label="movies" />
        <StatCell value={formatCount(stats.showsWatched)} label="shows" />
        <StatCell value={formatCount(stats.episodesWatched)} label="episodes" />
        <StatCell
          value={watched.value}
          label={watched.unit}
          hint={`${formatCount(stats.totalWatchMinutes)} minutes watched`}
        />
        <StatCell
          value={formatCount(activity.daysActive)}
          label="days active"
          hint={`Days with a watch in the last ${ACTIVITY_WEEKS} weeks`}
        />
        <StatCell value={formatCount(activity.streak)} label="day streak" />
      </StatGrid>

      <ActivityCard points={activity.points} unit="watches" subject="Watching" />
    </StatsLayout>
  );
}

/**
 * Watch stats for the TV section: all-time counts plus an activity heatmap and
 * streak built from Scrob's `/stats` endpoint, which — unlike Koito — computes
 * neither a streak nor zero-filled daily activity itself (see
 * `buildWatchActivity`). Read in one request through `/api/scrob/stats`.
 */
export default function WatchStats() {
  const { status, data } = useFeed<WatchStatsFeed>(SCROB_STATS_PROXY_PATH);

  if (status === "error" || status === "hidden" || (status === "ready" && !data.stats)) {
    return null;
  }

  const ready = status === "ready" && data.stats ? data : undefined;

  return (
    <StatsPanel id="watching-stats" title="watch stats" ariaLabel="Watch stats on Scrob">
      {ready?.stats ? (
        <Numbers stats={ready.stats} activity={ready.activity} />
      ) : (
        <StatsSkeleton cells={6} columns={3} />
      )}
    </StatsPanel>
  );
}
