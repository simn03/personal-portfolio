"use client"
import React, {useState} from "react";
import SectionItem from "./SectionItem.component";

import CompactMode from "../icons/CompactMode.icon";
import LargeMode from "../icons/LargeMode.icon";

import {ItemType} from "../../../lib/Definitions";

type SectionProps = {
    items: ItemType[],
    className?: string,
    id?: string,
    header: string

}

export default function Section({items, className, id, header}: SectionProps) {

    const [isCompact, setIsCompact] = useState(false);

    function toggleCompact() {
        setIsCompact(!isCompact);
    }

    return (


        <section className={`${className} text-black dark:text-blue-100`}>

            <div className='text-2xl uppercase backdrop-blur-md flex flex-row justify-between items-center border-b-2 border-slate-300 dark:border-blue-200'
                id={id}>

                <h1>{header}</h1>

                <button
                    onClick={toggleCompact}
                    className="pb-2 flex flex-row hover:opacity-50 transition-opacity duration-600"
                    title={isCompact ? "Compact Mode" : "Large Mode"}>
                    <CompactMode className={`${isCompact ? "absolute" : "opacity-0"} fill-teal-600 dark:fill-teal-300 w-10 h-10 transition-all duration-300`} />
                    <LargeMode className={`${isCompact ? "opacity-0" : "absolute"} fill-teal-600 dark:fill-teal-300 w-10 h-10 transition-all duration-300`} />
                </button>

            </div>

            <div className={`${isCompact ? `flex flex-col` : `flex flex-col md:grid lg:grid-cols-2`} gap-10 transition-all`}>

                {
                    items.map((item, index) => {
                        return (
                            <SectionItem
                                key={index}
                                title={item.title}
                                description={item.description}
                                metadata={item.metadata}
                                image={item.image}
                                url={item.url}
                                page={item.page}
                                className={item.className}
                                isCompact={isCompact}
                            />
                        )
                    })
                }

            </div>

        </section >
    );
}