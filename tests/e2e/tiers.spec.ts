import { test, expect } from "@playwright/test";

test("data-tier resolves to a valid tier", async ({ page }, info) => {
  await page.goto("/");
  await page.waitForFunction(() => !!document.documentElement.dataset.tier);
  const tier = await page.evaluate(() => document.documentElement.dataset.tier);
  console.log(`[tier] project=${info.project.name} tier=${tier}`);
  expect(["A", "B", "C"]).toContain(tier);
  if (info.project.name === "reduced-motion") expect(tier).toBe("C");
});

test("tier override A mounts Lenis", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "desktop only");
  await page.addInitScript(() => localStorage.setItem("redzy:tier", "A"));
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.tier === "A");
  await expect(page.locator("html.lenis")).toHaveCount(1);
});
