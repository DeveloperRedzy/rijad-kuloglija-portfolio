import { test, expect } from "@playwright/test";
import { projectSlugs } from "../../content";

// lib/media.ts derives srcset widths from the file-name convention; this checks every derived candidate exists.
for (const slug of projectSlugs) {
  test(`/work/${slug}/ frames offer responsive candidates that all exist`, async ({ page }, info) => {
    test.skip(info.project.name === "reduced-motion", "same markup as desktop");
    await page.goto(`/work/${slug}/`);
    const sets = await page.locator("[data-frame] picture source, [data-frame] picture img").evaluateAll((els) =>
      els.map((el) => el.getAttribute("srcset") ?? ""),
    );
    expect(sets.length).toBeGreaterThan(0);
    for (const set of sets) expect(set.split(",").length, set).toBeGreaterThan(1);
    const urls = [...new Set(sets.flatMap((s) => s.split(",").map((c) => c.trim().split(/\s+/)[0])))];
    for (const url of urls) expect((await page.request.get(url)).status(), url).toBe(200);
  });
}

// Below md a single-desktop-hero case leads with a phone capture through an art-directed <picture>: the image the phone
// shows is the eager, high-priority one, and no hidden duplicate frame is fetched.
test("/work/liblynx/ phone hero is the priority image", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/work/liblynx/");
  const hero = page.locator("figure[data-frame='liblynx'] img");
  await expect(hero).toHaveCount(1);
  await expect(hero).toHaveAttribute("loading", "eager");
  await expect(hero).toHaveAttribute("fetchpriority", "high");
  await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/\/gallery-2-\d+\.(avif|webp)$/);
});
