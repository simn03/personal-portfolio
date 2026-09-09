import { readWeeklyTracks } from "@/lib/server/koito";
import { feedRoute } from "@/lib/server/route";

/**
 * Server-side proxy for the Koito weekly top-tracks feed.
 *
 * Koito is read here rather than from the browser so the instance is asked at
 * most hourly instead of once per visitor, and so the optional `KOITO_API_KEY`
 * never reaches the client. Only the display fields the section renders are
 * returned; the rest of Koito's payload stays server-side.
 */
export const GET = feedRoute({
  label: "koito",
  read: readWeeklyTracks,
  emptyBody: { tracks: [] },
});
