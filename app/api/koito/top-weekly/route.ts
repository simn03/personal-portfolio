import { NextResponse } from "next/server";
import { KOITO_ORIGIN, WEEKLY_PERIOD, parseWeeklyPayload } from "@/lib/koito";
import {
  FEED_CACHE_HEADERS,
  feedUnavailable,
  fetchFeedJson,
  resolveUpstreamUrl,
} from "@/lib/upstream";

const LABEL = "koito";
const WEEKLY_LIMIT = 8;

/**
 * Server-side proxy for the Koito weekly top-tracks feed.
 *
 * Koito is read here rather than from the browser so the instance is asked at
 * most hourly (see `fetchFeedJson`) instead of once per visitor, and so the
 * optional `KOITO_API_KEY` — needed only when the instance's login gate is on —
 * never reaches the client. Only the display fields the section renders are
 * returned; the rest of Koito's payload stays server-side.
 */
export async function GET() {
  try {
    const { origin } = resolveUpstreamUrl(process.env.KOITO_UPSTREAM_ORIGIN, KOITO_ORIGIN);
    const apiKey = process.env.KOITO_API_KEY;

    const payload = await fetchFeedJson(
      `${origin}/apis/web/v1/top/tracks?limit=${WEEKLY_LIMIT}&period=${WEEKLY_PERIOD}&page=0`,
      {
        label: LABEL,
        headers: {
          Accept: "application/json",
          ...(apiKey ? { Authorization: `Token ${apiKey}` } : {}),
        },
      }
    );

    return NextResponse.json(
      { tracks: parseWeeklyPayload(payload).slice(0, WEEKLY_LIMIT) },
      { headers: FEED_CACHE_HEADERS }
    );
  } catch (error) {
    return feedUnavailable(LABEL, error);
  }
}
