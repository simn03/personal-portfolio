import { describe, expect, it } from "vitest";
import {
  DEFAULT_THEME_ID,
  THEMES,
  isThemeId,
  resolveTheme,
  themeIds,
} from "./themes";

describe("theme registry", () => {
  it("exposes at least two presets and unique ids", () => {
    expect(THEMES.length).toBeGreaterThanOrEqual(2);
    const ids = themeIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("defines a complete shape for every preset", () => {
    for (const theme of THEMES) {
      expect(theme.id).toBeTruthy();
      expect(theme.label).toBeTruthy();
      expect(["light", "dark"]).toContain(theme.mode);
      expect(theme.description).toBeTruthy();
      expect(theme.swatch.background).toMatch(/^#/);
      expect(theme.swatch.primary).toMatch(/^#/);
    }
  });

  it("mixes light and dark presets", () => {
    const modes = new Set(THEMES.map((t) => t.mode));
    expect(modes.has("light")).toBe(true);
    expect(modes.has("dark")).toBe(true);
  });

  it("resolveTheme returns the matching preset for a known id", () => {
    expect(resolveTheme("mocha").id).toBe("mocha");
    expect(resolveTheme("sakura").mode).toBe("light");
  });

  it("resolveTheme falls back to the default for unknown ids", () => {
    const fallback = resolveTheme("not-a-theme");
    expect(fallback.id).toBe(DEFAULT_THEME_ID);
  });

  it("the default preset is the first in the registry", () => {
    expect(THEMES[0].id).toBe(DEFAULT_THEME_ID);
  });

  it("isThemeId narrows values correctly", () => {
    expect(isThemeId("cream")).toBe(true);
    expect(isThemeId("nope")).toBe(false);
    expect(isThemeId(null)).toBe(false);
    expect(isThemeId(42)).toBe(false);
  });
});
