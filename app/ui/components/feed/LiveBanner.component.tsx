import type { ReactNode } from "react";
import ExternalLink from "./ExternalLink.component";

type LiveBannerProps = {
  /** Small caption above the title, e.g. "now playing on koito". */
  eyebrow: string;
  cover: ReactNode;
  title: string;
  href?: string;
  subtitle?: ReactNode;
  /** 0-100. Renders a playback meter under the title when present. */
  progressPercent?: number;
};

/**
 * The "on air" banner shown above a feed row while something is playing right
 * now — one treatment for both the Koito track and the Scrob playback session,
 * since they say the same thing about two different upstreams.
 *
 * `aria-live` is deliberately absent: the banner is polled, and re-announcing
 * the same track every twenty seconds would make a screen reader unusable. It
 * is a `status` region a reader can visit, not an interruption.
 */
export default function LiveBanner({
  eyebrow,
  cover,
  title,
  href,
  subtitle,
  progressPercent,
}: LiveBannerProps) {
  return (
    <div className="retro-live-banner" role="status">
      <span className="retro-live-dot shrink-0" aria-hidden="true" />

      {cover}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="retro-eyebrow text-primary">{eyebrow}</span>

        <ExternalLink
          href={href}
          title={title}
          className="truncate text-sm font-semibold transition-colors hover:text-primary"
        >
          {title}
        </ExternalLink>

        {subtitle && <span className="truncate text-xs text-muted-foreground">{subtitle}</span>}

        {progressPercent !== undefined && (
          <div
            className="retro-meter mt-0.5"
            role="progressbar"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${title} playback progress`}
          >
            <span
              className="retro-meter-fill"
              style={{ width: `${Math.max(progressPercent, 1.5)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
