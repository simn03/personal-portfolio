import { ItemType } from "../../app/lib/Definitions";

export const ARCHIVED_TAG = "archived";

/**
 * Returns every unique metadata tag across the given items, sorted.
 * (Includes the special `archived` tag — callers decide how to surface it.)
 */
export function uniqueSortedTags(items: ItemType[]): string[] {
  return Array.from(new Set(items.flatMap(({ metadata = [] }) => metadata))).sort();
}

/**
 * Filters items by tag intent:
 *  - active `selected` tags must ALL be present on a kept item.
 *  - `archived` items are hidden unless `includeArchived` is set.
 *  - With no active selection everything (non-archived) matches.
 */
export function filterSectionItems(
  items: ItemType[],
  selected: string[],
  includeArchived = false
): ItemType[] {
  const matchSelected = selected.length === 0
    ? items
    : items.filter(({ metadata = [] }) =>
        selected.every((tag) => metadata.includes(tag))
      );

  if (includeArchived) {
    return matchSelected;
  }
  return matchSelected.filter(
    ({ metadata = [] }) => !metadata.includes(ARCHIVED_TAG)
  );
}

/** True when any item in the collection carries the archived tag. */
export function hasArchivedTag(items: ItemType[]): boolean {
  return items.some(({ metadata = [] }) => metadata.includes(ARCHIVED_TAG));
}

/** Empty-state message used when the active filters hide everything. */
export const NO_MATCH_MESSAGE = "No items match the active filters.";
