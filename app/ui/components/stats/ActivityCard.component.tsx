"use client";

import { ACTIVITY_WEEKS, type ActivityPoint } from "@/lib/feeds";
import { cn } from "@/lib/utils";
import { formatCount } from "@/lib/utils/format";
import ActivityHeatmap from "./ActivityHeatmap.component";

type ActivityCardProps = {
  points: ActivityPoint[];
  /** Plural noun for the tooltips and the summary, e.g. "plays". */
  unit: string;
  /** What the grid is of, e.g. "Listening". Used to build the accessible name. */
  subject: string;
  className?: string;
};

/**
 * The activity heatmap in its card, with the window caption and a one-line
 * summary of the window's total.
 *
 * The summary is not decoration: a heatmap is a shape, and the shape alone
 * tells a reader using a screen reader nothing. The total gives the grid an
 * accessible name worth reading out.
 */
export default function ActivityCard({ points, unit, subject, className }: ActivityCardProps) {
  const total = points.reduce((sum, point) => sum + point.value, 0);

  return (
    <div className={cn("retro-card items-start gap-3 overflow-x-auto p-4 lg:w-fit", className)}>
      <div className="flex w-full items-center justify-between gap-4">
        <span className="retro-eyebrow text-muted-foreground">activity</span>
        <span className="retro-eyebrow text-muted-foreground">
          {formatCount(total)} {unit} · {ACTIVITY_WEEKS}w
        </span>
      </div>

      <ActivityHeatmap
        points={points}
        weeks={ACTIVITY_WEEKS}
        unit={unit}
        ariaLabel={`${subject} activity over the last ${ACTIVITY_WEEKS} weeks: ${formatCount(total)} ${unit} in total`}
      />
    </div>
  );
}
