import type { ReactNode } from "react";
import SectionHeading from "../section/SectionHeading.component";

export type FeedStatus = "loading" | "ready" | "hidden" | "error";

type FeedLink = {
  href: string;
  label: string;
};

type FeedSectionProps = {
  /** Anchor id used by the nav (`#music`, `#watching`, `#reading`). */
  id: string;
  title: string;
  blurb: string;
  ariaLabel: string;
  status: FeedStatus;
  /** True once loaded but the feed came back with nothing to show. */
  isEmpty: boolean;
  errorText: string;
  emptyText: string;
  /** Shown on the error / empty cards, e.g. "open koito ↗". */
  fallbackLink: FeedLink;
  /** Shown under a populated row, e.g. "more on koito →". */
  moreLink?: FeedLink;
  skeleton: ReactNode;
  children: ReactNode;
};

function OutboundLink({ href, label }: FeedLink) {
  return (
    <a
      className="link-accent retro-eyebrow"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {label}
    </a>
  );
}

function Notice({ text, link }: { text: string; link: FeedLink }) {
  return (
    <div className="retro-card items-center gap-3 p-6 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      <OutboundLink {...link} />
    </div>
  );
}

/**
 * Shared chrome for the three "what I'm currently into" rows (music, tv,
 * books). Owns the heading, the loading / error / empty states and the outbound
 * links so all three stay visually identical; callers supply only the tiles.
 */
export default function FeedSection({
  id,
  title,
  blurb,
  ariaLabel,
  status,
  isEmpty,
  errorText,
  emptyText,
  fallbackLink,
  moreLink,
  skeleton,
  children,
}: FeedSectionProps) {
  return (
    <section className="mt-20 text-foreground" aria-label={ariaLabel}>
      <SectionHeading id={id} title={title} blurb={blurb} />

      <div className="document-padding pt-4">
        {status === "loading" && (
          <ol className="retro-scroller" aria-hidden="true">
            {skeleton}
          </ol>
        )}

        {status === "error" && <Notice text={errorText} link={fallbackLink} />}

        {status === "ready" && isEmpty && <Notice text={emptyText} link={fallbackLink} />}

        {status === "ready" && !isEmpty && (
          <>
            <ol className="retro-scroller">{children}</ol>
            {moreLink && (
              <div className="mt-4 flex items-center justify-center">
                <OutboundLink {...moreLink} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
