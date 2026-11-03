"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import Tag from "./Tag.component";
import ProjectBadge from "./ProjectBadge.component";
import ScrollButton from "../home/ScrollButton.component";
import { formatDateRange, formatDuration, PRESENT_LABEL } from "@/lib/utils/dates";

type ListItemProps = {
  className?: string;
  images?: string[];
  title: string;
  description?: string[];
  metadata: string[];
  url?: string;
  /** Short label beside the title ("Startup", "Freelance", …). */
  badge?: string;
  /** `id` of the project card this role links to. */
  project?: string;
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
  badge,
  project,
  startDate,
  endDate,
}: ListItemProps) {
  const [role, ...details] = description;
  // The write-up starts folded so the list scans as a timeline; the header and
  // the stack row stay visible either way.
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  // A role with neither date is ongoing and reads simply "Present".
  const dateRange =
    !startDate && !endDate ? PRESENT_LABEL : formatDateRange(startDate, endDate);
  const duration = formatDuration(startDate, endDate);
  const logo = images[0];

  return (
    <article className={`${className ?? ""} retro-card gap-0 p-0`}>
      <div className="flex items-start gap-4 p-5 sm:gap-5">
        {logo ? (
          <Image
            src={logo}
            width={56}
            height={56}
            className="size-12 shrink-0 rounded-xl border border-border bg-card object-contain p-1 sm:size-14"
            alt={`${title} logo`}
          />
        ) : (
          <span
            className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-xl font-black uppercase text-primary sm:size-14 sm:text-2xl"
            aria-hidden="true"
          >
            {title.charAt(0)}
          </span>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
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
            {badge && <ProjectBadge>{badge}</ProjectBadge>}
          </div>

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
        <div
          id={detailsId}
          className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
          inert={!expanded}
        >
          <div className="min-h-0 overflow-hidden">
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
          </div>
        </div>
      )}

      {(metadata.length > 0 || project || details.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 border-t border-border p-5">
          {metadata.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
          <div className="ml-auto flex items-center gap-4">
            {details.length > 0 && (
              <button
                type="button"
                onClick={() => setExpanded((open) => !open)}
                aria-expanded={expanded}
                aria-controls={detailsId}
                className="link-accent retro-eyebrow flex items-center gap-1 py-1"
              >
                {expanded ? "hide details" : "details"}
                <ChevronDown
                  className={`size-3 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            )}
            {project && (
              <ScrollButton elementID={`project-${project}`} className="link-accent retro-eyebrow py-1">
                see the project ↓
              </ScrollButton>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
