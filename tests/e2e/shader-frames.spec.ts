import { test, expect } from "@playwright/test";

test.describe("shader frames", () => {
  test("Tier A: one shared canvas, the hero frame gets the shader and runs it on hover", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "desktop only");
    test.setTimeout(60_000);
    await page.addInitScript(() => {
      localStorage.setItem("redzy:tier", "A");
      // headless Chromium renders with SwiftShader; force past the software-renderer guard (half resolution there)
      localStorage.setItem("redzy:scene", "force");
      sessionStorage.setItem("redzy:loaded", "1");
    });
    await page.goto("/work/liblynx/");
    const webgl2 = await page.evaluate(() => !!document.createElement("canvas").getContext("webgl2"));
    test.skip(!webgl2, "WebGL2 unavailable in this headless browser");

    const hero = page.locator("figure[data-frame='liblynx']");
    await expect(hero).toHaveAttribute("data-shader-frame", "ready", { timeout: 30_000 });
    await expect(page.locator("canvas")).toHaveCount(1);
    await expect(page.locator("canvas")).toHaveCSS("pointer-events", "none");

    // the View rect is exactly the <img> box
    const [view, img] = await Promise.all([hero.locator("[data-shader-view]").boundingBox(), hero.locator("img").boundingBox()]);
    expect(view).not.toBeNull();
    for (const k of ["x", "y", "width", "height"] as const) expect(Math.abs(view![k] - img![k])).toBeLessThan(1);

    await expect(hero).not.toHaveAttribute("data-shader-active", "true");
    // The active state is transient (~1.1 s) and the software-rendered canvas can starve the main thread long enough
    // for a runner-side poll to miss it: record the transition in the page instead.
    await hero.evaluate((el) => {
      const w = window as unknown as { __shaderActivated?: boolean };
      new MutationObserver(() => { if (el.getAttribute("data-shader-active") === "true") w.__shaderActivated = true; })
        .observe(el, { attributes: true, attributeFilter: ["data-shader-active"] });
    });
    await hero.hover();
    await expect.poll(() => page.evaluate(() => !!(window as unknown as { __shaderActivated?: boolean }).__shaderActivated)).toBe(true);
    // the tween ends and the plane hides again
    await expect.poll(() => hero.getAttribute("data-shader-active"), { timeout: 10_000 }).toBeNull();
  });

  test("mobile and reduced motion: no canvas and no shader frames", async ({ page }, info) => {
    test.skip(info.project.name === "desktop", "mobile and reduced-motion only");
    await page.goto("/work/liblynx/");
    await page.waitForFunction(() => !!document.documentElement.dataset.tier);
    await page.waitForTimeout(1500);
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator("[data-shader-frame]")).toHaveCount(0);
  });
});
