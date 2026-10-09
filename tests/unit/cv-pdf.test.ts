import { existsSync, readFileSync, statSync } from "node:fs";
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";

describe("CV PDF", () => {
  it("exists, is A4 and has exactly 2 pages", async () => {
    const path = "public/Rijad-Kuloglija-CV.pdf";
    expect(existsSync(path)).toBe(true);
    expect(statSync(path).size).toBeGreaterThan(20_000);
    const doc = await PDFDocument.load(readFileSync(path));
    expect(doc.getPageCount()).toBe(2);
    const { width, height } = doc.getPage(0).getSize();
    expect(Math.round(width)).toBe(595);
    expect(Math.round(height)).toBe(842);
  });
});
