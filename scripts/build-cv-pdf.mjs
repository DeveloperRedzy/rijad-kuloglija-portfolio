// Generates the CV PDF from the built /cv/ page (out/) into out/ and public/.
// Deploy-safe: if Chromium cannot launch (e.g. no browser on Vercel) it warns and
// exits 0 WITHOUT touching public/; Next already copied the committed PDF into out/.
// Any other failure (bad /cv/ status, pdf error) fails the build with exit 1.
import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, copyFile } from "node:fs/promises";
import { extname, join } from "node:path";

const root = "out";
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif" };

let browser;
try {
  browser = await chromium.launch();
} catch {
  console.warn("CV PDF: Chromium unavailable, keeping the committed public/Rijad-Kuloglija-CV.pdf");
  process.exit(0);
}

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  try {
    const body = await readFile(join(root, p));
    res.writeHead(200, { "content-type": types[extname(p)] ?? "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});

try {
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const port = server.address().port;
  const page = await browser.newPage();
  await page.emulateMedia({ media: "print" });
  const res = await page.goto(`http://127.0.0.1:${port}/cv/`, { waitUntil: "networkidle" });
  if (!res || res.status() !== 200) throw new Error(`/cv/ returned ${res ? res.status() : "no response"}`);
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: `${root}/Rijad-Kuloglija-CV.pdf`, format: "A4", printBackground: true, preferCSSPageSize: true });
  await copyFile(`${root}/Rijad-Kuloglija-CV.pdf`, "public/Rijad-Kuloglija-CV.pdf");
  console.log("CV PDF written to out/ and public/");
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  await browser.close();
  server.close();
}
