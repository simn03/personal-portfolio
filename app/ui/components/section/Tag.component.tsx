type TagProps = {
  children: React.ReactNode;
  isSelected?: boolean;
  isUnselected?: boolean;
  shouldHover?: boolean;
};

/**
 * Pills used for tech tags & filters. Styles come from the shared `.chip*`
 * recipes in global.css so every tag looks identical app-wide.
 */
export default function Tag({
  children,
  isSelected = false,
  isUnselected = false,
  shouldHover = true,
}: TagProps) {
  const stateClass = isUnselected
    ? "chip-unselected"
    : isSelected
      ? "chip-selected"
      : "chip-idle";

  const hoverClass =
    shouldHover && !isSelected && !isUnselected
      ? "hover:border-primary hover:text-primary"
      : "";

  return (
    <span className={`chip ${stateClass} ${hoverClass}`}>
      <span className="select-none">{children}</span>
    </span>
  );
}
