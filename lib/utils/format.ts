/**
 * Number formatting for the feed widgets.
 *
 * The locale is pinned rather than left to the browser: the surrounding copy is
 * English, so a visitor in a `de-DE` browser reading "12.481 plays" next to
 * lowercase English labels is a worse result than one consistent convention.
 */

const INTEGER = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const DECIMAL = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** A grouped whole number, e.g. `12,481`. */
export function formatCount(value: number): string {
  return INTEGER.format(Math.round(value));
}

/** One decimal place, for rates like "avg. plays / day". */
export function formatDecimal(value: number): string {
  return DECIMAL.format(value);
}

/**
 * Minutes rendered at a legible scale. Six-figure minute counts say nothing to
 * a reader, so anything past an hour is reported in hours (and past a few
 * thousand hours, in days) with the exact figure kept for the tooltip.
 */
export function formatMinutes(minutes: number): { value: string; unit: string } {
  if (minutes < 60) {
    return { value: formatCount(minutes), unit: "minutes" };
  }

  const hours = minutes / 60;
  if (hours < 2400) {
    return { value: formatCount(hours), unit: "hours" };
  }
  return { value: formatCount(hours / 24), unit: "days" };
}

/** Rounds a percentage for display without ever showing "0%" for a started book. */
export function formatPercent(percent: number): string {
  const rounded = Math.round(percent);
  if (rounded === 0 && percent > 0) return "<1%";
  return `${rounded}%`;
}
