import { test, expect } from "@playwright/test";
import { projectSlugs } from "../../content";

// lib/media.ts derives srcset widths from the file-name convention; this checks every derived candidate exists.
for (const slug of projectSlugs) {
  test(`/work/${slug}/ frames offer responsive candidates that all exist`, async ({ page }, info) => {
    test.skip(info.project.name !== "desktop");
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
