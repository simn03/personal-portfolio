"use client";

import Image from "next/image";
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
};

export default function SectionItem({
  className,
  images = [],
  title,
  description = [],
  metadata,
  url,
}: SectionItemProps) {
  const preview = images[0];

  return (
    <article className={`${className ?? ""} flex min-w-0 flex-col justify-start gap-3`}>
      {preview && (
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="group/image flex h-56 w-full overflow-hidden rounded-lg bg-slate-100/50 dark:bg-slate-800/40"
              aria-label={`Open the ${title} image gallery`}
            >
              <Image
                src={preview}
                width={500}
                height={500}
                className="h-full w-full object-contain transition-all duration-300 group-hover/image:scale-105 group-hover/image:opacity-80"
                alt={`${title} project preview`}
              />
            </button>
          </DialogTrigger>

          <DialogContent className="w-[calc(100%-2rem)] max-w-6xl bg-white/95 p-5 backdrop-blur-xl dark:bg-slate-900/95 sm:max-w-6xl sm:p-8">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl">{title}</DialogTitle>
              <DialogDescription>
                {images.length > 1 ? `${images.length} project images. Use the arrows or swipe to browse.` : "Project image."}
              </DialogDescription>
            </DialogHeader>

            <Carousel opts={{ loop: images.length > 1 }} className="mx-auto w-[calc(100%-4rem)] sm:w-[calc(100%-6rem)]">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={image}>
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-950">
                      <Image
                        src={image}
                        fill
                        sizes="90vw"
                        className="object-contain"
                        alt={`${title} project screenshot ${index + 1} of ${images.length}`}
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
          </DialogContent>
        </Dialog>
      )}

      {url ? (
        <a className="external w-fit text-xl transition-colors hover:text-teal-600 sm:text-2xl dark:hover:text-teal-300" href={url} target="_blank" rel="noreferrer">
          {title}
        </a>
      ) : (
        <h3 className="text-xl sm:text-2xl">{title}</h3>
      )}

      <div className="no-scrollbar mt-1 flex gap-2 overflow-x-auto py-2">
        {metadata.map((tag) => <Tag key={tag}>{tag}</Tag>)}
      </div>

      {description[0] && <p className="leading-relaxed">{description[0]}</p>}
    </article>
  );
}
