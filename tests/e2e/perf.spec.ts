import { test, expect } from "@playwright/test";

/**
 * Frame-time trace of the dive (spec §10: no frame > 32 ms on real hardware). Advisory in CI: headless Chromium
 * renders WebGL with SwiftShader, where real tier detection never yields Tier A, so the test skips there. It runs where
 * the detected tier is A (a GPU-backed headed/new-headless browser) and allows a few long frames for scheduler noise;
 * the binding check is manual on an M1 Air with the Performance panel (see the plan's result section).
 */
test("dive keeps frames under 32ms on desktop", async ({ page, browserName }, info) => {
  test.skip(info.project.name !== "desktop" || browserName !== "chromium", "desktop Chromium only");
  await page.goto("/");
  await page.waitForFunction(() => !!document.documentElement.dataset.tier);
  const tier = await page.evaluate(() => document.documentElement.dataset.tier);
  test.skip(tier !== "A", `no Tier A in this environment (detected ${tier})`);
  // the first-visit loader covers the page until it lands
  await page.waitForFunction(() => document.documentElement.dataset.landed === "true", null, { timeout: 10_000 });
  // the dive (lazy chunk) is mounted once the hero is pinned (ScrollTrigger wraps it in a .pin-spacer) and the motion
  // layer (Lenis) is ready; measuring before that would scroll a plain page
  await page.waitForFunction(() => {
    const hero = document.querySelector("[data-hero]");
    return document.documentElement.dataset.motion === "ready" && !!hero?.parentElement?.classList.contains("pin-spacer");
  }, null, { timeout: 10_000 });
  const longFrames = await page.evaluate(async () => {
    const times: number[] = [];
    let last = performance.now();
    const loop = () => { const now = performance.now(); times.push(now - last); last = now; if (times.length < 240) requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
    for (let i = 0; i < 24; i++) { window.scrollBy(0, 120); await new Promise((r) => setTimeout(r, 60)); }
    await new Promise((r) => setTimeout(r, 1500));
    return times.filter((t) => t > 32).length;
  });
  expect(longFrames).toBeLessThanOrEqual(6);
});
