import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

export const PRESENT_LABEL = "Present";

function parseDate(value?: string): Dayjs | null {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
}

/**
 * Formats an ISO date range, e.g. "Apr 2024 — Present".
 * Missing or invalid dates collapse cleanly: a lone start prints as just that
 * month/year; invalid values are ignored rather than rendered as "Invalid Date".
 */
export function formatDateRange(start?: string, end?: string): string {
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  if (!startDate && !endDate) {
    return "";
  }
  const startText = startDate?.format("MMM YYYY") ?? "";
  const endText = endDate ? endDate.format("MMM YYYY") : PRESENT_LABEL;
  if (startDate && startText === endText) {
    return startText;
  }
  return startDate ? `${startText} — ${endText}` : endText;
}

/**
 * Inclusive length of a role, in the "8 mos" / "1 yr 2 mos" style résumés use —
 * a role spanning Jan to Aug reads as 8 months, not 7. Returns "" when there is
 * no usable start date.
 */
export function formatDuration(start?: string, end?: string): string {
  const startDate = parseDate(start);
  if (!startDate) {
    return "";
  }
  const endDate = parseDate(end) ?? dayjs();
  if (endDate.isBefore(startDate)) {
    return "";
  }

  const months = endDate.diff(startDate, "month") + 1;
  const years = Math.floor(months / 12);
  const remainder = months % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years === 1 ? "" : "s"}`);
  if (remainder > 0) parts.push(`${remainder} mo${remainder === 1 ? "" : "s"}`);
  return parts.join(" ");
}
