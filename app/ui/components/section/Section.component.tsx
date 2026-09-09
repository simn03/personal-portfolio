"use client";

import { useMemo, useState } from "react";
import { ItemType } from "../../../lib/Definitions";
import FilterTabs from "./FilterTabs.component";
import ListItem from "./ListItem.component";
import SectionItem from "./SectionItem.component";

type SectionProps = {
  items: ItemType[];
  className?: string;
  id?: string;
  header: string;
  tagline?: string;
  isList?: boolean;
};

export default function Section({ items, className, header, tagline, id, isList = false }: SectionProps) {
  const [selectedTabs, setSelectedTabs] = useState<string[]>([]);
  const [unselectedTabs, setUnselectedTabs] = useState<string[]>(["archived"]);

  const tabs = useMemo(() => {
    const allTags = items.flatMap(({ metadata }) => metadata);
    return Array.from(new Set(allTags)).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!selectedTabs.length && !unselectedTabs.length) return items;

    return items.filter(({ metadata = [] }) =>
      selectedTabs.every((tag) => metadata.includes(tag)) &&
      unselectedTabs.every((tag) => !metadata.includes(tag))
    );
  }, [items, selectedTabs, unselectedTabs]);

  return (
    <section className={`${className ?? ""} text-slate-600 dark:text-blue-100`}>
      <div className="flex w-full flex-row justify-between gap-8 document-padding-r sm:gap-20">
        <div className="relative mt-4 flex w-full flex-col justify-end gap-4 overflow-hidden">
          <div className="w-full border-b-4 border-slate-800 dark:border-blue-200" />
          <p className="flex flex-row justify-end text-right font-thin document-padding-l">{tagline}</p>
        </div>
        <h2 id={id} className="scroll-mt-28 text-xl font-extrabold uppercase sm:text-3xl">{header}</h2>
      </div>

      <FilterTabs
        tabs={tabs}
        selectedTabs={selectedTabs}
        unselectedTabs={unselectedTabs}
        setSelectedTabs={setSelectedTabs}
        setUnselectedTabs={setUnselectedTabs}
      />

      <div className={`document-padding flex flex-col gap-10 transition-all ${isList ? "" : "md:grid md:grid-cols-2 lg:grid-cols-3"}`}>
        {filteredItems.map((item) =>
          isList ? (
            <ListItem key={item.title} {...item} />
          ) : (
            <SectionItem key={item.title} {...item} />
          )
        )}
      </div>

      {filteredItems.length === 0 && (
        <p className="document-padding text-sm text-slate-400">No items match the active filters.</p>
      )}
    </section>
  );
}
