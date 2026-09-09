"use client";

import { useEffect, useState } from "react";
import { LIVE_POLL_INTERVAL_MS } from "@/lib/feeds";
import { readFeed } from "./useFeed";

/**
 * Polls one of the "live" proxies (now playing / now watching) while the page
 * is actually in front of someone.
 *
 * Polling stops the moment the tab is hidden and resumes — with an immediate
 * read, so the banner is never stale on return — when it comes back. A tab left
 * open in the background for a day would otherwise quietly make thousands of
 * requests, which is exactly what the whole proxy layer exists to avoid.
 *
 * Failures resolve to `undefined` rather than an error state: these banners are
 * a bonus on top of a feed, not a feed of their own, so they simply disappear.
 */
export function useLiveFeed<T extends object>(
  path: string,
  intervalMs: number = LIVE_POLL_INTERVAL_MS
): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const poll = async () => {
      if (cancelled || document.hidden) return;
      try {
        const next = await readFeed<T>(path);
        if (!cancelled) setData(next ?? undefined);
      } catch {
        // Silently skip — the banner just stays as it was.
      }
    };

    const stop = () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    const start = () => {
      stop();
      void poll();
      timer = window.setInterval(() => void poll(), intervalMs);
    };

    const onVisibilityChange = () => (document.hidden ? stop() : start());

    if (!document.hidden) {
      start();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [path, intervalMs]);

  return data;
}
