import { describe, expect, it, vi } from "vitest";
import {
  THEME_STORAGE_KEY,
  readStoredTheme,
  themeFromStorage,
  writeStoredTheme,
} from "./theme-storage";
import { DEFAULT_THEME_ID } from "./themes";

function storageWith(value: string | null): Pick<Storage, "getItem"> & { setItem: () => void } {
  return {
    getItem: () => value,
    setItem: () => undefined,
  };
}

describe("theme-storage", () => {
  it("themeFromStorage accepts a known theme id", () => {
    expect(themeFromStorage("lavender")).toBe("lavender");
  });

  it("themeFromStorage falls back for null, unknown, or empty values", () => {
    expect(themeFromStorage(null)).toBe(DEFAULT_THEME_ID);
    expect(themeFromStorage("")).toBe(DEFAULT_THEME_ID);
    expect(themeFromStorage("bogus")).toBe(DEFAULT_THEME_ID);
  });

  it("readStoredTheme reads through the storage key", () => {
    const getItem = vi.fn(() => "mocha");
    expect(readStoredTheme({ getItem })).toBe("mocha");
    expect(getItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
  });

  it("readStoredTheme handles missing storage", () => {
    expect(readStoredTheme(null)).toBe(DEFAULT_THEME_ID);
  });

  it("readStoredTheme swallows storage exceptions", () => {
    const storage = {
      getItem: () => {
        throw new Error("denied");
      },
    };
    expect(readStoredTheme(storage)).toBe(DEFAULT_THEME_ID);
  });

  it("writeStoredTheme persists via the storage key", () => {
    const setItem = vi.fn();
    writeStoredTheme({ setItem }, "sakura");
    expect(setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, "sakura");
  });

  it("writeStoredTheme ignores missing storage and exceptions", () => {
    expect(() => writeStoredTheme(null, "mint")).not.toThrow();
    expect(() => writeStoredTheme(storageWith(null), "mint")).not.toThrow();
  });
});
