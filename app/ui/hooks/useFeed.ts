"use client";

import { useEffect, useState } from "react";

/**
 * The one client-side reader for the same-origin feed proxies in `app/api/*`.
 *
 * Every feed widget wants the same four things — a skeleton while it loads, the
 * rows once they arrive, silence when the feed has no credentials configured,
 * and a fallback card when the upstream is down — so the fetch, the abort on
 * unmount, the timeout and the envelope handling live here once instead of in
 * each of the six widgets.
 */

/** Give up on a proxy that never answers, rather than skeleton-ing forever. */
const REQUEST_TIMEOUT_MS = 15_000;

export type FeedStatus = "loading" | "ready" | "hidden" | "error";

export type FeedState<T> =
  | { status: "loading" | "hidden" | "error"; data: undefined }
  | { status: "ready"; data: T };

/** Every proxy answers with `configured` alongside its rows. */
type FeedEnvelope<T> = T & { configured?: boolean };

/**
 * Reads one proxy response. Rejects on anything that isn't a usable payload;
 * resolves to `null` when the feed reports it has no credentials configured.
 */
export async function readFeed<T extends object>(
  path: string,
  signal?: AbortSignal
): Promise<T | null> {
  const response = await fetch(path, { signal });
  if (!response.ok) {
    throw new Error(`Feed responded with ${response.status}`);
  }

  const { configured, ...data } = (await response.json()) as FeedEnvelope<T>;
  return configured === false ? null : (data as T);
}

/**
 * Loads a feed once on mount.
 *
 * `hidden` means the feed is switched off (no API key configured) and the
 * section should render nothing at all; `error` means it is configured but
 * unreachable, which is worth showing a fallback card for.
 */
export function useFeed<T extends object>(path: string): FeedState<T> {
  const [state, setState] = useState<FeedState<T>>({ status: "loading", data: undefined });

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    readFeed<T>(path, controller.signal)
      .then((data) => {
        if (cancelled) return;
        setState(
          data === null
            ? { status: "hidden", data: undefined }
            : { status: "ready", data }
        );
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", data: undefined });
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [path]);

  return state;
}
