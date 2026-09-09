import { describe, expect, it } from "vitest";
import {
  HARDCOVER_ACTIVITY_PROXY_PATH,
  HARDCOVER_PROFILE_ORIGIN,
  HARDCOVER_PROFILE_URL,
  HARDCOVER_PROXY_PATH,
  hardcoverBookUrl,
} from "./hardcover";

describe("hardcover deep links", () => {
  it("builds a book url on the profile origin", () => {
    expect(hardcoverBookUrl("project-hail-mary")).toBe(
      `${HARDCOVER_PROFILE_ORIGIN}/books/project-hail-mary`
    );
  });

  it("points the profile link at the configured handle", () => {
    expect(HARDCOVER_PROFILE_URL.startsWith(`${HARDCOVER_PROFILE_ORIGIN}/@`)).toBe(true);
  });
});

describe("proxy paths", () => {
  it("keeps every Hardcover read on the site's own origin", () => {
    for (const path of [HARDCOVER_PROXY_PATH, HARDCOVER_ACTIVITY_PROXY_PATH]) {
      expect(path.startsWith("/api/")).toBe(true);
    }
  });
});
