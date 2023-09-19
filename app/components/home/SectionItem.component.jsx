"use client"

import Image from 'next/image'

import { useState } from 'react'
import CompactMode from '../icons/CompactMode.icon';

function Tag({ children }) {
    return (
        <div className='flex text-teal-500 dark:text-teal-300 bg-teal-300 dark:bg-teal-500 bg-opacity-25 dark:bg-opacity-25 rounded-3xl hover:outline'>
            <p className="text-sm px-4 p-1 select-none place-self-center whitespace-nowrap">{children}</p>
        </div>
    )
}

export default function SectionItem({ className, image, title, description, metadata, url, page, isCompact }) {

    const [showMore, setShowMore] = useState(false);

    function toggleShowMore() {
        setShowMore(!showMore);
    }

    return (
        <div className={`z-10 flex flex-col gap-3 bg-glass dark:text-blue-200 text-slate-600 ` + className}>

            <div className='flex flex-row justify-between items-center '>
                <a className="text-2xl hover:cursor-pointer" href={url} target='_blank'> {title} </a>

                <button onClick={toggleShowMore} className={`${isCompact ? "block" : "hidden"} text-teal-600 dark:text-teal-300 hover:line-through`}>{showMore ? "Collapse" : "Expand"}</button>

            </div>


            <div className={`flex overflow-hidden hover:cursor-pointer gap-5`} href={page}>

                <Image
                    src={image}
                    className={`${isCompact ? `h-16 w-16 sm:h-24 sm:w-24 object-cover` : 'object-contain'} hover:scale-110  sm:transition-all duration-200 rounded-lg`}
                    alt={`image of ${title} project`} />

                <ul className={`${isCompact ? `block` : 'hidden'} basis-9/12 list ${showMore ? `` : `max-h-[4.5em] sm:line-clamp-4 sm:max-h-full`} flex-grow`}>

                    {description.map((paragraph, index) => { return <li key={index}>{paragraph}</li> })}

                </ul>

            </div>




            <div className="mt-3 flex flex-row max-sm:no-scrollbar max-sm:overflow-x-scroll md:flex-wrap gap-2">
                {
                    metadata.map((tag, index) => {
                        return <Tag key={index}>{tag}</Tag>
                    })
                }
            </div>


        </div>
    )
}