import { NextResponse } from "next/server";
import { READING_LIMIT, buildReadingLogQuery, parseReadingFeed } from "@/lib/hardcover";
import {
  FEED_CACHE_HEADERS,
  NO_STORE_HEADERS,
  feedUnavailable,
  fetchFeedJson,
  resolveUpstreamUrl,
} from "@/lib/upstream";
import { asRecord, asString } from "@/lib/utils/records";

const LABEL = "hardcover";
const HARDCOVER_GRAPHQL = "https://api.hardcover.app/v1/graphql";

/**
 * Server-side proxy for the Hardcover reading feed.
 *
 * Requires a user access token (`HARDCOVER_ACCESS_TOKEN`), which stays
 * server-side. The GraphQL response is cached for an hour so Hardcover is not
 * queried per visitor, and only the book fields the section renders are
 * forwarded. When no token is configured the route reports `configured: false`
 * so the section hides itself instead of showing an error.
 */
export async function GET() {
  const accessToken = process.env.HARDCOVER_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json({ configured: false, books: [] }, { headers: NO_STORE_HEADERS });
  }

  try {
    const endpoint = resolveUpstreamUrl(process.env.HARDCOVER_API_URL, HARDCOVER_GRAPHQL).href;

    const payload = await fetchFeedJson(endpoint, {
      label: LABEL,
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: buildReadingLogQuery(),
        variables: { limit: READING_LIMIT },
      }),
    });

    const root = asRecord(payload);
    const errors = Array.isArray(root?.errors) ? root.errors : [];
    if (errors.length > 0) {
      // GraphQL messages can describe the query and the token's scope, so they
      // are logged rather than returned.
      throw new Error(
        `Hardcover GraphQL error: ${asString(asRecord(errors[0])?.message) ?? "unknown"}`
      );
    }

    // Hardcover returns `me` as a single-element list.
    const rawMe = asRecord(root?.data)?.me;
    const me = asRecord(Array.isArray(rawMe) ? rawMe[0] : rawMe);

    return NextResponse.json(
      {
        configured: true,
        books: parseReadingFeed({ current: me?.reading, finished: me?.finished }),
      },
      { headers: FEED_CACHE_HEADERS }
    );
  } catch (error) {
    return feedUnavailable(LABEL, error);
  }
}
