import { Fragment } from "react";
import { koitoArtistUrl, musicbrainzArtistUrl, type WeeklyArtist } from "@/lib/koito";
import ExternalLink from "../feed/ExternalLink.component";

type ArtistLinksProps = {
  artists: WeeklyArtist[];
  /**
   * Appends a small `mbz` link per artist. On for the weekly tiles, off for the
   * now-playing banner, where the extra links would crowd a single line.
   */
  withMusicbrainz?: boolean;
};

/**
 * A comma-separated artist list, each name linked back to its Koito page where
 * Koito knows one. Shared by the weekly tiles and the now-playing banner so the
 * two can't disagree about how a collaboration is written out.
 */
export default function ArtistLinks({ artists, withMusicbrainz = false }: ArtistLinksProps) {
  return (
    <>
      {artists.map((artist, index) => (
        <Fragment key={`${artist.name}-${index}`}>
          <ExternalLink
            href={typeof artist.koitoId === "number" ? koitoArtistUrl(artist.koitoId) : undefined}
            label={`${artist.name} on Koito`}
            className="transition-colors hover:text-primary"
          >
            {artist.name}
          </ExternalLink>

          {withMusicbrainz && artist.musicbrainzId && (
            <>
              {" "}
              <ExternalLink
                href={musicbrainzArtistUrl(artist.musicbrainzId)}
                label={`${artist.name} on MusicBrainz`}
                className="font-mono text-[0.6rem] text-muted-foreground underline underline-offset-2 transition-colors hover:text-primary"
              >
                mbz
              </ExternalLink>
            </>
          )}

          {index < artists.length - 1 ? ", " : ""}
        </Fragment>
      ))}
    </>
  );
}
