"use client";

import { useMemo, useState } from "react";
import { ItemType } from "../../../lib/Definitions";
import {
  ARCHIVED_TAG,
  filterSectionItems,
  hasArchivedTag,
  metadataTags,
  NO_MATCH_MESSAGE,
  uniqueSortedTags,
} from "@/lib/utils/items";
import CourseItem, { courseFilterTags } from "./CourseItem.component";
import FilterTabs from "./FilterTabs.component";
import ListItem from "./ListItem.component";
import SectionItem from "./SectionItem.component";
import SectionHeading from "./SectionHeading.component";

type SectionVariant = "grid" | "list" | "course";

type SectionProps = {
  items: ItemType[];
  className?: string;
  id?: string;
  header: string;
  tagline?: string;
  /** Visual layout for the items. Defaults to the project-card grid. */
  variant?: SectionVariant;
};

const VARIANT_CONTAINER: Record<SectionVariant, string> = {
  grid: "document-padding grid grid-cols-1 gap-8 transition-all md:grid-cols-2 lg:grid-cols-3",
  list: "document-padding flex flex-col gap-8 transition-all",
  course: "document-padding grid grid-cols-1 gap-4 transition-all md:grid-cols-2",
};

export default function Section({
  items,
  className,
  header,
  tagline,
  id,
  variant = "grid",
}: SectionProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [includeArchived, setIncludeArchived] = useState(false);
  // Courses filter on structured facts (subject, level, year…) parsed from
  // their tags; everything else filters on its tags directly.
  const tagsOf = variant === "course" ? courseFilterTags : metadataTags;

  // Only offer tags something on screen can match: archived-only tags stay
  // hidden until archived items are shown.
  const tabs = useMemo(
    () =>
      uniqueSortedTags(
        includeArchived
          ? items
          : items.filter(({ metadata = [] }) => !metadata.includes(ARCHIVED_TAG)),
        tagsOf
      ),
    [items, includeArchived, tagsOf]
  );
  const archived = useMemo(() => hasArchivedTag(items), [items]);

  const filteredItems = useMemo(
    () => filterSectionItems(items, selected, includeArchived, tagsOf),
    [items, selected, includeArchived, tagsOf]
  );

  const toggleTag = (tag: string) => {
    setSelected((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]
    );
  };

  const toggleArchived = () => {
    if (includeArchived) {
      // Drop picks that only archived items carry, so no invisible filter lingers.
      const stillOffered = new Set(
        uniqueSortedTags(
          items.filter(({ metadata = [] }) => !metadata.includes(ARCHIVED_TAG)),
          tagsOf
        )
      );
      setSelected((current) => current.filter((tag) => stillOffered.has(tag)));
    }
    setIncludeArchived(!includeArchived);
  };

  const clearFilters = () => {
    setSelected([]);
    setIncludeArchived(false);
  };

  return (
    <section className={`${className ?? ""} text-foreground`}>
      <SectionHeading id={id} title={header} blurb={tagline} />

      <FilterTabs
        tabs={tabs}
        selected={selected}
        onToggle={toggleTag}
        onClear={clearFilters}
        hasArchived={archived}
        includeArchived={includeArchived}
        onToggleArchived={toggleArchived}
        filteredCount={filteredItems.length}
        totalCount={items.length}
      />

      <div className={VARIANT_CONTAINER[variant]}>
        {filteredItems.map((item, index) => {
          if (variant === "list") {
            return <ListItem key={item.title} {...item} />;
          }
          if (variant === "course") {
            return <CourseItem key={item.title} item={item} />;
          }
          return <SectionItem key={item.title} index={index} {...item} />;
        })}
      </div>

      {filteredItems.length === 0 && (
        <p className="document-padding text-sm text-muted-foreground">{NO_MATCH_MESSAGE}</p>
      )}
    </section>
  );
}
