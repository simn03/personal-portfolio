import OrnamentDivider from "@/components/ui/ornament-divider";
import { SITE, SOCIAL_LINKS } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary/40 print:hidden">
      <div className="document-padding flex flex-col items-center gap-5 py-8 text-center">
        <OrnamentDivider glyph="✦" />

        <ul className="flex list-none flex-wrap items-center justify-center gap-3">
          {SOCIAL_LINKS.map(({ id, label, href }) => (
            <li key={id}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-block border border-border bg-background px-2 py-1 font-mono text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-block border border-border bg-background px-2 py-1 font-mono text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              email
            </a>
          </li>
        </ul>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name} · built with next.js · deployed on vercel
        </p>
      </div>
    </footer>
  );
}
