"use client";

import { useMemo } from "react";
import dayjs from "dayjs";
import type { ActivityPoint } from "@/lib/feeds";

type ActivityHeatmapProps = {
  /** Zero-filled, consecutive days ending today; anything missing reads as zero. */
  points: ActivityPoint[];
  weeks: number;
  /** Shown in each cell's tooltip, e.g. "plays" or "watches". */
  unit: string;
  /** Accessible label for the whole grid, e.g. "Listening activity, 20 weeks". */
  ariaLabel: string;
};

const LEGEND_STEPS = [1, 2, 3, 4, 5];
const DAYS_PER_WEEK = 7;

/** Cell edge and gap, in px — the month labels are laid out on the same track. */
const CELL_PX = 10;
const GAP_PX = 3;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Formats a `Date` using its own local calendar day — never `toISOString`, which is UTC. */
function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Same curve Koito's own activity grid uses: a floor so even one play stays visible. */
function blendAmount(fraction: number): number {
  return 0.15 + Math.min(Math.max(fraction, 0), 1) * 0.85;
}

function swatch(fraction: number): string {
  return `color-mix(in oklab, var(--primary) ${blendAmount(fraction) * 100}%, var(--muted))`;
}

/**
 * The locale's first day of the week (0 = Sunday, 1 = Monday, …). `getWeekInfo`
 * isn't in every browser (notably Firefox), so this falls back to Monday.
 */
function localeFirstDay(): number {
  try {
    return new Intl.Locale(navigator.language).getWeekInfo().firstDay;
  } catch {
    return 1;
  }
}

/**
 * Compact day-per-cell activity grid, shared by the music, watching and reading
 * stats widgets — weekday-aligned columns, month ticks along the top, a hover
 * tooltip per day and a Less→More gradient legend.
 *
 * The grid is a single `role="img"`: 140 individually focusable cells would be
 * a tab-trap, and the shape is the point, not each cell. The caption above it
 * carries the numbers a reader actually needs.
 */
export default function ActivityHeatmap({ points, weeks, unit, ariaLabel }: ActivityHeatmapProps) {
  const { cells, columns, dayLabels } = useMemo(() => {
    const countsByDate = new Map(points.map((point) => [point.date.slice(0, 10), point.value]));

    const firstDay = localeFirstDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Back up to the start of this week, then back `weeks - 1` further, so the
    // rightmost column is the current (partial) week.
    const daysSinceRowStart = (today.getDay() + (DAYS_PER_WEEK - firstDay)) % DAYS_PER_WEEK;
    const gridStart = new Date(today);
    gridStart.setDate(gridStart.getDate() - daysSinceRowStart - (weeks - 1) * DAYS_PER_WEEK);

    const cells: { key: string; date: Date; count: number; isFuture: boolean }[] = [];
    const columns: { index: number; month: string }[] = [];
    let previousMonth = -1;

    for (let col = 0; col < weeks; col++) {
      for (let row = 0; row < DAYS_PER_WEEK; row++) {
        const date = new Date(gridStart);
        date.setDate(date.getDate() + col * DAYS_PER_WEEK + row);
        const key = localDateKey(date);

        // A column is labelled with the month its first day falls in, and only
        // when that differs from the column before it.
        if (row === 0 && date.getMonth() !== previousMonth) {
          previousMonth = date.getMonth();
          columns.push({ index: col, month: dayjs(date).format("MMM") });
        }

        cells.push({ key, date, count: countsByDate.get(key) ?? 0, isFuture: date > today });
      }
    }

    return {
      cells,
      columns,
      dayLabels:
        firstDay === 1
          ? ["Mon", "", "Wed", "", "Fri", "", "Sun"]
          : ["Sun", "", "Tue", "", "Thu", "", "Sat"],
    };
  }, [points, weeks]);

  const maxCount = Math.max(1, ...cells.map((cell) => cell.count));
  const trackStyle = {
    gridTemplateColumns: `repeat(${weeks}, ${CELL_PX}px)`,
    columnGap: `${GAP_PX}px`,
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        {/* Weekday gutter, pushed down past the month row so rows stay aligned. */}
        <div
          className="grid grid-rows-7 pt-[15px]"
          style={{ rowGap: `${GAP_PX}px` }}
          aria-hidden="true"
        >
          {dayLabels.map((label, index) => (
            <div key={index} className="flex h-[10px] items-center justify-end">
              <span className="retro-eyebrow leading-none text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1" role="img" aria-label={ariaLabel}>
          <div className="grid h-[11px]" style={trackStyle} aria-hidden="true">
            {columns.map((column) => (
              <span
                key={column.index}
                className="retro-eyebrow whitespace-nowrap leading-none text-muted-foreground"
                style={{ gridColumnStart: column.index + 1 }}
              >
                {column.month}
              </span>
            ))}
          </div>

          <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
            {cells.map((cell) =>
              cell.isFuture ? (
                <div key={cell.key} className="size-[10px]" />
              ) : (
                <div
                  key={cell.key}
                  title={`${dayjs(cell.date).format("MMM D, YYYY")} · ${cell.count} ${unit}`}
                  className="size-[10px] rounded-[2px] border border-border transition-colors"
                  style={{
                    backgroundColor: cell.count > 0 ? swatch(cell.count / maxCount) : undefined,
                  }}
                />
              )
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end" aria-hidden="true">
        <span className="retro-eyebrow text-muted-foreground">less</span>
        <div className="flex gap-1">
          {LEGEND_STEPS.map((step) => (
            <div
              key={step}
              className="size-[9px] rounded-[2px] border border-border"
              style={{ backgroundColor: swatch(step / LEGEND_STEPS.length) }}
            />
          ))}
        </div>
        <span className="retro-eyebrow text-muted-foreground">more</span>
      </div>
    </div>
  );
}
