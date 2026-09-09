import Tag from "./Tag.component";
import { ARCHIVED_TAG } from "@/lib/utils/items";

type FilterTabsProps = {
  tabs: string[];
  selected: string[];
  onToggle: (tab: string) => void;
  onClear: () => void;
  /** Whether the collection contains archived items (shows the toggle). */
  hasArchived?: boolean;
  includeArchived?: boolean;
  onToggleArchived?: () => void;
  filteredCount: number;
  totalCount: number;
};

/**
 * Retro, single-state tag filter. Clicking a tag adds it as an "include"
 * filter (AND); clicking it again removes it. Archived items have their own
 * explicit toggle, and a live count + clear affordance keep the state obvious.
 */
export default function FilterTabs({
  tabs,
  selected,
  onToggle,
  onClear,
  hasArchived = false,
  includeArchived = false,
  onToggleArchived,
  filteredCount,
  totalCount,
}: FilterTabsProps) {
  const visibleTabs = tabs.filter((tab) => tab !== ARCHIVED_TAG);
  const isFiltering = selected.length > 0 || includeArchived;
  const everythingShown = filteredCount === totalCount;

  return (
    <div className="document-padding flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter items by tag">
        <span className="mr-1 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground" aria-hidden="true">
          browse:
        </span>

        {visibleTabs.map((tab) => {
          const isActive = selected.includes(tab);
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onToggle(tab)}
              aria-pressed={isActive}
              title={isActive ? `Remove ${tab} filter` : `Show only ${tab}`}
            >
              <Tag isSelected={isActive} shouldHover={false}>
                {tab}
              </Tag>
            </button>
          );
        })}

        {hasArchived && onToggleArchived && (
          <>
            <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
            <button
              type="button"
              onClick={onToggleArchived}
              aria-pressed={includeArchived}
              title={includeArchived ? "Hide archived items" : "Include archived items"}
            >
              <Tag isSelected={includeArchived} shouldHover={false}>
                {includeArchived ? "hide archived" : "show archived"}
              </Tag>
            </button>
          </>
        )}

        {isFiltering && (
          <button
            type="button"
            onClick={onClear}
            className="link-accent ml-2 font-mono text-xs uppercase tracking-wider"
          >
            clear ✕
          </button>
        )}
      </div>

      <p className="font-mono text-xs text-muted-foreground" aria-live="polite">
        {everythingShown && !isFiltering
          ? `showing all ${totalCount}`
          : `showing ${filteredCount} of ${totalCount}`}
        {selected.length > 0 && !everythingShown && ` · matching ${selected.join(", ")}`}
        {includeArchived && !everythingShown && " · including archived"}
      </p>
    </div>
  );
}
