export type ThemeMode = "light" | "dark";

export type ThemePreset = {
  id: string;
  label: string;
  mode: ThemeMode;
  description: string;
  swatch: {
    background: string;
    primary: string;
  };
};

export const DEFAULT_THEME_ID = "cream";

export const THEMES: ThemePreset[] = [
  {
    id: "cream",
    label: "Cream",
    mode: "light",
    description: "Warm parchment with a terracotta pop.",
    swatch: { background: "#faf6ec", primary: "#be4e2e" },
  },
  {
    id: "sakura",
    label: "Sakura",
    mode: "light",
    description: "Soft blush pink with a rosy accent.",
    swatch: { background: "#fdf1ec", primary: "#c65e78" },
  },
  {
    id: "mint",
    label: "Mint",
    mode: "light",
    description: "Fresh sage-green with a deep leaf accent.",
    swatch: { background: "#eff5ea", primary: "#36795b" },
  },
  {
    id: "mocha",
    label: "Mocha",
    mode: "dark",
    description: "Roasted coffee browns with an apricot glow.",
    swatch: { background: "#211b14", primary: "#e39162" },
  },
  {
    id: "lavender",
    label: "Lavender",
    mode: "dark",
    description: "Deep aubergine with a lavender pop.",
    swatch: { background: "#191727", primary: "#ad93f0" },
  },
  {
    id: "midnight",
    label: "Midnight",
    mode: "dark",
    description: "Classic deep navy with an electric blue glow.",
    swatch: { background: "#0d1421", primary: "#7aa2f7" },
  },
  {
    id: "graphite",
    label: "Graphite",
    mode: "dark",
    description: "Classic charcoal with a warm honey accent.",
    swatch: { background: "#141518", primary: "#e8b364" },
  },
  {
    id: "forest",
    label: "Forest",
    mode: "dark",
    description: "Deep pine green with a bright leaf accent.",
    swatch: { background: "#101a14", primary: "#54b685" },
  },
  {
    id: "wine",
    label: "Wine",
    mode: "dark",
    description: "Dark plum with a raspberry pop.",
    swatch: { background: "#1a1016", primary: "#ef6a9e" },
  },
];

export function isThemeId(value: unknown): value is string {
  return typeof value === "string" && THEMES.some((theme) => theme.id === value);
}

export function resolveTheme(id: string | null | undefined): ThemePreset {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}

export function themeIds(): string[] {
  return THEMES.map((theme) => theme.id);
}
