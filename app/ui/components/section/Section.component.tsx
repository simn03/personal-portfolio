"use client"
import React, {useMemo, useState} from "react";
import SectionItem from "./SectionItem.component";

import {ItemType} from "../../../lib/Definitions";
import FilterTabs from "./FilterTabs.component";
import ListItem from "./ListItem.component";

type SectionProps = {
  items: ItemType[],
  className?: string,
  id?: string,
  header: string
  tagline?: string,
  isList?: boolean,
}

export default function Section({items, className, header, tagline, id, isList = false}: SectionProps) {

  const [selectedTabs, setSelectedTabs] = useState([]);
  const [unselectedTabs, setUnselectedTabs] = useState(['archived']);

  const tabs = useMemo(() => {
    const allTags = items.map(({metadata}) => metadata).flat();
    const uniqueTags = Array.from(new Set(allTags));

    return uniqueTags.sort();
  }, [items])

  const filteredItems = useMemo(() => {
    if (!selectedTabs.length && !unselectedTabs.length) return items;
    return items.filter(({metadata = []}) => {
      return selectedTabs.every((tag) => metadata.includes(tag)) &&
        unselectedTabs.every((tag) => !metadata.includes(tag));
    })
  }, [items, selectedTabs, unselectedTabs]);

  return (
    <section className={`${className} text-black dark:text-blue-100`}>

      <div className="flex flex-row justify-between justify-items-center gap-10 sm:gap-20 document-padding-r w-full">
        <div className="w-full flex flex-col justify-end gap-4 mt-4 relative overflow-hidden">
          <div className='w-full border-b-4 border-slate-800 dark:border-blue-200'/>
          <p className="flex flex-row justify-end font-thin document-padding-l"> {tagline} </p>
        </div>
        
        <h1 id={id} className="uppercase text-xl sm:text-3xl font-extrabold">{header}</h1>

      </div>

      <FilterTabs
        tabs={tabs}
        selectedTabs={selectedTabs}
        unselectedTabs={unselectedTabs}
        setSelectedTabs={setSelectedTabs}
        setUnselectedTabs={setUnselectedTabs}
      />

      <div className={`flex flex-col ${isList ? '' : 'md:grid lg:grid-cols-3'} gap-10 transition-all document-padding`}>

        {
          filteredItems.map((item, index) => {
            return isList ? (<ListItem
              key={index}
              title={item.title}
              description={item.description}
              metadata={item.metadata}
              images={item.images}
              url={item.url}
              page={item.page}
              className={item.className}
              startDate={item.startDate}
              endDate={item.endDate}
            />) : (
              <SectionItem
                key={index}
                title={item.title}
                description={item.description}
                metadata={item.metadata}
                images={item.images}
                url={item.url}
                page={item.page}
                className={item.className}
              />
            )
          })
        }

      </div>

    </section >
  );
}