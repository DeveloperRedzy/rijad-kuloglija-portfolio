// Downloads the woff2 files we self-host (sources for next/font/local in app/fonts.ts). Run once: node scripts/fetch-fonts.mjs
import { mkdir, writeFile } from "node:fs/promises";

const OUT = "assets/fonts";
const UA = "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120 Safari/537.36";

const sources = [
  { css: "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&display=swap", family: "cabinet-grotesk" },
  { css: "https://api.fontshare.com/v2/css?f[]=switzer@400,500,600&display=swap", family: "switzer" },
  { css: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap", family: "ibm-plex-mono" },
];

// Google serves one face per unicode-range; keep latin and latin-ext (Bosnian place names: č ć đ š ž), keyed by the
// first range of each block. Fontshare serves whole fonts without a unicode-range.
const SUBSETS = { "U+0000-00FF": "", "U+0100-02BA": "-latin-ext" };

await mkdir(OUT, { recursive: true });

for (const { css, family } of sources) {
  const text = await (await fetch(css, { headers: { "user-agent": UA } })).text();
  const faces = text.split("@font-face").slice(1);
  for (const face of faces) {
    // Fontshare also appends unrelated families (e.g. Satoshi); keep only the one we asked for.
    const name = face.match(/font-family:\s*['"]?([^;'"]+)/)?.[1]?.trim().toLowerCase().replace(/\s+/g, "-");
    if (name !== family) continue;
    const weight = face.match(/font-weight:\s*(\d+)/)?.[1];
    const style = face.match(/font-style:\s*(\w+)/)?.[1] ?? "normal";
    const url = face.match(/url\(([^)]+\.woff2[^)]*)\)/)?.[1]?.replace(/['"]/g, "");
    const range = face.match(/unicode-range:\s*([^;]+)/)?.[1]?.trim();
    const subset = range ? SUBSETS[range.split(",")[0].trim()] : "";
    if (!url || !weight || subset === undefined) continue;
    const abs = url.startsWith("//") ? `https:${url}` : url;
    const buf = Buffer.from(await (await fetch(abs, { headers: { "user-agent": UA } })).arrayBuffer());
    const file = `${OUT}/${family}${subset}-${weight}${style === "italic" ? "-italic" : ""}.woff2`;
    await writeFile(file, buf);
    console.log(`${file} ${buf.length} bytes`);
  }
}
