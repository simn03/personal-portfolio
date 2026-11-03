// End-to-end smoke test for the home page, driven by playwright-core.
//
// It uses the Chrome already installed on this machine (no browser download):
//   npm run e2e                      # builds, serves on :3100, runs the checks
//   E2E_BASE_URL=http://localhost:3000 node scripts/e2e.mjs   # against a running server
//   E2E_BROWSER_PATH=/path/to/chrome  # use a specific Chrome/Chromium binary
//   E2E_SCREENSHOTS=/some/dir         # also save full-page screenshots per width/theme

import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const TIMEOUT_MS = 15_000;

// Extra private terms (people, orgs, repos) to make sure never reach the page,
// one per line, from a git-ignored file so the list itself isn't published.
const PRIVATE_TERMS = (() => {
  try {
    return readFileSync(new URL("../.e2e-private-terms", import.meta.url), "utf8")
      .split("\n")
      .map((line) => line.trim().toLowerCase())
      .filter((line) => line && !line.startsWith("#"));
  } catch {
    return [];
  }
})();

const PORT = 3100;
const externalBase = process.env.E2E_BASE_URL;
const BASE = externalBase ?? `http://localhost:${PORT}`;
const SHOTS = process.env.E2E_SCREENSHOTS;

const results = [];
async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`  ✓ ${name}`);
  } catch (error) {
    results.push({ name, ok: false });
    console.log(`  ✗ ${name}\n      ${String(error?.message ?? error).split("\n")[0]}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForServer(url, timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`server at ${url} did not come up`);
}

/** Opens the home page with a given theme and viewport, collecting errors. */
async function openHome(browser, { width = 1440, height = 900, theme = "cream" } = {}) {
  const context = await browser.newContext({ viewport: { width, height } });
  await context.addInitScript((value) => {
    try {
      localStorage.setItem("theme", value);
    } catch {
      // storage blocked: the default theme applies
    }
  }, theme);
  context.setDefaultTimeout(TIMEOUT_MS);
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    // Feed widgets talk to third-party services; a failed fetch there is
    // handled in the UI and isn't a page bug.
    if (/Failed to load resource/.test(message.text())) return;
    errors.push(message.text());
  });
  // Live feed widgets poll forever, so "networkidle" never arrives; wait for
  // the page itself and give hydration a moment instead.
  await page.goto(BASE, { waitUntil: "load" });
  await page.locator("h2#projects").waitFor();
  await page.waitForTimeout(500);
  return { context, page, errors };
}

/** Scrolls through the page so every reveal-on-scroll section mounts. */
async function revealAll(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
  });
  // Lazy images only start loading once scrolled past; let them finish.
  await page
    .waitForFunction(
      () => Array.from(document.images).every((image) => image.complete),
      undefined,
      { timeout: 10_000 }
    )
    .catch(() => {});
}

/** Waits until smooth scrolling has settled (scrollY unchanged for a few frames). */
async function settle(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        let last = -1;
        let still = 0;
        const started = performance.now();
        const tick = () => {
          still = window.scrollY === last ? still + 1 : 0;
          last = window.scrollY;
          if (still >= 8 || performance.now() - started > 5000) resolve();
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      })
  );
}

async function topOf(page, selector) {
  return page.locator(selector).evaluate((element) => element.getBoundingClientRect().top);
}

async function run() {
  let server;
  if (!externalBase) {
    server = spawn("npx", ["next", "start", "-p", String(PORT)], {
      stdio: ["ignore", "ignore", "inherit"],
      env: process.env,
      // Own process group, so stopping it also stops the next-server child npx starts.
      detached: true,
    });
  }

  const browser = await chromium.launch(
    process.env.E2E_BROWSER_PATH
      ? { executablePath: process.env.E2E_BROWSER_PATH, headless: true }
      : { channel: "chrome", headless: true }
  );

  try {
    await waitForServer(BASE);
    console.log(`\nE2E against ${BASE}\n`);

    // ---------- Desktop ----------
    const { context, page, errors } = await openHome(browser);
    await revealAll(page);

    await check("home page renders the work and projects sections", async () => {
      assert(await page.locator("h2#work").isVisible(), "work heading missing");
      assert(await page.locator("h2#projects").isVisible(), "projects heading missing");
    });

    for (const target of ["work", "projects", "courses"]) {
      await check(`nav link "${target}" scrolls to its section`, async () => {
        await page.locator("nav").getByRole("button", { name: target, exact: true }).first().click();
        await settle(page);
        const top = await topOf(page, `h2#${target}`);
        assert(top > 0 && top < 220, `#${target} ended at ${Math.round(top)}px from the top`);
        assert(new URL(page.url()).hash === `#${target}`, "hash not updated");
      });
    }

    await check("work descriptions start collapsed and expand on click", async () => {
      const card = page.locator("article", { hasText: "Software Engineer Co-op" }).first();
      const bullet = card.getByText("Built API revision history", { exact: false });
      // Clipped by a zero-height panel, so measure the panel rather than the text.
      const panelHeight = () => bullet.evaluate((el) => el.closest("ul").parentElement.getBoundingClientRect().height);
      assert((await panelHeight()) < 2, "details visible before expanding");
      const toggle = card.getByRole("button", { name: /details/i });
      await toggle.click();
      await page.waitForTimeout(450);
      assert((await panelHeight()) > 40, "details did not expand");
      await toggle.click();
      await page.waitForTimeout(450);
      assert((await panelHeight()) < 2, "details did not collapse");
    });

    await check("work and project cards show the Startup / Freelance badges", async () => {
      const work = page.locator("section", { has: page.locator("h2#work") });
      for (const label of ["Startup", "Freelance"]) {
        assert(await work.locator(".chip-badge", { hasText: label }).first().isVisible(), `work ${label}`);
        assert(await page.locator("article[id^=project-] .retro-badge-active", { hasText: label }).first().isVisible(), `project ${label}`);
      }
    });

    for (const [role, id] of [["Wyndo", "wyndo"], ["LeaserFlow", "leaserflow"]]) {
      await check(`${role} work entry jumps to its project card`, async () => {
        const card = page.locator("article", { hasText: role }).filter({ has: page.getByRole("button", { name: /see the project/i }) });
        await card.getByRole("button", { name: /see the project/i }).click();
        await settle(page);
        const top = await topOf(page, `#project-${id}`);
        assert(top > 0 && top < 220, `#project-${id} ended at ${Math.round(top)}px`);
        assert(await page.locator(`#project-${id}.is-targeted`).count() === 1, "landing highlight missing");
      });
    }

    await check("Wyndo has no outbound links anywhere", async () => {
      const wyndoLinks = await page.locator("a", { hasText: /wyndo/i }).count();
      assert(wyndoLinks === 0, `${wyndoLinks} link(s) mentioning Wyndo`);
      const hrefs = await page.locator("a[href*='wyndo' i]").count();
      assert(hrefs === 0, "found a link to a wyndo domain");
    });

    await check("no private names, domains or repos anywhere in the page", async () => {
      // Open every dialog's content too: galleries render their text on demand.
      const html = (await page.content()).toLowerCase();
      // Generic terms live here; names and repos that are private in their own
      // right stay out of this public file, in the git-ignored list below.
      const banned = [
        "wyndo.ca", // product domains: app, staging and API hosts
        "outlook.com", // personal inboxes
        "session_token", "better-auth", // auth cookie names
        "github.students.cs.ubc.ca", // private course repos
        ...PRIVATE_TERMS,
      ];
      const hits = banned.filter((term) => html.includes(term));
      assert(hits.length === 0, `page contains: ${hits.join(", ")}`);
    });

    await check("Wyndo gallery and details open and close", async () => {
      await page.getByRole("button", { name: "Open the Wyndo gallery and details" }).click();
      const dialog = page.getByRole("dialog");
      await dialog.waitFor();
      assert((await dialog.textContent()).includes("window designer"), "details missing");
      assert((await dialog.locator("img").count()) >= 5, "screenshots missing");
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "detached" });
    });

    await check("LeaserFlow gallery opens with its screenshots", async () => {
      await page.getByRole("button", { name: "Open the LeaserFlow gallery and details" }).click();
      const dialog = page.getByRole("dialog");
      await dialog.waitFor();
      const slides = await dialog.locator("img").count();
      assert(slides >= 10, `only ${slides} images in the gallery`);
      await page.keyboard.press("Escape");
      await dialog.waitFor({ state: "detached" });
    });

    await check("archived toggle reveals the seven archived projects", async () => {
      const projects = page.locator("section", { has: page.locator("h2#projects") });
      const before = await projects.locator("article").count();
      await projects.getByRole("button", { name: /show archived/i }).click();
      const after = await projects.locator("article").count();
      assert(before === 6, `expected 6 featured projects, saw ${before}`);
      assert(after === before + 7, `expected ${before + 7} with archived, saw ${after}`);
      await projects.getByRole("button", { name: /hide archived/i }).click();
    });

    await check("course grade filter is a multi-select that widens the match", async () => {
      const courses = page.locator("section", { has: page.locator("h2#courses") });
      const all = await courses.locator("article, li, [class*=retro-card]").count();
      await courses.getByRole("button", { name: "Filter by grade" }).click();
      const menu = page.getByRole("group", { name: "Grade options" });
      await menu.getByRole("button", { name: "A+", exact: true }).click();
      const onlyAPlus = await courses.locator("[class*=retro-card]").count();
      await menu.getByRole("button", { name: "A", exact: true }).click();
      const aPlusOrA = await courses.locator("[class*=retro-card]").count();
      assert(onlyAPlus > 0 && onlyAPlus < all, `A+ alone showed ${onlyAPlus}`);
      assert(aPlusOrA > onlyAPlus, `adding A should widen the match (${onlyAPlus} → ${aPlusOrA})`);
      await page.keyboard.press("Escape");
      await courses.getByRole("button", { name: /clear/i }).click();
    });

    await check("no runtime errors on desktop", async () => {
      assert(errors.length === 0, errors.join(" | "));
    });

    await context.close();

    // ---------- Mobile ----------
    const mobile = await openHome(browser, { width: 375, height: 800 });
    await revealAll(mobile.page);

    await check("no horizontal scroll at 375px", async () => {
      const overflow = await mobile.page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      assert(overflow <= 0, `page is ${overflow}px wider than the viewport`);
    });

    await check("mobile menu opens and navigates to projects", async () => {
      await mobile.page.getByRole("button", { name: "Open navigation" }).click();
      const menu = mobile.page.locator("#mobile-navigation");
      assert(await menu.isVisible(), "menu did not open");
      await menu.getByRole("button", { name: /projects/ }).click();
      await settle(mobile.page);
      assert(!(await menu.isVisible()), "menu did not close");
      const top = await topOf(mobile.page, "h2#projects");
      assert(top > 0 && top < 220, `#projects ended at ${Math.round(top)}px`);
    });

    await check("no runtime errors on mobile", async () => {
      assert(mobile.errors.length === 0, mobile.errors.join(" | "));
    });
    await mobile.context.close();

    // ---------- Screenshots ----------
    if (SHOTS) {
      await mkdir(SHOTS, { recursive: true });
      for (const theme of ["cream", "mocha"]) {
        for (const width of [1440, 768, 375]) {
          const shot = await openHome(browser, { width, height: 900, theme });
          await revealAll(shot.page);
          for (const id of ["work", "projects"]) {
            const section = shot.page.locator("section", { has: shot.page.locator(`h2#${id}`) });
            // Element screenshots of sections taller than the viewport come out
            // blank under the sticky nav; clip a full-page capture instead.
            const box = await section.evaluate((element) => {
              const rect = element.getBoundingClientRect();
              return { x: 0, y: rect.top + window.scrollY - 24, width: window.innerWidth, height: rect.height + 48 };
            });
            await shot.page.screenshot({ path: path.join(SHOTS, `${id}-${theme}-${width}.png`), fullPage: true, clip: box });
          }
          await shot.context.close();
        }
      }
      console.log(`\n  screenshots saved to ${SHOTS}`);
    }
  } finally {
    await browser.close();
    if (server?.pid) {
      try {
        process.kill(-server.pid, "SIGTERM");
      } catch {
        // already gone
      }
    }
  }

  const failed = results.filter((result) => !result.ok).length;
  console.log(`\n${results.length - failed} passed, ${failed} failed\n`);
  process.exit(failed ? 1 : 0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
