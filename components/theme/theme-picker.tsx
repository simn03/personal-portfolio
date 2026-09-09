"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Palette } from "lucide-react";
import { THEMES, isThemeId } from "@/lib/theme/themes";
import { useTheme } from "@/lib/theme/ThemeProvider";

export default function ThemePicker({ className }: { className?: string }) {
  const { themeId, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = THEMES.find((theme) => theme.id === themeId) ?? THEMES[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectTheme = (id: string) => {
    if (isThemeId(id)) setTheme(id);
    setOpen(false);
  };

  return (
    <div className={`relative ${className ?? ""}`} ref={containerRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Theme: ${active.label}`}
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-2 text-sm text-secondary-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Palette className="size-4" aria-hidden="true" />
        <span
          className="size-3 rounded-full border border-border"
          style={{ backgroundColor: active.swatch.background }}
          aria-hidden="true"
        />
        <span className="hidden sm:inline">{active.label}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Color themes"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-xl"
        >
          {THEMES.map((theme) => {
            const isActive = theme.id === themeId;
            return (
              <li key={theme.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => selectTheme(theme.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-secondary"
                >
                  <span
                    className="size-6 shrink-0 rounded-full border border-border"
                    style={{ backgroundColor: theme.swatch.background }}
                    aria-hidden="true"
                  >
                    <span
                      className="mt-1.5 ml-1.5 block size-3 rounded-full"
                      style={{ backgroundColor: theme.swatch.primary }}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="text-sm font-medium">{theme.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {theme.description}
                    </span>
                  </span>
                  {isActive && (
                    <Check className="ml-auto size-4 shrink-0 text-primary" aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
