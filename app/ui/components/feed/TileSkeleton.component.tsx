import { cn } from "@/lib/utils";
import { TILE_ASPECT, TILE_WIDTH, type TileRatio } from "./MediaTile.component";

/**
 * Placeholder tile, shaped like the real one so the row doesn't reflow when the
 * feed lands. All three rows share it; only the artwork ratio differs.
 */
export default function TileSkeleton({ ratio }: { ratio: TileRatio }) {
  return (
    <li className={cn(TILE_WIDTH, "shrink-0 snap-start")} aria-hidden="true">
      <div
        className={cn(
          TILE_ASPECT[ratio],
          "animate-pulse rounded-xl border border-border bg-muted"
        )}
      />
      <div className="mt-2 space-y-2 px-0.5">
        <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
        <div className="h-2.5 w-3/5 animate-pulse rounded bg-muted" />
      </div>
    </li>
  );
}

/** A row of `count` placeholder tiles, ready to hand to `FeedSection`. */
export function tileSkeletons(count: number, ratio: TileRatio) {
  return Array.from({ length: count }, (_, index) => (
    <TileSkeleton key={index} ratio={ratio} />
  ));
}
