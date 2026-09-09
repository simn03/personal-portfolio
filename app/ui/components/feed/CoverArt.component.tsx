import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CoverArtProps = {
  src?: string;
  alt: string;
  /** Placeholder drawn when the upstream has no artwork for this row. */
  icon: LucideIcon;
  /** Frame sizing: an aspect class for a tile, a `size-*` class for a banner. */
  className?: string;
  iconClassName?: string;
  /** Layout hint for the fill image, matching the frame's rendered width. */
  sizes: string;
};

/**
 * Album art, episode poster or book cover — one frame treatment for all three,
 * with the same graceful fallback when a feed has no image for a row.
 *
 * `unoptimized` throughout: these are third-party covers that change with every
 * scrobble, so routing them through the image optimiser would spend a
 * transform on artwork nobody will request twice.
 */
export default function CoverArt({
  src,
  alt,
  icon: Icon,
  className,
  iconClassName = "size-8",
  sizes,
}: CoverArtProps) {
  return (
    <span className={cn("retro-frame", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} unoptimized className="object-cover" />
      ) : (
        <span className="flex size-full items-center justify-center text-muted-foreground">
          <Icon className={iconClassName} aria-hidden="true" />
        </span>
      )}
    </span>
  );
}
