import { DEFAULT_THEME_ID, isThemeId } from "./themes";

export const THEME_STORAGE_KEY = "theme";

export function themeFromStorage(raw: string | null): string {
  if (raw === null || !isThemeId(raw)) {
    return DEFAULT_THEME_ID;
  }
  return raw;
}

export function readStoredTheme(storage: Pick<Storage, "getItem"> | null): string {
  if (storage === null) {
    return DEFAULT_THEME_ID;
  }
  try {
    return themeFromStorage(storage.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_THEME_ID;
  }
}

export function writeStoredTheme(
  storage: Pick<Storage, "setItem"> | null,
  themeId: string
): void {
  if (storage === null) {
    return;
  }
  try {
    storage.setItem(THEME_STORAGE_KEY, themeId);
  } catch {
    // Storage can be unavailable (private mode, disabled cookies). Ignore.
  }
}
