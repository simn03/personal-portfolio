"use client";

import { Check, ChevronDown } from "lucide-react";
import { Popover } from "radix-ui";
import { splitCategoryTag } from "@/lib/utils/items";
import Tag from "./Tag.component";

type CategoryFilterProps = {
  name: string;
  /** Full tags in this category, e.g. ["Grade: A+", "Grade: A"]. */
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
};

/**
 * One "Category: Value" group as a multi-select menu. Picking several values
 * widens the match within the category (A+ or A); the menu stays open so
 * several can be ticked in one go.
 */
export default function CategoryFilter({ name, tags, selected, onToggle }: CategoryFilterProps) {
  const picked = tags.filter((tag) => selected.includes(tag));
  const label = name.toLowerCase();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={
            picked.length > 0 ? `Filter by ${label}, ${picked.length} selected` : `Filter by ${label}`
          }
        >
          <Tag isSelected={picked.length > 0} shouldHover={false}>
            <span className="flex items-center gap-1.5">
              {label}
              {picked.length > 0 && (
                <span className="rounded-full bg-primary px-1.5 py-0.5 font-mono text-[0.65rem] leading-none text-primary-foreground">
                  {picked.length}
                </span>
              )}
              <ChevronDown className="size-3.5 opacity-70" aria-hidden="true" />
            </span>
          </Tag>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 max-h-[min(22rem,var(--radix-popover-content-available-height))] w-56 overflow-y-auto rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <div role="group" aria-label={`${name} options`} className="flex flex-col">
            {tags.map((tag) => {
              const isActive = selected.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onToggle(tag)}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none"
                >
                  <span
                    className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                      isActive ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                    aria-hidden="true"
                  >
                    {isActive && <Check className="size-3" strokeWidth={3} />}
                  </span>
                  {splitCategoryTag(tag)?.value ?? tag}
                </button>
              );
            })}
          </div>
          {picked.length > 0 && (
            <button
              type="button"
              onClick={() => picked.forEach(onToggle)}
              className="link-accent mt-1 w-full border-t border-border px-2.5 pt-2 pb-1 text-left font-mono text-xs uppercase tracking-wider"
            >
              clear {label}
            </button>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
