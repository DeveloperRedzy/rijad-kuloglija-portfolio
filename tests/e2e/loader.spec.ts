import { test, expect, type Page } from "@playwright/test";

const LOADER = "[role=status][aria-label=Loading]";

/** Fresh tab session on the first navigation (sessionStorage survives reloads), with a forced tier. */
async function firstVisit(page: Page, tier: "A" | "B" | "C") {
  await page.addInitScript((t) => {
    if (!sessionStorage.getItem("redzy:init")) {
      sessionStorage.clear();
      sessionStorage.setItem("redzy:init", "1");
    }
    localStorage.setItem("redzy:tier", t);
  }, tier);
}

/** Records, frame by frame from document start, whether a frame showed the page's h1 before the loader was visible. */
async function watchFirstFrames(page: Page) {
  await page.addInitScript((sel) => {
    const w = window as unknown as { __contentBeforeLoader: boolean; __loaderSeen: boolean };
    w.__contentBeforeLoader = false;
    w.__loaderSeen = false;
    const tick = () => {
      const el = document.querySelector(sel);
      if (el && getComputedStyle(el).display !== "none") w.__loaderSeen = true;
      else if (!w.__loaderSeen && document.querySelector("h1")) w.__contentBeforeLoader = true;
      if (!w.__loaderSeen && performance.now() < 3000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, LOADER);
}

test.describe("loader (Tier A)", () => {
  test.beforeEach(async ({ page }, info) => {
    test.skip(info.project.name !== "desktop");
    await firstVisit(page, "A");
  });

  test("first load: the loader is in the server HTML and visible from the first frame", async ({ page }) => {
    const html = await (await page.request.get("/")).text();
    expect(html).toContain('aria-label="Loading"');
    // the gate script is inline in <head>, so it runs before the body (and the shell) is parsed
    const gate = html.indexOf("dataset.loader");
    expect(gate).toBeGreaterThan(-1);
    expect(gate).toBeLessThan(html.indexOf("<body"));
    await watchFirstFrames(page);
    await page.goto("/");
    await expect(page.locator(LOADER)).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { __contentBeforeLoader: boolean }).__contentBeforeLoader)).toBe(false);
  });

  test("first load shows loader, then lands into a visible nav dot", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(LOADER)).toBeVisible();
    await expect(page.locator(LOADER)).toHaveCount(0, { timeout: 4000 });
    await expect.poll(() => page.locator("[data-nav-dot]").evaluate((el) => getComputedStyle(el).opacity), { timeout: 4000 }).toBe("1");
    expect(await page.evaluate(() => document.documentElement.dataset.landed)).toBe("true");
    expect(await page.locator("a [data-nav-dot]").count()).toBe(0);
  });

  test("reload in the same tab never shows the loader", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(LOADER)).toHaveCount(0, { timeout: 4000 });
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.dataset.loader)).toBeUndefined();
    await page.waitForFunction(() => document.documentElement.dataset.landed === "true");
    await expect(page.locator(LOADER)).toHaveCount(0);
    await expect.poll(() => page.locator("[data-nav-dot]").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });

  test("a first visit to another route never shows the loader", async ({ page }) => {
    await page.goto("/work/liblynx/");
    await expect(page.locator(LOADER)).toBeHidden();
    await page.waitForFunction(() => document.documentElement.dataset.landed === "true");
    await expect(page.locator(LOADER)).toHaveCount(0);
  });

  test("wheel input skips the loader early", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(LOADER)).toBeVisible();
    await page.waitForTimeout(200);
    await page.mouse.wheel(0, 10);
    await expect(page.locator(LOADER)).toHaveCount(0, { timeout: 1200 });
    await expect.poll(() => page.locator("[data-nav-dot]").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    expect(await page.evaluate(() => document.documentElement.dataset.landed)).toBe("true");
  });

  test("clicking the nav dot sends a ping band that cleans itself up", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(LOADER)).toHaveCount(0, { timeout: 4000 });
    await expect.poll(() => page.locator("[data-nav-dot]").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    await page.locator("[data-nav-dot]").click();
    await expect(page.locator("[data-ping-band]")).toHaveCount(1);
    await expect(page.locator("[data-ping-band]")).toHaveCount(0, { timeout: 1500 });
  });
});

test("Tier C: the shell is dropped without animating and the page lands", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await firstVisit(page, "C");
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.landed === "true");
  await expect(page.locator(LOADER)).toHaveCount(0);
  await expect.poll(() => page.locator("[data-nav-dot]").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
});

test("reduced motion: no loader, nav dot visible", async ({ page }, info) => {
  test.skip(info.project.name !== "reduced-motion");
  await page.addInitScript(() => sessionStorage.clear());
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.dataset.loader)).toBeUndefined();
  await expect(page.locator(LOADER)).toBeHidden();
  await expect(page.locator(LOADER)).toHaveCount(0);
  await expect(page.locator("[data-nav-dot]")).toBeVisible();
  await expect.poll(() => page.locator("[data-nav-dot]").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
});
