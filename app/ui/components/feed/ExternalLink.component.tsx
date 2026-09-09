import type { ReactNode } from "react";

type ExternalLinkProps = {
  /** When absent the content renders unlinked, keeping the same typography. */
  href?: string;
  className?: string;
  /** Accessible name, when the link text alone isn't descriptive enough. */
  label?: string;
  /** Native tooltip — used by truncated tile titles to reveal the full text. */
  title?: string;
  children: ReactNode;
};

/**
 * Every outbound link on the page goes through here, so `target`/`rel` can't be
 * forgotten on one of the dozen-odd deep links out to Koito, Scrob, Hardcover,
 * MusicBrainz, TMDB and TheTVDB.
 *
 * `href` is optional on purpose: a tile whose upstream id is missing should
 * still render its title and cover, just without the link.
 */
export default function ExternalLink({
  href,
  className,
  label,
  title,
  children,
}: ExternalLinkProps) {
  if (!href) {
    return (
      <span className={className} title={title}>
        {children}
      </span>
    );
  }

  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={title}
    >
      {children}
    </a>
  );
}
