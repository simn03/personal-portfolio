"use client";

import Image from "next/image";
import { Images } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Tag from "./Tag.component";
import ProjectBadge from "./ProjectBadge.component";

type SectionItemProps = {
  className?: string;
  images?: string[];
  title: string;
  description?: string[];
  metadata: string[];
  url?: string;
  /** Anchor slug; the card renders as `#project-<id>`. */
  id?: string;
  /** Short label beside the title ("Startup", "Freelance", …). */
  badge?: string;
  /** Position in the grid, rendered as a catalogue number. */
  index?: number;
};

/** Tags shown on the card before collapsing the rest into a "+N" chip. */
const VISIBLE_TAGS = 4;

/**
 * Project card for the grid section. The card stays deliberately uniform — a
 * preview, one lead line and a capped tag row — so a row of cards scans evenly;
 * the full write-up, every tag and the whole gallery live in the dialog.
 */
export default function SectionItem({
  className,
  images = [],
  title,
  description = [],
  metadata,
  url,
  id,
  badge,
  index,
}: SectionItemProps) {
  const preview = images[0];
  const [lead, ...rest] = description;
  const hiddenTags = metadata.length - VISIBLE_TAGS;
  const catalogue =
    index === undefined ? null : String(index + 1).padStart(2, "0");

  const gallery = (
    <DialogContent
      className="flex w-[calc(100%-2rem)] max-w-5xl flex-col gap-0 overflow-y-hidden p-0 sm:max-w-5xl"
    >
      {/* Header stays put (with the close button) while the body scrolls. */}
      <DialogHeader className="shrink-0 border-b border-border p-4 pr-14 sm:p-6 sm:pr-14">
        <DialogTitle className="flex flex-wrap items-baseline gap-x-3 gap-y-2 text-xl sm:text-2xl">
          {catalogue && (
            <span className="retro-eyebrow text-primary" aria-hidden="true">
              {catalogue}
            </span>
          )}
          {title}
          {badge && <ProjectBadge>{badge}</ProjectBadge>}
        </DialogTitle>
        <DialogDescription>
          {images.length > 1
            ? `${images.length} project images. Use the arrows or swipe to browse.`
            : images.length === 1
              ? "Project image and details."
              : "Project details."}
        </DialogDescription>
      </DialogHeader>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6">

      {images.length > 0 && (
        <Carousel
          opts={{ loop: images.length > 1 }}
          className="mx-auto w-[calc(100%-4rem)] sm:w-[calc(100%-6rem)]"
        >
          <CarouselContent>
            {images.map((image, imageIndex) => (
              <CarouselItem key={image}>
                {/* The image itself carries the rounded frame, so it fills the box
                    at its own aspect ratio and sits centred. Slides stretch to the
                    tallest image, so the gallery never jumps between screenshots. */}
                <div className="flex h-full items-center justify-center">
                  <Image
                    src={image}
                    width={1600}
                    height={1000}
                    sizes="(min-width: 1024px) 64rem, 90vw"
                    // The dialog only mounts when opened, so load every slide now:
                    // the stage sizes to the tallest one instead of growing later.
                    loading="eager"
                    className="h-auto max-h-[min(52dvh,34rem)] w-auto max-w-full rounded-lg border border-border bg-muted object-contain"
                    alt={`${title} project screenshot ${imageIndex + 1} of ${images.length}`}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      )}

      {/* The full write-up: every bullet the card had to leave out. */}
      {description.length > 0 && (
        <ul className="flex list-none flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
          {description.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
        {metadata.map((tag) => (
          <Tag key={tag} shouldHover={false}>
            {tag}
          </Tag>
        ))}
      </div>

        {url && (
          <a
            className="link-accent retro-eyebrow self-start"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            visit {title} ↗
          </a>
        )}
      </div>
    </DialogContent>
  );

  return (
    <article
      id={id ? `project-${id}` : undefined}
      className={`${className ?? ""} retro-card retro-target group scroll-mt-28 gap-4 p-4 hover:border-primary/50`}
    >
      <Dialog>
        <DialogTrigger asChild>
          <button
            type="button"
            className="retro-frame group/image h-52 bg-muted p-2"
            aria-label={
              preview ? `Open the ${title} gallery and details` : `Open the ${title} details`
            }
          >
            {preview ? (
              <Image
                src={preview}
                width={500}
                height={500}
                className="h-full w-full object-contain transition-transform duration-300 group-hover/image:scale-105"
                alt={`${title} project preview`}
              />
            ) : (
              // No screenshots to show (private or not public yet): a quiet
              // typographic cover keeps the grid even and still opens the write-up.
              <span className="retro-cover" aria-hidden="true">
                <span className="retro-cover-title transition-transform duration-300 group-hover/image:scale-105">
                  {title}
                </span>
              </span>
            )}
            {badge && (
              <span className="retro-badge retro-badge-active z-10 left-3 top-3 bg-card uppercase tracking-[0.14em] shadow-sm">
                {badge}
              </span>
            )}
            {images.length > 1 && (
              <span className="retro-badge retro-badge-muted left-auto right-2 top-auto bottom-2 flex items-center gap-1">
                <Images className="size-3" aria-hidden="true" />
                {images.length}
              </span>
            )}
          </button>
        </DialogTrigger>
        {gallery}
      </Dialog>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          {catalogue && (
            <span className="retro-eyebrow text-primary" aria-hidden="true">
              {catalogue}
            </span>
          )}
          {url ? (
            <a
              className="link-accent text-xl font-semibold leading-tight"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              {title}
            </a>
          ) : (
            <h3 className="text-xl font-semibold leading-tight">{title}</h3>
          )}
        </div>
        <span className="h-px w-full bg-border" aria-hidden="true" />
      </div>

      {lead && (
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{lead}</p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2">
        {metadata.slice(0, VISIBLE_TAGS).map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
        {hiddenTags > 0 && (
          <span
            className="chip chip-idle text-xs"
            title={metadata.slice(VISIBLE_TAGS).join(", ")}
          >
            +{hiddenTags}
          </span>
        )}
      </div>

      {rest.length > 0 && (
        <p className="retro-eyebrow text-muted-foreground">
          {rest.length} more detail{rest.length === 1 ? "" : "s"}
          {preview ? " in the gallery" : " inside"}
        </p>
      )}
    </article>
  );
}
