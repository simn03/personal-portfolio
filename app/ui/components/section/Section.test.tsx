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

describe("Section category filters", () => {
  const courses: ItemType[] = [
    { title: "Course One", metadata: ["UBC", "Grade: A+"], description: ["x"] },
    { title: "Course Two", metadata: ["UBC", "Grade: A-"], description: ["x"] },
    { title: "Course Three", metadata: ["UBC", "Grade: B"], description: ["x"] },
  ];

  it("collapses 'Grade: …' tags into one multi-select menu", async () => {
    const user = userEvent.setup();
    render(<Section id="courses" header="Courses" items={courses} variant="course" />);

    // Category values aren't loose chips any more.
    expect(screen.queryByRole("button", { name: /Grade: A\+/ })).toBeNull();

    await user.click(screen.getByRole("button", { name: "Filter by grade" }));
    await user.click(await screen.findByRole("button", { name: "A+" }));
    await user.click(screen.getByRole("button", { name: "A-" }));

    expect(screen.getByText("Course One")).toBeTruthy();
    expect(screen.getByText("Course Two")).toBeTruthy();
    expect(screen.queryByText("Course Three")).toBeNull();
    expect(screen.getByRole("button", { name: "Filter by grade, 2 selected" })).toBeTruthy();
    expect(screen.getByText(/matching grade A\+ or A-/)).toBeTruthy();
  });

  it("offers subject, level and year menus for courses instead of code chips", () => {
    const real: ItemType[] = [
      { title: "Networks", metadata: ["CPSC 317", "UBC", "2024", "Grade: A+"], description: ["x"] },
      { title: "Calculus", metadata: ["MATH 100", "UBC", "2021", "Grade: B"], description: ["x"] },
    ];
    render(<Section id="courses" header="Courses" items={real} variant="course" />);
    for (const menu of ["subject", "level", "year", "grade"]) {
      expect(screen.getByRole("button", { name: `Filter by ${menu}` })).toBeTruthy();
    }
    expect(screen.queryByRole("button", { name: "CPSC 317" })).toBeNull();
    expect(screen.queryByRole("button", { name: "UBC" })).toBeNull();
  });
});

describe("Section archived-only tags", () => {
  const mixed: ItemType[] = [
    { title: "Live", metadata: ["react"], description: ["x"] },
    { title: "Old", metadata: ["bootstrap", "archived"], description: ["x"] },
  ];

  it("only offers archived-only tags while archived items are shown", async () => {
    const user = userEvent.setup();
    render(<Section id="projects" header="Projects" items={mixed} />);
    expect(screen.queryByRole("button", { name: "bootstrap" })).toBeNull();

    await user.click(screen.getByRole("button", { name: /show archived/i }));
    await user.click(screen.getByRole("button", { name: "bootstrap" }));
    expect(screen.queryByRole("heading", { name: "Live" })).toBeNull();

    // Hiding archived again drops the now-unreachable pick instead of showing nothing.
    await user.click(screen.getByRole("button", { name: /hide archived/i }));
    expect(screen.getByRole("heading", { name: "Live" })).toBeTruthy();
  });
});
