import { test, expect } from "@playwright/test";

test("home has metadata, OG image and Person JSON-LD", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Redzy — Rijad Kuloglija");
  const og = page.locator('meta[property="og:image"]');
  await expect(og).toHaveAttribute("content", /opengraph-image/);
  const ld = await page.locator('script[type="application/ld+json"]').textContent();
  expect(JSON.parse(ld!)["@type"]).toBe("Person");
});

test("case study has its own title, canonical and OG image", async ({ page }) => {
  await page.goto("/work/liblynx/");
  await expect(page).toHaveTitle("LibLynx report builder — Redzy");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/work\/liblynx\/$/);
  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  // og:image is absolute (production origin); fetch the same path from the local server.
  const u = new URL(og!);
  const res = await page.request.get(u.pathname + u.search);
  expect(res.status()).toBe(200);
  // Next exports the OG route as an extensionless file, so `serve` sends no content-type; assert the bytes instead.
  const body = await res.body();
  expect(body.subarray(1, 4).toString("latin1")).toBe("PNG");
  expect(body.readUInt32BE(16)).toBe(1200);
  expect(body.readUInt32BE(20)).toBe(630);
});

test("sitemap, robots, manifest and 404 exist", async ({ page }) => {
  for (const path of ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest"]) {
    expect((await page.request.get(path)).status()).toBe(200);
  }
  const res = await page.goto("/nope/");
  expect(res?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Lost signal.");
});
