import dayjs from "dayjs";
import { describe, expect, it } from "vitest";
import { workItems } from "./work";
import { projects } from "./projects";
import { courseItems } from "./courses";

const COLLECTIONS = [
  { label: "work", items: workItems },
  { label: "projects", items: projects },
  { label: "courses", items: courseItems },
];

describe("portfolio data integrity", () => {
  it("has unique titles within every collection", () => {
    for (const { label, items } of COLLECTIONS) {
      const titles = items.map((item) => item.title);
      expect(new Set(titles).size, `${label} titles are unique`).toBe(titles.length);
    }
  });

  it("gives every item the fields the UI renders", () => {
    for (const { label, items } of COLLECTIONS) {
      for (const item of items) {
        expect(item.title, `${label} title`).toBeTruthy();
        expect(item.metadata.length, `${label}: ${item.title} has metadata`).toBeGreaterThan(0);
        expect(item.metadata.every((tag) => tag.length > 0)).toBe(true);
        expect(item.description.length, `${label}: ${item.title} has a description`).toBeGreaterThan(
          0
        );
      }
    }
  });

  it("uses unique, self-hosted image paths per item", () => {
    for (const { label, items } of COLLECTIONS) {
      for (const item of items) {
        const images = item.images ?? [];
        expect(new Set(images).size, `${label}: ${item.title} unique images`).toBe(images.length);
        for (const image of images) {
          expect(image.startsWith("/"), `${label}: ${item.title} path ${image}`).toBe(true);
        }
      }
    }
  });

  it("keeps work dates chronological and parseable", () => {
    for (const item of workItems) {
      const start = dayjs(item.startDate);
      const end = dayjs(item.endDate);
      expect(start.isValid()).toBe(true);
      expect(end.isValid()).toBe(true);
      expect(end.valueOf()).toBeGreaterThan(start.valueOf());
    }
  });

  it("only flags explicit legacy projects as archived", () => {
    const archived = projects.filter((item) => item.metadata.includes("archived"));
    const archivedTitles = archived.map((item) => item.title).sort();
    expect(archivedTitles).toEqual(["Budget App", "Dress Portfolio Site", "Food Inventory App"]);
  });
});
