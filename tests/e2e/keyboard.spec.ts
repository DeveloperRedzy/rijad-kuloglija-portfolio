import { test, expect, type Page } from "@playwright/test";

/**
 * WCAG 2.4.11: on desktop the work chapters are sticky and stack (each later chapter covers the earlier ones). Walking
 * back with Shift+Tab from Contact focuses links in earlier chapters; the focused chapter must come to the front, so
 * the focused link is the topmost element at its own centre.
 */
async function walkBackThroughChapters(page: Page) {
  const slugs = await page.locator("[data-chapter]").evaluateAll((els) => els.map((el) => (el as HTMLElement).dataset.chapter!));
  expect(slugs.length).toBeGreaterThan(1);
  await page.locator("#contact a").first().focus();
  const seen = new Set<string>();
  for (let i = 0; i < 120 && seen.size < slugs.length; i++) {
    await page.keyboard.press("Shift+Tab");
    const hit = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      const chapter = el?.closest<HTMLElement>("[data-chapter]");
      if (!el || !chapter) return null;
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { slug: chapter.dataset.chapter!, inside: !!top && chapter.contains(top), inView: r.bottom > 0 && r.top < innerHeight };
    });
    if (!hit) continue;
    expect(hit.inView, `focused link of ${hit.slug} is in the viewport`).toBe(true);
    expect(hit.inside, `focused link of ${hit.slug} is not covered by another chapter`).toBe(true);
    seen.add(hit.slug);
  }
  // reached every chapter, the last one first and the first one last
  expect([...seen]).toEqual([...slugs].reverse());
}

test.describe("keyboard focus in the stacked work chapters", () => {
  test.beforeEach(({}, info) => {
    test.skip(info.project.name !== "desktop", "chapters stack only on desktop (≥ 1024 px)");
  });

  test("Tier C: Shift+Tab from Contact keeps each focused chapter link visible", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("redzy:tier", "C");
      sessionStorage.setItem("redzy:loaded", "1");
    });
    await page.goto("/");
    await page.waitForFunction(() => document.documentElement.dataset.tier === "C");
    await walkBackThroughChapters(page);
  });

  test("Tier A: the same with the chapter choreography mounted", async ({ page }) => {
    test.setTimeout(60_000);
    await page.addInitScript(() => {
      // Tier A without "redzy:scene=force": the chapter choreography mounts, the software-rendered 3D hero does not
      // (it is not under test here and would only slow the run)
      localStorage.setItem("redzy:tier", "A");
      sessionStorage.setItem("redzy:loaded", "1");
    });
    await page.goto("/");
    await page.waitForFunction(() => document.documentElement.dataset.choreoMounted === "true", null, { timeout: 30_000 });
    await walkBackThroughChapters(page);
  });
});
