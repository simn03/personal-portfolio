import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      // These React Compiler-oriented rules require larger behavioral refactors
      // than this legacy UI should receive as part of a dependency upgrade.
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    /*
     * `lib/server/*` reads API credentials out of `process.env`. Everything in
     * these directories either is a client component or is imported by one, so
     * an import from there would put a secret in the public bundle. The
     * client-safe half of each integration (types, proxy paths, deep links)
     * lives in `lib/<feed>.ts` and is what these files should reach for.
     *
     * Route handlers under `app/api/**` are deliberately not covered — reading
     * those modules is their whole job. Tests aren't either: they run in Node
     * and are never bundled.
     */
    files: ["app/ui/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/theme/**/*.{ts,tsx}"],
    ignores: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/lib/server/*", "**/lib/server/*", "../**/server/*"],
              message:
                "lib/server/* is server-only (it handles API credentials). Import the client-safe contract from @/lib/<feed> instead.",
            },
          ],
        },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "tailwind.config.js",
  ]),
]);
