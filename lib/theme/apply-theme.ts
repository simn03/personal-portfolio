import { resolveTheme, DEFAULT_THEME_ID } from "./themes";
import { readStoredTheme, writeStoredTheme } from "./theme-storage";

export const THEME_ATTRIBUTE = "data-theme";
export const DARK_CLASS = "dark";

export function themeIsDark(themeId: string): boolean {
  return resolveTheme(themeId).mode === "dark";
}

/**
 * Applies a theme to the <html> element. No-op when not running in a browser
 * (safe to call from effects and boot scripts).
 */
export function applyThemeToDocument(themeId: string): void {
  if (typeof document === "undefined") {
    return;
  }
  const resolved = resolveTheme(themeId);
  const root = document.documentElement;
  root.setAttribute(THEME_ATTRIBUTE, resolved.id);
  root.classList.toggle(DARK_CLASS, resolved.mode === "dark");
}

export function restoreStoredTheme(storage: Pick<Storage, "getItem"> | null): string {
  const stored = readStoredTheme(storage);
  applyThemeToDocument(stored);
  return stored;
}

export function changeTheme(themeId: string): void {
  applyThemeToDocument(themeId);
  if (typeof window !== "undefined") {
    writeStoredTheme(window.localStorage, themeId);
  }
}

export function bootThemeId(): string {
  if (typeof window === "undefined") {
    return DEFAULT_THEME_ID;
  }
  return readStoredTheme(window.localStorage);
}
