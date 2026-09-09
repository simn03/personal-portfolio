import { describe, expect, it } from "vitest";
import { PRESENT_LABEL, formatDateRange, formatDuration } from "./dates";

describe("formatDateRange", () => {
  it("formats a full range", () => {
    expect(formatDateRange("2024-04-01", "2024-12-31")).toBe("Apr 2024 — Dec 2024");
  });

  it("uses 'Present' when only a start date exists", () => {
    expect(formatDateRange("2024-04-01", undefined)).toBe(`Apr 2024 — ${PRESENT_LABEL}`);
  });

  it("prints only the end when only an end date exists", () => {
    expect(formatDateRange(undefined, "2024-12-31")).toBe("Dec 2024");
  });

  it("returns an empty string when both dates are missing", () => {
    expect(formatDateRange(undefined, undefined)).toBe("");
  });

  it("ignores invalid dates instead of printing 'Invalid Date'", () => {
    expect(formatDateRange("not-a-date", undefined)).toBe("");
    expect(formatDateRange(undefined, "garbage")).toBe("");
    expect(formatDateRange("garbage", "2024-05-10")).toBe("May 2024");
  });

  it("collapses identical start/end months to a single label", () => {
    expect(formatDateRange("2024-05-10", "2024-05-28")).toBe("May 2024");
  });
});

describe("formatDuration", () => {
  it("counts months inclusively, the way a resume reads", () => {
    expect(formatDuration("2026-01-09", "2026-08-24")).toBe("8 mos");
    expect(formatDuration("2024-04-28", "2024-12-31")).toBe("9 mos");
  });

  it("uses singular units where appropriate", () => {
    expect(formatDuration("2024-04-01", "2024-04-20")).toBe("1 mo");
    expect(formatDuration("2023-01-01", "2023-12-31")).toBe("1 yr");
  });

  it("combines years and months", () => {
    expect(formatDuration("2023-01-01", "2024-02-28")).toBe("1 yr 2 mos");
  });

  it("returns empty for missing, invalid or reversed ranges", () => {
    expect(formatDuration(undefined, "2024-01-01")).toBe("");
    expect(formatDuration("garbage", "2024-01-01")).toBe("");
    expect(formatDuration("2024-06-01", "2024-01-01")).toBe("");
  });
});
