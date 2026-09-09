"use client";

import Image from "next/image";
import Tag from "./Tag.component";
import { formatDateRange, formatDuration } from "@/lib/utils/dates";

type ListItemProps = {
  className?: string;
  images?: string[];
  title: string;
  description?: string[];
  metadata: string[];
  url?: string;
  page?: string;
  startDate?: string;
  endDate?: string;
};

/**
 * A role in the work history. Shares the card, chip, rule and eyebrow recipes
 * with the project cards and feed rows so the whole page reads as one system:
 * an identity block, a hairline, the write-up, then the stack.
 */
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
  const [role, ...details] = description;
  const dateRange = formatDateRange(startDate, endDate);
  const duration = formatDuration(startDate, endDate);
  const logo = images[0];

  return (
    <article className={`${className ?? ""} retro-card gap-0 p-0`}>
      <div className="flex items-start gap-4 p-5 sm:gap-5">
        {logo && (
          <Image
            src={logo}
            width={56}
            height={56}
            className="size-12 shrink-0 rounded-xl border border-border bg-card object-contain p-1 sm:size-14"
            alt={`${title} logo`}
          />
        )}

        <div className="flex min-w-0 flex-col gap-1">
          {url ? (
            <a
              className="link-accent text-2xl font-black lowercase tracking-tight sm:text-3xl"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              {title}
            </a>
          ) : (
            <h3 className="text-2xl font-black lowercase tracking-tight sm:text-3xl">
              {title}
            </h3>
          )}

          {role && <p className="text-base font-semibold text-foreground/90">{role}</p>}

          {dateRange && (
            <p className="retro-eyebrow text-muted-foreground">
              {dateRange}
              {duration && (
                <>
                  <span aria-hidden="true"> · </span>
                  {duration}
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {details.length > 0 && (
        <ul className="flex flex-col gap-3 border-t border-border p-5 text-sm leading-relaxed text-foreground/90 sm:text-base">
          {details.map((detail) => (
            <li key={detail} className="flex gap-3">
              <span
                className="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-primary"
                aria-hidden="true"
              />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}

      {metadata.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border p-5">
          {metadata.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}
    </article>
  );
}
