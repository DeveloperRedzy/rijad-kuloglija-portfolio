import { test, expect } from "@playwright/test";

test.describe("tier A", () => {
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

test("keyboard focus on a row shows the preview", async ({ page }) => {
  await page.goto("/");
  const row = page.locator("[data-row][data-preview]").first();
  await row.scrollIntoViewIfNeeded();
  await row.evaluate((el) => { el.setAttribute("tabindex", "-1"); (el as HTMLElement).focus(); });
  const box = page.locator("[data-preview-box]");
  await expect.poll(() => box.evaluate((el) => parseFloat(getComputedStyle(el).opacity)), { timeout: 4000 }).toBeGreaterThan(0.9);
});

test("arrow icons are swapped for drawn paths", async ({ page }) => {
  await page.goto("/");
  const svg = page.locator("a svg[data-drawn]").first();
  await expect(svg).toHaveCount(1);
  await svg.locator("xpath=ancestor::a").hover();
  expect(await svg.locator("path").count()).toBeGreaterThan(0);
  expect(await svg.locator("use").count()).toBe(0);
  await expect(svg).toHaveAttribute("aria-hidden", "true");
});
});

test.describe("below tier A", () => {
  test("nothing mounts on mobile or Tier B", async ({ page }, info) => {
    if (info.project.name === "desktop") await page.addInitScript(() => localStorage.setItem("redzy:tier", "B"));
    await page.goto("/");
    await page.waitForFunction(() => document.documentElement.dataset.tier !== undefined);
    await expect(page.locator("html")).not.toHaveAttribute("data-cursor", /.*/);
    await expect(page.locator("[data-cursor-dot], [data-cursor-ring], [data-preview-box]")).toHaveCount(0);
  });
});
