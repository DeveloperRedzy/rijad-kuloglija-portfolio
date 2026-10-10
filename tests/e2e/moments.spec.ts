import { test, expect } from "@playwright/test";

const SIGNAL = "rgb(255, 74, 38)";

test("contact monogram assembles when scrolled into view", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "monogram is desktop-only");
  await page.addInitScript(() => localStorage.setItem("redzy:tier", "A"));
  await page.goto("/");
  await page.waitForFunction(() => document.documentElement.dataset.tier === "A");
  const mono = page.locator("#contact svg").first();
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById("contact")!.scrollIntoView());
  await expect.poll(() => mono.locator("rect").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  await expect.poll(() => mono.locator("circle").evaluate((el) => new DOMMatrix(getComputedStyle(el).transform === "none" ? undefined : getComputedStyle(el).transform).a)).toBeCloseTo(1, 2);
});

test("contact monogram assembles on a #contact deep link", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "monogram is desktop-only");
  await page.addInitScript(() => localStorage.setItem("redzy:tier", "A"));
  await page.goto("/#contact");
  const mono = page.locator("#contact svg").first();
  await expect.poll(() => mono.locator("path").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
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
    await page.waitForTimeout(800);
    expect(await dot.evaluate((el) => el.getAttribute("style"))).toBeNull();
    expect(await fill()).not.toBe(SIGNAL);
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
