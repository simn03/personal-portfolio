type OrnamentDividerProps = {
  className?: string;
  /** Character rendered in the middle of the divider. */
  glyph?: string;
  /** Accessible label for the decorative divider. */
  label?: string;
};

/**
 * Retro horizontal rule with a centered ornament (e.g. ✦). Used between
 * sections to add a decorative touch.
 */
export default function OrnamentDivider({
  className,
  glyph = "✦",
  label = "ornamental divider",
}: OrnamentDividerProps) {
  return (
    <div
      className={`flex items-center gap-4 text-primary ${className ?? ""}`}
      role="separator"
      aria-label={label}
    >
      <span className="h-px flex-1 bg-border" />
      <span className="text-xl leading-none" aria-hidden="true">
        {glyph}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
