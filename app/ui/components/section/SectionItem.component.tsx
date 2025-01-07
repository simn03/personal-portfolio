"use client"

import Image from 'next/image'

import {useState} from 'react'

import CaretDownFilled from '../icons/CaretDownFilled.icon'
import Tag from './Tag.component'

type SectionItemProps = {
  className?: string,
  image?: string,
  title: string,
  description?: Array<string>,
  metadata: Array<string>,
  url: string,
  page: string,
  isCompact: boolean
}

export default function SectionItem({className, image, title, description, metadata, url, page, isCompact}: SectionItemProps) {

  const [showMore, setShowMore] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);

  function toggleShowMore() {
    setShowMore(!showMore);
  }

  return (
    <>
      <div className={`z-10 flex flex-col justify-between gap-3 bg-glass dark:text-blue-200 text-slate-600 ` + className}
        onClick={toggleShowMore}>

        <div className='flex flex-row justify-between items-start '>
          <a className="text-xl sm:text-2xl hover:cursor-pointer" href={url} target='_blank'> {title} </a>

          <button
            onClick={toggleShowMore}
            className={`${isCompact ? "block" : "hidden"} hover:animate-pulse duration-200`}
            title={showMore ? "Show Less" : "Show More"}>
            <CaretDownFilled className={`transform ${showMore ? "rotate-180" : "rotate-0"} transition-all duration-200 h-10 w-10 relative -top-2`} />
          </button>

        </div>


        <div className={`flex overflow-hidden hover:cursor-pointer gap-5`}>

          {image &&
            <Image
              src={image}
              width={isCompact ? 200 : 1080}
              height={isCompact ? 200 : 192}
              className={`${isCompact ? `h-16 w-16 sm:h-24 sm:w-24 object-cover` : 'object-contain'} hover:scale-110  sm:transition-all duration-200 rounded-lg`}
              alt={`image of ${title} project`}
              onClick={() => setShowCarousel(true)}
            />

          }
          {description && isCompact &&

            <ul className={`block basis-9/12 list ${showMore ? `` : `max-h-[4.5em] sm:line-clamp-3 md:line-clamp-4 sm:max-h-full`} flex-grow`}>

              {description.map((paragraph, index) => {return <li key={index}>{paragraph}</li>})}

            </ul>
          }


        </div>




        <div className="mt-3 flex flex-row max-sm:no-scrollbar max-sm:overflow-x-scroll md:flex-wrap gap-2">
          {
            metadata.map((tag, index) => {
              return <Tag key={index}>{tag}</Tag>
            })
          }
        </div>


      </div>
    </>

  )
}