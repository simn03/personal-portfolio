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
      // A role with no dates at all is ongoing and shown as "Present".
      if (item.startDate === undefined && item.endDate === undefined) continue;
      const start = dayjs(item.startDate);
      expect(start.isValid(), `${item.title} start`).toBe(true);
      // No end date means the role is ongoing ("Present").
      if (item.endDate === undefined) continue;
      const end = dayjs(item.endDate);
      expect(end.isValid(), `${item.title} end`).toBe(true);
      expect(end.valueOf()).toBeGreaterThan(start.valueOf());
    }
  });

  it("points every work entry's project link at a real project card", () => {
    const projectIds = new Set(projects.map((item) => item.id).filter(Boolean));
    expect(projectIds.size, "project ids are unique").toBe(
      projects.filter((item) => item.id).length
    );
    for (const item of workItems) {
      if (!item.project) continue;
      expect(projectIds.has(item.project), `${item.title} → ${item.project}`).toBe(true);
    }
  });

  it("uses only the known badge labels", () => {
    const allowed = new Set(["Startup", "Freelance", "Course project", "Team project", "Open source"]);
    for (const { label, items } of COLLECTIONS) {
      for (const item of items) {
        if (item.badge) expect(allowed.has(item.badge), `${label}: ${item.title}`).toBe(true);
      }
    }
  });

  it("only flags explicit legacy projects as archived", () => {
    const archived = projects.filter((item) => item.metadata.includes("archived"));
    const archivedTitles = archived.map((item) => item.title).sort();
    expect(archivedTitles).toEqual([
      "Budget App",
      "Dress Portfolio Site",
      "Focus Media",
      "Food Inventory App",
      "MediaHub",
      "Pulsar Star Classification",
      "UBC Dataset Explorer",
    ]);
  });
});
