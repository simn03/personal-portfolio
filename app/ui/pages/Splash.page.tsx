import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import type { IconType } from "react-icons";
import RevealOnScroll from "../components/home/RevealOnScroll.component";
import ScrollButton from "../components/home/ScrollButton.component";
import TypeEffect from "../components/home/TypeEffect.component";
import CaretDown from "../components/icons/CaretDownDouble.icon";
import { SOCIAL_LINKS } from "@/lib/site";

const SOCIAL_ICONS: Record<string, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
};

export default function SplashPage() {
  return (
    <section className="document-padding flex min-h-[calc(100svh-5.5rem)] flex-col">
      <RevealOnScroll className="m-auto flex flex-col items-center gap-10 text-center">
        <p className="chip chip-idle text-sm">
          ✦ based in vancouver · open to opportunities
        </p>

        <h1 className="retro-display font-serif">
          hi, i&apos;m <span className="italic text-primary">sim</span> — nice to
          meet you!
        </h1>

        <TypeEffect
          as="p"
          className="flex min-h-20 max-w-3xl flex-col items-center justify-center text-xl leading-relaxed text-muted-foreground sm:text-2xl"
          phrase="sim is"
          phrases={[
            "majoring in computer science @ ubc",
            "minoring in data science @ ubc",
            "building full-stack software",
            "learning game dev with c++ & opengl",
          ]}
        />

        <div className="flex items-center justify-center gap-10 text-3xl">
          {SOCIAL_LINKS.map(({ id, label, href }) => {
            const Icon = SOCIAL_ICONS[id];
            if (!Icon) return null;
            return (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Sim on ${label}`}
                className="text-foreground transition-colors hover:text-primary"
              >
                <Icon />
              </a>
            );
          })}
        </div>
      </RevealOnScroll>

      <ScrollButton
        className="mx-auto flex flex-col items-center pb-6 text-sm text-muted-foreground transition-colors hover:text-primary"
        elementID="work"
      >
        scroll to work
        <CaretDown
          className="mx-auto mt-3 animate-bounce opacity-75"
          innerClassName="stroke-foreground"
        />
      </ScrollButton>
    </section>
  );
}
