import { test, expect } from "@playwright/test";

test.describe("hero scene", () => {
  test("Tier A mounts the R3F canvas and resolves __heroSceneReady", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop only");
    await page.addInitScript(() => {
      localStorage.setItem("redzy:tier", "A");
      // headless Chromium renders with SwiftShader; force the scene past the software-renderer guard
      localStorage.setItem("redzy:scene", "force");
      sessionStorage.setItem("redzy:loaded", "1");
    });
    await page.goto("/");
    const webgl2 = await page.evaluate(() => !!document.createElement("canvas").getContext("webgl2"));
    test.skip(!webgl2, "WebGL2 unavailable in this headless browser");
    await expect(page.locator("[data-hero-scene] canvas")).toHaveCount(1, { timeout: 10_000 });
    await page.waitForFunction(() => !!window.__heroSceneReady);
    await page.evaluate(() => window.__heroSceneReady);
    const box = await page.locator("[data-hero-scene] canvas").boundingBox();
    expect(box?.width).toBeGreaterThan(200);
    // No poster image on Tier A
    await expect(page.locator("[data-hero-poster] img")).toHaveCount(0);
  });

  test("Tier A on a software renderer falls back to the poster", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop only");
    await page.addInitScript(() => localStorage.setItem("redzy:tier", "A"));
    await page.goto("/");
    const software = await page.evaluate(() => {
      const gl = document.createElement("canvas").getContext("webgl2");
      const ext = gl?.getExtension("WEBGL_debug_renderer_info");
      return !!gl && !!ext && /swiftshader|llvmpipe|softpipe|software/i.test(String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)));
    });
    test.skip(!software, "hardware GL: the scene path is covered above");
    await expect(page.locator("[data-hero-poster] img")).toHaveCount(1);
    await expect.poll(() => page.locator("[data-hero-poster] img").evaluate((el: HTMLImageElement) => el.currentSrc)).toContain("poster-1600");
    await page.waitForTimeout(1500);
    await expect(page.locator("[data-hero-scene]")).toHaveCount(0);
  });

  test("mobile (Tier B) shows the 900 px poster with a CSS dot and no canvas", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "mobile only");
    await page.goto("/");
    await page.waitForFunction(() => !!document.documentElement.dataset.tier);
    const img = page.locator("[data-hero-poster] img");
    await expect(img).toHaveCount(1);
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.currentSrc || el.src)).toContain("poster-900");
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBe(900);
    await expect(page.locator("[data-poster-dot]")).toHaveCount(1);
    await page.waitForTimeout(1500);
    await expect(page.locator("[data-hero-scene], [data-hero-poster] canvas")).toHaveCount(0);
  });

  test("reduced motion (Tier C) shows the poster and no canvas", async ({ page }, info) => {
    test.skip(info.project.name !== "reduced-motion", "reduced-motion only");
    await page.goto("/");
    await page.waitForFunction(() => document.documentElement.dataset.tier === "C");
    await expect(page.locator("[data-hero-poster] img")).toHaveCount(1);
    await expect(page.locator("[data-poster-dot]")).toHaveCount(1);
    expect(await page.locator("[data-poster-dot]").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    await page.waitForTimeout(1500);
    await expect(page.locator("[data-hero-scene], [data-hero-poster] canvas")).toHaveCount(0);
  });
});
