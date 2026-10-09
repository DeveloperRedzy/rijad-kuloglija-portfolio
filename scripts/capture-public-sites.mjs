import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const sites = {
  liblynx: ["https://www.liblynx.com/"],
  "din-solution": ["https://www.dinsolution.com/"],
  "neo-labs": ["https://www.neo-labs.ai/", "https://www.neo-care.ai/", "https://www.neo-therapy.ai/"],
  arkona: ["https://www.arkonatechnology.com/"],
  "nepa-invest": ["https://www.nepainvest.com/"],
};

const browser = await chromium.launch();
for (const [slug, urls] of Object.entries(sites)) {
  const dir = `assets/source/captures/${slug}`;
  await mkdir(dir, { recursive: true });
  for (const [i, url] of urls.entries()) {
    for (const [name, vp] of [["desktop", { width: 1600, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
      const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 2, colorScheme: "light" });
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(1500);
      await page.addStyleTag({ content: "[class*=cookie],[id*=cookie],[class*=consent]{display:none!important}" });
      // Hide bottom-anchored fixed overlays (cookie banners with unpredictable class names)
      await page.evaluate(() => {
        for (const el of document.querySelectorAll("body *")) {
          if (getComputedStyle(el).position !== "fixed") continue;
          const r = el.getBoundingClientRect();
          if (r.top > innerHeight * 0.6 && r.bottom >= innerHeight - 40) el.style.display = "none";
        }
      });
      await page.screenshot({ path: `${dir}/${i}-${name}.png` });
      await page.close();
      console.log(slug, i, name);
    }
  }
}
await browser.close();
