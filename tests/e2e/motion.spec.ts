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
    await expect.poll(() => chapter.locator("[data-chapter-grid] > *").first().evaluate((el) => getComputedStyle(el).opacity), { timeout: 10_000 }).toBe("1");
    // the hidden scene stops rendering
    await expect(page.locator("[data-hero-poster]")).toHaveCSS("visibility", "hidden");
    // reversible: back to the top (one wheel: Lenis owns the scroll position, and wheel acks stall while the
    // software-rendered scene resumes), the dive unwinds and the hero copy returns
    await page.mouse.wheel(0, -4000);
    await expect.poll(() => hero.getAttribute("data-dive"), { timeout: 10_000 }).toBeNull();
    await expect.poll(() => page.locator("h1").evaluate((el) => getComputedStyle(el).opacity), { timeout: 10_000 }).toBe("1");
    await expect(page.locator("[data-hero-poster]")).toHaveCSS("visibility", "visible");
  } else {
    expect(await page.locator(".pin-spacer").count()).toBe(0);
    await page.mouse.wheel(0, 1200);
    await chapter.scrollIntoViewIfNeeded();
    await expect(chapter).toBeInViewport({ ratio: 0.3, timeout: 5000 });
    expect(await page.locator(".pin-spacer").count()).toBe(0);
    // Tier B: one red fade on hero exit, then landed
    if (tier === "B") await expect.poll(() => hero.getAttribute("data-dive"), { timeout: 5000 }).toBe("landed");
  }
});
