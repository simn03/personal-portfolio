import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DARK_CLASS,
  THEME_ATTRIBUTE,
  applyThemeToDocument,
  changeTheme,
  restoreStoredTheme,
  themeIsDark,
} from "./apply-theme";
import { THEME_STORAGE_KEY } from "./theme-storage";
import { DEFAULT_THEME_ID } from "./themes";

function mockStorage(): Pick<Storage, "getItem" | "setItem"> {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
  };
}

afterEach(() => {
  document.documentElement.removeAttribute(THEME_ATTRIBUTE);
  document.documentElement.classList.remove(DARK_CLASS);
});

describe("apply-theme", () => {
  it("themeIsDark mirrors the preset mode", () => {
    expect(themeIsDark("mocha")).toBe(true);
    expect(themeIsDark("lavender")).toBe(true);
    expect(themeIsDark("cream")).toBe(false);
    expect(themeIsDark("sakura")).toBe(false);
  });

  it("applyThemeToDocument sets the data-theme attribute", () => {
    applyThemeToDocument("mint");
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe("mint");
  });

  it("applyThemeToDocument toggles the dark class for dark presets only", () => {
    applyThemeToDocument("mocha");
    expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(true);

    applyThemeToDocument("sakura");
    expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(false);
  });

  it("restoreStoredTheme applies the stored theme and returns it", () => {
    const storage = {
      getItem: () => "lavender",
      setItem: () => undefined,
    };
    expect(restoreStoredTheme(storage)).toBe("lavender");
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe("lavender");
  });

  it("restoreStoredTheme falls back to the default when storage is empty", () => {
    const storage = { getItem: () => null, setItem: () => undefined };
    expect(restoreStoredTheme(storage)).toBe(DEFAULT_THEME_ID);
  });

  it("changeTheme applies and persists", () => {
    const storage = mockStorage();
    const spy = vi.spyOn(window, "localStorage", "get").mockReturnValue(storage as Storage);
    try {
      changeTheme("mocha");
      expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe("mocha");
      expect(storage.getItem(THEME_STORAGE_KEY)).toBe("mocha");
    } finally {
      spy.mockRestore();
    }
  });
});
