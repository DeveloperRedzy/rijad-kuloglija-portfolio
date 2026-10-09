import { test, expect } from "@playwright/test";

test("data-tier resolves to a valid tier", async ({ page }, info) => {
  await page.goto("/");
  await page.waitForFunction(() => !!document.documentElement.dataset.tier);
  const tier = await page.evaluate(() => document.documentElement.dataset.tier);
  console.log(`[tier] project=${info.project.name} tier=${tier}`);
  expect(["A", "B", "C"]).toContain(tier);
  if (info.project.name === "reduced-motion") expect(tier).toBe("C");
});
