// Generates the CV PDF from the built /cv/ page (out/) into out/ and public/.
// Deploy-safe: if Chromium cannot launch (e.g. no browser on Vercel) it warns and
// exits 0 WITHOUT touching public/; Next already copied the committed PDF into out/.
// Any other failure (bad /cv/ status, pdf error) fails the build with exit 1.
import { chromium } from "@playwright/test";
import { createServer } from "node:http";
import { readFile, writeFile, copyFile } from "node:fs/promises";
import { extname, join } from "node:path";

const root = "out";

// Chromium sets no author, so Title and Author are written explicitly: the page <title>
// ("CV — <name>") and the Person name from the page's JSON-LD, both derived from content/profile.
// pdf-lib is imported lazily: it is only needed once Chromium has produced a PDF.
async function withMetadata(bytes, { title, author }) {
  const { PDFDocument } = await import("pdf-lib");
  const doc = await PDFDocument.load(bytes);
  doc.setTitle(title);
  doc.setAuthor(author);
  return doc.save();
}

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
  const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
  const meta = {
    title: await page.title(),
    author: await page.evaluate(() => JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent).name),
  };
  await writeFile(`${root}/Rijad-Kuloglija-CV.pdf`, await withMetadata(pdf, meta));
  await copyFile(`${root}/Rijad-Kuloglija-CV.pdf`, "public/Rijad-Kuloglija-CV.pdf");
  console.log("CV PDF written to out/ and public/");
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  await browser.close();
  server.close();
}
