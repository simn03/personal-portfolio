type ProjectBadgeProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Marks what kind of thing an item is ("Startup", "Freelance", …). It sits
 * apart from the tech tags: accented, monospace, and never part of the filters.
 */
export default function ProjectBadge({ children, className }: ProjectBadgeProps) {
  return <span className={`chip-badge ${className ?? ""}`}>{children}</span>;
}
