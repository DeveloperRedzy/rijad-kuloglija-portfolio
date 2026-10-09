import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";

const svg = await readFile("app/icon.svg");
await mkdir("public/brand", { recursive: true });
for (const size of [32, 180, 192, 512]) {
  await sharp(svg).resize(size, size).png().toFile(`public/brand/icon-${size}.png`);
  console.log(`icon-${size}.png`);
}
