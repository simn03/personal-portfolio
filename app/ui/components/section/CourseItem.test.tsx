import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import CourseItem, { parseCourseMetadata } from "./CourseItem.component";
import type { ItemType } from "../../../lib/Definitions";

describe("parseCourseMetadata", () => {
  it("splits a course metadata list into structured facts", () => {
    const parsed = parseCourseMetadata([
      "CPSC 110",
      "UBC",
      "2021",
      "Grade: A+",
      "Skill: Racket",
    ]);
    expect(parsed).toEqual({
      department: "cpsc",
      courseNumber: "110",
      departmentLabel: "computer science",
      year: "2021",
      grade: "A+",
      skills: ["Racket"],
    });
  });

  it("handles codes with a letter suffix and unknown departments", () => {
    const parsed = parseCourseMetadata(["CPSC 436S", "UBC", "2024", "Skill: Python"]);
    expect(parsed.courseNumber).toBe("436S");
    expect(parsed.departmentLabel).toBe("computer science");
  });

  it("keeps only skill/grade/date tags that match their prefixes", () => {
    const parsed = parseCourseMetadata(["cpsc 221", "2023", "Grade: A+", "Skill: C++", "UBC"]);
    expect(parsed.courseNumber).toBe("221");
    expect(parsed.year).toBe("2023");
    expect(parsed.grade).toBe("A+");
    expect(parsed.skills).toEqual(["C++"]);
  });

  it("returns empty fields for non-course metadata", () => {
    const parsed = parseCourseMetadata(["MySQL", "JavaScript", "AWS Lambda"]);
    expect(parsed).toEqual({
      skills: [],
    });
  });
});

describe("CourseItem", () => {
  const item: ItemType = {
    title: "Software Construction",
    metadata: ["CPSC 210", "UBC", "2022", "Grade: A+", "Skill: Java", "Skill: JUnit"],
    description: ["Design, development, and analysis of robust software components."],
  };

  it("renders the title, course code, year and skills", () => {
    const { container } = render(<CourseItem item={item} />);
    expect(screen.getByRole("heading", { name: "Software Construction" })).toBeTruthy();
    expect(screen.getByText("210")).toBeTruthy();
    expect(screen.getByText(/term/i).textContent).toContain("‘22");
    expect(screen.getByText("A+")).toBeTruthy();
    expect(screen.getByText("Java")).toBeTruthy();
    expect(screen.getByText("JUnit")).toBeTruthy();
    expect(container.querySelector(".retro-card")).toBeTruthy();
  });
});
