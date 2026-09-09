"use client"

import Image from 'next/image'

import {useEffect, useMemo, useState} from 'react'

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
}


export default function SectionItem({className, images, title, description, metadata, url}: SectionItemProps) {
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

  useEffect(() => {
  // close carousel when the user clicks outside of it
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCarousel && !target.closest('.ant-carousel') && !target.closest('.ant-carousel .ant-carousel-arrow')) {
        setShowCarousel(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showCarousel]);

  return (
    <>

      <div className={`w-full h-full fixed top-0 left-0 bg-glass bg-black/50 pt-20 
        backdrop-blur-sm flex flex-col justify-center items-center z-30
        ${showCarousel ? `block no-doc-scroll` : `hidden`} `}>
          <Carousel key={`carousel-${showCarousel}`} autoplay arrows
            dots={false} className={`w-[90vw] h-full flex flex-col justify-center items-center`}>
            {imageNodes}
          </Carousel>
        </div>
     
      <div className={`z-10 flex flex-col justify-start gap-3 dark:text-blue-200 text-slate-600 ` + className}
        onClick={toggleShowMore}>

        <div className={`flex overflow-hidden hover:cursor-pointer gap-5`}>
          {images && images.length > 0 && (
            <Image
              src={images[0]}
              width={500}
              height={500}
              className={`object-contain hover:scale-110 hover:opacity-50 hover:bg-gray-600 sm:transition-all duration-200 rounded-lg h-56`}
              alt={`image of ${title} project`}
              onClick={toggleShowCarousel}
            />
          )}
        </div>

        <a className="external text-xl sm:text-2xl hover:cursor-pointer" href={url} target='_blank'> {title} </a>

        <div className="mt-3 py-2 flex flex-row max-sm:no-scrollbar overflow-x-scroll gap-2 no-scrollbar">
          {
            metadata.map((tag, index) => {
              return <Tag key={index}>{tag}</Tag>
            })
          }
        </div>

        <div className='flex-grow-0'>
          {description && description.length > 0 && description[0]}
        </div>

      </div>

     
    </>

  )
}
