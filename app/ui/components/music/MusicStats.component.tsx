"use client";

import dayjs from "dayjs";
import { KOITO_STATS_PROXY_PATH, type KoitoStats, type MusicStatsFeed } from "@/lib/koito";
import type { ActivitySummary } from "@/lib/feeds";
import { formatCount, formatDecimal, formatMinutes } from "@/lib/utils/format";
import { useFeed } from "../../hooks/useFeed";
import ActivityCard from "../stats/ActivityCard.component";
import StatCell from "../stats/StatCell.component";
import StatsPanel, {
  StatGrid,
  StatsLayout,
  StatsSkeleton,
} from "../stats/StatsPanel.component";

function Numbers({ stats, activity }: { stats: KoitoStats; activity: ActivitySummary }) {
  const listened = formatMinutes(stats.minutesListened);

  return (
    <StatsLayout>
      <StatGrid columns={4}>
        <StatCell value={formatCount(stats.listenCount)} label="plays" />
        <StatCell value={formatCount(stats.trackCount)} label="tracks" />
        <StatCell value={formatCount(stats.albumCount)} label="albums" />
        <StatCell value={formatCount(stats.artistCount)} label="artists" />
        <StatCell
          value={listened.value}
          label={listened.unit}
          hint={`${formatCount(stats.minutesListened)} minutes listened`}
        />
        <StatCell value={formatCount(stats.daysActive)} label="days active" />
        <StatCell
          value={formatCount(activity.streak)}
          label="day streak"
          hint={`Longest streak: ${formatCount(stats.longestStreak)} days`}
        />
        <StatCell value={formatDecimal(stats.avgDailyPlays)} label="avg. plays / day" />
      </StatGrid>

      <ActivityCard points={activity.points} unit="plays" subject="Listening" />
    </StatsLayout>
  );
}

/**
 * Listening stats for the music section: all-time counts plus the same activity
 * heatmap and streak Koito shows on its own dashboard. Read in one request
 * through `/api/koito/stats`, which combines Koito's `/stats`,
 * `/listen-activity` and `/first-activity` endpoints server-side.
 */
export default function MusicStats() {
  const { status, data } = useFeed<MusicStatsFeed>(KOITO_STATS_PROXY_PATH);

  // Nothing worth a section: unreachable, unconfigured, or configured with no
  // listening behind it.
  if (status === "error" || status === "hidden" || (status === "ready" && !data.stats)) {
    return null;
  }

  const ready = status === "ready" && data.stats ? data : undefined;

  return (
    <StatsPanel
      id="music-stats"
      title="listening stats"
      ariaLabel="Listening stats on Koito"
      meta={
        ready?.listeningSince
          ? `since ${dayjs(ready.listeningSince).format("MMM YYYY")}`
          : undefined
      }
    >
      {ready?.stats ? (
        <Numbers stats={ready.stats} activity={ready.activity} />
      ) : (
        <StatsSkeleton cells={8} columns={4} />
      )}
    </StatsPanel>
  );
}
