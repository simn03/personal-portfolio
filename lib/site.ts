/** Hardcover username, used to build profile + book links. */
export const HARDCOVER_HANDLE = "simn03";

export const SITE = {
  name: "sim",
  domain: "portfolio.simrit.dev",
  email: "personal@simrit.dev",
  github: "https://github.com/simn03",
  githubLegacy: "https://github.com/simrit-nijjar",
  linkedin: "https://www.linkedin.com/in/sim-n/",
  instagram: "https://www.instagram.com/sim.n03/"
};

export const SOCIAL_LINKS = [
  { id: "github", label: "github", href: SITE.github },
  { id: "linkedin", label: "linkedin", href: SITE.linkedin },
  { id: "instagram", label: "instagram", href: SITE.instagram }
] as const;
