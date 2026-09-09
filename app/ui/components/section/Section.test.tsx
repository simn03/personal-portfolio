import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Section from "./Section.component";
import type { ItemType } from "../../../lib/Definitions";

vi.mock("next/image", async () => {
  const React = await import("react");
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => React.createElement("img", props),
  };
});

const items: ItemType[] = [
  {
    title: "Active Project",
    metadata: ["typescript"],
    description: ["Builds things."],
  },
  {
    title: "Archived Project",
    metadata: ["archived"],
    description: ["Legacy work."],
  },
];

describe("Section", () => {
  it("renders the header and tagline", () => {
    render(<Section id="projects" header="Projects" tagline="my work" items={items} />);
    expect(screen.getByRole("heading", { name: /projects/i })).toBeTruthy();
    expect(screen.getByText("my work")).toBeTruthy();
  });

  it("hides archived items by default and reports the count", () => {
    render(<Section header="Projects" items={items} />);
    expect(screen.getByRole("heading", { name: "Active Project" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Archived Project" })).toBeNull();
    expect(screen.getByText(/showing 1 of 2/)).toBeTruthy();
  });

  it("shows the empty state when filters leave nothing", () => {
    render(<Section header="Projects" items={[items[1]]} />);
    expect(screen.getByText("No items match the active filters.")).toBeTruthy();
  });

  it("lets the user reveal archived work and filter by tag", async () => {
    const user = userEvent.setup();
    render(<Section header="Projects" items={items} />);

    await user.click(screen.getByRole("button", { name: "show archived" }));
    expect(screen.getByRole("heading", { name: "Archived Project" })).toBeTruthy();
    expect(screen.getByText(/showing 2 of 2/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "typescript" }));
    expect(screen.queryByRole("heading", { name: "Archived Project" })).toBeNull();
    expect(screen.getByRole("heading", { name: "Active Project" })).toBeTruthy();
    expect(screen.getByText(/showing 1 of 2/)).toBeTruthy();

    await user.click(screen.getByRole("button", { name: /clear/i }));
    expect(screen.getByText(/showing 1 of 2/)).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Archived Project" })).toBeNull();
  });
});
