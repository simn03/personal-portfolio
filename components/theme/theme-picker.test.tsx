import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { THEMES } from "@/lib/theme/themes";
import { THEME_STORAGE_KEY } from "@/lib/theme/theme-storage";
import ThemePicker from "./theme-picker";

function renderPicker() {
  return render(
    <ThemeProvider>
      <ThemePicker />
    </ThemeProvider>
  );
}

describe("ThemePicker", () => {
  it("defaults to the first (default) preset", async () => {
    renderPicker();
    expect(screen.getByRole("button", { name: `Theme: ${THEMES[0].label}` })).toBeTruthy();
  });

  it("lists every theme preset when opened", async () => {
    const user = userEvent.setup();
    renderPicker();

    await user.click(screen.getByRole("button", { name: `Theme: ${THEMES[0].label}` }));

    for (const theme of THEMES) {
      expect(screen.getByRole("option", { name: new RegExp(theme.label, "i") })).toBeTruthy();
    }
  });

  it("selecting a preset applies it to the document and persists it", async () => {
    const user = userEvent.setup();
    renderPicker();

    await user.click(screen.getByRole("button", { name: `Theme: ${THEMES[0].label}` }));
    await user.click(screen.getByRole("option", { name: /mocha/i }));

    const root = document.documentElement;
    expect(root.getAttribute("data-theme")).toBe("mocha");
    expect(root.classList.contains("dark")).toBe(true);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("mocha");
    expect(screen.getByRole("button", { name: "Theme: Mocha" })).toBeTruthy();

    expect(screen.queryByRole("option")).toBeNull();
  });

  it("switching to a light preset removes the dark class", async () => {
    const user = userEvent.setup();
    renderPicker();

    await user.click(screen.getByRole("button", { name: `Theme: ${THEMES[0].label}` }));
    await user.click(screen.getByRole("option", { name: /mocha/i }));
    await user.click(screen.getByRole("button", { name: "Theme: Mocha" }));
    await user.click(screen.getByRole("option", { name: /sakura/i }));

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.getAttribute("data-theme")).toBe("sakura");
  });
});
