"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_THEME_ID } from "./themes";
import { changeTheme, restoreStoredTheme } from "./apply-theme";

type ThemeContextValue = {
  themeId: string;
  setTheme: (themeId: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<string>(DEFAULT_THEME_ID);

  useEffect(() => {
    setThemeId(restoreStoredTheme(window.localStorage));
  }, []);

  const setTheme = useCallback((next: string) => {
    changeTheme(next);
    setThemeId(next);
  }, []);

  const value = useMemo(() => ({ themeId, setTheme }), [themeId, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return context;
}
