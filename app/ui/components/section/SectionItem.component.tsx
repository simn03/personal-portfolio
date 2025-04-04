"use client"

import Image from 'next/image'

import {useEffect, useMemo, useState} from 'react'

import CaretDownFilled from '../icons/CaretDownFilled.icon'
import {IoCloseCircleSharp} from "react-icons/io5";
import Tag from './Tag.component'
import { Carousel } from 'antd'

type SectionItemProps = {
  className?: string,
  images?: string[],
  title: string,
  description?: Array<string>,
  metadata: Array<string>,
  url: string,
  page: string,
  isCompact: boolean
}


export default function SectionItem({className, images, title, description, metadata, url, page, isCompact}: SectionItemProps) {
  const [showMore, setShowMore] = useState(false);
  const [showCarousel, setShowCarousel] = useState(false);

  function toggleShowMore() {
    setShowMore(!showMore);
  }

  const toggleShowCarousel = () => {
    setShowCarousel(!showCarousel);
  }

  const imageNodes = useMemo(() => {
    if (images && images.length > 0) {
      return images.map((image) => {
        return <Image
                key={image}
                src={image}
                width={1080}
                height={192}
                className={`h-full object-contain scale-90 hover:bg-gray-600 sm:transition-all duration-200 rounded-lg`}
                alt={`image of ${title} project`}
              />
      }
      )
    }
    return null;
  }, [images, title])

  return (
    <>

      <div className={`w-full h-full fixed top-0 left-0 bg-glass dark:bg-black/50 pt-20 
        backdrop-blur-sm flex flex-col justify-center items-center z-30
        ${showCarousel ? `block no-doc-scroll` : `hidden`} `}>
          <button
            onClick={toggleShowCarousel}
            className={`absolute text-3xl top-[105] right-10 hover:opacity-50 transition-opacity duration-600 text-white z-[99999]`}
            title="Close Carousel">
            <IoCloseCircleSharp />
          </button>
          <Carousel key={`carousel-${showCarousel}`} autoplay arrows
            dots={false} className={`w-[90vw] h-full flex flex-col justify-center items-center`}>
            {imageNodes}
          </Carousel>
        </div>
     
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

      

          {images && images.length > 0 && (
            <Image
              src={images[0]}
              width={isCompact ? 200 : 1080}
              height={isCompact ? 200 : 192}
              className={`${isCompact ? `h-16 w-16 sm:h-24 sm:w-24 object-cover` : 'object-contain'} hover:scale-110 hover:opacity-50 hover:bg-gray-600 sm:transition-all duration-200 rounded-lg`}
              alt={`image of ${title} project`}
              onClick={toggleShowCarousel}
            />
          )}

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