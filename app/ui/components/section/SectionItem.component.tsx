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

type SectionItemProps = {
  className?: string;
  images?: string[];
  title: string;
  description?: string[];
  metadata: string[];
  url?: string;
  page?: string;
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
        <DialogTitle className="flex items-baseline gap-3 text-xl sm:text-2xl">
          {catalogue && (
            <span className="retro-eyebrow text-primary" aria-hidden="true">
              {catalogue}
            </span>
          )}
          {title}
        </DialogTitle>
        <DialogDescription>
          {images.length > 1
            ? `${images.length} project images. Use the arrows or swipe to browse.`
            : "Project image."}
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
                <div className="relative aspect-video max-h-[45dvh] overflow-hidden rounded-lg border border-border bg-muted">
                  <Image
                    src={image}
                    fill
                    sizes="90vw"
                    className="object-contain p-2"
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
      className={`${className ?? ""} retro-card group gap-4 p-4 hover:border-primary/50`}
    >
      {preview && (
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="retro-frame group/image h-52 bg-muted p-2"
              aria-label={`Open the ${title} gallery and details`}
            >
              <Image
                src={preview}
                width={500}
                height={500}
                className="h-full w-full object-contain transition-transform duration-300 group-hover/image:scale-105"
                alt={`${title} project preview`}
              />
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
      )}

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

      {rest.length > 0 && preview && (
        <p className="retro-eyebrow text-muted-foreground">
          {rest.length} more detail{rest.length === 1 ? "" : "s"} in the gallery
        </p>
      )}
    </article>
  );
}
