import { test, expect } from "@playwright/test";

test("headings reveal on desktop and mobile, not under reduced motion", async ({ page }, info) => {
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
  await page.locator("#work h2").scrollIntoViewIfNeeded();
  await expect(page.locator("#work h2")).toHaveAttribute("data-revealed", "true", { timeout: 12000 });
});

test("progress rail reflects chapter progress on desktop", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop");
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.tier === "A" || document.documentElement.dataset.tier === "B");
  // Park the last chapter at the top of the viewport (inside the work section, rail active).
  await page.locator("[data-chapter]").last().evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80));
  const rail = page.locator("[data-rail]");
  await expect
    .poll(() => rail.evaluate((el) => parseFloat(getComputedStyle(el).getPropertyValue("--progress"))), { timeout: 5000 })
    .toBeGreaterThan(0.7);
  await expect.poll(() => rail.evaluate((el) => getComputedStyle(el).opacity), { timeout: 5000 }).toBe("1");
  await expect(page.locator("[data-rail-label]")).toHaveText(/0[1-5] \/ 05/);
});

test("desktop dive lands in chapter 01 and reverses; mobile has no pin", async ({ page }, info) => {
  test.skip(info.project.name === "reduced-motion", "Tier C: no dive (covered by the hero-scene and home specs)");
  if (info.project.name === "desktop") {
    // the forced scene renders on SwiftShader: slow frames when other workers compete for the CPU
    test.setTimeout(60_000);
    await page.addInitScript(() => {
      localStorage.setItem("redzy:tier", "A");
      // headless Chromium renders with SwiftShader; force the scene past the software-renderer guard
      localStorage.setItem("redzy:scene", "force");
      sessionStorage.setItem("redzy:loaded", "1");
    });
  }
  await page.goto("/");
  await page.waitForFunction(() => !!document.documentElement.dataset.tier);
  const tier = await page.evaluate(() => document.documentElement.dataset.tier);
  const hero = page.locator("[data-hero]");
  const chapter = page.locator("[data-chapter]").first();
  if (tier === "A") {
    await expect(page.locator(".pin-spacer")).toHaveCount(1, { timeout: 5000 });
    // Lenis smooths the wheel: scroll in steps through the pinned 250 vh
    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, 250);
      await page.waitForTimeout(80);
    }
    await expect.poll(() => hero.getAttribute("data-dive"), { timeout: 10_000 }).toBe("landed");
    await expect(chapter).toBeInViewport({ ratio: 0.5 });
    await expect(page.locator("[data-nav-dot]")).toHaveCSS("opacity", "1");
    // the navbar dot is back to its own size (6× → 1×)
    await expect.poll(() => page.locator("[data-nav-dot]").evaluate((el) => getComputedStyle(el).transform), { timeout: 10_000 }).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
    await expect(page.locator("#work")).not.toHaveAttribute("inert", /.*/);
    await expect.poll(() => chapter.locator("[data-chapter-grid] > *").first().evaluate((el) => getComputedStyle(el).opacity), { timeout: 10_000 }).toBe("1");
    // the hidden scene stops rendering
    await expect(page.locator("[data-hero-poster]")).toHaveCSS("visibility", "hidden");
    // reversible: back to the top (one wheel: Lenis owns the scroll position, and wheel acks stall while the
    // software-rendered scene resumes), the dive unwinds and the hero copy returns
    await page.mouse.wheel(0, -4000);
    await expect.poll(() => hero.getAttribute("data-dive"), { timeout: 10_000 }).toBeNull();
    // keep nudging up until Lenis has settled at the very top (the copy is fully back by scroll 0)
    await expect.poll(async () => {
      await page.mouse.wheel(0, -1000);
      return page.locator("h1").evaluate((el) => getComputedStyle(el).opacity);
    }, { timeout: 15_000 }).toBe("1");
    await expect(page.locator("[data-hero-poster]")).toHaveCSS("visibility", "visible");
  } else {
    expect(await page.locator(".pin-spacer").count()).toBe(0);
    // the real wheel path: no pin holds the page back
    await expect.poll(async () => {
      await page.mouse.wheel(0, 400);
      return chapter.evaluate((el) => { const r = el.getBoundingClientRect(); return r.top < innerHeight * 0.7 && r.bottom > 0; });
    }, { timeout: 10_000 }).toBe(true);
    await expect(chapter).toBeInViewport({ ratio: 0.3 });
    expect(await page.locator(".pin-spacer").count()).toBe(0);
    // Tier B: one red fade on hero exit, then landed
    if (tier === "B") await expect.poll(() => hero.getAttribute("data-dive"), { timeout: 5000 }).toBe("landed");
  }
});

for (const height of [821, 768]) {
  test(`the #work anchor lands the dive at ${height} px tall`, async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "Tier A only");
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 1440, height });
    // poster fallback (no forced scene): the landing logic is the same and the run stays fast
    await page.addInitScript(() => { localStorage.setItem("redzy:tier", "A"); sessionStorage.setItem("redzy:loaded", "1"); });
    await page.goto("/#work");
    await expect(page.locator(".pin-spacer")).toHaveCount(1, { timeout: 5000 });
    await expect.poll(() => page.locator("[data-hero]").getAttribute("data-dive"), { timeout: 10_000 }).toBe("landed");
    const row = page.locator("[data-chapter]").first().locator("[data-chapter-grid] > *").first();
    await expect.poll(() => row.evaluate((el) => getComputedStyle(el).opacity), { timeout: 10_000 }).toBe("1");
    await expect.poll(() => page.locator("[data-hero]").evaluate((el) => getComputedStyle(el).pointerEvents)).toBe("none");
  });
}

test("Tab from the hero never lands on the hidden work section before the dive lands", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "Tier A only");
  await page.addInitScript(() => { localStorage.setItem("redzy:tier", "A"); sessionStorage.setItem("redzy:loaded", "1"); });
  await page.goto("/");
  await expect(page.locator(".pin-spacer")).toHaveCount(1, { timeout: 5000 });
  await expect(page.locator("#work")).toHaveAttribute("inert", "");
  await page.locator("[data-hero-copy] a").last().focus();
  await page.keyboard.press("Tab");
  const inWork = await page.evaluate(() => !!document.activeElement?.closest("#work"));
  // the inert section is skipped: focus goes to the next focusable after it
  expect(inWork).toBe(false);
});
