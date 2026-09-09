import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatsPanelProps = {
  /** Anchor id, e.g. `music-stats`. */
  id: string;
  title: string;
  ariaLabel: string;
  /** Right-aligned caption on the heading rule — "since jan 2020", a streak. */
  meta?: ReactNode;
  children: ReactNode;
};

/**
 * Chrome for a stats widget: the sub-heading, its rule and the optional caption
 * on the right. Sits directly under the feed row it belongs to, at a lighter
 * weight than `SectionHeading`, so the page reads as three sections rather than
 * six.
 */
export default function StatsPanel({ id, title, ariaLabel, meta, children }: StatsPanelProps) {
  return (
    <section className="mt-8 text-foreground" aria-label={ariaLabel}>
      <div className="document-padding flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h3 className="retro-eyebrow scroll-mt-28 text-muted-foreground" id={id}>
            {title}
          </h3>
          <span className="h-px flex-1 bg-border" aria-hidden="true" />
          {meta && <span className="retro-eyebrow text-muted-foreground">{meta}</span>}
        </div>

        {children}
      </div>
    </section>
  );
}

/** The stats-grid / activity-card two-column layout the widgets share. */
export function StatsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-start">{children}</div>
  );
}

/**
 * Placeholder shaped like the real panel — `columns` cells wide, with the
 * activity card beside it — so nothing jumps when the numbers land.
 */
export function StatsSkeleton({ cells, columns }: { cells: number; columns: 3 | 4 }) {
  return (
    <StatsLayout>
      <div
        className={cn("grid grid-cols-2 gap-3", columns === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3")}
        aria-hidden="true"
      >
        {Array.from({ length: cells }, (_, index) => (
          <div
            key={index}
            className="h-[4.5rem] animate-pulse rounded-2xl border border-border bg-muted"
          />
        ))}
      </div>
      <div
        className="h-[8.5rem] w-full animate-pulse rounded-2xl border border-border bg-muted lg:w-[320px]"
        aria-hidden="true"
      />
    </StatsLayout>
  );
}

/** The counts grid itself — two columns on phones, three or four from `sm` up. */
export function StatGrid({ columns, children }: { columns: 3 | 4; children: ReactNode }) {
  return (
    <div
      className={cn("grid grid-cols-2 gap-3", columns === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3")}
    >
      {children}
    </div>
  );
}
