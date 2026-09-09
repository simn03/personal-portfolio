import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import ExternalLink from "./ExternalLink.component";

/** One tile width for every feed row, so the three sections scroll in step. */
export const TILE_WIDTH = "w-40 sm:w-44";

/** Album art is square; posters and book covers are 2:3. */
export type TileRatio = "square" | "poster";

export const TILE_ASPECT: Record<TileRatio, string> = {
  square: "aspect-square",
  poster: "aspect-[2/3]",
};

type MediaTileProps = {
  /** Deep link for both the artwork and the title, when the feed has one. */
  href?: string;
  /** Accessible name for the artwork link, e.g. "Dune on Hardcover". */
  coverLabel?: string;
  cover: ReactNode;
  /** Corner chip over the artwork: a rank, a season/episode, a finish date. */
  badge?: ReactNode;
  badgeTone?: "muted" | "active";
  title: string;
  /** Second line — artists, an episode title, an author list. */
  subtitle?: ReactNode;
  /** Tooltip for a truncated subtitle. */
  subtitleTitle?: string;
  /** Optional third row: a date, a progress meter, a play count. */
  footer?: ReactNode;
};

/**
 * The shared tile the music, watching and reading rows are all built from.
 *
 * Every row previously grew its own copy of this markup, which is how they
 * drifted: one lifted on hover and the others didn't, one linked its title and
 * the others didn't. Keeping the shell here means a tile change lands in all
 * three rows at once, and the fixed-height text rows keep the footers aligned
 * across a row no matter how long a title runs.
 */
export default function MediaTile({
  href,
  coverLabel,
  cover,
  badge,
  badgeTone = "muted",
  title,
  subtitle,
  subtitleTitle,
  footer,
}: MediaTileProps) {
  return (
    <li className={cn(TILE_WIDTH, "group shrink-0 snap-start scroll-mx-2")}>
      <div className="relative">
        <ExternalLink
          href={href}
          label={coverLabel}
          className={cn(
            "block rounded-xl transition-transform duration-200",
            href && "group-hover:-translate-y-1 focus-visible:-translate-y-1"
          )}
        >
          {cover}
        </ExternalLink>
        {badge && (
          <span
            className={cn(
              "retro-badge",
              badgeTone === "active" ? "retro-badge-active" : "retro-badge-muted"
            )}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="mt-2 flex min-w-0 flex-col gap-0.5 px-0.5">
        <ExternalLink
          href={href}
          title={title}
          className={cn("tile-title", href && "transition-colors group-hover:text-primary")}
        >
          {title}
        </ExternalLink>
        <p className="tile-sub" title={subtitleTitle}>
          {subtitle}
        </p>
        {footer}
      </div>
    </li>
  );
}
