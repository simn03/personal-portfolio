"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import ScrollButton from "../home/ScrollButton.component";
import Toggle from "./Toggle.component";

type NavBarProps = {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
};

export default function NavBar({ darkMode, setDarkMode }: NavBarProps) {
  const [navOpen, setNavOpen] = useState(false);
  const closeNavigation = () => setNavOpen(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 px-5 py-6 font-mono text-xl lowercase text-slate-600 backdrop-blur-lg print:hidden dark:border-slate-700/60 dark:bg-slate-900/80 dark:text-blue-100 sm:px-10 md:px-16 lg:flex lg:items-center lg:px-28">
      <div className="relative z-20 flex items-center justify-between lg:block">
        <ScrollButton elementID="" className="transition-colors hover:text-teal-600 dark:hover:text-teal-300" onClick={closeNavigation}>
          sim
        </ScrollButton>

        <button
          type="button"
          className="rounded-md p-2 lg:hidden"
          onClick={() => setNavOpen((open) => !open)}
          aria-expanded={navOpen}
          aria-label={navOpen ? "Close navigation" : "Open navigation"}
        >
          {navOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <div className={`${navOpen ? "flex" : "hidden"} fixed inset-0 z-10 flex-col items-center justify-center gap-16 bg-white/95 backdrop-blur-xl dark:bg-slate-900/95 lg:static lg:ml-auto lg:flex lg:flex-row lg:gap-10 lg:bg-transparent lg:backdrop-blur-none lg:dark:bg-transparent`}>
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-8">
          {[
            ["work", "work"],
            ["project", "projects"],
            ["courses", "courses"],
          ].map(([label, target]) => (
            <ScrollButton
              key={target}
              elementID={target}
              className="transition-colors hover:text-teal-600 hover:line-through dark:hover:text-teal-300"
              onClick={closeNavigation}
            >
              {label}
            </ScrollButton>
          ))}
        </div>

        <Toggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </nav>
  );
}
