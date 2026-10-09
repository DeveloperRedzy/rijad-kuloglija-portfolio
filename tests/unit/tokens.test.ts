import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("app/globals.css", "utf8");

describe("design tokens", () => {
  it.each([
    ["--color-canvas", "#0a0908"],
    ["--color-surface-1", "#121110"],
    ["--color-surface-2", "#1a1816"],
    ["--color-hairline", "#23211e"],
    ["--color-hairline-strong", "#2e2b28"],
    ["--color-ink-muted", "#8a857e"],
    ["--color-ink-soft", "#b8b2aa"],
    ["--color-ink", "#f2efea"],
    ["--color-signal", "#ff4a26"],
    ["--color-signal-soft", "#ffb3a3"],
  ])("defines %s as %s", (name, value) => {
    const re = new RegExp(`${name}:\\s*${value};`, "i");
    expect(css).toMatch(re);
  });

  it("never uses pure black or white", () => {
    expect(css).not.toMatch(/#000(000)?\b/i);
    expect(css).not.toMatch(/#fff(fff)?\b/i);
  });
});
