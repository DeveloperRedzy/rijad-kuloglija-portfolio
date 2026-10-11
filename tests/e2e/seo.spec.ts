import { test, expect, type Page } from "@playwright/test";

// og:image is absolute (production origin); fetch the same path from the local server.
async function expectPng(page: Page, url: string | null) {
  const res = await page.request.get(new URL(url!).pathname);
  expect(res.status()).toBe(200);
  const body = await res.body();
  expect(body.subarray(1, 4).toString("latin1")).toBe("PNG");
  expect(body.readUInt32BE(16)).toBe(1200);
  expect(body.readUInt32BE(20)).toBe(630);
}

test("home has metadata, OG image and Person JSON-LD", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Rijad Kuloglija — Lead Software Developer & CTO, Sarajevo");
  const og = page.locator('meta[property="og:image"]');
  await expect(og).toHaveAttribute("content", /\/og\/home\.png$/);
  await expectPng(page, await og.getAttribute("content"));
  const ld = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(ld!)["@type"]).toBe("Person");
});

test("case study has its own title, canonical and OG image", async ({ page }) => {
  await page.goto("/work/liblynx/");
  await expect(page).toHaveTitle("LibLynx report builder — Rijad Kuloglija");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/work\/liblynx\/$/);
  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(og).toMatch(/\/og\/liblynx\.png$/);
  await expectPng(page, og);
});

test("sitemap, robots, manifest and 404 exist", async ({ page }) => {
  for (const path of ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest"]) {
    expect((await page.request.get(path)).status()).toBe(200);
  }
  const res = await page.goto("/nope/");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Lost signal.");
});
