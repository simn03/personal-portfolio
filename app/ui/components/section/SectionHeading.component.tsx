type SectionHeadingProps = {
  /** Anchor id used by the nav. */
  id?: string;
  title: string;
  blurb?: string;
};

/**
 * The one heading treatment used by every top-level section — the feed rows and
 * the work / projects / courses lists alike. Keeping it here means the rule,
 * spacing and type scale can only ever change in one place.
 */
export default function SectionHeading({ id, title, blurb }: SectionHeadingProps) {
  return (
    <header className="document-padding flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <h2 id={id} className="retro-display scroll-mt-28">
          {title}
        </h2>
        <span className="mt-1 h-px flex-1 bg-border" aria-hidden="true" />
      </div>
      {blurb && <p className="max-w-2xl text-muted-foreground">{blurb}</p>}
    </header>
  );
}
