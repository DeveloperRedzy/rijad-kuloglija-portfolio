import { test, expect } from "@playwright/test";

const routes: Array<[string, RegExp]> = [
  ["/", /I build products and stand behind them/],
  ["/work/liblynx/", /LibLynx report builder/],
  ["/work/neo-labs/", /Neo Labs/],
  ["/work/arkona/", /Arkona \+ GumaMax/],
  ["/work/nepa-invest/", /Nepa Invest/],
];

for (const [path, h1] of routes) {
  test(`${path} renders its H1`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(h1);
  });
}

test("case study links to next project and back to work", async ({ page }) => {
  await page.goto("/work/nepa-invest/");
  await expect(page.getByRole("link", { name: /Next · 01/ })).toHaveAttribute("href", "/work/liblynx/");
  await page.getByRole("link", { name: /All work/ }).first().click();
  await expect(page).toHaveURL(/\/#work$/);
});

test("neo-labs hero tabs switch heroes and support arrow keys", async ({ page }) => {
  await page.goto("/work/neo-labs/");
  const tabs = page.getByRole("tab");
  await expect(tabs).toHaveCount(3);
  const img = page.getByRole("tabpanel").locator("img");
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "false");
  await expect(img).toHaveAttribute("src", /hero-care/);
  await tabs.nth(1).focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.nth(2)).toBeFocused();
  await expect(img).toHaveAttribute("src", /hero-therapy/);
});

test("case study has title and canonical metadata", async ({ page }) => {
  await page.goto("/work/liblynx/");
  await expect(page).toHaveTitle("LibLynx report builder — Rijad Kuloglija");
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", /\/work\/liblynx\/$/);
});

test("reading progress bar exists and advances on scroll", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "scroll-driven animations are Chromium-only here");
  await page.goto("/work/liblynx/");
  const bar = page.locator("[data-reading-progress]");
  await expect(bar).toHaveCount(1);
  const supported = await page.evaluate(() => CSS.supports("animation-timeline: scroll()"));
  const reduced = await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  test.skip(!supported || reduced, "needs scroll timelines and motion enabled");
  const before = await bar.evaluate((el) => getComputedStyle(el).transform);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => bar.evaluate((el) => getComputedStyle(el).transform)).not.toBe(before);
});
