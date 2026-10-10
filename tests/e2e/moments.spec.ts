import { test, expect } from "@playwright/test";

const SIGNAL = "rgb(255, 74, 38)";

// Records the lowest circle scale and rect opacity GSAP writes inside the contact mark, so the test proves it animated.
const trackAssemble = () => {
  const w = window as unknown as { __m: { minScale: number; minOpacity: number } };
  w.__m = { minScale: 1, minOpacity: 1 };
  document.addEventListener("DOMContentLoaded", () => {
    new MutationObserver((list) => {
      for (const m of list) {
        const el = m.target as Element;
        if (!el.closest("[data-contact-mark]")) continue;
        if (el.tagName === "circle") {
          const t = el.getAttribute("transform") ?? "";
          const mm = /matrix\(([-\d.e]+)/.exec(t);
          if (mm) w.__m.minScale = Math.min(w.__m.minScale, +mm[1]);
        }
        if (el.tagName === "rect") {
          const o = /opacity:\s*([\d.e-]+)/.exec(el.getAttribute("style") ?? "");
          if (o) w.__m.minOpacity = Math.min(w.__m.minOpacity, +o[1]);
        }
      }
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ["transform", "style"] });
  });
};

async function expectAssembled(page: import("@playwright/test").Page) {
  const mark = page.locator("#contact [data-contact-mark]");
  await expect(mark).toHaveAttribute("data-assembled", "true");
  await expect.poll(() => mark.locator("rect").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  await expect.poll(() => mark.locator("circle").evaluate((el) => +(/matrix\(([-\d.e]+)/.exec(el.getAttribute("transform") ?? "")?.[1] ?? "1"))).toBeCloseTo(1, 2);
  const m = await page.evaluate(() => (window as unknown as { __m: { minScale: number; minOpacity: number } }).__m);
  expect(m.minScale).toBeLessThan(0.5);
  expect(m.minOpacity).toBeLessThan(0.5);
}

test("contact monogram assembles when scrolled into view", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "monogram is desktop-only");
  await page.addInitScript(() => localStorage.setItem("redzy:tier", "A"));
  await page.addInitScript(trackAssemble);
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.tier === "A");
  const mark = page.locator("#contact [data-contact-mark]");
  await expect(mark).not.toHaveAttribute("data-assembled", "true");
  expect(await mark.locator("rect").evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
  await page.evaluate(() => document.getElementById("contact")!.scrollIntoView());
  await expectAssembled(page);
});

test("contact monogram assembles on a #contact deep link", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "monogram is desktop-only");
  await page.addInitScript(() => localStorage.setItem("redzy:tier", "A"));
  await page.addInitScript(trackAssemble);
  await page.goto("/#contact");
  await expectAssembled(page);
});

test("404 dot flickers near the pointer (desktop) or on load (mobile)", async ({ page }, info) => {
  const dot = page.getByRole("img", { name: "Redzy monogram, unlit" }).locator("[data-signal-dot]");
  const fill = () => dot.evaluate((el) => getComputedStyle(el).fill);
  if (info.project.name === "reduced-motion") {
    await page.goto("/nope/");
    await page.waitForFunction(() => document.documentElement.dataset.tier === "C");
    await page.mouse.move(10, 10);
    const box = (await dot.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 5 });
    let muted = 0;
    await expect.poll(async () => { muted = (await fill()) !== SIGNAL ? muted + 1 : 0; return muted; }, { intervals: [150], timeout: 5000 }).toBeGreaterThanOrEqual(3);
    expect(await dot.evaluate((el) => el.getAttribute("style"))).toBeNull();
    return;
  }
  if (info.project.name === "desktop") {
    await page.addInitScript(() => localStorage.setItem("redzy:tier", "A"));
    await page.goto("/nope/");
    await page.waitForFunction(() => document.documentElement.dataset.tier === "A");
    expect(await fill()).not.toBe(SIGNAL);
    const box = (await dot.boundingBox())!;
    await page.mouse.move(5, 5);
    await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2, { steps: 8 });
    const seen = new Set<string>();
    await expect.poll(async () => { seen.add(await fill()); return seen.has(SIGNAL); }, { timeout: 3000, intervals: [30] }).toBe(true);
  } else {
    await page.goto("/nope/");
    await expect.poll(fill, { timeout: 4000 }).toBe(SIGNAL);
  }
});

test("neo-labs tab switch crossfades without breaking tab semantics", async ({ page }) => {
  await page.goto("/work/neo-labs/");
  const tabs = page.getByRole("tab");
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", "hero-tab-1");
  await expect(tabs.nth(0)).toHaveAttribute("tabindex", "-1");
});
