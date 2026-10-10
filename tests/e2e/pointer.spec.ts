import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.addInitScript(() => localStorage.setItem("redzy:tier", "A"));
});

test("custom cursor mounts on Tier A", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-cursor", "custom");
  await expect(page.locator("[data-cursor-dot]")).toHaveCount(1);
  await expect(page.locator("[data-cursor-ring]")).toHaveCount(1);
});

test("hovering an experience row shows the floating preview", async ({ page }) => {
  await page.goto("/");
  const row = page.locator("[data-row][data-preview]").first();
  await row.scrollIntoViewIfNeeded();
  const box = page.locator("[data-preview-box]");
  await expect(box).toHaveCount(1);
  const b = (await row.boundingBox())!;
  await page.mouse.move(b.x + 40, b.y + b.height / 2);
  await page.mouse.move(b.x + 80, b.y + b.height / 2, { steps: 5 });
  await expect.poll(() => box.evaluate((el) => parseFloat(getComputedStyle(el).opacity)), { timeout: 4000 }).toBeGreaterThan(0.9);
});

test("magnetic pill is pulled toward the pointer", async ({ page }) => {
  await page.goto("/");
  const pill = page.locator("[data-magnetic]").first();
  await pill.scrollIntoViewIfNeeded();
  const b = (await pill.boundingBox())!;
  await page.mouse.move(b.x + b.width / 2 + 30, b.y + b.height / 2 + 10);
  await page.mouse.move(b.x + b.width / 2 + 40, b.y + b.height / 2 + 12, { steps: 4 });
  await expect.poll(() => pill.evaluate((el) => getComputedStyle(el).transform), { timeout: 3000 }).not.toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
});
