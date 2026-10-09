import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, copyFile } from "node:fs/promises";
import { extname, join } from "node:path";

const root = "out";
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif" };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  try {
    const body = await readFile(join(root, p));
    res.writeHead(200, { "content-type": types[extname(p)] ?? "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.emulateMedia({ media: "print" });
await page.goto(`http://localhost:${port}/cv/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.pdf({ path: `${root}/Rijad-Kuloglija-CV.pdf`, format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
server.close();
await copyFile(`${root}/Rijad-Kuloglija-CV.pdf`, "public/Rijad-Kuloglija-CV.pdf");
console.log("CV PDF written to out/ and public/");
