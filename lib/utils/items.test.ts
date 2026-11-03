import { describe, expect, it } from "vitest";
import type { ItemType } from "../../app/lib/Definitions";
import {
  ARCHIVED_TAG,
  NO_MATCH_MESSAGE,
  filterSectionItems,
  groupTags,
  hasArchivedTag,
  splitCategoryTag,
  uniqueSortedTags,
} from "./items";

const items: ItemType[] = [
  {
    title: "Alpha",
    metadata: ["react", "typescript", "archived"],
    description: [],
  },
  {
    title: "Beta",
    metadata: ["react"],
    description: [],
  },
  {
    title: "Gamma",
    metadata: ["c++", "opengl"],
    description: [],
  },
];

describe("uniqueSortedTags", () => {
  it("returns sorted unique tags including 'archived'", () => {
    expect(uniqueSortedTags(items)).toEqual(["archived", "c++", "opengl", "react", "typescript"]);
  });

  it("tolerates items with an empty metadata list", () => {
    const emptyMeta: ItemType = { title: "Solo", metadata: [], description: [] };
    expect(uniqueSortedTags([...items, emptyMeta])).toEqual([
      "archived",
      "c++",
      "opengl",
      "react",
      "typescript",
    ]);
  });
});

describe("hasArchivedTag", () => {
  it("detects the presence of archived items", () => {
    expect(hasArchivedTag(items)).toBe(true);
    expect(hasArchivedTag(items.slice(1))).toBe(false);
  });
});

describe("filterSectionItems", () => {
  it("hides archived items by default", () => {
    expect(filterSectionItems(items, [])).toEqual([items[1], items[2]]);
  });

  it("shows everything when nothing is selected and archived are included", () => {
    expect(filterSectionItems(items, [], true)).toHaveLength(items.length);
  });

  it("requires every selected tag (AND semantics)", () => {
    expect(filterSectionItems(items, ["react"], true)).toEqual([items[0], items[1]]);
    expect(filterSectionItems(items, ["react", "typescript"], true)).toEqual([items[0]]);
  });

  it("combined with archived filtering", () => {
    expect(filterSectionItems(items, ["react"])).toEqual([items[1]]);
    expect(filterSectionItems(items, ["react"], true)).toEqual([items[0], items[1]]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterSectionItems(items, ["svelte"])).toEqual([]);
  });

  it("is pure — the input array is untouched", () => {
    const original = items.map((item) => item.title);
    filterSectionItems(items, ["react"], true);
    expect(items.map((item) => item.title)).toEqual(original);
  });
});

describe("constants", () => {
  it("exposes the archived sentinel and stable empty-state copy", () => {
    expect(ARCHIVED_TAG).toBe("archived");
    expect(NO_MATCH_MESSAGE).toBe("No items match the active filters.");
  });
});

describe("category filters", () => {
  const courses: ItemType[] = [
    { title: "One", metadata: ["UBC", "Grade: A+", "Skill: C"], description: [] },
    { title: "Two", metadata: ["UBC", "Grade: A", "Skill: Java"], description: [] },
    { title: "Three", metadata: ["UBC", "Grade: B+", "Skill: C"], description: [] },
  ];

  it("groups 'Category: Value' tags and orders letter grades best-first", () => {
    const { plain, categories } = groupTags([
      "UBC",
      "Grade: B+",
      "Grade: A-",
      "Grade: A+",
      "Grade: A",
      "Skill: Java",
      "Skill: C",
    ]);
    expect(plain).toEqual(["UBC"]);
    expect(categories).toEqual([
      { name: "Grade", tags: ["Grade: A+", "Grade: A", "Grade: A-", "Grade: B+"] },
      { name: "Skill", tags: ["Skill: C", "Skill: Java"] },
    ]);
  });

  it("treats values within a category as alternatives", () => {
    const titles = filterSectionItems(courses, ["Grade: A+", "Grade: A"]).map((i) => i.title);
    expect(titles).toEqual(["One", "Two"]);
  });

  it("still requires every category and plain tag that is selected", () => {
    const titles = filterSectionItems(courses, ["UBC", "Grade: A+", "Grade: B+", "Skill: C"]).map(
      (i) => i.title
    );
    expect(titles).toEqual(["One", "Three"]);
    expect(filterSectionItems(courses, ["Grade: A", "Skill: C"])).toEqual([]);
  });

  it("leaves tags without a value as plain tags", () => {
    expect(splitCategoryTag("Grade:")).toBeNull();
    expect(splitCategoryTag("Next.js")).toBeNull();
    expect(splitCategoryTag("Skill: C++")).toEqual({ category: "Skill", value: "C++" });
  });
});
