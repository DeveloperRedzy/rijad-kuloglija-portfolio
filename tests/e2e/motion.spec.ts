import { test, expect } from "@playwright/test";

test("headings reveal and sweeps run on desktop, not under reduced motion", async ({ page }, info) => {
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
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect(page.locator("#work h2")).toHaveAttribute("data-revealed", "true", { timeout: 5000 });
});

test("progress rail reflects chapter progress on desktop", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.tier === "A" || document.documentElement.dataset.tier === "B");
  await page.locator("[data-chapter='nepa-invest']").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const progress = await page.locator("[data-rail]").evaluate((el) => parseFloat(getComputedStyle(el).getPropertyValue("--progress")));
  expect(progress).toBeGreaterThan(0.7);
});
