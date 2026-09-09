import { isHardcoverConfigured, readReadingFeed } from "@/lib/server/hardcover";
import { feedRoute } from "@/lib/server/route";

/**
 * Server-side proxy for the Hardcover reading feed.
 *
 * Requires a user access token (`HARDCOVER_ACCESS_TOKEN`), which stays
 * server-side along with the GraphQL query itself. The response is cached for
 * an hour so Hardcover is not queried per visitor, and only the book fields the
 * section renders are forwarded.
 */
export const GET = feedRoute({
  label: "hardcover",
  isConfigured: isHardcoverConfigured,
  read: readReadingFeed,
  emptyBody: { books: [] },
});
