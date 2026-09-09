"use client";

import { Dayjs } from "dayjs";
import Image from "next/image";
import Tag from "./Tag.component";

type ListItemProps = {
  className?: string;
  images?: string[];
  title: string;
  description?: string[];
  metadata: string[];
  url?: string;
  page?: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
};

export default function ListItem({
  className,
  images = [],
  title,
  description = [],
  metadata,
  url,
  startDate,
  endDate,
}: ListItemProps) {
  const [job, ...details] = description;

  return (
    <article className={`${className ?? ""} flex flex-col gap-3`}>
      <div className="flex items-center gap-5">
        {images[0] && (
          <Image
            src={images[0]}
            width={56}
            height={56}
            className="size-14 rounded-lg bg-white object-contain p-1"
            alt={`${title} logo`}
          />
        )}
        {url ? (
          <a className="external text-3xl font-bold transition-colors hover:text-teal-600 dark:hover:text-teal-300" href={url} target="_blank" rel="noreferrer">
            {title}
          </a>
        ) : (
          <h3 className="text-3xl font-bold">{title}</h3>
        )}
      </div>

      <div className="flex gap-5">
        <div className="ml-6 mt-2 flex flex-col place-items-center gap-1">
          <div className="size-2 rounded-full bg-slate-500" />
          <div className="ml-[3.5px] w-px flex-grow self-stretch bg-slate-400/70" />
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          {job && <p className="text-xl">{job}</p>}
          {(startDate || endDate) && (
            <p className="text-slate-400">
              {startDate?.format("MMM YYYY") ?? ""} {startDate && endDate ? "—" : ""} {endDate?.format("MMM YYYY") ?? "Present"}
            </p>
          )}
          <ul className="list-outside list-disc space-y-2 pl-5">
            {details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
          <div className="flex flex-wrap gap-2 pt-1">
            {metadata.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
        </div>
      </div>
    </article>
  );
}
