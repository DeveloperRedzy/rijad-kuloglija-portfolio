import { test, expect } from "@playwright/test";

test("headings reveal on desktop and mobile, not under reduced motion", async ({ page }, info) => {
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.tier !== undefined);
  const tier = await page.evaluate(() => document.documentElement.dataset.tier);
  if (info.project.name === "reduced-motion") {
    expect(tier).toBe("C");
    await expect(page.locator("h1")).not.toHaveAttribute("data-revealed", "true");
    expect(await page.locator("h1 .line").count()).toBe(0);
    return;
  }
  await expect(page.locator("h1")).toHaveAttribute("data-revealed", "true", { timeout: 5000 });
  await page.locator("#work h2").scrollIntoViewIfNeeded();
  await expect(page.locator("#work h2")).toHaveAttribute("data-revealed", "true", { timeout: 12000 });
});

test("progress rail reflects chapter progress on desktop", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.tier === "A" || document.documentElement.dataset.tier === "B");
  // Park the last chapter at the top of the viewport (inside the work section, rail active).
  await page.locator("[data-chapter]").last().evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80));
  const rail = page.locator("[data-rail]");
  await expect
    .poll(() => rail.evaluate((el) => parseFloat(getComputedStyle(el).getPropertyValue("--progress"))), { timeout: 5000 })
    .toBeGreaterThan(0.7);
  await expect.poll(() => rail.evaluate((el) => getComputedStyle(el).opacity), { timeout: 5000 }).toBe("1");
  await expect(page.locator("[data-rail-label]")).toHaveText(/0[1-5] \/ 05/);
});
