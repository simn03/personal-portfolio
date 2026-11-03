import { ItemType } from "../../app/lib/Definitions";

export const ARCHIVED_TAG = "archived";

/**
 * Returns every unique metadata tag across the given items, sorted.
 * (Includes the special `archived` tag — callers decide how to surface it.)
 */
export type TagAccessor = (item: ItemType) => string[];

/** Default: an item's filterable tags are its metadata. */
export const metadataTags: TagAccessor = ({ metadata = [] }) => metadata;

export function uniqueSortedTags(items: ItemType[], tagsOf: TagAccessor = metadataTags): string[] {
  return Array.from(new Set(items.flatMap(tagsOf))).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base", numeric: true })
  );
}

/** Separator between a category and its value, e.g. "Grade: A-". */
const CATEGORY_SEPARATOR = ": ";

/** Splits "Grade: A-" into its category and value; plain tags return null. */
export function splitCategoryTag(tag: string): { category: string; value: string } | null {
  const at = tag.indexOf(CATEGORY_SEPARATOR);
  if (at <= 0) return null;
  const value = tag.slice(at + CATEGORY_SEPARATOR.length).trim();
  return value ? { category: tag.slice(0, at), value } : null;
}

export type TagCategory = { name: string; tags: string[] };

/** Broad-to-narrow order for known categories; anything else follows, A–Z. */
const CATEGORY_ORDER = ["Subject", "Level", "Year", "Grade", "Skill"];
const categoryRank = (name: string) => {
  const rank = CATEGORY_ORDER.indexOf(name);
  return rank === -1 ? CATEGORY_ORDER.length : rank;
};

const LETTER_GRADE = /^[A-F][+-]?$/;
const gradeRank = (value: string) =>
  value.charCodeAt(0) * 3 + (value[1] === "+" ? 0 : value[1] === "-" ? 2 : 1);

/** Letter grades read best-first (A+, A, A-, B+…); everything else alphabetically. */
function compareCategoryValues(a: string, b: string): number {
  if (LETTER_GRADE.test(a) && LETTER_GRADE.test(b)) return gradeRank(a) - gradeRank(b);
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

/**
 * Splits a tag list into plain tags and "Category: Value" groups, so a filter
 * UI can show categories as multi-select menus instead of a wall of chips.
 */
export function groupTags(tags: string[]): { plain: string[]; categories: TagCategory[] } {
  const plain: string[] = [];
  const byCategory = new Map<string, string[]>();
  for (const tag of tags) {
    const parts = splitCategoryTag(tag);
    if (!parts) {
      plain.push(tag);
      continue;
    }
    byCategory.set(parts.category, [...(byCategory.get(parts.category) ?? []), tag]);
  }
  const categories = Array.from(byCategory, ([name, categoryTags]) => ({
    name,
    tags: categoryTags.sort((a, b) =>
      compareCategoryValues(splitCategoryTag(a)!.value, splitCategoryTag(b)!.value)
    ),
  })).sort((a, b) => categoryRank(a.name) - categoryRank(b.name) || a.name.localeCompare(b.name));
  return { plain, categories };
}

/**
 * Filters items by tag intent:
 *  - selected plain tags must ALL be present on a kept item.
 *  - selected values within one category are alternatives (Grade: A+ OR
 *    Grade: A); each category with a selection must be satisfied (AND).
 *  - `archived` items are hidden unless `includeArchived` is set.
 *  - With no active selection everything (non-archived) matches.
 */
export function filterSectionItems(
  items: ItemType[],
  selected: string[],
  includeArchived = false,
  tagsOf: TagAccessor = metadataTags
): ItemType[] {
  const required: string[] = [];
  const anyOf = new Map<string, string[]>();
  for (const tag of selected) {
    const parts = splitCategoryTag(tag);
    if (parts) anyOf.set(parts.category, [...(anyOf.get(parts.category) ?? []), tag]);
    else required.push(tag);
  }

  const matchSelected = selected.length === 0
    ? items
    : items.filter((item) => {
        const tags = tagsOf(item);
        return (
          required.every((tag) => tags.includes(tag)) &&
          Array.from(anyOf.values()).every((options) => options.some((tag) => tags.includes(tag)))
        );
      });

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
