"use client"
import React, { useEffect, useState } from "react";
import SectionItem from "./SectionItem.component";

import CompactMode from "../icons/CompactMode.icon";
import LargeMode from "../icons/LargeMode.icon";

export default function Section({ items, className, header }) {

    const [isCompact, setIsCompact] = useState(true);

    function toggleCompact() {
        setIsCompact(!isCompact);
    }

    return (


        <section section className={`${className} text-black dark:text-blue-100`}>

            <div className='text-2xl uppercase backdrop-blur-md flex flex-row justify-between items-center border-b-2 border-slate-300 dark:border-blue-200'
                id='projects'>

                <h1>{header}</h1>

                <button
                    onClick={toggleCompact}
                    className="pb-2 flex flex-row hover:opacity-50 transition-opacity duration-600"
                    title={isCompact ? "Compact Mode" : "Large Mode"}>
                    <CompactMode className={`${isCompact ? "absolute" : "opacity-0"} fill-teal-600 dark:fill-teal-300 w-10 h-10 transition-all duration-300`} />
                    <LargeMode className={`${isCompact ? "opacity-0" : "absolute"} fill-teal-600 dark:fill-teal-300 w-10 h-10 transition-all duration-300`} />
                </button>

            </div>

            <div className={`${isCompact ? `flex flex-col` : `grid grid-cols-1 lg:grid-cols-2`} gap-10 transition-all`}>

                {
                    items.map((item) => {
                        return (
                            <SectionItem
                                key={item.key}
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