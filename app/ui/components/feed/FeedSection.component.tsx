import type { ReactNode } from "react";
import type { FeedStatus } from "../../hooks/useFeed";
import SectionHeading from "../section/SectionHeading.component";
import ExternalLink from "./ExternalLink.component";

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
  /** Rendered under the heading, above the row — e.g. a "now playing" banner. */
  beforeItems?: ReactNode;
  skeleton: ReactNode;
  children: ReactNode;
};

function Notice({ text, link }: { text: string; link: FeedLink }) {
  return (
    <div className="retro-card items-center gap-3 p-8 text-center">
      <p className="text-sm text-muted-foreground">{text}</p>
      <ExternalLink className="link-accent retro-eyebrow" href={link.href}>
        {link.label}
      </ExternalLink>
    </div>
  );
}

/**
 * Shared chrome for the three "what I'm currently into" rows (music, tv,
 * books). Owns the heading, the loading / error / empty states and the outbound
 * links so all three stay visually identical; callers supply only the tiles.
 *
 * `hidden` renders nothing at all — that's a feed whose credentials aren't
 * configured, which should leave no trace on the page rather than advertise a
 * section that isn't set up.
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
  beforeItems,
  skeleton,
  children,
}: FeedSectionProps) {
  if (status === "hidden") {
    return null;
  }

  return (
    <section className="mt-20 text-foreground" aria-label={ariaLabel}>
      <SectionHeading id={id} title={title} blurb={blurb} />

      <div className="document-padding flex flex-col gap-4 pt-4">
        {beforeItems}

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
              <div className="flex items-center justify-center">
                <ExternalLink className="link-accent retro-eyebrow" href={moreLink.href}>
                  {moreLink.label}
                </ExternalLink>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
