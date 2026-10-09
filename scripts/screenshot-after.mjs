import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.BASE_URL ?? "http://localhost:4173";
const routes = ["/", "/work/liblynx/", "/work/din-solution/", "/work/neo-labs/", "/work/arkona/", "/work/nepa-invest/", "/cv/", "/nope/"];
await mkdir("docs/screenshots/after", { recursive: true });
const browser = await chromium.launch();
for (const [name, vp] of [["desktop", { width: 1440, height: 900 }], ["mobile", { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport: vp });
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: "networkidle" });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((res) => setTimeout(res, 120)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(500);
    const file = `docs/screenshots/after/${name}${r.replace(/\//g, "-").replace(/-$/, "") || "-home"}.jpg`;
    await page.screenshot({ path: file, fullPage: true, type: "jpeg", quality: 70 });
    console.log(file);
  }
  await page.close();
}
await browser.close();
