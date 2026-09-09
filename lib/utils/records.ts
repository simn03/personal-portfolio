/** Narrowing helpers for untrusted JSON coming back from third-party feeds. */

export type RawRecord = Record<string, unknown>;

/** Treats a JSON value as an object, or `undefined` when it isn't one. */
export function asRecord(value: unknown): RawRecord | undefined {
  return value !== null && typeof value === "object" ? (value as RawRecord) : undefined;
}

/** Treats a JSON value as a string, or `undefined` when it isn't one. */
export function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/** Treats a JSON value as a number, or `undefined` when it isn't one. */
export function asNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

/** An absolute http(s) URL from an untrusted value, or `undefined`. */
export function asAbsoluteUrl(value: unknown): string | undefined {
  const raw = asString(value);
  return raw && /^https?:\/\//i.test(raw) ? raw : undefined;
}
