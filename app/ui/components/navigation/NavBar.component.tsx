"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import ScrollButton from "../home/ScrollButton.component";
import ThemePicker from "@/components/theme/theme-picker";

export const NAV_LINKS: ReadonlyArray<{ label: string; target: string }> = [
  { label: "work", target: "work" },
  { label: "projects", target: "projects" },
  { label: "courses", target: "courses" },
];

export default function NavBar() {
  const [navOpen, setNavOpen] = useState(false);
  const closeNavigation = () => setNavOpen(false);

  return (
    <nav className="sticky top-0 z-40 w-full text-lg lowercase text-foreground print:hidden">
      {/* Frosted top bar. Kept as a separate box so the full-screen mobile
          overlay below is not trapped by this element's backdrop-filter
          (backdrop-filter would otherwise turn `fixed inset-0` into a
          containing block sized to the bar itself). */}
      <div className="relative z-30 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-10 md:px-16 lg:px-28">
          <ScrollButton
            elementID=""
            className="transition-colors hover:text-primary"
            onClick={closeNavigation}
          >
            <span className="text-2xl font-black tracking-tight">sim</span>
          </ScrollButton>

          <div className="flex items-center gap-3">
            {/* Desktop navigation inline in the bar. */}
            <div className="hidden items-center gap-8 lg:flex">
              {NAV_LINKS.map(({ label, target }) => (
                <ScrollButton
                  key={target}
                  elementID={target}
                  className="transition-colors hover:text-primary"
                  onClick={closeNavigation}
                >
                  {label}
                </ScrollButton>
              ))}
              <ThemePicker />
            </div>

            {/* Mobile controls: theme picker + hamburger toggle. */}
            <div className="flex items-center gap-3 lg:hidden">
              <ThemePicker />
              <button
                type="button"
                className="rounded-md p-2"
                onClick={() => setNavOpen((open) => !open)}
                aria-expanded={navOpen}
                aria-controls="mobile-navigation"
                aria-label={navOpen ? "Close navigation" : "Open navigation"}
              >
                {navOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile full-screen navigation menu. */}
      <div
        id="mobile-navigation"
        className={`${
          navOpen ? "flex" : "hidden"
        } fixed inset-0 z-20 flex-col items-center justify-center gap-12 bg-background/95 backdrop-blur-xl lg:hidden`}
      >
        {NAV_LINKS.map(({ label, target }, index) => (
          <ScrollButton
            key={target}
            elementID={target}
            className="retro-display transition-colors hover:text-primary"
            onClick={closeNavigation}
          >
            <span>{String(index + 1).padStart(2, "0")}</span> {label}
          </ScrollButton>
        ))}
      </div>
    </nav>
  );
}
