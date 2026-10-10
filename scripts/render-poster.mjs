// Renders the Tier B/C hero posters from the live R3F scene.
// Usage: `npm run dev` (or PORT=3100 npm run dev), then `npm run poster` (POSTER_URL overrides the base URL).
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const base = process.env.POSTER_URL ?? "http://localhost:3000";
await mkdir("public/media/hero", { recursive: true });
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
try {
  for (const [name, size] of [["poster-1600", 1600], ["poster-900", 900]]) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    page.on("pageerror", (e) => console.error(`[${name}] pageerror`, e.message));
    // Skip the loader so nothing else competes for the frame.
    await page.addInitScript(() => sessionStorage.setItem("redzy:loaded", "1"));
    await page.goto(`${base}/?poster=1`, { waitUntil: "networkidle" });
    await page.waitForSelector("[data-hero-scene] canvas", { timeout: 60000 });
    // Under `next dev` (StrictMode) the Canvas can miss its first measure; a 1 px resize nudge re-measures it.
    await page.setViewportSize({ width: size, height: size + 1 });
    await page.waitForTimeout(300);
    await page.setViewportSize({ width: size, height: size });
    await page.waitForFunction((px) => document.querySelector("[data-hero-scene] canvas").getBoundingClientRect().width === px, size, { timeout: 30000 });
    await page.waitForTimeout(2500);
    const dataUrl = await page.evaluate(() => document.querySelector("[data-hero-scene] canvas").toDataURL("image/png"));
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");
    // The canvas may be up to dpr 1.5; normalize to the poster size.
    await sharp(buf).resize(size, size).webp({ quality: 86, alphaQuality: 90 }).toFile(`public/media/hero/${name}.webp`);
    console.log(`${name}.webp`);
    await page.close();
  }
} finally {
  await browser.close();
}
