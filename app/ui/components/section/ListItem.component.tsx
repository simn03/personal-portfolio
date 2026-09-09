"use client"

import { Dayjs } from "dayjs"
import Image from "next/image"
import Tag from "./Tag.component"

type SectionItemProps = {
  className?: string,
  images?: string[],
  title: string,
  description?: Array<string>,
  metadata: Array<string>,
  url: string,
  page: string,
  startDate?: Dayjs
  endDate?: Dayjs,
}



export default function ListItem({className, images, title, description, metadata, url, startDate, endDate}: SectionItemProps) {

  const [job, ...descriptions] = description;
  
  return (
    <div className={className + ' flex flex-col gap-2'}>
      
      <div className="flex flex-row gap-5 place-items-center">
        <Image
          src={images[0]}
          width={50}
          height={50}
          className={`h-full object-contain rounded-lg mb-3`}
          alt={`image of ${title} project`}
        />
        <a className="external text-3xl font-bold" href={url}> Ontraccr </a>
      </div>

      <div className="flex flex-row gap-5">
        <div className="flex flex-col place-items-center gap-1 ml-5 mt-2 ">
          <div className="size-2 rounded-full bg-slate-500"/>
          <div className="ml-[3.5px] flex-grow w-[1px] bg-slate-500 self-stretch"/>
        </div>

        <div className="flex-grow-0 flex flex-col gap-2">
          <p className="text-xl"> {job} </p>
          <div className="text-slate-400">
            {startDate.format("MMM YYYY")} - {endDate.format("MMM YYYY")}
          </div>
          <ul className="list-disc list-inside">
            {descriptions.map((desc, index) => {
              return (
                <li key={index} className="text-slate-600 dark:text-blue-200">
                  {desc}
                </li>
              )
            }
            )}
          </ul>
          <div className="flex flex-row flex-wrap gap-2">
            {metadata.map((tag) => {
              return <Tag key={tag}>{tag}</Tag>
            })}
          </div>
        </div>
      </div>

    </div>
  )
};
