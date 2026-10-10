import { test, expect } from "@playwright/test";

test.describe("loader (Tier A)", () => {
  test.beforeEach(async ({ page }, info) => {
    test.skip(info.project.name !== "desktop");
    await page.addInitScript(() => {
      if (!sessionStorage.getItem("redzy:init")) {
        sessionStorage.clear();
        sessionStorage.setItem("redzy:init", "1");
      }
      localStorage.setItem("redzy:tier", "A");
    });
  });

  test("first load shows loader, then lands into a visible nav dot", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[role=status][aria-label=Loading]")).toBeVisible();
    await expect(page.locator("[role=status][aria-label=Loading]")).toHaveCount(0, { timeout: 4000 });
    await expect.poll(() => page.locator("[data-nav-dot]").evaluate((el) => getComputedStyle(el).opacity), { timeout: 4000 }).toBe("1");
    expect(await page.evaluate(() => document.documentElement.dataset.landed)).toBe("true");
    expect(await page.locator("a [data-nav-dot]").count()).toBe(0);
  });

  test("reload in the same tab skips the loader", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[role=status][aria-label=Loading]")).toHaveCount(0, { timeout: 4000 });
    await page.reload();
    await page.waitForFunction(() => document.documentElement.dataset.landed === "true");
    await expect(page.locator("[role=status][aria-label=Loading]")).toHaveCount(0);
    await expect.poll(() => page.locator("[data-nav-dot]").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });

  test("wheel input skips the loader early", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[role=status][aria-label=Loading]")).toBeVisible();
    await page.waitForTimeout(200);
    await page.mouse.wheel(0, 10);
    await expect(page.locator("[role=status][aria-label=Loading]")).toHaveCount(0, { timeout: 1200 });
    await expect.poll(() => page.locator("[data-nav-dot]").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    expect(await page.evaluate(() => document.documentElement.dataset.landed)).toBe("true");
  });

  test("clicking the nav dot sends a ping band that cleans itself up", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[role=status][aria-label=Loading]")).toHaveCount(0, { timeout: 4000 });
    await expect.poll(() => page.locator("[data-nav-dot]").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    await page.locator("[data-nav-dot]").click();
    await expect(page.locator("[data-ping-band]")).toHaveCount(1);
    await expect(page.locator("[data-ping-band]")).toHaveCount(0, { timeout: 1500 });
  });
});

test("reduced motion: no loader, nav dot visible", async ({ page }, info) => {
  test.skip(info.project.name !== "reduced-motion");
  await page.goto("/");
  await expect(page.locator("[role=status][aria-label=Loading]")).toHaveCount(0);
  await expect(page.locator("[data-nav-dot]")).toBeVisible();
  await expect.poll(() => page.locator("[data-nav-dot]").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
});
